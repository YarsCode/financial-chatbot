export const initMessages = [
    "היי,\nאני FUTURE.AI והמטרה שלי היא להוביל אותך להפסיק לפחד מכסף ולחיות בשלווה כלכלית.",
    "אני הולך לשאול אותך מספר שאלות, כדי להכיר אותך יותר טוב ולעזור לך לתכנן את החיים העשירים שתמיד חלמת לחיות ולבנות תיק השקעות מגוון.",
    "שנתחיל?",
];

export const systemMessages = {
    startConversation: "מתחילים",
    analysisInProgress: "אספתי את כל המידע שאני צריך, תנו לי כמה רגעים לנתח את הנתונים ואומר לכם איזה סוג משקיעים אתם ואיך ניתן לשפר את המצב הנוכחי. פעולה זו עשויה להימשך מעל לדקה.",
    profileError: "אירעה שגיאה בניתוח הפרופיל. אנא נסה שוב מאוחר יותר.",
    success: "תודה! הפרטים נשלחו ויועץ פיננסי יצור איתך קשר בקרוב.",
};

export const getGreetingMessage = (userName: string): string => {
    return `נעים להכיר ${userName} 🤝🏻\nכדי שאוכל לבחון את אופי ההשקעה שלך, אשאל מספר שאלות פסיכולוגיות ופיננסיות ובעזרתן אערוך עבורך צ'ק אפ פיננסי ראשוני.`;
};

export const getCtaMessage = (userName: string, userGender: string): string => {
    const genderText = userGender === "male" ? "השאר" : "השאירי";
    return `${userName}, כדי שיועץ פיננסי מוסמך יוכל לחזור אליך ולסייע לך ביצירת תוכנית פיננסית מותאמת אישית, אנא ${genderText} את מספר הטלפון שלך.`;
};

export const getFinalMessage = (userName: string, genderedProfileName: string, profileDescription: string, gender: string): string => {
    if (gender === "male") {
        return `${userName} תודה ששיתפת אותי!
בהתאם לשקלול התשובות שלך אתה המשקיע ה"${genderedProfileName}".
${profileDescription}

כדי שנוכל לבנות את אלוקציית ההשקעות שלך, נצטרך להגדיר מה המטרה שהכי חשוב לך להשיג, על מנת לבחון האם ניתן להשיג אותה בעזרת תהליך התכנון הפיננסי.`;
    } else {
        return `${userName} תודה ששיתפת אותי!
בהתאם לשקלול התשובות שלך את המשקיעה ה"${genderedProfileName}".
${profileDescription}

כדי שנוכל לבנות את אלוקציית ההשקעות שלך, נצטרך להגדיר מה המטרה שהכי חשוב לך להשיג, על מנת לבחון האם ניתן להשיג אותה בעזרת תהליך התכנון הפיננסי.`;
    }
};
