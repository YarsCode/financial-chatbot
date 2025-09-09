export const initMessages = [
    `היי,
אני FUTURE.AI והמטרה שלי היא לעזור לך להבין מה (באמת) גורם לך לקבל החלטות כשזה נוגע לכסף שלך, לבחון מה רמת הסיכון שמתאימה לך והאם תהליך התכנון הפיננסי יעזור לך להשיג את המטרות הכלכליות שלך.`,
];

export const systemMessages = {
    startConversation: "מתחילים!",
    profileError: "אירעה שגיאה בניתוח הפרופיל. אנא נסה שוב מאוחר יותר.",
    success: `קיבלתי!
נשתמע 🙂`,
};

export const getGreetingMessage = (userName: string): string => {
    return `נעים להכיר ${userName} 🤝🏻\nכדי שאוכל לבחון את אופי ההשקעה שלך, אשאל מספר שאלות פסיכולוגיות ופיננסיות ובעזרתן אערוך עבורך צ'ק אפ פיננסי ראשוני.`;
};

export const phoneRequestMessage = 
    `מעולה!
אשמח להזמין אותך לשיחת אבחון ללא עלות וללא התחייבות. 
אני אעביר את כל התשובות למתכנן לטובת השיחה שתקבעו.

מה הנייד שלך לתיאום השיחה?
`;

export const getSelectedProfileDescription = (userName: string, genderedProfileName: string, profileDescription: string, gender: string): string[] => {
    if (gender === "male") {
        return [
            `${userName} תודה ששיתפת אותי!
        
בהתאם לשקלול התשובות שלך אתה המשקיע ה"${genderedProfileName}".
${profileDescription}`,
            `כדי שנוכל לבנות את אלוקציית ההשקעות שלך, נצטרך להגדיר מה המטרה שהכי חשוב לך להשיג, על מנת לבחון האם ניתן להשיג אותה בעזרת תהליך התכנון הפיננסי.`
        ];
    } else {
        return [
            `${userName} תודה ששיתפת אותי!
        
בהתאם לשקלול התשובות שלך את המשקיעה ה"${genderedProfileName}".
${profileDescription}`,
            `כדי שנוכל לבנות את אלוקציית ההשקעות שלך, נצטרך להגדיר מה המטרה שהכי חשוב לך להשיג, על מנת לבחון האם ניתן להשיג אותה בעזרת תהליך התכנון הפיננסי.`
        ];
    }
};
