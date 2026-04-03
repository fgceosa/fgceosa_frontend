#!/bin/bash

# Chat Redesign Setup Script
# Installs all required dependencies for the premium chat interface

echo "🚀 Setting up premium chat interface..."
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the frontend directory."
    exit 1
fi

echo "📦 Installing required packages..."
echo ""

# Install framer-motion for animations
echo "Installing framer-motion..."
npm install framer-motion

# Install react-syntax-highlighter for code blocks
echo "Installing react-syntax-highlighter..."
npm install react-syntax-highlighter

# Install TypeScript types
echo "Installing TypeScript types..."
npm install -D @types/react-syntax-highlighter

echo ""
echo "✅ All dependencies installed successfully!"
echo ""
echo "📁 New components created:"
echo "   ✓ src/app/(protected-pages)/chat/_components/CodeBlock.tsx"
echo "   ✓ src/app/(protected-pages)/chat/_components/ChatMessage.tsx"
echo "   ✓ src/app/(protected-pages)/chat/_components/ChatMessageActions.tsx"
echo "   ✓ src/app/(protected-pages)/chat/_components/ChatInputEnhanced.tsx"
echo "   ✓ src/app/(protected-pages)/chat/_components/TypingIndicator.tsx"
echo ""
echo "📖 Next steps:"
echo "   1. Read CHAT_REDESIGN_GUIDE.md for complete implementation guide"
echo "   2. Update your MessageList component to use the new ChatMessage component"
echo "   3. Replace ChatInput with ChatInputEnhanced"
echo "   4. Add custom CSS styles from the guide"
echo "   5. Test the new interface!"
echo ""
echo "🎉 Premium chat interface components are ready!"
