# Jabri RoleFit Assessment Builder

A comprehensive Next.js application for creating end-to-end candidate screening assessments that replace a recruiter's initial screening call and prepare candidates for face-to-face interviews.

## Features

- **Complete Assessment Builder**: Create role-specific assessments with all six primary screening categories
- **Video Interview Questions**: On-demand video recording with time limits and scoring rubrics
- **Progress Tracking**: Visual progress bar showing assessment completion status
- **AI-Powered Question Generation**: Uses OpenAI GPT models to generate role-specific questions
- **LangSmith Integration**: Optional tracing and evaluation support
- **Responsive Design**: Modern, mobile-friendly UI built with Tailwind CSS

## Project Structure

```
jabri-rolefit/
├── app/
│   ├── api/
│   │   ├── generate-assessment/    # API endpoint for generating assessments
│   │   └── submit-response/        # API endpoint for submitting candidate responses
│   ├── assessment/                 # Assessment taking page
│   ├── builder/                    # Assessment builder form page
│   ├── layout.tsx                  # Root layout
│   └── page.tsx                    # Home page
├── components/
│   ├── ProgressBar.tsx             # Progress indicator component
│   ├── QuestionCard.tsx            # Question display component
│   └── VideoRecorder.tsx           # Video recording component
├── lib/
│   ├── langchain.ts                # LangChain and LangSmith configuration
│   ├── prompt.ts                   # System prompt for assessment generation
│   └── schema.ts                   # Zod schemas for validation
├── types/
│   └── assessment.ts               # TypeScript type definitions
└── public/                         # Static assets
```

## Prerequisites

- Node.js 18+ and npm/yarn
- OpenAI API key
- (Optional) LangSmith API key for tracing

## Installation

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd jabri-rolefit
```

### Step 2: Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Step 3: Configure Environment Variables

Create a `.env.local` file in the root directory:

**Windows (PowerShell):**
```powershell
New-Item -Path .env.local -ItemType File
```

**macOS/Linux:**
```bash
touch .env.local
```

Edit `.env.local` and add your API keys:

```env
# OpenAI Configuration (Required)
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini
OPENAI_TEMPERATURE=0.2

# LangSmith Configuration (Optional)
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=your_langsmith_api_key_here
LANGCHAIN_PROJECT=rolefit-assessments
LANGCHAIN_ENDPOINT=https://api.smith.langchain.com
```

**Note:** For detailed setup instructions, see [SETUP.md](./SETUP.md)

### Step 4: Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Configuration Details

### OpenAI Configuration

- **OPENAI_API_KEY**: Your OpenAI API key (required)
- **OPENAI_MODEL**: Model to use (default: `gpt-4o-mini`)
  - Recommended models: `gpt-4o-mini`, `gpt-4o`, `gpt-4-turbo`
- **OPENAI_TEMPERATURE**: Controls randomness (0.0-2.0, default: 0.2)
  - Lower values = more deterministic
  - Higher values = more creative

### LangSmith Configuration (Optional)

LangSmith provides tracing and evaluation capabilities:

- **LANGCHAIN_TRACING_V2**: Set to `true` to enable tracing
- **LANGCHAIN_API_KEY**: Your LangSmith API key (starts with `lsv2_`)
- **LANGCHAIN_ENDPOINT**: LangSmith API endpoint (default: `https://api.smith.langchain.com`)
- **LANGCHAIN_PROJECT**: Project name for organizing traces

To get a LangSmith API key:
1. Sign up at [smith.langchain.com](https://smith.langchain.com)
2. Navigate to Settings → API Keys
3. Create a new API key
4. Copy the key (starts with `lsv2_`)

### Tailwind CSS Configuration

The project uses Tailwind CSS v4 with PostCSS. Configuration is handled via `tailwind.config.ts` and `postcss.config.mjs`.

## Usage

### Creating an Assessment

1. Navigate to the home page
2. Click "Create New Assessment"
3. Fill in the role details:
   - Basic Information (role title, seniority, experience)
   - Skills & Expertise (tech stack, domain expertise, must-have/nice-to-have skills)
   - Employment Details (type, location, work pattern)
   - Deal Breakers (timezone, salary, work rights, etc.)
   - Culture & Values (company values, culture notes)
4. Click "Generate Assessment"
5. The system will generate questions across all six categories

### Taking an Assessment

1. The assessment page displays questions sequentially
2. Review the question, competencies, and scoring guide
3. Record your video answer (with automatic time limits)
4. Review your recording and retake if needed
5. Navigate between questions using Previous/Next buttons
6. Complete the assessment when finished

## Assessment Categories

Every assessment includes these six categories:

1. **Background and Experience**: Candidate's professional history and relevant experience
2. **Technical or Role-Specific Skills**: Domain expertise and technical capabilities
3. **Soft Skills and Ways of Working**: Communication, collaboration, and work style
4. **Culture and Values Alignment**: Fit with company values and culture
5. **Motivation and Career Goals**: Career aspirations and motivation
6. **Practical Details and Deal Breakers**: Logistics, requirements, and non-negotiables

## API Endpoints

### POST `/api/generate-assessment`

Generates a complete assessment based on role input.

**Request Body:**
```json
{
  "roleTitle": "Senior Backend Engineer",
  "seniority": "Senior",
  "yearsExperience": 6,
  "techStack": ["Node.js", "PostgreSQL"],
  "team": "Engineering",
  "mustHaveSkills": ["REST APIs", "Database Design"],
  "dealBreakers": ["Timezone overlap"],
  "companyValues": ["Ownership", "Customer Focus"]
}
```

**Response:**
```json
{
  "sections": [
    {
      "title": "Background and Experience",
      "questions": [...]
    },
    ...
  ]
}
```

### POST `/api/submit-response`

Submits a candidate's response to a question.

**Request Body:**
```json
{
  "assessmentId": "assessment_123",
  "questionId": "question_456",
  "videoBlob": "...",
  "score": 4,
  "notes": "Strong technical answer"
}
```

## Development

### Building for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Architecture Decisions

- **Next.js App Router**: Uses the latest Next.js 16 App Router for server components and API routes
- **LangChain**: Orchestrates LLM calls with structured outputs
- **Zod**: Validates assessment structure and ensures data integrity
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Utility-first CSS for rapid UI development
- **Client Components**: Uses "use client" directive only where needed (interactivity, browser APIs)

## Future Enhancements

- [ ] Video storage integration (S3, Cloudinary, etc.)
- [ ] Database persistence for assessments and responses
- [ ] Scoring and evaluation automation
- [ ] Assessment templates and saving
- [ ] Multi-language support
- [ ] Candidate dashboard
- [ ] Recruiter review interface
- [ ] Export functionality (PDF, CSV)

## License

[Your License Here]

## Support

For issues and questions, please open an issue on GitHub.
