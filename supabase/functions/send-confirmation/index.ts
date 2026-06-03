import { serve } from 'https://deno.land/std@0.208.0/http/server.ts'
import * as nodemailer from 'npm:nodemailer@6.9.8'


const SMTP_HOST = 'smtp.qq.com'
const SMTP_PORT = 465
const SMTP_USER = Deno.env.get('SMTP_USER') || ''
const SMTP_PASS = Deno.env.get('SMTP_PASS') || ''

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: true,
  auth: { user: SMTP_USER, pass: SMTP_PASS },
})

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey' } })
  }
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } })
  }
  try {
    const { email, parent_name } = await req.json()
    if (!email) {
      return new Response(JSON.stringify({ error: 'Missing email' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
    }
    const displayName = parent_name || '家長'
    await transporter.sendMail({
      from: `"佳思教育" <${SMTP_USER}>`,
      to: email,
      subject: '收到您的諮詢 - 佳思教育 Joy n Think',
      html: `<div style="font-family:'Noto Sans SC','Microsoft YaHei',sans-serif;max-width:600px;margin:0 auto;padding:30px;background:#f8f9ff;border-radius:16px;">
        <div style="text-align:center;margin-bottom:24px;">
          <h1 style="color:#1a1a2e;font-size:24px;margin:0;">佳思教育</h1>
          <p style="color:#667eea;font-size:14px;margin:4px 0 0;">Joy n Think — 幫你實現夢想</p>
        </div>
        <div style="background:#fff;border-radius:12px;padding:28px;box-shadow:0 2px 12px rgba(0,0,0,0.06);">
          <p style="font-size:16px;color:#1a1a2e;margin:0 0 16px;">尊敬的 <strong>${displayName}</strong>：</p>
          <p style="font-size:15px;color:#4b5563;line-height:1.8;margin:0 0 12px;">感謝您填寫諮詢表格！我們已收到您的查詢，將在 <strong style="color:#667eea;">1-2 個工作日</strong> 內通過電話或郵件與您聯繫。</p>
          <p style="font-size:15px;color:#4b5563;line-height:1.8;margin:0 0 12px;">如有緊急事宜，歡迎直接致電我們：</p>
          <div style="background:#f3f4f6;border-radius:8px;padding:12px 16px;margin:12px 0;">
            <p style="margin:4px 0;font-size:14px;color:#374151;">📞 <strong>電話：</strong>（852）1234 5678</p>
            <p style="margin:4px 0;font-size:14px;color:#374151;">📍 <strong>地址：</strong>香港九龍旺角彌敦道 123 號</p>
          </div>
        </div>
        <div style="text-align:center;margin-top:20px;font-size:12px;color:#9ca3af;">
          <p>此郵件由系統自動發送，請勿直接回覆</p>
          <p style="margin-top:4px;">© ${new Date().getFullYear()} 佳思教育 Joy n Think</p>
        </div>
      </div>`,
    })
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } })
  }
})
