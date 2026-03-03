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

        const msg = await anthropic.messages.create({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 4096,
            temperature: 0.2,
            system: systemPrompt,
            messages: [
                { role: 'user', content: `Here is the English resume text:\n\n${rawText}` }
            ]
        });

        const jsonStr = (msg.content[0] as any).text;
        const translatedData = JSON.parse(jsonStr);
        return res.json({ success: true, data: translatedData });

    } catch (error) {
        console.error('Error generating resume:', error);
        return res.status(500).json({ error: 'Failed to generate resume' });
    }
}
