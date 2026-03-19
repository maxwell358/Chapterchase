# Chapterchase

An interactive AI conversation tool for your books. Upload PDFs and chat with them using voice.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

Copy the `.env.example` file to create a `.env.local` file and fill in your own keys:

```bash
cp .env.example .env.local
```

### Required Keys

The following environment variables are needed for the app to function properly:

- **Clerk (Authentication):** `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`
- **Clerk URL redirects:** `NEXT_PUBLIC_CLERK_SIGN_IN_URL`, etc.
- **Database (MongoDB):** `MONGODB_URL`
- **Vapi (Voice AI):** `NEXT_PUBLIC_VAPI_PUBLIC_KEY`, `VAPI_SECRET_KEY`, `NEXT_PUBLIC_ASSISTANT_ID`
- **Vercel Blob (File Uploads):** `BLOB_READ_WRITE_TOKEN`

## Clerk Configuration Warning

If you see the warning:
`Clerk: Clerk has been loaded with development keys. Development instances have strict usage limits...`

This is normal in a development environment. Clerk uses `pk_test_` and `sk_test_` keys for development.

### To fix this for production:
1. Go to your [Clerk Dashboard](https://dashboard.clerk.com).
2. Create a new application or go to your existing one.
3. Switch to **Production mode** in the dashboard.
4. Copy your **Production Publishable Key** (`pk_live_...`) and **Secret Key** (`sk_live_...`).
5. Add these keys to your production environment variables (e.g., in Vercel's environment variables dashboard).

Once production keys are set, this warning will disappear.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
