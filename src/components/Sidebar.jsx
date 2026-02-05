import React from 'react';
import { useEditorStore } from '../store/editorStore';
import { FileCode, FileJson, FileType, Plus } from 'lucide-react';
import { clsx } from 'clsx';

const FileIcon = ({ name }) => {
  if (name.endsWith('.js') || name.endsWith('.jsx')) return <FileCode className="w-4 h-4 text-yellow-400" />;
  if (name.endsWith('.css')) return <FileType className="w-4 h-4 text-blue-400" />;
  if (name.endsWith('.html')) return <FileCode className="w-4 h-4 text-orange-400" />;
  return <FileCode className="w-4 h-4 text-gray-400" />;
};

export const Sidebar = () => {
  const { files, activeFileId, setActiveFile, addFile } = useEditorStore();

  const handleAddFile = () => {
    const name = prompt("Enter file name (e.g., script.js):");
    if (name) {
      const ext = name.split('.').pop();
      let lang = 'plaintext';
      if (ext === 'js' || ext === 'jsx') lang = 'javascript';
      else if (ext === 'css') lang = 'css';
      else if (ext === 'html') lang = 'html';
      
      addFile(name, lang);
    }
  };

  return (
    <div className="w-64 bg-vscode-sidebar border-r border-vscode-border flex flex-col h-full">
      <div className="p-2 text-xs font-bold text-gray-400 uppercase tracking-wider flex justify-between items-center">
        <span>Explorer</span>
        <button onClick={handleAddFile} className="hover:bg-vscode-activityBar p-1 rounded">
          <Plus className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="px-2 py-1">
          <div className="text-sm font-semibold text-gray-300 mb-1 px-2">MY PROJECT</div>
          {files.map((file) => (
            <div
              key={file.id}
              onClick={() => setActiveFile(file.id)}
              className={clsx(
                "flex items-center gap-2 px-2 py-1 cursor-pointer text-sm rounded-sm",
                activeFileId === file.id ? "bg-vscode-activityBar text-white" : "text-gray-400 hover:bg-[#2a2d2e]"
              )}
            >
              <FileIcon name={file.name} />
              <span>{file.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
