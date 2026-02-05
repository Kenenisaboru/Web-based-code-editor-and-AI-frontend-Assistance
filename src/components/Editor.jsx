import React from 'react';
import Editor, { loader } from '@monaco-editor/react';
import { useEditorStore } from '../store/editorStore';

// Configure Monaco loader if needed (optional)
// loader.config({ paths: { vs: '...' } });

export const CodeEditor = () => {
  const { files, activeFileId, updateFileContent } = useEditorStore();
  
  const activeFile = files.find(f => f.id === activeFileId);

  const handleEditorChange = (value) => {
    if (activeFileId) {
      updateFileContent(activeFileId, value);
    }
  };

  if (!activeFile) {
    return (
      <div className="flex-1 flex items-center justify-center bg-vscode-bg text-gray-500">
        Select a file to edit
      </div>
    );
  }

  return (
    <div className="flex-1 h-full overflow-hidden bg-vscode-bg">
      <Editor
        height="100%"
        language={activeFile.language}
        value={activeFile.content}
        theme="vs-dark"
        onChange={handleEditorChange}
        options={{
          minimap: { enabled: true },
          fontSize: 14,
          wordWrap: 'on',
          automaticLayout: true,
          scrollBeyondLastLine: false,
        }}
      />
    </div>
  );
};
