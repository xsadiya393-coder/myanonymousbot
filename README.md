# Vercel + Next.js + Telegram Form

A ready-to-deploy Next.js form with:
- form fields
- preview/confirmation screen
- PDF/JPG/PNG/WEBP uploads
- server-side validation
- Telegram Bot delivery
- Telegram Bot token kept server-side
- simple honeypot anti-spam field

## 1. Create a Telegram bot

Open Telegram and talk to **@BotFather**. Create a bot with `/newbot` and copy its token.

Then send a message to the bot from the Telegram account/chat that should receive submissions.

Get the target chat ID using a trusted method such as Telegram's `getUpdates` API, or use a bot-management tool you trust. Do not publish your bot token.

## 2. Configure environment variables

Create `.env.local` for local development:

```env
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```

On Vercel, add the same two variables under Project Settings → Environment Variables.

Never put the bot token in `app/page.tsx` or other browser-side code.

## 3. Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## 4. Deploy

Push this project to GitHub, import it into Vercel, add the two environment variables, and deploy.

## Upload limits

This demo limits each file to 10 MB, up to 8 files, and 40 MB total. Telegram and Vercel platform limits can change; for larger document workflows, use object storage and send Telegram links instead.

## Privacy/security

If collecting IDs, passports, certificates, or other sensitive documents:
- collect only what you need
- clearly disclose why you collect it
- use HTTPS
- restrict Telegram chat access
- consider retention/deletion procedures
- add authentication/rate limiting before using this in production
- do not log document contents or bot tokens


## Important security note

The bot token that was pasted into chat should be considered exposed. Revoke it in Telegram's @BotFather and create a new token before deploying. Put the replacement only in Vercel Environment Variables.

This project intentionally does **not** claim to secretly read a visitor's phone address/location, SIM state, Gmail accounts, passwords, OTPs, or other device data. A web form cannot legitimately promise those checks without a separate, explicit, permission-based mechanism.
