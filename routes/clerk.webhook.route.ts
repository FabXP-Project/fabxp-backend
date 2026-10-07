import express from "express"
import { clerkWebhook } from "../webhooks/clerk.webhook.js";
const app=express()

app.post(
  '/api/webhooks/clerk',
  clerkWebhook,
);