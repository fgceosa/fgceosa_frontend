import { useState, useEffect } from 'react'

export const useTypewriter = (text: string, speed = 10, active = true) => {
    const [displayedText, setDisplayedText] = useState('')
    const [isTyping, setIsTyping] = useState(false)

    useEffect(() => {
        if (!active) {
            setDisplayedText(text)
            return
        }

        if (!text) {
            setDisplayedText('')
            setIsTyping(false)
            return
        }

        // For streaming responses: only reset if the new text isn't a continuation of what we're already showing
        setDisplayedText((prev) => {
            if (text.startsWith(prev)) return prev
            return text.slice(0, 1)
        })

        setIsTyping(true)

        // Use a functional approach to get the current length for the interval starting point
        let i = 0
        setDisplayedText(prev => {
            i = text.startsWith(prev) ? prev.length : 1
            return prev
        })

        const timer = setInterval(() => {
            if (i < text.length) {
                const char = text.charAt(i)
                setDisplayedText((prev) => prev + char)
                i++
            } else {
                setIsTyping(false)
                clearInterval(timer)
            }
        }, speed)

        return () => clearInterval(timer)
    }, [text, speed, active])

    return { displayedText, isTyping }
}
