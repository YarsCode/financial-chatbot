import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { readFileSync } from "fs";
import { join } from "path";
import mammoth from "mammoth";

// Function to read all financial documents
async function readFinancialDocuments(): Promise<string> {
    const documentFiles = [
        "financial_profile_meuzan.docx",
        "financial_profile_mehamer.docx",
        "financial_profile_mehushav.docx",
        "financial_profile_metachnen.docx",
    ];

    const documentContents: string[] = [];

    for (const filename of documentFiles) {
        try {
            const buffer = readFileSync(join(process.cwd(), "src/documents", filename));
            const result = await mammoth.extractRawText({ buffer });
            documentContents.push(`=== ${filename} ===\n${result.value}`);
        } catch (error) {
            console.error(`Error reading ${filename}:`, error);
        }
    }

    return documentContents.join("\n\n");
}

export async function POST(req: Request) {
    try {
        const { context } = await req.json();

        // Read profile selection prompt from file
        const profileSelectionPrompt = readFileSync(
            join(process.cwd(), "src/prompts/profile-selection.md"),
            "utf-8"
        );

        // Read financial documents
        const documentsContent = await readFinancialDocuments();

        let result;
        for (let attempt = 1; attempt <= 2; attempt++) {
            try {
                result = await generateObject({
                    model: openai("gpt-5-mini"),
                    output: "enum",
                    enum: ["המתכנן", "המהמר", "המאוזן", "המחושב"],
                    prompt: `
        ${profileSelectionPrompt}

        User's questionnaire answers:
        ${context}

        These are the 4 available financial profiles and their descriptions:
        ${documentsContent}

        Based on the above instructions and the user's answers, return only the name of the most appropriate financial profile in plain Hebrew language`
                });
                break;
            } catch (error) {
                if (attempt === 2) throw error;
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        return result!.toJsonResponse();
    } catch (error) {
        console.error("Error generating profile selection:", error);
        return new Response("Failed to generate profile selection", { status: 500 });
    }
}
