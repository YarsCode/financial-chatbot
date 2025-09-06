import { useEffect, useState } from "react";

interface MessageBubbleProps {
    role: "user" | "system" | "assistant";
    content: string;
    children?: React.ReactNode;
}

export function MessageBubble({ role, content, children }: MessageBubbleProps) {
    const isUser = role === "user";
    const [isVisible, setIsVisible] = useState(false);
    
    useEffect(() => {
        setIsVisible(true);
    }, []);
    
    return (
        <div className={`flex ${isUser ? "justify-start" : "justify-end"}`}>
            <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-3xl transition-all duration-500 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] ${
                    isVisible
                        ? "opacity-100 translate-x-0"
                        : `opacity-0 ${isUser ? "translate-x-4" : "-translate-x-4"}`
                } ${
                    isUser
                        ? "bg-[var(--primary-green)] backdrop-blur-[12px] backdrop-saturate-[180%] text-gray-900 rounded-br-sm"
                        : "bg-[rgba(0,0,0,0.06)] backdrop-blur-[12px] backdrop-saturate-[180%] text-gray-800 rounded-bl-sm"
                }`}
            >
                {content && <div className="whitespace-pre-wrap">{content}</div>}
                {children}
            </div>
        </div>
    );
}
