import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const resendApiKey = process.env.RESEND_API_KEY;

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: { message: 'Method Not Allowed. Only POST requests are accepted.' }
    });
  }

  const { name, email, company } = req.body || {};

  if (!name || !email) {
    return res.status(400).json({
      error: { message: 'Missing required fields: name and email are required.' }
    });
  }

  // Simple email regex validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      error: { message: 'Invalid email address format.' }
    });
  }

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in server environment variables.');
    return res.status(500).json({
      error: { message: 'Server configuration error: Database credentials are not set.' }
    });
  }

  try {
    // 1. Insert lead into Supabase cv_downloads table
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { error: dbError } = await supabase
      .from('cv_downloads')
      .insert([{ name, email, company }]);

    if (dbError) {
      console.error('Database insertion error:', dbError);
      throw new Error(`Failed to save download record: ${dbError.message}`);
    }

    // 2. Send transaction email using Resend
    if (!resendApiKey) {
      console.error('Missing RESEND_API_KEY in server environment variables.');
      throw new Error('Email service is currently unconfigured.');
    }

    const resend = new Resend(resendApiKey);
    const downloadUrl = 'https://myciozcwwvziuqlqxhpq.supabase.co/storage/v1/object/public/portfolio-media/resumes.zip';

    const htmlContent = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e5e5; border-radius: 5px; background-color: #ffffff;">
        <h2 style="color: #111111; margin-bottom: 20px;">Thank you for your interest!</h2>
        <p style="color: #555555; font-size: 16px; line-height: 1.5;">Hi ${name},</p>
        <p style="color: #555555; font-size: 16px; line-height: 1.5;">Thank you for requesting my CV / Resume. Please click the button below to download the ZIP file containing my latest resume versions and credentials portfolio.</p>
        
        <div style="margin: 30px 0; text-align: center;">
          <a href="${downloadUrl}" 
             style="background-color: #111111; color: #ffffff; text-decoration: none; padding: 12px 24px; font-weight: bold; font-family: monospace; font-size: 14px; border-radius: 0; border: 2px solid #111111; display: inline-block; letter-spacing: 0.1em; text-transform: uppercase;">
            DOWNLOAD RESUME ZIP ↗
          </a>
        </div>
        
        <p style="color: #555555; font-size: 16px; line-height: 1.5;">
          If the button above does not work, you can copy and paste the following URL into your browser:
          <br/>
          <a href="${downloadUrl}" style="color: #0066cc; text-decoration: underline; font-break: break-all;">${downloadUrl}</a>
        </p>

        <p style="color: #777777; font-size: 14px; line-height: 1.5; margin-top: 30px; border-top: 1px solid #e5e5e5; padding-top: 20px;">
          Best regards,<br/>
          <strong>Haikal Jibran Al Ghiffarry</strong><br/>
          Systems Architect & Fullstack Developer<br/>
          <a href="https://ghiffa.dev" style="color: #666666; text-decoration: underline;">ghiffa.dev</a>
        </p>
      </div>
    `;

    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'Haikal Jibran <noreply@ghiffa.dev>',
      to: [email],
      subject: 'Requested CV & Resume - Haikal Jibran Al Ghiffarry',
      html: htmlContent
    });

    if (emailError) {
      console.error('Resend delivery error:', emailError);
      throw new Error(`Failed to send email: ${emailError.message}`);
    }

    return res.status(200).json({
      success: true,
      message: 'Resume sent successfully!',
      data: emailData
    });

  } catch (error) {
    return res.status(500).json({
      error: { message: error.message || 'Internal Server Error' }
    });
  }
}
