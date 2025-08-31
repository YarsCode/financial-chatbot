import { openai } from '@ai-sdk/openai';
import { convertToModelMessages, streamText, UIMessage } from 'ai';
import { readFileSync } from 'fs';
import { join } from 'path';
import mammoth from 'mammoth';
import { PromptType } from '@/types';

// Function to read all financial documents
async function readFinancialDocuments(): Promise<string> {
  const documentFiles = [
    'financial_profile_meuzan.docx',
    'financial_profile_mehamer.docx', 
    'financial_profile_mehushav.docx',
    'financial_profile_metachnen.docx'
  ];
  
  const documentContents: string[] = [];
  
  for (const filename of documentFiles) {
    try {
      const buffer = readFileSync(join(process.cwd(), 'src/documents', filename));
      const result = await mammoth.extractRawText({ buffer });
      documentContents.push(`=== ${filename} ===\n${result.value}`);
    } catch (error) {
      console.error(`Error reading ${filename}:`, error);
    }
  }
  
  return documentContents.join('\n\n');
}

export async function POST(req: Request) {
  const { messages, type, context }: { messages: UIMessage[]; type?: PromptType; context?: string } = await req.json();
  
  // Read system prompt from file
  const generalSystemPrompt = readFileSync(
    join(process.cwd(), 'src/prompts/system.md'),
    'utf-8'
  );

  // Read financial documents
  const documentsContent = await readFinancialDocuments();

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
  const specificPrompt = getSpecificPrompt(type);
  let combinedSystemPrompt = specificPrompt 
    ? `${generalSystemPrompt}\n\n${specificPrompt}`
    : generalSystemPrompt;
  
  // Add financial documents as context
  combinedSystemPrompt += `\n\These are the 4 available financial profiles:\n${documentsContent}`;
  
  // Add additional context if provided
  if (context) {
    combinedSystemPrompt += `\n\nCurrent context:\n${context}\n\n`;
  }  
  
  console.log("combinedSystemPrompt", combinedSystemPrompt);
    
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
