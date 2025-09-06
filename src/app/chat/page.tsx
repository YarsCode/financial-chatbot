"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useEffect, useRef } from "react";
import { Question, ConversationItem, QuestionAnswerPair, Answer } from "@/types";
import { NumberInput } from "@/components/NumberInput";
import { MultipleChoice } from "@/components/MultipleChoice";
import { MessageBubble } from "@/components/MessageBubble";
import { Loader } from "@/components/Loader";
// import { RobotModel } from "@/components/RobotModel";
import styles from "./page.module.css";
import { IoSend } from "react-icons/io5";
import Image from "next/image";

const greetingMessages = [
    "היי,\nאני FUTURE.AI והמטרה שלי היא להוביל אותך להפסיק לפחד מכסף ולחיות בשלווה כלכלית.",
    "אני הולך לשאול אותך מספר שאלות, כדי להכיר אותך יותר טוב ולעזור לך לתכנן את החיים העשירים שתמיד חלמת לחיות ולבנות תיק השקעות מגוון.",
    "שנתחיל?",
];

export default function ChatbotPage() {
    const { messages, sendMessage, status, error } = useChat({
        transport: new DefaultChatTransport({
            api: "/api/chat",
        }),
    });

    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [conversation, setConversation] = useState<ConversationItem[]>([]);
    const [conversationStarted, setConversationStarted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [questionsError, setQuestionsError] = useState<string | null>(null);
    const [inputValue, setInputValue] = useState("");
    const [pendingNextQuestion, setPendingNextQuestion] = useState(false);
    const [questionAnswerPairs, setQuestionAnswerPairs] = useState<QuestionAnswerPair[]>([]);
    const [questionnaireComplete, setQuestionnaireComplete] = useState(false);
    const [isLoadingFirstQuestion, setIsLoadingFirstQuestion] = useState(false);
    const [phoneValue, setPhoneValue] = useState("");
    const [phoneSubmitted, setPhoneSubmitted] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(false);
    const [userName, setUserName] = useState("");
    const [userGender, setUserGender] = useState("");
    const [showCtaMessage, setShowCtaMessage] = useState(false);
    const [showProfileImage, setShowProfileImage] = useState(false);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const textInputRef = useRef<HTMLInputElement>(null);
    const phoneInputRef = useRef<HTMLInputElement>(null);

    // Function to get profile image path
    const getProfileImagePath = (profile: string): string => {
        const profileMap: Record<string, string> = {
            "המתכנן": "/financial-profiles-images/financial_profile_metachnen.jpeg",
            "המהמר": "/financial-profiles-images/financial_profile_mehamer.jpeg", 
            "המאוזן": "/financial-profiles-images/financial_profile_meuzan.jpeg",
            "המחושב": "/financial-profiles-images/financial_profile_mehushav.jpeg",
        };
        return profileMap[profile] || "";
    };

    // Load questions on component mount
    useEffect(() => {
        async function fetchQuestions() {
            try {
                const response = await fetch("/api/questions");
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Failed to load questions");
                }
                setQuestions(data.questions);
            } catch (err) {
                setQuestionsError(err instanceof Error ? err.message : "Failed to load questions");
            } finally {
                setIsLoading(false);
            }
        }

        fetchQuestions();
    }, []);

    // Keep chat at bottom without jumps
    useEffect(() => {
        const container = messagesContainerRef.current;
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }, [conversation, messages, showProfileImage, showCtaMessage]);

    // Show next question only when AI finishes streaming
    useEffect(() => {
        if (pendingNextQuestion && messages.length > 0 && status === "ready") {
            // showNextQuestion();
            setPendingNextQuestion(false);
        }
    }, [messages, status]);

    // Show profile image when AI finishes streaming
    useEffect(() => {
        if (questionnaireComplete && status === "ready" && messages.length > 0 && selectedProfile && !showProfileImage && !isLoadingProfile) {
            setShowProfileImage(true);
        }
    }, [questionnaireComplete, status, messages.length, selectedProfile, showProfileImage, isLoadingProfile]);

    // Show CTA message when profile image is displayed
    useEffect(() => {
        if (showProfileImage && !showCtaMessage) {
            setShowCtaMessage(true);
        }
    }, [showProfileImage, showCtaMessage]);
    
    useEffect(() => {
        if (!isLoading) {
            showNextQuestion();
        }
    }, [isLoading]);

    // Helper function to build context for AI
    const buildContextMessage = async (qaPairs: QuestionAnswerPair[]): Promise<string> => {
        const context = qaPairs
            .map((qa, index) => `${index + 1}. שאלה: ${qa.question}\nתשובה: ${qa.answer}`)
            .join("\n\n");

        return context;
    };

    // Start the conversation with first question
    const startConversation = () => {
        if (questions.length > 0) {
            setConversationStarted(true);
            setIsLoadingFirstQuestion(true);
            setConversation([
                {
                    id: "start-message",
                    type: "answer",
                    content: "מתחילים",
                },
            ]);
            
            setTimeout(() => {
                setIsLoadingFirstQuestion(false);
                showNextQuestion(0);
            }, Math.random() * 700 + 500); // Random delay between 500-1200ms
        }
    };

    const showNextQuestion = (nextQuestionIndex?: number) => {
        const nextIndex = nextQuestionIndex ?? currentQuestionIndex + 1;
        if (nextIndex < questions.length) {
            const nextQuestion = questions[nextIndex];
            setCurrentQuestionIndex(nextIndex);

            const questionId = nextQuestion.id;
            setConversation((prev) => [
                ...prev,
                {
                    id: questionId,
                    type: "question",
                    content: nextQuestion.text,
                    questionData: nextQuestion,
                },
            ]);
        }
    };

    const handleAnswer = async (answer: string | Answer) => {
        const currentQuestion = conversation[conversation.length - 1]?.questionData;
        if (!currentQuestion) return;

        // Extract answer text for display and context
        const answerText = typeof answer === 'string' ? answer : answer.answer;

        // Add user's answer to conversation
        const answerId = typeof answer === 'string' ? currentQuestion.id + "_a1" : answer.answer_id;
        setConversation((prev) => [
            ...prev,
            {
                id: answerId,
                type: "answer",
                content: answerText,
            },
        ]);

        // Set user name and gender based on question index
        if (currentQuestionIndex === 0) {
            setUserName(answerText.trim());
        } else if (currentQuestionIndex === 1) {
            const selectedAnswer = typeof answer === 'object' ? answer : null;
            if (selectedAnswer && currentQuestion.answers) {
                const answerIndex = currentQuestion.answers.findIndex(a => a.answer_id === selectedAnswer.answer_id);
                setUserGender(answerIndex === 0 ? "male" : "female");
            }
        }

        // Add to question-answer pairs for AI context
        const newQAPair: QuestionAnswerPair = {
            question: currentQuestion.text,
            answer: answerText,
        };
        setQuestionAnswerPairs((prev) => [...prev, newQAPair]);

        setInputValue("");

        const isLastQuestion = currentQuestion.isLastQuestion || currentQuestionIndex === questions.length - 1;
        
        if (isLastQuestion) {
            await handleFinalQuestionSubmission(answerText, newQAPair);
        } else {
            setIsLoading(true);

            setTimeout(() => {
                setIsLoading(false);
            }, Math.random() * 700 + 500); // Random delay between 500-1200ms
        }

        if (typeof answer === 'object' && answer.next_question) {
            setCurrentQuestionIndex(questions.findIndex(q => q.id === answer.next_question) - 1);
        }
    };

    // Function that runs only at the end of the questionnaire
    const handleFinalQuestionSubmission = async (answer: string, newQAPair: QuestionAnswerPair) => {
        // Add analysis message to conversation instantly
        setConversation((prev) => [
            ...prev,
            {
                id: "analysis-message",
                type: "question",
                content: "אספתי את כל המידע שאני צריך, תנו לי כמה רגעים לנתח את הנתונים ואומר לכם איזה סוג משקיעים אתם ואיך ניתן לשפר את המצב הנוכחי. פעולה זו עשויה להימשך מעל לדקה.",
            },
        ]);
        
        // Mark questionnaire as complete to show AI response
        setQuestionnaireComplete(true);
        setIsLoadingProfile(true);
        
        // Build context message for profile selection
        const contextMessage = await buildContextMessage([...questionAnswerPairs, newQAPair]);
        
        try {
            // First, get profile selection
            const profileResponse = await fetch("/api/chat/profile-selection", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ context: contextMessage }),
            });
            
            const profile = await profileResponse.json();
            setSelectedProfile(profile);
            setIsLoadingProfile(false);
            
            // Then send to main chat with profile as context
            sendMessage(
                { text: answer },
                {
                    body: {
                        context: `Name: ${userName}\nGender: ${userGender}\nProfile: ${profile}\n${contextMessage}`,
                    },
                }
            );
        } catch (error) {
            console.error("Error getting profile selection:", error);
            setIsLoadingProfile(false);
            // Display error message
            setConversation((prev) => [
                ...prev,
                {
                    id: "profile-error",
                    type: "question",
                    content: "אירעה שגיאה בניתוח הפרופיל. אנא נסה שוב מאוחר יותר.",
                },
            ]);
        }
    };



    // Phone validation function
    const validatePhone = (phone: string): boolean => {
        const cleanPhone = phone.trim();
        // Must be at least 9 characters and only contain numbers
        return cleanPhone.length >= 9 && /^[0-9]+$/.test(cleanPhone);
    };

    // Phone submission handler
    const onPhoneSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const cleanPhone = phoneValue.trim();
        if (!cleanPhone || !validatePhone(cleanPhone)) return;

        try {
            // Get AI response text
            const aiResponse = messages
                .filter(msg => msg.role === "assistant")
                .map(msg => msg.parts.filter(part => part.type === "text").map(part => part.text).join(""))
                .join("\n");

            // Send to webhook
            const response = await fetch("/api/webhook", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    phone: cleanPhone,
                    questionAnswerPairs,
                    aiResponse,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to send webhook");
            }

            setPhoneSubmitted(true);
        } catch (error) {
            console.error("Error submitting phone:", error);
            // Still mark as submitted to avoid blocking user
            setPhoneSubmitted(true);
        }
    };

    // Render helper functions
    const renderConversationItem = (item: ConversationItem, index: number) => {
        const isCurrentQuestion = item.type === "question" && index === conversation.length - 1;

        return (
            <div key={item.id} className="space-y-4">
                <MessageBubble role="system" content={item.content} />

                {/* Multiple Choice Options (only for current unanswered question) */}
                {item.questionData?.type === "multiple" &&
                    item.questionData.answers &&
                    isCurrentQuestion && (
                        <div className="flex justify-start">
                            <div className="max-w-xs lg:max-w-md w-full">
                                <MultipleChoice
                                    options={item.questionData.answers.map(answer => answer.answer)}
                                    onSelect={(answerText, index) => {
                                        const selectedAnswer = item.questionData!.answers![index];
                                        handleAnswer(selectedAnswer);
                                    }}
                                />
                            </div>
                        </div>
                    )}
            </div>
        );
    };

    const renderUserReply = (item: ConversationItem) => {
        return <MessageBubble key={item.id} role="user" content={item.content} />;
    };

    const renderAiResponse = () => {
        return (
            <>
                {/* AI Messages - Only render if there's actual content */}
                {messages
                    .filter((message) => message.role === "assistant")
                    .filter((message) => message.parts.some(part => part.type === "text" && part.text.trim() !== ""))
                    .map((message) => (
                        <MessageBubble key={message.id} role="assistant" content="">
                            {message.parts.map((part, index) => {
                                switch (part.type) {
                                    case "text":
                                        return (
                                            <div key={`${message.id}-${index}`} className="whitespace-pre-wrap">{part.text}</div>
                                        );
                                    default:
                                        return null;
                                }
                            })}
                        </MessageBubble>
                    ))}

                {/* Loading indicator for AI response and profile selection */}
                {(status === "submitted" || status === "streaming" || isLoadingProfile) && (
                    <MessageBubble role="assistant" content="">
                        <Loader />
                    </MessageBubble>
                )}
            </>
        );
    };

    // Derived state for UI rendering
    const currentQuestion = conversation[conversation.length - 1]?.questionData;
    const showInput = conversationStarted && currentQuestion && currentQuestion.type !== "multiple" && !questionnaireComplete;
    const showPhoneInput = questionnaireComplete && status === "ready" && !phoneSubmitted && !isLoadingProfile;

    // Auto-focus text input when it becomes available
    useEffect(() => {
        if (showInput && currentQuestion?.type === "text" && textInputRef.current) {
            textInputRef.current.focus();
        }
    }, [showInput, currentQuestion?.type]);

    // Auto-focus phone input when it becomes available
    useEffect(() => {
        if (showPhoneInput && phoneInputRef.current) {
            phoneInputRef.current.focus();
        }
    }, [showPhoneInput]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4" dir="rtl">
            {/* Chat Header */}
            <div className={`text-white p-3 rounded-t-lg ${styles["chat-header"]}`}>
                <h1
                    className={`text-4xl font-black text-center text-[var(--primary-green)] ${styles["chat-title"]}`}
                >
                    FUTURE AI
                </h1>
            </div>
            <div
                className={`w-full max-w-xl h-[600px] rounded-3xl border-2 border-t-0 border-[var(--primary-green)] flex flex-col ${styles["chat-container"]}`}
            >

                {/* Messages Container */}
                <div ref={messagesContainerRef} className={`flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-3`}>
                    {/* <RobotModel /> */}
                    
                    {/* Greeting Messages */}
                    {greetingMessages.map((message, index) => (
                        <MessageBubble key={`greeting-${index}`} role="system" content={message} />
                    ))}

                    {/* Error State */}
                    {error && (
                        <div className="flex justify-center">
                            <div className="bg-red-900 text-red-300 px-4 py-2 rounded-lg text-sm border border-red-700">
                                {error instanceof Error ? error.message : error}
                            </div>
                        </div>
                    )}

                    {/* Loading State */}
                    {!conversationStarted && isLoading && (
                        <div className="flex justify-center">
                            <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-3xl bg-[rgba(0,0,0,0.06)] backdrop-blur-[12px] backdrop-saturate-[180%] border border-[rgba(0,0,0,0.05)] text-gray-800">
                                <Loader />
                            </div>
                        </div>
                    )}

                    {/* Conversation Flow */}
                    {conversationStarted && (
                        <>
                            {conversation.map((item, index) => {
                                if (item.type === "question" || item.type === "ai-response") {
                                    return renderConversationItem(item, index);
                                } else {
                                    return renderUserReply(item);
                                }
                            })}
                            {isLoadingFirstQuestion && (
                                <MessageBubble role="system" content="">
                                    <Loader />
                                </MessageBubble>
                            )}
                            {isLoading && !isLoadingFirstQuestion && (
                                <MessageBubble role="system" content="">
                                    <Loader />
                                </MessageBubble>
                            )}
                        </>
                    )}



                    {/* AI Responses - Show only after questionnaire is complete */}
                    {questionnaireComplete && renderAiResponse()}

                    {/* Profile Image - Show after AI finishes streaming */}
                    {showProfileImage && selectedProfile && (
                        <MessageBubble role="system" content="">
                            <div className="flex justify-center">
                                <Image 
                                    src={getProfileImagePath(selectedProfile)}
                                    alt={`פרופיל פיננסי - ${selectedProfile}`}
                                    width={400}
                                    height={300}
                                    className="w-full h-auto rounded-lg"
                                    onLoad={() => {
                                        const container = messagesContainerRef.current;
                                        if (container) {
                                            requestAnimationFrame(() => {
                                                container.scrollTop = container.scrollHeight;
                                            });
                                        }
                                    }}
                                />
                            </div>
                        </MessageBubble>
                    )}

                    {/* Call to Action Message */}
                    {showCtaMessage && !phoneSubmitted && (
                        <MessageBubble 
                            role="system" 
                            content={`${userName}, כדי שיועץ פיננסי מוסמך יוכל לחזור אליך ולסייע לך ביצירת תוכנית פיננסית מותאמת אישית, אנא ${userGender === "male" ? "השאר" : "השאירי"} את מספר הטלפון שלך.`}
                        />
                    )}

                    {/* Success Message after phone submission */}
                    {phoneSubmitted && (
                        <MessageBubble 
                            role="system" 
                            content="תודה! הפרטים נשלחו ויועץ פיננסי יצור איתך קשר בקרוב."
                        />
                    )}
                </div>

                {/* Input Area */}
                {(showInput || showPhoneInput) && (
                    <>
                        <div className="px-4">
                            <div className="w-full h-px bg-gray-300"></div>
                        </div>
                        <div className="p-4 rounded-b-lg">
                        <form onSubmit={showPhoneInput ? onPhoneSubmit : (e) => e.preventDefault()}>
                            <div className="flex gap-2">
                                {showInput && currentQuestion?.type === "text" && (
                                    <input
                                        ref={textInputRef}
                                        placeholder="כתוב את התשובה שלך..."
                                        className="flex-1 px-4 py-3 border border-[#aeaeae] bg-white rounded-full placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[var(--primary-green)] focus:border-[var(--primary-green)]"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && inputValue.trim() && handleAnswer(inputValue.trim())}
                                    />
                                )}
                                
                                {showInput && (currentQuestion?.type === "number" || currentQuestion?.type === "sum") && (
                                    <div className="flex-1">
                                        <NumberInput
                                            type={currentQuestion.type}
                                            value={inputValue}
                                            onChange={setInputValue}
                                            onSubmit={() => inputValue.trim() && handleAnswer(inputValue.trim())}
                                            placeholder={currentQuestion.type === "sum" ? "הכנס סכום" : "הכנס מספר"}
                                        />
                                    </div>
                                )}

                                {showPhoneInput && (
                                    <input
                                        ref={phoneInputRef}
                                        type="tel"
                                        dir="rtl"
                                        placeholder="מספר הטלפון שלך..."
                                        className={`flex-1 px-4 py-3 border rounded-full placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[var(--primary-green)] focus:border-[var(--primary-green)] ${
                                            phoneValue.trim() && !validatePhone(phoneValue.trim()) 
                                                ? 'border-red-500 bg-red-50' 
                                                : 'border-[#aeaeae] bg-white'
                                        }`}
                                        value={phoneValue}
                                        onChange={(e) => setPhoneValue(e.target.value)}
                                        onKeyDown={(e) => {
                                            // Allow: backspace, delete, tab, escape, enter, arrows, numbers
                                            if ([8, 9, 27, 13, 37, 38, 39, 40, 46].includes(e.keyCode) || 
                                                (e.key >= '0' && e.key <= '9')) {
                                                return;
                                            }
                                            e.preventDefault();
                                        }}
                                    />
                                )}

                                <button
                                    type={showPhoneInput ? "submit" : "button"}
                                    onClick={showInput ? () => inputValue.trim() && handleAnswer(inputValue.trim()) : undefined}
                                    className="pr-1 bg-[var(--primary-green)] hover:bg-[var(--primary-green-hover)] disabled:bg-[#888888d4] disabled:hover:bg-[#888888d4] disabled:cursor-not-allowed text-gray-900 font-medium rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary-green)] flex items-center justify-center min-w-[60px]"
                                    disabled={showInput ? !inputValue.trim() : !phoneValue.trim() || !validatePhone(phoneValue.trim())}
                                >
                                    <IoSend className="rotate-180 text-2xl" />
                                </button>
                            </div>
                        </form>
                        </div>
                    </>
                )}

                {/* Start Conversation Button at bottom */}
                {!conversationStarted && !isLoading && (
                    <div className="p-4 mb-4">
                        <div className="flex justify-center">
                            <button
                                onClick={startConversation}
                                className={`px-6 py-3 bg-[var(--primary-green)] hover:bg-[var(--primary-green-hover)] text-white rounded-3xl transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary-green)] text-xl font-bold cursor-pointer ${styles["start-button"]}`}
                            >
                                מתחילים
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
