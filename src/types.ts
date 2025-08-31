export interface Question {
    id: string;
    text: string;
    type: 'text' | 'number' | 'sum' | 'multiple';
    options?: string[];
    nextQuestions?: string[];
    answers?: Answer[];
    isLastQuestion?: boolean;
    section?: string;
}

export interface Answer {
    answer_id: string;
    question_id: string;
    answer: string;
    next_question: string;
}

export interface ConversationItem {
    id: string;
    type: "question" | "answer" | "ai-response";
    content: string;
    questionData?: Question;
}

export interface QuestionAnswerPair {
    question: string;
    answer: string;
}

export type PromptType = 'answer-feedback' | 'profile-selection' | 'financial-plan';