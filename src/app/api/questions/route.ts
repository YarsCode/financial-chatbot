import { NextResponse } from 'next/server';
import { Question } from '@/types';
import { getQuestionsAndAnswers } from '@/lib/google-sheets';

export async function GET() {
  try {
    const questionsData = await getQuestionsAndAnswers();
    
    const questions: Question[] = questionsData.map((q) => {
      const question: Question = {
        id: q.id,
        text: q.question,
        type: q.type,
        isLastQuestion: q.is_last_question,
        section: q.section,
      };
      
      if (q.type === 'multiple' && q.answers) {
        question.answers = q.answers.map(a => ({
          answer_id: a.answer_id,
          question_id: a.question_id,
          answer: a.answer,
          next_question: a.next_question,
          score: a.score,
        }));

        //TODO: check if this is needed
        // question.options = q.answers.map(a => a.answer);
        // question.nextQuestions = q.answers.map(a => a.next_question);
      }
      
      return question;
    });
    
    return NextResponse.json({ questions });
  } catch (error) {
    console.error('Error loading questions:', error);
    return NextResponse.json(
      { error: 'Failed to load questions' },
      { status: 500 }
    );
  }
}
