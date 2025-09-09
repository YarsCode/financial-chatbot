import { financialProfiles, getProfileByScore } from "@/constants/financial-profiles";
import { getSelectedProfileDescription } from "@/constants/messages";

export async function POST(req: Request) {
    try {
        const { score, gender, userName } = await req.json();

        const profileName = getProfileByScore(Number(score));
        const profile = financialProfiles[profileName];
        const profileDescription = profile[gender === "male" ? "male" : "female"];
        const genderedProfileName = profile[gender === "male" ? "maleName" : "femaleName"];
        const selectedProfileDescriptionMessages = getSelectedProfileDescription(userName, genderedProfileName, profileDescription, gender);

        return Response.json({
            profile: profileName,
            messages: selectedProfileDescriptionMessages
        });
    } catch (error) {
        console.error("Error generating profile selection:", error);
        return new Response("Failed to generate profile selection", { status: 500 });
    }
}
