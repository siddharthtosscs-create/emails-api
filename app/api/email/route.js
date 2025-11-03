import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

// ============================================
// FIXED RECIPIENT EMAIL ADDRESS
// Enter the recipient email address below:
// ============================================
const FIXED_RECIPIENT_EMAIL = "siddharth.toss.cs@gmail.com"; // <-- ENTER YOUR RECIPIENT EMAIL HERE
// ============================================

export async function GET() {
    const data = {
        message: 'Hello from the Email API',
        endpoints: {
            POST: '/api/email - Send email with Name, Email, Mobile Number, and Message',
            GET: '/api/email - Get API information'
        },
        usage: {
            method: 'POST',
            body: {
                name: 'John Doe',
                email: 'john@example.com',
                mobileNumber: '1234567890',
                message: 'Your message here'
            }
        }
    }
    return Response.json({ data })
}

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "toss125training@gmail.com",
        pass: "limzksqufgsenfls"
    }
});

export async function POST(req) {
    try {
        const { name, email, mobileNumber, message } = await req.json();

        console.log('Received Email Request:', { name, email, mobileNumber, message });

        if (!name || !email || !mobileNumber || !message) {
            return NextResponse.json({ 
                error: 'All fields are required: name, email, mobileNumber, message' 
            }, { status: 400 });
        }

        // Format email body with Name, Email, Mobile Number, and Message
        const emailText = `Name: ${name}\nEmail: ${email}\nMobile Number: ${mobileNumber}\nMessage: ${message}`;
        const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Contact Form Submission</h2>
                <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
                    <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
                    <p style="margin: 10px 0;"><strong>Email:</strong> ${email}</p>
                    <p style="margin: 10px 0;"><strong>Mobile Number:</strong> ${mobileNumber}</p>
                    <p style="margin: 10px 0;"><strong>Message:</strong></p>
                    <div style="background-color: #fff; padding: 15px; border-left: 3px solid #333; margin-top: 10px;">
                        ${message.replace(/\n/g, '<br>')}
                    </div>
                </div>
            </div>
        `;

        const mailOptions = {
            from: `"Contact Form" <toss125training@gmail.com>`,
            to: FIXED_RECIPIENT_EMAIL,
            subject: 'Contact Form Submission',
            text: emailText,
            html: emailHtml
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ 
            message: 'Email sent successfully',
            details: {
                from: 'Contact Form <toss125training@gmail.com>',
                to: FIXED_RECIPIENT_EMAIL,
                subject: 'Contact Form Submission'
            }
        }, { status: 200 });

    } catch (error) {
        console.error('Email Send Error:', error);
        return NextResponse.json({ 
            error: error.message || 'Failed to send email' 
        }, { status: 500 });
    }
}
