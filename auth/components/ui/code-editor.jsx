'use client';

import { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';

const CodeEditor = ({
  code,
  onChange,
  language = 'javascript',
  theme = 'vs-dark',
  height = '100%',
  width = '100%',
  options = {},
  loading = null,
}) => {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  useEffect(() => {
    // Check if the browser is in the client-side
    if (typeof window !== 'undefined') {
      // Dynamically import Monaco Editor
      import('@monaco-editor/react').then((monaco) => {
        monacoRef.current = monaco;
      });
    }
  }, []);

  if (typeof window === 'undefined' || !monacoRef.current) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900 text-white">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
      </div>
    );
  }

  const Editor = monacoRef.current.Editor;
  const defaultOptions = {
    selectOnLineNumbers: true,
    fontSize: 14,
    wordWrap: 'on',
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    automaticLayout: true,
    ...options,
  };

  return (
    <div style={{ height, width }} className="relative">
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white p-4 rounded-md shadow-lg flex items-center">
            <Loader2 className="h-5 w-5 animate-spin text-indigo-600 mr-2" />
            <span>{loading}</span>
          </div>
        </div>
      )}
      <Editor
        height="100%"
        defaultLanguage={language}
        language={language}
        theme={theme}
        value={code}
        onChange={onChange}
        options={defaultOptions}
      />
    </div>
  );
};

export default CodeEditor;
