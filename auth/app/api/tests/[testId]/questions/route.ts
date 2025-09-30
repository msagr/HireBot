import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getQuestionSetById } from '@/actions/question-set';

export async function GET(
  request: Request,
  { params }: { params: { testId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Decode the testId from the URL
    const testId = decodeURIComponent(params.testId);
    console.log('API - Fetching questions for testId:', testId);
    console.log('API - User ID:', session.user.id);

    if (!testId) {
      return NextResponse.json(
        { error: 'Test ID is required' },
        { status: 400 }
      );
    }

    // Fetch the question set with questions
    console.log('API - Fetching question set...');
    const questionSet = await getQuestionSetById(testId, session.user.id);
    
    if (!questionSet) {
      console.log('API - Question set not found');
      return NextResponse.json(
        { error: 'Test not found' },
        { status: 404 }
      );
    }

    console.log('API - Found question set:', questionSet.id);
    // Return the questions
    return NextResponse.json({
      questions: questionSet.questions || []
    });

  } catch (error) {
    console.error('API - Error fetching questions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
