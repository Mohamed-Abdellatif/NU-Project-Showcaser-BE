import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

interface SendMailParams {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export const sendMail = async ({ to, subject, text, html }: SendMailParams) => {
  try {
    // Get email credentials from environment variables
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    if (!emailUser || !emailPass) {
      return {
        data: 'Email credentials not configured. Please set EMAIL_USER and EMAIL_PASS in .env file.',
        statusCode: 500,
      };
    }

    // Determine email provider based on email domain
    const emailDomain = emailUser.split('@')[1]?.toLowerCase();
    const isGmail = emailDomain === 'gmail.com';
    const isOutlook = emailDomain?.includes('outlook') || emailDomain?.includes('hotmail') || emailDomain?.includes('live') || emailDomain?.includes('office365') || emailDomain?.includes('microsoft');

    // Create transporter based on email provider
    let transporter;
    
    if (isGmail) {
      // Gmail configuration
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: emailUser,
          pass: emailPass, // Use App Password for Gmail
        },
      });
    } else if (isOutlook) {
      // Office 365/Outlook configuration
      // Note: SMTP AUTH must be enabled in Microsoft 365 Admin Center
      transporter = nodemailer.createTransport({
        host: 'smtp.office365.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
          user: emailUser,
          pass: emailPass, // Use App Password
        },
        tls: {
          rejectUnauthorized: false,
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 10000,
      });
    } else {
      // Generic SMTP configuration
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: emailUser,
          pass: emailPass,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });
    }

    // Verify transporter configuration
    await transporter.verify();

    // Email options
    const mailOptions = {
      from: emailUser,
      to,
      subject,
      text: text || '',
      html: html || text || '',
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    return {
      data: {
        message: 'Email sent successfully',
        messageId: info.messageId,
      },
      statusCode: 200,
    };
  } catch (error) {
    let errorMessage = 'Failed to send email';
    let statusCode = 500;

    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Check for specific Office 365 authentication errors
      if (errorMessage.includes('535') || errorMessage.includes('basic authentication is disabled')) {
        errorMessage = 'Office 365 Authentication Error: Basic authentication is disabled. You need to enable SMTP AUTH in Microsoft 365 Admin Center. Go to Users > Active users > [Your User] > Mail > Manage email apps > Enable "Authenticated SMTP". If you don\'t have admin access, contact your IT administrator. Alternatively, use Gmail or another email service.';
        statusCode = 403;
      } else if (errorMessage.includes('Invalid login') || errorMessage.includes('535')) {
        errorMessage = 'Authentication failed. Verify: 1) EMAIL_USER is your full email address, 2) EMAIL_PASS is an App Password, 3) SMTP AUTH is enabled in Microsoft 365 Admin Center.';
        statusCode = 401;
      }
    }

    return {
      data: errorMessage,
      statusCode,
    };
  }
};

