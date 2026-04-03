'use client'

import { useState } from 'react'
import classNames from '@/utils/classNames'
import { Card, Button, Tabs, Badge } from '@/components/ui'
import { ChevronDown, ChevronUp, Copy, Book, Sparkles, Terminal, Code2, CheckCircle2, Zap, X } from 'lucide-react'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'

const { TabNav, TabList, TabContent } = Tabs

// VS Code Dark+ Style Colors (Inline styles to bypass Tailwind JIT issues)
const colors = {
    keyword: '#569cd6',
    string: '#ce9178',
    comment: '#6a9955',
    function: '#dcdcaa',
    number: '#b5cea8',
    variable: '#9cdcfe',
    text: '#d4d4d4',
    bracket: '#ffd700',
    background: '#1e1e1e',
    cursor: '#aeafad',
}

const highlightLine = (line: string, language: string) => {
    if (!line.trim()) return <span style={{ color: colors.text }}>&nbsp;</span>

    let highlightedLine: (string | React.ReactNode)[] = [line]

    const applyHighlight = (regex: RegExp, color: string, isItalic = false) => {
        highlightedLine = highlightedLine.flatMap((part) => {
            if (typeof part !== 'string') return [part]
            
            const results: (string | React.ReactNode)[] = []
            let lastIndex = 0
            let match

            while ((match = regex.exec(part)) !== null) {
                if (match.index > lastIndex) {
                    results.push(part.substring(lastIndex, match.index))
                }
                results.push(
                    <span key={`${match.index}-${match[0]}`} style={{ color, fontStyle: isItalic ? 'italic' : 'normal' }}>
                        {match[0]}
                    </span>
                )
                lastIndex = regex.lastIndex
            }

            if (lastIndex < part.length) {
                results.push(part.substring(lastIndex))
            }

            return results
        })
    }

    if (language === 'python') {
        applyHighlight(/#.*$/g, colors.comment, true)
        applyHighlight(/\b(from|import|def|class|return|if|else|for|while|in|as|with|try|except|finally|raise|pass|break|continue|None|True|False|and|or|not|await|async)\b/g, colors.keyword)
        applyHighlight(/("([^"\\]|\\.)*"|'([^'\\]|\\.)*')/g, colors.string)
        applyHighlight(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g, colors.function)
        applyHighlight(/\b(\d+)\b/g, colors.number)
    } else if (language === 'typescript' || language === 'javascript') {
        applyHighlight(/\/\/.*$/g, colors.comment, true)
        applyHighlight(/\b(import|export|from|const|let|var|function|async|await|return|if|else|for|while|in|of|as|type|interface|class|extends|implements|new|this|super|static|private|public|protected|readonly|undefined|null|boolean|string|number)\b/g, colors.keyword)
        applyHighlight(/("([^"\\]|\\.)*"|'([^'\\]|\\.)*'|`([^`\\]|\\.)*`)/g, colors.string)
        applyHighlight(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g, colors.function)
        applyHighlight(/\b(\d+)\b/g, colors.number)
        applyHighlight(/\b(console|process|window|document|Error|JSON|Math|Date)\b/g, '#4ec9b0')
    } else if (language === 'bash') {
        applyHighlight(/^curl\s+/g, colors.keyword)
        applyHighlight(/\s-X\s|\s-H\s|\s-d\s/g, colors.variable)
        applyHighlight(/("([^"\\]|\\.)*"|'([^'\\]|\\.)*')/g, colors.string)
    }

    return <>{highlightedLine}</>
}

const CodeBlock = ({
    code,
    language = 'bash',
    title
}: {
    code: string
    language?: 'bash' | 'python' | 'typescript' | 'javascript'
    title?: string
}) => {
    const [copied, setCopied] = useState(false)

    const copyToClipboard = () => {
        navigator.clipboard.writeText(code)
        setCopied(true)
        toast.push(
            <Notification type="success">
                {title || language} snippet copied to clipboard
            </Notification>,
            { placement: 'top-center' }
        )
        setTimeout(() => setCopied(false), 2000)
    }

    const fileName = language === 'python' ? 'app.py' : language === 'typescript' ? 'index.ts' : language === 'javascript' ? 'script.js' : 'request.sh'
    const lines = code.split('\n')

    return (
        <div className="group relative rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-2xl transition-all duration-300 bg-[#0d0d0d] flex flex-col">
            {/* Header */}
            <div className="bg-[#1a1a1a] border-b border-white/5 flex items-center justify-between px-5 h-12">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 pr-4 border-r border-white/10">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Code2 className="w-3.5 h-3.5 text-gray-500" />
                        <span className="text-gray-300 text-[11px] font-black uppercase tracking-widest">{title || fileName}</span>
                    </div>
                </div>
                
                <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-all text-[10px] font-black text-gray-400 group-hover:text-white border border-white/10 active:scale-95"
                >
                    {copied ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'COPIED' : 'COPY'}</span>
                </button>
            </div>

            {/* Code Content */}
            <div className="p-6 font-mono text-[11px] leading-relaxed overflow-x-auto custom-scrollbar select-text">
                <div className="min-w-full inline-block">
                    {lines.map((line, i) => (
                        <div key={i} className="flex group/line">
                            <div className="w-8 text-right pr-4 select-none text-gray-600 shrink-0 font-medium">
                                {i + 1}
                            </div>
                            <div className="pl-4 whitespace-pre text-[#d4d4d4] flex-1">
                                {highlightLine(line, language)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Language Badge */}
            <div className="absolute bottom-4 right-4 bg-white/5 px-2 py-0.5 rounded-md border border-white/10 backdrop-blur-md opacity-20 group-hover:opacity-100 transition-opacity pointer-events-none">
                <span className="text-[10px] font-bold text-gray-400">{language}</span>
            </div>
        </div>
    )
}

export default function ApiIntegrationGuide() {
    const baseUrl = 'https://api.qorebit.ai/v1'

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        toast.push(
            <Notification type="success">
                Endpoint URL copied to clipboard
            </Notification>,
            { placement: 'top-center' }
        )
    }

    const pythonExample = `from openai import OpenAI

# Initialize client
client = OpenAI(
    api_key="qb_live_YOUR_API_KEY",
    base_url="${baseUrl}"
)

# Send chat request
response = client.chat.completions.create(
    model="openai/gpt-4o-mini",
    messages=[{"role": "user", "content": "Hello Qorebit!"}]
)

# Print response content
print(response.choices[0].message.content)`

    const typescriptExample = `import OpenAI from 'openai';

// Initialize client
const client = new OpenAI({
    apiKey: 'qb_live_YOUR_API_KEY',
    baseURL: '${baseUrl}'
});

async function main() {
    // Send chat request
    const completion = await client.chat.completions.create({
        model: 'openai/gpt-4o-mini',
        messages: [
            { role: 'user', content: 'Hello Qorebit!' }
        ]
    });

    // Print response content
    console.log(completion.choices[0].message.content);
}

main();`

    const javascriptExample = `const OpenAI = require('openai');

// Initialize client
const client = new OpenAI({
    apiKey: 'qb_live_YOUR_API_KEY',
    baseURL: '${baseUrl}'
});

async function callApi() {
    try {
        // Send chat request
        const response = await client.chat.completions.create({
            model: 'openai/gpt-4o-mini',
            messages: [{ role: 'user', content: 'Hello Qorebit!' }]
        });
        
        // Print response content
        console.log(response.choices[0].message.content);
    } catch (error) {
        console.error('API Error:', error.message);
    }
}

callApi();`

    const curlExample = `curl -X POST "${baseUrl}/chat/completions" \\
  -H "Authorization: Bearer qb_live_YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "openai/gpt-4o-mini",
    "messages": [
      {
        "role": "user", 
        "content": "Hello Qorebit!"
      }
    ]
  }'`

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            {/* Guide Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-primary/5 rounded-[22px] flex items-center justify-center border border-primary/10 shadow-inner">
                        <Book className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-none mb-2">How to Use</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-base font-medium">
                            Integrate our AI power into your workflow with these simple steps.
                        </p>
                    </div>
                </div>
            </div>

            <Tabs defaultValue="overview" className="w-full">
                <div className="flex justify-start mb-10 overflow-x-auto no-scrollbar px-2 lg:px-0">
                    <TabList className="bg-gray-50 dark:bg-gray-800/50 p-1.5 rounded-2xl w-fit border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-1">
                        <TabNav value="overview" className="px-6 py-2.5 rounded-xl flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-md data-[state=active]:text-primary transition-all font-black text-xs text-gray-400">
                            <Terminal className="w-4 h-4" />
                            <span>Setup</span>
                        </TabNav>
                        <TabNav value="examples" className="px-6 py-2.5 rounded-xl flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-md data-[state=active]:text-primary transition-all font-black text-xs text-gray-400">
                            <Code2 className="w-4 h-4" />
                            <span>Code</span>
                        </TabNav>
                        <TabNav value="links" className="px-6 py-2.5 rounded-xl flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-md data-[state=active]:text-primary transition-all font-black text-xs text-gray-400">
                            <Zap className="w-4 h-4" />
                            <span>Links</span>
                        </TabNav>
                    </TabList>
                </div>

                <TabContent value="overview" className="space-y-8 mt-0 outline-none">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Card className="p-8 rounded-[2rem] bg-white dark:bg-gray-900 border-none shadow-xl shadow-gray-200/40 dark:shadow-none group overflow-hidden relative">
                            <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-blue-50/50 dark:bg-blue-900/10 rounded-full opacity-50 group-hover:scale-125 transition-transform duration-700" />
                            <div className="flex items-center gap-4 mb-6 relative z-10">
                                <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-2xl border border-blue-100 dark:border-blue-800">
                                    <Terminal className="w-6 h-6 text-primary" />
                                </div>
                                <h4 className="text-sm font-black text-gray-900 dark:text-white">Connection Link</h4>
                            </div>
                            <div className="space-y-4 relative z-10">
                                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                                    Use this universal URL in your applications to connect directly to our AI services.
                                </p>
                                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 group/link">
                                    <code className="flex-1 font-mono text-sm text-primary font-bold overflow-hidden text-ellipsis whitespace-nowrap">
                                        {baseUrl}
                                    </code>
                                    <button
                                        onClick={() => copyToClipboard(baseUrl)}
                                        className="p-2.5 bg-white dark:bg-gray-700 hover:bg-primary hover:text-white rounded-xl shadow-sm border border-gray-100 dark:border-gray-600 transition-all group-hover/link:scale-110"
                                    >
                                        <Copy className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-8 rounded-[2rem] bg-white dark:bg-gray-900 border-none shadow-xl shadow-gray-200/40 dark:shadow-none group overflow-hidden relative">
                            <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-full opacity-50 group-hover:scale-125 transition-transform duration-700" />
                            <div className="flex items-center gap-4 mb-6 relative z-10">
                                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl border border-indigo-100 dark:border-indigo-800">
                                    <Sparkles className="w-6 h-6 text-indigo-600" />
                                </div>
                                <h4 className="text-sm font-black text-gray-900 dark:text-white">Tool Support</h4>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed relative z-10">
                                Our API is compatible with any standard library. Just point your existing tools to our connection link and use your token for instant access.
                            </p>
                        </Card>
                    </div>

                    <div className="p-8 rounded-[2.5rem] bg-gradient-to-r from-primary/5 to-indigo-500/5 border border-primary/10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-inner">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl shadow-sm flex items-center justify-center text-primary border border-primary/10">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-base font-black text-gray-900 dark:text-white">Need full technical details?</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 font-bold italic">Explore our comprehensive API documentation</p>
                            </div>
                        </div>
                        <Button
                            variant="solid"
                            className="bg-primary hover:bg-primary-deep text-white hover:text-white font-black text-[10px] h-12 px-8 rounded-2xl shadow-lg shadow-primary/20 transition-all hover:scale-105"
                            onClick={() => window.open('https://qorebit.ai/docs', '_blank')}
                        >
                            GO TO DOCUMENTATION
                        </Button>
                    </div>
                </TabContent>

                <TabContent value="examples" className="space-y-8 mt-0 outline-none">
                    <div className="grid grid-cols-1 gap-8 max-w-4xl mx-auto">
                        <CodeBlock language="python" title="Python SDK" code={pythonExample} />
                        <CodeBlock language="typescript" title="TypeScript Project" code={typescriptExample} />
                        <CodeBlock language="javascript" title="JavaScript / Node" code={javascriptExample} />
                        <CodeBlock language="bash" title="cURL Request" code={curlExample} />
                    </div>
                </TabContent>

                <TabContent value="links" className="space-y-6 mt-0 outline-none">
                    <div className="grid grid-cols-1 gap-4">
                        {[
                            { method: 'POST', path: '/chat/completions', desc: 'Main link for AI chat interactions' },
                            { method: 'GET', path: '/models', desc: 'Listing of available AI models' },
                            { method: 'POST', path: '/embeddings', desc: 'Generate data patterns for search' }
                        ].map((endpoint, i) => (
                            <div key={i} className="flex items-center justify-between p-6 rounded-[1.5rem] bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50 border border-gray-100 dark:border-gray-800 group hover:shadow-xl transition-all duration-300">
                                <div className="flex items-center gap-6">
                                    <span className="text-xs font-black px-3 py-1.5 rounded-xl bg-primary/10 text-primary border border-primary/20">{endpoint.method}</span>
                                    <div className="space-y-1">
                                        <code className="text-base font-black text-gray-900 dark:text-white">{endpoint.path}</code>
                                        <p className="text-xs font-bold text-gray-400 leading-none">{endpoint.desc}</p>
                                    </div>
                                </div>
                                <Zap className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                            </div>
                        ))}
                    </div>
                </TabContent>
            </Tabs>
        </div>
    )
}
