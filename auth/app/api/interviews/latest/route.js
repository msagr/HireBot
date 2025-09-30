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
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get the latest QuestionSet created by the user
    const latestSet = await db.questionSet.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    if (!latestSet) {
      return NextResponse.json({ error: "No interviews found" }, { status: 404 });
    }

    return NextResponse.json({ interviewId: latestSet.id }, { status: 200 });
  } catch (err) {
    console.error("❌ Error in GET /api/interviews/latest:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
