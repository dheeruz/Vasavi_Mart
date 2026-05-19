import nodemailer from 'nodemailer';
import dns from 'dns';
import { promisify } from 'util';
import dotenv from 'dotenv';

dotenv.config();

const resolve4 = promisify(dns.resolve4);

async function testSMTP() {
  console.log('Testing SMTP connection...');
  console.log('MAIL_USER:', process.env.MAIL_USER);
  console.log('MAIL_PASS:', process.env.MAIL_PASS ? '********' : 'missing');

  try {
    const addresses = await resolve4('smtp.gmail.com');
    const ipv4Address = addresses[0];
    console.log(`Resolved smtp.gmail.com to IPv4: ${ipv4Address}`);

    const transporter = nodemailer.createTransport({
      host: ipv4Address,
      port: 587,
      secure: false, // Must be false for port 587 (STARTTLS)
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      tls: {
        servername: 'smtp.gmail.com',
        rejectUnauthorized: false,
      },
    });

    console.log('Verifying transporter...');
    await transporter.verify();
    console.log('Transporter verified successfully! Connection is valid.');
  } catch (error) {
    console.error('SMTP test failed:', error);
  }
}

testSMTP();
