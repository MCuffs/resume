import type { VercelRequest, VercelResponse } from '@vercel/node';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
let supabaseAdmin: any = null;
if (supabaseUrl && supabaseKey) {
    supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
        auth: { autoRefreshToken: false, persistSession: false }
    });
}

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL_CANDIDATES = [
    process.env.ANTHROPIC_MODEL,
    'claude-3-5-sonnet-latest',
    'claude-3-7-sonnet-latest',
    'claude-sonnet-4-0',
    'claude-sonnet-4-5',
].filter(Boolean) as string[];
const MAX_GENERATION_ATTEMPTS = 3;

function extractJsonObject(text: string): string | null {
    if (!text || typeof text !== 'string') return null;

    let candidate = text.trim();
    if (candidate.startsWith('```')) {
        candidate = candidate.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    }

    const firstBrace = candidate.indexOf('{');
    const lastBrace = candidate.lastIndexOf('}');
    if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) return null;

    return candidate.slice(firstBrace, lastBrace + 1);
}

function isModelNotFoundError(err: any): boolean {
    const status = err?.status;
    const apiType = err?.error?.error?.type || err?.error?.type;
    const message = String(err?.message || err?.error?.error?.message || '');
    return status === 404 || apiType === 'not_found_error' || message.includes('model:');
}

async function createAnthropicMessageWithFallback(systemPrompt: string, userPrompt: string) {
    let lastError: any = null;
    for (const model of MODEL_CANDIDATES) {
        try {
            const msg = await anthropic.messages.create({
                model,
                max_tokens: 4096,
                temperature: 0.2,
                system: systemPrompt,
                messages: [{ role: 'user', content: userPrompt }]
            });
            return { msg, model };
        } catch (err: any) {
            lastError = err;
            if (isModelNotFoundError(err)) {
                console.warn(`Anthropic model unavailable: ${model}. Trying next candidate...`);
                continue;
            }
            throw err;
        }
    }
    throw lastError || new Error('No available Anthropic model candidates');
}

function validateResumePayload(data: any): string[] {
    const issues: string[] = [];
    const isObj = (v: any) => typeof v === 'object' && v !== null && !Array.isArray(v);
    const isText = (v: any) => typeof v === 'string' && v.trim().length > 0;
    const isTextArray = (v: any) => Array.isArray(v) && v.every((item) => typeof item === 'string');

    if (!isObj(data)) return ['Payload is not a JSON object'];

    if (!isObj(data.personalInfo)) {
        issues.push('personalInfo must be an object');
    } else {
        if (!isText(data.personalInfo.name)) issues.push('personalInfo.name is required');
        if (!isText(data.personalInfo.email)) issues.push('personalInfo.email is required');
        if (!isText(data.personalInfo.summary) || data.personalInfo.summary.trim().length < 30) {
            issues.push('personalInfo.summary must be at least 30 characters');
        }
    }

    if (!Array.isArray(data.education) || data.education.length === 0) {
        issues.push('education must be a non-empty array');
    }

    if (!Array.isArray(data.experience) || data.experience.length === 0) {
        issues.push('experience must be a non-empty array');
    } else {
        data.experience.forEach((exp: any, i: number) => {
            if (!isObj(exp)) {
                issues.push(`experience[${i}] must be an object`);
                return;
            }
            if (!Array.isArray(exp.projects) || exp.projects.length === 0) {
                issues.push(`experience[${i}].projects must be a non-empty array`);
                return;
            }
            exp.projects.forEach((proj: any, j: number) => {
                if (!isObj(proj)) {
                    issues.push(`experience[${i}].projects[${j}] must be an object`);
                    return;
                }
                if (!isTextArray(proj.achievements) || proj.achievements.length < 2) {
                    issues.push(`experience[${i}].projects[${j}].achievements must have at least 2 bullet strings`);
                }
            });
        });
    }

    if (!isTextArray(data.skills) || data.skills.length === 0) {
        issues.push('skills must be a non-empty string array');
    }
    if (!isTextArray(data.keywords) || data.keywords.length === 0) {
        issues.push('keywords must be a non-empty string array');
    }
    if (!isText(data.selfIntroduction) || data.selfIntroduction.trim().length < 200) {
        issues.push('selfIntroduction must be at least 200 characters');
    }

    return issues;
}

function buildInitialUserPrompt(rawText: string): string {
    return `Here is the English resume text:

${rawText}

Hard constraints:
- Use only facts grounded in the source text.
- Do not invent metrics, employers, dates, or certifications.
- If missing, keep fields empty string ("") or empty array ([]), but preserve full schema.`;
}

function buildRepairUserPrompt(rawText: string, previousJsonPayload: string, issues: string[]): string {
    return `Your previous JSON output failed validation. Fix it and return ONLY corrected JSON.

Validation issues:
${issues.map((issue, i) => `${i + 1}. ${issue}`).join('\n')}

Original English resume text:
${rawText}

Previous JSON output:
${previousJsonPayload}

Rules:
- Preserve schema exactly.
- Keep all facts grounded in source text.
- No markdown, no explanations, output JSON object only.`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    res.setHeader('Access-Control-Allow-Origin', '*');

    try {
        const { rawText, sessionId, orderId } = req.body;

        if (!rawText) {
            return res.status(400).json({ error: 'No raw text provided for generation' });
        }

        // Payment verification (best-effort)
        if (supabaseAdmin && sessionId && orderId) {
            const { data, error } = await supabaseAdmin
                .from('anonymous_transactions')
                .update({ status: 'completed', payment_id: orderId, updated_at: new Date() })
                .eq('session_id', sessionId)
                .eq('status', 'pending')
                .select()
                .single();

            if (error || !data) {
                console.warn('Supabase session update failed, but PayPal orderId is present. Proceeding:', error?.message);
            }
        } else if (!orderId) {
            return res.status(403).json({ error: 'Unauthorized: No payment verification found' });
        }

        if (!process.env.ANTHROPIC_API_KEY) {
            return res.status(500).json({ error: 'ANTHROPIC_API_KEY is not configured on server' });
        }

        const systemPrompt = `You are an expert Korean Resume Translator and Career Consultant. 
Your goal is to take the extracted text from an English PDF resume and convert it into a highly detailed, professional Korean Resume data format matching standard Korean corporate templates.

IMPORTANT: Respond ONLY with a valid JSON strictly following this structure. Do NOT include markdown tags like \`\`\`json. Just the raw JSON object.
{
  "personalInfo": {
    "name": "Korean Name",
    "gender": "남 or 여",
    "birthYear": "YYYY년 (만 00세)",
    "phone": "010-0000-0000",
    "email": "email",
    "address": "Address translated to Korean, if available",
    "summary": "1-2 sentence professional summary"
  },
  "education": [
    {
      "schoolName": "School Name translated",
      "degree": "Degree (e.g., 대학교(4년))",
      "major": "Major translated",
      "period": "YYYY.MM ~ YYYY.MM",
      "status": "졸업, 재학중, 등"
    }
  ],
  "experience": [
    {
      "companyName": "Company Name",
      "period": "YYYY.MM ~ YYYY.MM (or 재직 중)",
      "totalDuration": "e.g., 1년 3개월",
      "projects": [
        {
          "projectName": "Project / Core Task Name",
          "period": "YYYY.MM ~ YYYY.MM",
          "role": "Role / Title",
          "achievements": [
            "Achievement 1 focusing on numbers and impact",
            "Achievement 2"
          ]
        }
      ]
    }
  ],
  "extracurricular": [
    {
      "title": "Activity Name",
      "period": "YYYY.MM ~ YYYY.MM",
      "description": "Short description"
    }
  ],
  "certifications": ["Cert 1", "Cert 2"],
  "skills": ["Skill 1", "Skill 2"],
  "keywords": ["성향 키워드 1", "키워드 2"],
  "selfIntroduction": "Write a highly professional 3-4 paragraph '자기소개서' (Self Introduction Letter)."
}`;

        let userPrompt = buildInitialUserPrompt(rawText);
        let translatedData: any = null;
        let selectedModel: string | null = null;
        let lastIssues: string[] = [];

        for (let attempt = 1; attempt <= MAX_GENERATION_ATTEMPTS; attempt++) {
            const { msg, model } = await createAnthropicMessageWithFallback(systemPrompt, userPrompt);
            selectedModel = model;
            console.log(`Anthropic generation model selected: ${model} (attempt ${attempt}/${MAX_GENERATION_ATTEMPTS})`);

            const modelText = ((msg.content[0] as any)?.text ?? '') as string;
            const jsonPayload = extractJsonObject(modelText);

            if (!jsonPayload) {
                lastIssues = ['AI response did not include valid JSON payload'];
                continue;
            }

            try {
                translatedData = JSON.parse(jsonPayload);
                lastIssues = validateResumePayload(translatedData);
                if (lastIssues.length === 0) {
                    return res.json({ success: true, data: translatedData, meta: { model: selectedModel, attempt } });
                }
                userPrompt = buildRepairUserPrompt(rawText, jsonPayload, lastIssues);
            } catch (parseError) {
                console.error('AI JSON parse failed:', parseError);
                lastIssues = ['AI returned malformed JSON'];
            }
        }

        console.warn('Resume generation failed validation after retries:', lastIssues);
        return res.status(502).json({
            error: 'Failed to generate valid resume output after retries',
            details: lastIssues.slice(0, 5)
        });

    } catch (error) {
        console.error('Error generating resume:', error);
        return res.status(500).json({ error: 'Failed to generate resume' });
    }
}
