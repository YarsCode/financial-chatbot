const SHEET_ID = process.env.GOOGLE_SHEETS_ID;
const API_KEY = process.env.GOOGLE_SHEETS_API_KEY;

if (!SHEET_ID || !API_KEY) {
  throw new Error('Missing GOOGLE_SHEETS_ID or GOOGLE_SHEETS_API_KEY env variable');
}

const QUESTIONS_RANGE = 'questions';
const ANSWERS_RANGE = 'answers';

export interface SheetQuestion {
  id: string;
  section: string;
  question: string;
  type: 'text' | 'sum' | 'number' | 'multiple';
  is_last_question: boolean;
}

export interface SheetAnswer {
  question_id: string;
  answer_id: string;
  answer: string;
  next_question: string;
}

export interface ParsedQuestion extends SheetQuestion {
  answers?: SheetAnswer[];
}

async function fetchSheet(range: string): Promise<string[][]> {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`;
  const res = await fetch(url);

  const data = await res.json();
  return data.values;
}

export async function getQuestionsAndAnswers(): Promise<ParsedQuestion[]> {
  const [questionsRaw, answersRaw] = await Promise.all([
    fetchSheet(QUESTIONS_RANGE),
    fetchSheet(ANSWERS_RANGE),
  ]);

  // Parse questions
  const [qHeaders, ...qRows] = questionsRaw;
  const questions: SheetQuestion[] = qRows.map(row => {
    const obj: Record<string, string | boolean> = {};
    qHeaders.forEach((header, i) => {
      const key = header.trim().toLowerCase();
      if (key === 'is_last_question') {
        obj[key] = row[i] === 'TRUE';
      } else {
        obj[key] = row[i];
      }
    });
    return obj as unknown as SheetQuestion;
  });

  // Parse answers
  const [aHeaders, ...aRows] = answersRaw;
  const answers: SheetAnswer[] = aRows.map(row => {
    const obj: Record<string, string> = {};
    aHeaders.forEach((header, i) => {
      obj[header.trim().toLowerCase()] = row[i];
    });
    return obj as unknown as SheetAnswer;
  });

  // Attach answers to questions
  const questionsWithAnswers: ParsedQuestion[] = questions.map(q => {
    if (q.type === 'multiple') {
      const qAnswers = answers.filter(a => a.question_id === q.id);
      return { ...q, answers: qAnswers };
    }
    return q;
  });

  return questionsWithAnswers;
}
