import { create } from 'zustand';

// Initial mock file system
const initialFiles = [
  {
    id: '1',
    name: 'main.js',
    language: 'javascript',
    content: '// Welcome to your AI Editor\nconsole.log("Hello World");\n\nfunction calculateSum(a, b) {\n  return a + b;\n}'
  },
  {
    id: '2',
    name: 'styles.css',
    language: 'css',
    content: 'body {\n  background-color: #1e1e1e;\n  color: #fff;\n}'
  },
  {
    id: '3',
    name: 'index.html',
    language: 'html',
    content: '<!DOCTYPE html>\n<html>\n<body>\n  <h1>Hello World</h1>\n</body>\n</html>'
  }
];

export const useEditorStore = create((set, get) => ({
  files: initialFiles,
  activeFileId: '1',
  // Initial welcome message structured correctly
  aiMessages: [{ 
    role: 'assistant', 
    content: { 
      answer_text: 'Hello! I am your AI coding assistant. I can explain code, fix bugs, or generate new functions for you.',
      suggestion: 'Try asking me to "Explain this code"'
    } 
  }],
  isAiPanelOpen: true,

  setActiveFile: (id) => set({ activeFileId: id }),
  
  updateFileContent: (id, newContent) => set((state) => ({
    files: state.files.map(f => f.id === id ? { ...f, content: newContent } : f)
  })),

  addFile: (name, language) => set((state) => {
    const newFile = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      language,
      content: ''
    };
    return { files: [...state.files, newFile], activeFileId: newFile.id };
  }),

  toggleAiPanel: () => set((state) => ({ isAiPanelOpen: !state.isAiPanelOpen })),

  addAiMessage: (role, content) => set((state) => ({
    aiMessages: [...state.aiMessages, { role, content }]
  })),
}));
