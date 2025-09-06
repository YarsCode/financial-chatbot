import { openai } from '@ai-sdk/openai';
import { convertToModelMessages, streamText, UIMessage } from 'ai';
import { readFileSync } from 'fs';
import { join } from 'path';
import { PromptType } from '@/types';

export async function POST(req: Request) {
  const { messages, type, context }: { messages: UIMessage[]; type?: PromptType; context?: string } = await req.json();
  // Read system prompt from file
  const generalSystemPrompt = readFileSync(
    join(process.cwd(), 'src/prompts/system.md'),
    'utf-8'
  );

  // Function to get specific prompt based on type
  const getSpecificPrompt = (promptType?: PromptType): string => {
    if (!promptType) return '';
    
    const promptFiles: Record<PromptType, string> = {
      'answer-feedback': 'answer-feedback.md',
      'profile-selection': 'profile-selection.md',
      'financial-plan': 'financial-plan.md'
    };
    
    const filename = promptFiles[promptType];
    return readFileSync(
      join(process.cwd(), `src/prompts/${filename}`),
      'utf-8'
    );
  };

  // Get specific prompt if type is provided
  // const specificPrompt = getSpecificPrompt(type);
  // let combinedSystemPrompt = specificPrompt 
  //   ? `${generalSystemPrompt}\n\n${specificPrompt}`
  //   : generalSystemPrompt;

  let combinedSystemPrompt = generalSystemPrompt;
  
  // Add additional context if provided
  if (context) {
    combinedSystemPrompt += `Context:\n${context}\n\n`;
  }  
  
  // console.log("combinedSystemPrompt", combinedSystemPrompt);
    
  const result = streamText({
    model: openai('gpt-5'),
    system: combinedSystemPrompt,
    messages: convertToModelMessages(messages),
  });

  result.usage.then((usage) => {
    console.log({
      messageCount: messages.length,
      inputTokens: usage.inputTokens,
      outputTokens: usage.outputTokens,
      totalTokens: usage.totalTokens,
    });
  });
  
  return result.toUIMessageStreamResponse();
}
