# AI-Powered Chemistry Learning Platform

A comprehensive web-based learning platform for BTech First Year students focused on Engineering Chemistry, particularly Water and Its Treatment.

## Features

### 🤖 AI Problem Solver with Weakness Detector
- Step-by-step guided problem-solving (no direct answers)
- Concept identification and concept-check questions
- Progressive hints system
- Answer verification with detailed feedback
- Automatic weakness detection and tracking
- Tracks hints used, wrong attempts, and time per problem

### 🧪 Virtual Chemistry Lab (Water & Its Treatment)
- Pre-lab learning with tutorials
- Interactive lab simulation with step-by-step procedures
- Two modes: Guided (with hints) and Exam (no hints)
- Error handling with visual feedback
- Safety precautions and explanations
- Performance tracking and scoring

### 📝 Teach-Back Learning Module
- Create notes via text or voice input (speech-to-text)
- AI evaluation of notes (accuracy, clarity, completeness)
- Improved version suggestions
- Concept map generation
- Formula summaries
- Publish notes publicly or keep private
- Like and save system for top student explanations

### 📚 Structured Course Content
- Complete "Water and Its Treatment" chapter
- Prerequisite basics (Units, Concentration, Reactions)
- Core topics (Hardness, Alkalinity, pH, Softening, Treatment)
- Advanced applications (Industrial cases, Exam problems)
- Visual diagrams, videos, quizzes, and examples
- Difficulty tagging (🟢 Easy, 🟡 Medium, 🔴 Hard)
- Progress tracking

### 📊 Student Dashboard
- Learning progress overview
- Weak concepts tracker with strength analysis
- Problem-solving accuracy trends
- Lab performance metrics
- Analytics: time spent, hint dependency, improvement trends
- Personalized recommendations

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Charts**: Recharts
- **Icons**: Lucide React
- **Animations**: Framer Motion

## Project Structure

```
├── app/
│   ├── api/              # API routes for AI integration
│   ├── auth/             # Login and signup pages
│   ├── dashboard/         # Main dashboard and feature pages
│   │   ├── problem-solver/
│   │   ├── virtual-lab/
│   │   ├── teach-back/
│   │   └── course/
│   └── page.tsx           # Landing page
├── components/            # Reusable components
├── lib/                   # Store and utilities
└── public/                # Static assets
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Vercel will automatically detect Next.js and configure the build
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Render

Build command: `npm run build`
Start command: `npm start`

## Environment Variables

Currently, the app uses simulated AI responses. To integrate with OpenAI:

1. Create a `.env.local` file:
```env
OPENAI_API_KEY=your_api_key_here
```

2. Update API routes to use OpenAI API

## Key Features Implementation

### AI Behavior Rules
- ✅ Never directly reveals final answers immediately
- ✅ Always encourages student thinking
- ✅ Provides progressive hints and guidance
- ✅ Supportive and non-judgmental feedback
- ✅ Adapts difficulty based on performance

### User Authentication
- Student login/signup
- Progress saved to localStorage (can be upgraded to database)
- Personalized recommendations based on performance

## Development Notes

- AI integration uses simulated responses (ready for OpenAI API integration)
- Data persistence via localStorage (can be upgraded to database)
- Mobile-responsive design
- Clean, modern, student-friendly UI

## Future Enhancements

- Real OpenAI API integration
- Database backend for persistent storage
- Image upload and OCR for problem solving
- Advanced analytics and reporting
- Multi-language support
- Collaborative features

## License

MIT

