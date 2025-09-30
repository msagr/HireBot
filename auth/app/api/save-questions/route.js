// app/api/questionSets/route.js
import { NextResponse } from 'next/server';
import { auth } from '@/auth';   
import { db } from '@/lib/db';   // singleton Prisma client

export async function POST(request) {
  try {
    // ✅ Get authenticated user
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // ✅ Parse request body safely
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { title, description, questions } = body || {};

    // ✅ Validate title
    if (!title || typeof title !== 'string') {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // ✅ Validate questions array
    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json({ error: 'Questions must be a non-empty array' }, { status: 400 });
    }

    // ✅ Define allowed enum values
    const allowedTypes = ['CODING', 'THEORY', 'SYSTEM_DESIGN'];
    const allowedDifficulties = ['EASY', 'MEDIUM', 'HARD'];

    // ✅ Normalize and validate each question
    const questionsToCreate = questions.map((q, i) => {
      if (!q || typeof q.question !== 'string') {
        throw new Error(`Question at index ${i} must include a valid "question" string`);
      }

      return {
        question: q.question,
        type: allowedTypes.includes(q.type) ? q.type : 'CODING',
        difficulty: allowedDifficulties.includes(q.difficulty) ? q.difficulty : 'MEDIUM',
      };
    });

    // ✅ Find user by email
    const user = await db.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // ✅ Create QuestionSet with nested questions
    const questionSet = await db.questionSet.create({
      data: {
        title,
        description: description || '',
        userId: user.id,
        questions: {
          create: questionsToCreate,
        },
      },
      include: {
        questions: true,
      },
    });

    return NextResponse.json({ success: true, questionSet }, { status: 201 });
  } catch (err) {
    console.error('❌ Error in POST /api/questionSets:', err);
    return NextResponse.json(
      { error: err?.message || 'Something went wrong while saving questions' },
      { status: 500 }
    );
  }
}
