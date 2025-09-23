import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const name = formData.get("name")?.toString();
    const email = formData.get("email")?.toString();
    const message = formData.get("message")?.toString();
    const honeypot = formData.get("honeypot")?.toString();

    if (honeypot) {
      console.warn("🤖 Bot detectado. Ignorando solicitud.");
      return NextResponse.json({ error: "Bot detected" }, { status: 400 });
    }

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const mailOptions = {
      from: `"Fran Aragon Website" <noreply@cdesteponafans.com>`,
      to: "info@franaragondev.com",
      subject: `Nuevo mensaje de ${name}`,
      replyTo: email,
      html: `
        <h2>Nuevo mensaje desde franaragondev.com</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensaje:</strong><br/>${message.replace(/\n/g, "<br/>")}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("❌ Error al enviar el email:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
