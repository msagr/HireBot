import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

interface QuestionAnswer {
  id: string;
  question: string;
  type: string;
  difficulty: string;
  answer: string | null;
  code: string | null;
}

interface ReportData {
  id: string;
  title: string;
  description: string | null;
  createdAt: Date;
  questions: QuestionAnswer[];
}

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const { params } = context;
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Use findFirst instead of findUnique to filter by user email
    const questionSet = await db.questionSet.findFirst({
      where: { 
        id: params.id,
        user: {
          email: session.user.email
        }
      },
      include: {
        questions: {
          orderBy: { id: 'asc' },
          include: {
            answers: {
              where: {
                user: {
                  email: session.user.email
                }
              },
              select: {
                answer: true,
                code: true,
              },
              take: 1
            }
          }
        }
      },
    });

    if (!questionSet) {
      return NextResponse.json({ error: "Question set not found" }, { status: 404 });
    }

    const report: ReportData = {
      id: questionSet.id,
      title: questionSet.title,
      description: questionSet.description,
      createdAt: questionSet.createdAt,
      questions: questionSet.questions.map(question => ({
        id: question.id,
        question: question.question,
        type: question.type,
        difficulty: question.difficulty,
        answer: question.answers[0]?.answer || null,
        code: question.answers[0]?.code || null,
      })),
    };

    return NextResponse.json({ report }, { status: 200 });
  } catch (err) {
    console.error(`❌ Error in GET /api/reports/${params.id}:`, err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
