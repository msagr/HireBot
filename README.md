# HireBot - AI-Powered Technical Interview Platform

HireBot is a modern, full-stack application designed to streamline the technical interview process. It provides a platform for conducting coding interviews, theory-based assessments, and system design evaluations with AI assistance.

## ✨ Features

- **User Authentication** - Secure sign-up and login with email/password or OAuth providers
- **Interview Management** - Create and manage interview question sets
- **Multiple Question Types** - Support for coding challenges, theory questions, and system design
- **AI-Powered Analysis** - Get AI-assisted evaluation of candidate responses
- **Resume Parsing** - Automatically extract and analyze candidate information from resumes
- **Real-time Code Execution** - Built-in code editor with syntax highlighting
- **Responsive Design** - Works seamlessly on desktop and mobile devices

## 🚀 Tech Stack

- **Frontend**: Next.js 14 with TypeScript, React 19
- **Styling**: Tailwind CSS with shadcn/ui components
- **Authentication**: NextAuth.js with JWT
- **Database**: PostgreSQL with Prisma ORM
- **AI**: OpenAI Integration
- **Email**: Resend
- **Deployment**: Vercel (recommended)

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 18.0.0 or later
- npm or yarn
- PostgreSQL database
- Git

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/hirebot.git
cd hirebot/auth
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Set Up Environment Variables

Create a `.env` file in the `auth` directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/hirebot?schema=public"

# Authentication
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3001

# Email (for password reset, etc.)
EMAIL_SERVER=smtp://username:password@smtp.example.com:587
EMAIL_FROM=noreply@example.com

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# Resend (for email)
RESEND_API_KEY=your-resend-api-key

# OAuth Providers (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

### 4. Set Up the Database

1. Create a new PostgreSQL database named `hirebot`
2. Run database migrations:

```bash
npx prisma migrate dev --name init
```

### 5. Start the Development Server

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3001`

## 🏗️ Project Structure

```
/auth
├── app/                  # Next.js app directory
│   ├── api/              # API routes
│   ├── (auth)/           # Authentication pages
│   ├── dashboard/        # Protected dashboard routes
│   └── ...
├── components/           # Reusable UI components
├── lib/                  # Utility functions and configurations
├── prisma/               # Database schema and migrations
└── public/               # Static assets
```

## 📝 Database Schema

Key models include:

- **User**: Application users (interviewers/candidates)
- **QuestionSet**: Collections of interview questions
- **Question**: Individual questions with types (coding/theory/system design)
- **Answer**: Candidate responses to questions
- **Account**: Linked authentication accounts (for OAuth)

## 🧪 Running Tests

```bash
npm test
# or
yarn test
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to a GitHub/GitLab/Bitbucket repository
2. Import the project on Vercel
3. Add your environment variables in the Vercel dashboard
4. Deploy!

### Other Platforms

1. Build the application:
   ```bash
   npm run build
   ```
2. Start the production server:
   ```bash
   npm start
   ```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with Next.js and the T3 Stack
- UI components powered by shadcn/ui
- Icons by Lucide React

---

Made with ❤️ by Your Name
