import { NextRequest, NextResponse } from 'next/server';

interface WebhookData {
  phone: string;
  userName: string;
  questionAnswerPairs: Array<{
    question: string;
    answer: string;
  }>;
  aiResponse: string;
}

export async function POST(request: NextRequest) {
  try {
    const data: WebhookData = await request.json();
    
    const webhookUrl = 'https://hook.eu1.make.com/9q2s3leha2qc1uojxudk2m7uyk31h5pi';
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: data.phone,
        userName: data.userName,
        conversation: data.questionAnswerPairs,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.status}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Failed to send webhook' },
      { status: 500 }
    );
  }
}
