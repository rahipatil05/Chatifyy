import { Monaco } from "@monaco-editor/react";

export interface Theme {
  id: string;
  label: string;
  color: string;
}

export interface Language {
  id: string;
  label: string;
  logoPath: string;
  monacoLanguage: string;
  defaultCode: string;
  pistonRuntime: LanguageRuntime;
}

export interface LanguageRuntime {
  language: string;
  version: string;
}

export interface ExecuteCodeResponse {
  compile?: {
    output: string;
  };
  run?: {
    output: string;
    stderr: string;
  };
}

export interface ExecutionResult {
  code: string;
  output: string;
  error: string | null;
}

export interface AIInsights {
  explain: string;
  security: string;
  optimize: string;
  visualize: string;
}

export interface CodeEditorState {
  language: string;
  output: string;
  isRunning: boolean;
  isAnalyzing: boolean;
  error: string | null;
  theme: string;
  fontSize: number;
  editor: any | null;
  code: string;
  stdin: string;
  executionResult: ExecutionResult | null;
  engine: "wandbox" | "piston";
  aiInsights: AIInsights | null;
  showAI: boolean;
  ignoredMarkers: string[];
  editorWidth: number;
  aiWidth: number;

  setEditor: (editor: any) => void;
  getCode: () => string;
  setCode: (code: string) => void;
  setLanguage: (language: string) => void;
  setTheme: (theme: string) => void;
  setFontSize: (fontSize: number) => void;
  setStdin: (stdin: string) => void;
  setEngine: (engine: "wandbox" | "piston") => void;
  toggleAI: () => void;
  setEditorWidth: (width: number) => void;
  setAIWidth: (width: number) => void;
  runCode: () => Promise<void>;
  analyzeCode: () => Promise<void>;
  lintCode: () => Promise<any[]>;
  ignoreMarker: (markerHash: string) => void;
}

export interface Snippet {
  _id: string;
  _creationTime: number;
  userId: string;
  language: string;
  code: string;
  title: string;
  userName: string;
}
