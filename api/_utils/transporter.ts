import nodemailer from 'nodemailer';

const user = process.env.MAIL_USER;
const pass = process.env.MAIL_PASS;

if (!user || !pass) {
  console.warn('MAIL_USER or MAIL_PASS environment variables are missing!');
}

export const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // Use SSL
  auth: {
    user: user || '',
    pass: pass || '',
  },
});

export const adminEmail = user || 'admin@vasavimart.com';
