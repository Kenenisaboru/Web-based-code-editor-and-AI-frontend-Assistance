import React from 'react';
import { Sidebar } from './components/Sidebar';
import { CodeEditor } from './components/Editor';
import { AIPanel } from './components/AIPanel';
import { useEditorStore } from './store/editorStore';
import { Bot, Play } from 'lucide-react';

function App() {
  const { isAiPanelOpen, toggleAiPanel, activeFileId, files } = useEditorStore();

  const handleRun = () => {
    // Basic JS execution for now
    const activeFile = files.find(f => f.id === activeFileId);
    if (activeFile && activeFile.language === 'javascript') {
      try {
        // Create a safe-ish sandbox or just console log for now
        // In a real app, send to backend or use WebContainer/Sandpack
        console.clear();
        console.log('--- Running Code ---');
        // eslint-disable-next-line no-eval
        eval(activeFile.content);
      } catch (e) {
        console.error(e);
      }
    } else {
      alert('Only JavaScript execution is supported in the browser console for now.');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-vscode-bg text-vscode-text">
      {/* Top Bar */}
      <div className="h-10 bg-vscode-header border-b border-vscode-border flex items-center justify-between px-4">
        <span className="font-semibold text-sm">Dualite Code</span>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleRun}
            className="flex items-center gap-1 text-green-500 hover:bg-[#3c3c3c] px-2 py-1 rounded text-xs transition-colors"
          >
            <Play className="w-3 h-3" /> Run
          </button>
          <button 
            onClick={toggleAiPanel}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${isAiPanelOpen ? 'bg-vscode-activityBar text-white' : 'hover:bg-[#3c3c3c]'}`}
          >
            <Bot className="w-3 h-3" /> AI Chat
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <CodeEditor />
        <AIPanel />
      </div>
      
      {/* Status Bar */}
      <div className="h-6 bg-vscode-activityBar border-t border-vscode-border flex items-center px-3 text-xs text-blue-400">
        <span>Ready</span>
      </div>
    </div>
  );
}

export default App;
