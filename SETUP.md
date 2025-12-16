# Detailed Setup Guide

This guide provides step-by-step instructions for setting up the Jabri RoleFit Assessment Builder project.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
  - Check your version: `node --version`
  - Download from: [nodejs.org](https://nodejs.org/)

- **npm** or **yarn** or **pnpm**
  - npm comes with Node.js
  - Check version: `npm --version`

- **Git** (optional, for version control)
  - Check version: `git --version`

## Step 1: Project Setup

### 1.1 Navigate to Project Directory

```bash
cd jabri-rolefit
```

### 1.2 Install Dependencies

Install all required packages:

```bash
npm install
```

This will install:
- Next.js 16 (React framework)
- LangChain and OpenAI integration
- LangSmith for tracing
- Zod for validation
- Tailwind CSS for styling
- TypeScript types and dev dependencies

**Expected output:** You should see packages being installed. This may take 1-2 minutes.

## Step 2: Environment Configuration

### 2.1 Create Environment File

Create a `.env.local` file in the root directory:

**On Windows (PowerShell):**
```powershell
New-Item -Path .env.local -ItemType File
```

**On macOS/Linux:**
```bash
touch .env.local
```

### 2.2 Configure OpenAI API Key

1. **Get your OpenAI API key:**
   - Go to [platform.openai.com](https://platform.openai.com/)
   - Sign up or log in
   - Navigate to API Keys section
   - Create a new secret key
   - Copy the key (you won't be able to see it again)

2. **Add to `.env.local`:**
```env
OPENAI_API_KEY=sk-your-actual-api-key-here
OPENAI_MODEL=gpt-4o-mini
OPENAI_TEMPERATURE=0.2
```

**Configuration explanation:**
- `OPENAI_API_KEY`: Your OpenAI API key (required)
- `OPENAI_MODEL`: The model to use
  - `gpt-4o-mini`: Fast and cost-effective (recommended)
  - `gpt-4o`: More capable but slower
  - `gpt-4-turbo`: Balance of capability and speed
- `OPENAI_TEMPERATURE`: Controls randomness (0.0-2.0)
  - 0.0 = Very deterministic
  - 0.2 = Slightly creative (recommended)
  - 1.0 = More creative

### 2.3 Configure LangSmith (Optional but Recommended)

LangSmith provides tracing, monitoring, and evaluation for LLM applications.

1. **Get your LangSmith API key:**
   - Go to [smith.langchain.com](https://smith.langchain.com/)
   - Sign up for a free account
   - Navigate to Settings → API Keys
   - Create a new API key
   - Copy the key

2. **Add to `.env.local`:**
```env
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=lsv2_your-actual-api-key-here
LANGCHAIN_PROJECT=rolefit-assessments
LANGCHAIN_ENDPOINT=https://api.smith.langchain.com
```

**Note:** If you don't set up LangSmith, the application will still work, but you won't have tracing and monitoring capabilities.

### 2.4 Complete `.env.local` File

Your complete `.env.local` should look like:

```env
# OpenAI Configuration (Required)
OPENAI_API_KEY=sk-your-openai-api-key-here
OPENAI_MODEL=gpt-4o-mini
OPENAI_TEMPERATURE=0.2

# LangSmith Configuration (Optional)
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=lsv2_your-langsmith-api-key-here
LANGCHAIN_PROJECT=rolefit-assessments
LANGCHAIN_ENDPOINT=https://api.smith.langchain.com

# Next.js Configuration
NODE_ENV=development
```

### 2.5 Security Notes

- **Never commit `.env.local`** to version control
- The file is already in `.gitignore`
- Keep your API keys secret
- Rotate keys if exposed

## Step 3: Verify Installation

### 3.1 Check Node Modules

Ensure all dependencies are installed:

```bash
npm list --depth=0
```

You should see all packages listed without errors.

### 3.2 Verify TypeScript Compilation

Check for TypeScript errors:

```bash
npx tsc --noEmit
```

This should complete without errors.

## Step 4: Run the Development Server

### 4.1 Start the Server

```bash
npm run dev
```

**Expected output:**
```
  ▲ Next.js 16.0.10
  - Local:        http://localhost:3000
  - Ready in X seconds
```

### 4.2 Open in Browser

Navigate to: [http://localhost:3000](http://localhost:3000)

You should see the home page with "Create New Assessment" button.

## Step 5: Test the Application

### 5.1 Create a Test Assessment

1. Click "Create New Assessment"
2. Fill in the form:
   - Role Title: "Senior Software Engineer"
   - Seniority: Select "Senior"
   - Years of Experience: Enter "5"
   - Tech Stack: Add "React", "Node.js"
3. Click "Generate Assessment"
4. Wait for the assessment to be generated (10-30 seconds)

### 5.2 Verify Assessment Generation

- You should see 6 sections
- Each section should have 2-5 questions
- Questions should have scoring guides
- Progress bar should show correctly

### 5.3 Test Video Recording

1. On the assessment page, click "Start Recording"
2. Allow camera/microphone permissions
3. Record a test answer
4. Stop recording
5. Verify playback works

## Troubleshooting

### Issue: "OPENAI_API_KEY is not defined"

**Solution:**
- Verify `.env.local` exists in the root directory
- Check the file name is exactly `.env.local` (not `.env.local.txt`)
- Ensure the API key is on a single line without quotes
- Restart the development server after adding env vars

### Issue: "Module not found" errors

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Port 3000 already in use

**Solution:**
Use a different port:
```bash
PORT=3001 npm run dev
```

Or kill the process using port 3000:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill
```

### Issue: Video recording not working

**Solution:**
- Ensure you're using HTTPS or localhost (required for getUserMedia)
- Check browser permissions for camera/microphone
- Try a different browser (Chrome, Firefox, Safari)

### Issue: Assessment generation fails

**Solution:**
- Check OpenAI API key is valid
- Verify you have API credits
- Check browser console for error messages
- Check server logs in terminal

### Issue: TypeScript errors

**Solution:**
```bash
npm install --save-dev @types/node @types/react @types/react-dom
```

## Next Steps

Once the application is running:

1. **Customize the prompt** in `lib/prompt.ts` if needed
2. **Adjust styling** in `app/globals.css` and component files
3. **Add database** for persistence (see Future Enhancements in README)
4. **Set up production deployment** (Vercel, AWS, etc.)

## Production Deployment

### Build for Production

```bash
npm run build
npm start
```

### Environment Variables in Production

Set environment variables in your hosting platform:
- Vercel: Project Settings → Environment Variables
- AWS: Use Parameter Store or Secrets Manager
- Docker: Use `--env-file` or environment variables

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [LangChain Documentation](https://js.langchain.com/)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [LangSmith Documentation](https://docs.smith.langchain.com/)

## Support

If you encounter issues not covered here:
1. Check the browser console for errors
2. Check the terminal/server logs
3. Review the README.md for architecture details
4. Open an issue on GitHub

