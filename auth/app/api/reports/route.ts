import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Find the user
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      include: {
        questionSets: {
          include: {
            questions: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Format the response
    const reports = user.questionSets.map((set) => ({
      id: set.id,
      title: set.title,
      description: set.description,
      createdAt: set.createdAt,
      questionCount: set.questions.length,
      difficultyCount: {
        easy: set.questions.filter((q) => q.difficulty === 'EASY').length,
        medium: set.questions.filter((q) => q.difficulty === 'MEDIUM').length,
        hard: set.questions.filter((q) => q.difficulty === 'HARD').length,
      },
    }));

    return NextResponse.json({ reports }, { status: 200 });
  } catch (err) {
    console.error("❌ Error in GET /api/reports:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
