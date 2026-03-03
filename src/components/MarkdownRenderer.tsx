import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MarkdownRendererProps {
    content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
    return (
        <div className="prose prose-lg prose-neutral max-w-none">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                    code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                            <SyntaxHighlighter
                                style={oneDark}
                                language={match[1]}
                                PreTag="div"
                                {...props}
                            >
                                {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                        ) : (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        );
                    },
                    h1: ({ children }) => (
                        <h1 className="text-4xl font-bold mt-12 mb-6 text-neutral-900">
                            {children}
                        </h1>
                    ),
                    h2: ({ children }) => (
                        <h2 className="text-3xl font-semibold mt-10 mb-5 text-neutral-900">
                            {children}
                        </h2>
                    ),
                    h3: ({ children }) => (
                        <h3 className="text-2xl font-semibold mt-8 mb-4 text-neutral-900">
                            {children}
                        </h3>
                    ),
                    p: ({ children }) => (
                        <p className="text-lg leading-relaxed mb-6 text-neutral-700">
                            {children}
                        </p>
                    ),
                    a: ({ href, children }) => (
                        <a
                            href={href}
                            className="text-blue-600 hover:text-blue-700 underline underline-offset-2"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {children}
                        </a>
                    ),
                    ul: ({ children }) => (
                        <ul className="list-disc list-inside mb-6 space-y-2 text-neutral-700">
                            {children}
                        </ul>
                    ),
                    ol: ({ children }) => (
                        <ol className="list-decimal list-inside mb-6 space-y-2 text-neutral-700">
                            {children}
                        </ol>
                    ),
                    blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-blue-600 pl-6 py-2 my-6 italic text-neutral-600 bg-blue-50/50 rounded-r-lg">
                            {children}
                        </blockquote>
                    ),
                    img: ({ src, alt }) => (
                        <img
                            src={src}
                            alt={alt}
                            className="rounded-2xl my-8 w-full shadow-lg"
                        />
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
