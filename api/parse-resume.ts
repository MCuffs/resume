import type { VercelRequest, VercelResponse } from '@vercel/node';
import formidable from 'formidable';
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

import PDFParser from 'pdf2json';

export const config = {
    api: {
        bodyParser: false, // needed for file uploads
    },
};

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
let supabaseAdmin: any = null;
if (supabaseUrl && supabaseKey) {
    supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
        auth: { autoRefreshToken: false, persistSession: false }
    });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    try {
        const form = formidable({ maxFileSize: 10 * 1024 * 1024 }); // 10MB
        const [, files] = await form.parse(req);

        const resumeFile = Array.isArray(files.resume) ? files.resume[0] : files.resume;
        if (!resumeFile) {
            return res.status(400).json({ error: 'No PDF file uploaded' });
        }

        const fullText = await new Promise<string>((resolve, reject) => {
            const pdfParser = new PDFParser(null, true as any);
            pdfParser.on("pdfParser_dataError", (errData: any) => reject(errData.parserError || errData));
            pdfParser.on("pdfParser_dataReady", () => {
                resolve(pdfParser.getRawTextContent());
            });
            pdfParser.loadPDF(resumeFile.filepath);
        });

        // Clean up temp file
        fs.unlinkSync(resumeFile.filepath);

        let sessionId = null;
        if (supabaseAdmin) {
            const { data, error } = await supabaseAdmin
                .from('anonymous_transactions')
                .insert([{ status: 'pending', amount_usd: 2.99, payment_provider: 'paypal' }])
                .select()
                .single();

            if (!error) sessionId = data?.session_id;
        }

        return res.json({ success: true, text: fullText, sessionId });
    } catch (error) {
        console.error('Error parsing PDF:', error);
        return res.status(500).json({ error: 'Failed to process PDF file' });
    }
}
