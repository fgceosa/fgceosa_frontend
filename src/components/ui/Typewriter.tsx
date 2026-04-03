import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import classNames from '@/utils/classNames';

interface TypewriterProps {
    content: string;
    onComplete?: () => void;
    speed?: number;
    className?: string;
    isUser?: boolean;
}

const Typewriter = ({
    content,
    onComplete,
    speed = 10,
    className,
    isUser = false
}: TypewriterProps) => {
    const [displayedContent, setDisplayedContent] = useState('');
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        // Reset if content changes completely (e.g. new message)
        // But if content just grows (streaming), we continue
        if (!content.startsWith(displayedContent) && displayedContent !== '') {
            setDisplayedContent('');
            setIsComplete(false);
        }
    }, [content]);

    useEffect(() => {
        if (isComplete) return;

        if (displayedContent.length < content.length) {
            const timeout = setTimeout(() => {
                // Add a small chunk of characters at a time for smoother rendering of markdown
                const chunkSize = 2;
                setDisplayedContent(content.slice(0, displayedContent.length + chunkSize));
            }, speed);

            return () => clearTimeout(timeout);
        } else {
            setIsComplete(true);
            onComplete?.();
        }
    }, [content, displayedContent, isComplete, speed, onComplete]);

    // Pre-process content to detect raw URLs and wrap them in markdown syntax if they aren't already
    const autoLinkedContent = displayedContent.replace(
        /(?<!\]\()(?<!\()(https?:\/\/[^\s\)]+)/g,
        '[$1]($1)'
    );

    return (
        <div className={classNames(
            "prose prose-sm max-w-none dark:prose-invert prose-p:leading-relaxed prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-800",
            isUser ? "prose-p:text-blue-50 prose-strong:text-white prose-headings:text-white" : "prose-p:text-gray-700 dark:prose-p:text-gray-300 font-medium",
            className
        )}>
            <ReactMarkdown
                components={{
                    a: ({ node, ...props }) => (
                        <a
                            {...props}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#0055BA] dark:text-blue-400 font-black underline hover:no-underline transition-all"
                        />
                    ),
                }}
            >
                {autoLinkedContent}
            </ReactMarkdown>
            {!isComplete && (
                <span className="inline-block w-1.5 h-3.5 ml-0.5 align-middle bg-primary animate-pulse" />
            )}
        </div>
    );
};

export default Typewriter;
