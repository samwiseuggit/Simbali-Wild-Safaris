import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';
import { createEnquiryHandler } from '../../lib/enquiries.mjs';

export const prerender = false;

const handleEnquiry = createEnquiryHandler({
  sendMail: async (message, settings) => nodemailer.createTransport(settings).sendMail(message),
});

export const POST: APIRoute = ({request, clientAddress}) => handleEnquiry(request, clientAddress);
