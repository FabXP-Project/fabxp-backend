import {type Request, type Response} from "express"
import { Webhook, type WebhookRequiredHeaders } from 'svix';
import express from   "express"

const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
if (!WEBHOOK_SECRET) {
  throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env');
}

// Interface for Clerk/Svix event structure
interface ClerkEvent {
  data: Record<string, any>;
  object: string;
  type: string;
}

const clerkWebhook=async(req:Request,res:Response)=>{
    const payloadString = Buffer.isBuffer(req.body)
      ? req.body.toString('utf8')
      : JSON.stringify(req.body);
    const headers = req.headers;

    // Extract Svix headers required for verification
    const svixId = headers['svix-id'] as string;
    const svixTimestamp = headers['svix-timestamp'] as string;
    const svixSignature = headers['svix-signature'] as string;

    if (!svixId || !svixTimestamp || !svixSignature) {
      return res.status(400).json({ success: false, message: 'Missing svix headers' });
    }

    const wh = new Webhook(WEBHOOK_SECRET);
    let evt: ClerkEvent;

    try {
      evt = wh.verify(payloadString, {
        'svix-id': svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': svixSignature,
      } as WebhookRequiredHeaders) as ClerkEvent;
    } catch (err: any) {
      return res.status(400).json({ success: false, message: err.message });
    }

    // Handle the event types
    const eventType = evt.type;
    const data = evt.data;

    if (eventType === 'user.created') {
      console.log(`User created ID: ${data.id}`);
      // Add your database sync logic here (e.g., Prisma, MongoDB)
    } else if (eventType === 'user.updated') {
      console.log(`User updated ID: ${data.id}`);
    }

    return res.status(200).json({ success: true, message: 'Webhook received' });
  
};

export {clerkWebhook};