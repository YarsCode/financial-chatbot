import { NextRequest, NextResponse } from 'next/server';

interface WebhookData {
  phone: string;
  questionAnswerPairs: Array<{
    question: string;
    answer: string;
  }>;
  aiResponse: string;
}

export async function POST(request: NextRequest) {
  try {
    const data: WebhookData = await request.json();
    
    const webhookUrl = 'https://webhook.site/a213d6bd-352c-489a-9312-e16e6943c2df';
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: data.phone,
        conversation: data.questionAnswerPairs,
        aiResponse: data.aiResponse,
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
