
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface KnowledgeBaseItem {
  title: string;
  content: string;
}
