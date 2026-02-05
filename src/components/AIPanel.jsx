import React, { useState, useRef, useEffect } from 'react';
import { useEditorStore } from '../store/editorStore';
import { Send, X, Bot, User, Sparkles, Lightbulb, Copy, Check } from 'lucide-react';

export const AIPanel = () => {
  const { isAiPanelOpen, toggleAiPanel, aiMessages, addAiMessage, files, activeFileId } = useEditorStore();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const activeFile = files.find(f => f.id === activeFileId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [aiMessages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    // Add user message to UI
    addAiMessage('user', { answer_text: userMessage });
    setIsLoading(true);

    try {
      const payload = {
        user_question: userMessage,
        selected_code: activeFile ? activeFile.content : "", // In future, hook into Monaco selection
        language: activeFile ? activeFile.language : "plaintext",
        project_context: `Current File: ${activeFile?.name}`
      };

      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      addAiMessage('assistant', data);
    } catch (error) {
      console.error('AI Error:', error);
      addAiMessage('assistant', { answer_text: "Sorry, I encountered an error connecting to the server." });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAiPanelOpen) return null;

  return (
    <div className="w-96 bg-vscode-sidebar border-l border-vscode-border flex flex-col h-full shadow-xl z-10">
      {/* Header */}
      <div className="p-3 border-b border-vscode-border flex justify-between items-center bg-vscode-header select-none">
        <div className="flex items-center gap-2 font-semibold text-sm text-gray-200">
          <Sparkles className="w-4 h-4 text-vscode-accent" />
          AI Assistant
        </div>
        <button onClick={toggleAiPanel} className="hover:text-white text-gray-400 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {aiMessages.map((msg, idx) => (
          <MessageBubble key={idx} role={msg.role} content={msg.content} />
        ))}
        
        {isLoading && (
          <div className="flex gap-3 animate-pulse">
            <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-[#333] rounded-lg p-3 text-sm text-gray-400">
              Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-vscode-border bg-vscode-header">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about your code..."
            className="flex-1 bg-[#3c3c3c] border border-vscode-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-vscode-accent text-white placeholder-gray-500 transition-all"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading}
            className="bg-vscode-accent hover:bg-blue-600 text-white p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Sub-component for rendering messages
const MessageBubble = ({ role, content }) => {
  const isUser = role === 'user';
  
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${isUser ? 'bg-blue-600' : 'bg-green-600'}`}>
        {isUser ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
      </div>

      {/* Content Box */}
      <div className={`flex flex-col gap-2 max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
        
        {/* Main Text */}
        <div className={`rounded-lg p-3 text-sm shadow-sm ${isUser ? 'bg-vscode-accent text-white' : 'bg-[#2d2d2d] text-gray-200 border border-vscode-border'}`}>
          <div className="whitespace-pre-wrap font-sans leading-relaxed">
            {content.answer_text}
          </div>
        </div>

        {/* Code Snippet (AI Only) */}
        {!isUser && content.code_snippet && (
          <div className="w-full bg-[#1e1e1e] rounded-md border border-vscode-border overflow-hidden mt-1">
            <div className="flex justify-between items-center px-3 py-1 bg-[#252526] border-b border-vscode-border">
              <span className="text-xs text-gray-400 font-mono">Code Snippet</span>
              <CopyButton text={content.code_snippet} />
            </div>
            <pre className="p-3 overflow-x-auto text-xs font-mono text-blue-300">
              {content.code_snippet}
            </pre>
          </div>
        )}

        {/* Suggestion (AI Only) */}
        {!isUser && content.suggestion && (
          <div className="flex items-start gap-2 bg-[#2d2d2d]/50 border border-yellow-900/30 rounded-md p-2 mt-1 text-xs text-gray-300">
            <Lightbulb className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
            <span>{content.suggestion}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button onClick={handleCopy} className="text-gray-400 hover:text-white transition-colors">
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
    </button>
  );
};
