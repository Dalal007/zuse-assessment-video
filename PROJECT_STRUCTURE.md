# Project Structure & File Overview

This document provides a detailed explanation of the project structure and key files.

## Directory Structure

```
jabri-rolefit/
├── app/                          # Next.js App Router directory
│   ├── api/                      # API routes (backend endpoints)
│   │   ├── generate-assessment/
│   │   │   └── route.ts         # POST endpoint for generating assessments
│   │   └── submit-response/
│   │       └── route.ts         # POST endpoint for submitting responses
│   ├── assessment/
│   │   └── page.tsx             # Assessment taking interface
│   ├── builder/
│   │   └── page.tsx             # Assessment builder form
│   ├── layout.tsx               # Root layout with metadata
│   ├── page.tsx                 # Home page
│   └── globals.css              # Global styles and Tailwind imports
│
├── components/                   # React components
│   ├── ProgressBar.tsx          # Progress indicator component
│   ├── QuestionCard.tsx         # Question display with scoring guide
│   └── VideoRecorder.tsx        # Video recording and playback component
│
├── lib/                         # Utility libraries and configurations
│   ├── langchain.ts             # LangChain/OpenAI LLM configuration
│   ├── prompt.ts                # System prompt for assessment generation
│   └── schema.ts                # Zod schemas for validation
│
├── types/                       # TypeScript type definitions
│   └── assessment.ts            # All assessment-related types
│
├── public/                      # Static assets
│
├── package.json                 # Dependencies and scripts
├── tsconfig.json                # TypeScript configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── next.config.ts               # Next.js configuration
├── .env.local                   # Environment variables (create this)
├── README.md                    # Main documentation
├── SETUP.md                     # Detailed setup instructions
└── PROJECT_STRUCTURE.md         # This file
```

## Key Files Explained

### App Router Files (`app/`)

#### `app/page.tsx`
- **Purpose**: Home page with navigation to builder
- **Type**: Server Component (default in Next.js 13+)
- **Key Features**: Simple landing page with link to assessment builder

#### `app/builder/page.tsx`
- **Purpose**: Assessment builder form interface
- **Type**: Client Component ("use client")
- **Key Features**:
  - Comprehensive form for role details input
  - Dynamic array inputs for skills, values, deal breakers
  - Form validation
  - Submits to `/api/generate-assessment`
  - Redirects to assessment page on success

#### `app/assessment/page.tsx`
- **Purpose**: Assessment taking interface
- **Type**: Client Component
- **Key Features**:
  - Displays questions sequentially
  - Progress tracking
  - Navigation between questions
  - Integrates VideoRecorder component
  - Stores responses in state

#### `app/api/generate-assessment/route.ts`
- **Purpose**: Backend API endpoint for generating assessments
- **Type**: Server-side API route
- **Key Features**:
  - Accepts RoleInput JSON
  - Validates required fields
  - Calls OpenAI via LangChain
  - Validates response with Zod schema
  - Returns structured assessment

#### `app/api/submit-response/route.ts`
- **Purpose**: Backend API endpoint for submitting candidate responses
- **Type**: Server-side API route
- **Key Features**:
  - Accepts video recordings and responses
  - Placeholder for video storage integration
  - Returns success/error status

### Components (`components/`)

#### `components/ProgressBar.tsx`
- **Purpose**: Visual progress indicator
- **Props**: `current` (number), `total` (number)
- **Features**: Animated progress bar with percentage display

#### `components/QuestionCard.tsx`
- **Purpose**: Display question with all details
- **Props**: `question` (Question type), `questionNumber` (optional)
- **Features**:
  - Question text display
  - Competencies tags
  - Signal/evaluation description
  - Time limit display
  - Expandable scoring guide

#### `components/VideoRecorder.tsx`
- **Purpose**: Video recording and playback
- **Props**: `question` (Question), `onRecorded` (callback), `recordedBlob` (optional)
- **Features**:
  - Camera/microphone access
  - Recording with countdown timer
  - Video playback
  - Retake functionality
  - Error handling for permissions

### Libraries (`lib/`)

#### `lib/langchain.ts`
- **Purpose**: LLM configuration and initialization
- **Exports**: `getLlm()` function
- **Configuration**:
  - OpenAI API key from environment
  - Model selection (default: gpt-4o-mini)
  - Temperature setting
  - LangSmith tracing (via env vars)

#### `lib/prompt.ts`
- **Purpose**: System prompt for assessment generation
- **Exports**: `ROLEFIT_SYSTEM_PROMPT` constant
- **Content**:
  - Core objective and instructions
  - All six primary categories
  - Second-tier competencies mapping
  - Output format specification
  - Design rules and quality guidelines

#### `lib/schema.ts`
- **Purpose**: Zod schemas for validation
- **Exports**:
  - `QuestionSchema`: Validates individual questions
  - `SectionSchema`: Validates sections with 2-5 questions
  - `AssessmentSchema`: Validates complete assessment (exactly 6 sections)

### Types (`types/`)

#### `types/assessment.ts`
- **Purpose**: TypeScript type definitions
- **Exports**:
  - `Question`: Question structure
  - `Section`: Section with questions
  - `Assessment`: Complete assessment
  - `RoleInput`: Input for assessment generation
  - `QuestionResponse`: Candidate response structure
  - `AssessmentSession`: Full session data

## Data Flow

### Assessment Generation Flow

1. User fills form in `app/builder/page.tsx`
2. Form submits to `app/api/generate-assessment/route.ts`
3. API route:
   - Validates input
   - Builds user prompt
   - Calls `getLlm()` from `lib/langchain.ts`
   - Invokes LLM with system prompt from `lib/prompt.ts`
   - Parses and validates response with `lib/schema.ts`
   - Returns assessment JSON
4. Builder page receives assessment and redirects to assessment page
5. Assessment page displays questions from assessment data

### Assessment Taking Flow

1. User views question in `app/assessment/page.tsx`
2. Question displayed via `components/QuestionCard.tsx`
3. Progress shown via `components/ProgressBar.tsx`
4. User records answer via `components/VideoRecorder.tsx`
5. Video blob stored in component state
6. User navigates to next question
7. On completion, responses can be submitted to `app/api/submit-response/route.ts`

## Configuration Files

### `package.json`
- **Dependencies**:
  - `next`: React framework
  - `@langchain/openai`: OpenAI integration
  - `langchain`: LLM orchestration
  - `langsmith`: Tracing and monitoring
  - `zod`: Schema validation
  - `react`, `react-dom`: React library
- **Dev Dependencies**:
  - `typescript`: Type checking
  - `tailwindcss`: Styling
  - `eslint`: Linting

### `tsconfig.json`
- TypeScript configuration
- Path aliases: `@/*` maps to root directory
- React JSX settings
- Strict type checking enabled

### `tailwind.config.ts`
- Tailwind CSS configuration
- Custom theme settings (if any)

### `next.config.ts`
- Next.js configuration
- Currently minimal, can be extended

## Environment Variables

See `SETUP.md` for detailed environment variable configuration.

**Required:**
- `OPENAI_API_KEY`: OpenAI API key

**Optional:**
- `OPENAI_MODEL`: Model name (default: gpt-4o-mini)
- `OPENAI_TEMPERATURE`: Temperature setting (default: 0.2)
- `LANGCHAIN_TRACING_V2`: Enable LangSmith tracing
- `LANGCHAIN_API_KEY`: LangSmith API key
- `LANGCHAIN_PROJECT`: Project name for traces

## Styling Approach

- **Framework**: Tailwind CSS v4
- **Design System**: Utility-first CSS
- **Colors**: Blue/indigo gradient theme
- **Responsive**: Mobile-first design with breakpoints
- **Components**: Custom styled components with Tailwind classes

## State Management

- **Client State**: React `useState` hooks
- **Form State**: Controlled components
- **API State**: Fetch API with loading/error states
- **No Global State**: Currently using local component state

## API Design

### RESTful Endpoints

- `POST /api/generate-assessment`: Generate assessment
- `POST /api/submit-response`: Submit candidate response

### Request/Response Format

All requests use JSON. Responses are JSON with appropriate status codes:
- `200`: Success
- `400`: Bad request (validation errors)
- `500`: Server error

## Error Handling

- **Client-side**: Try-catch blocks with user-friendly error messages
- **Server-side**: Try-catch with structured error responses
- **Validation**: Zod schema validation with detailed error messages
- **API Errors**: Logged to console, returned with appropriate status codes

## Future Architecture Considerations

When scaling, consider:
- Database integration (PostgreSQL, MongoDB)
- Video storage (S3, Cloudinary)
- Authentication (NextAuth.js, Clerk)
- Global state management (Zustand, Redux)
- API caching (React Query, SWR)
- Server-side session management

