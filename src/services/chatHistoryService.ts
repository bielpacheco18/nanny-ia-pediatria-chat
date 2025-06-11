
export interface Conversation {
  id: string;
  title: string;
  messages: Array<{
    id: string;
    content: string;
    isUser: boolean;
    timestamp: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export class ChatHistoryService {
  private static readonly STORAGE_KEY = 'chat_conversations';

  static getConversations(): Conversation[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];
      
      const conversations = JSON.parse(stored);
      return conversations.map((conv: any) => ({
        ...conv,
        createdAt: new Date(conv.createdAt),
        updatedAt: new Date(conv.updatedAt),
        messages: conv.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      }));
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
      return [];
    }
  }

  static saveConversation(conversation: Conversation): void {
    try {
      const conversations = this.getConversations();
      const existingIndex = conversations.findIndex(conv => conv.id === conversation.id);
      
      if (existingIndex >= 0) {
        conversations[existingIndex] = conversation;
      } else {
        conversations.unshift(conversation);
      }
      
      // Manter apenas as últimas 50 conversas
      const limitedConversations = conversations.slice(0, 50);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(limitedConversations));
    } catch (error) {
      console.error('Erro ao salvar conversa:', error);
    }
  }

  static deleteConversation(conversationId: string): void {
    try {
      const conversations = this.getConversations();
      const filtered = conversations.filter(conv => conv.id !== conversationId);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Erro ao deletar conversa:', error);
    }
  }

  static clearAllConversations(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Erro ao limpar conversas:', error);
    }
  }

  static generateConversationTitle(firstMessage: string): string {
    // Gerar título baseado na primeira mensagem (primeiras 30 caracteres)
    const title = firstMessage.trim().substring(0, 30);
    return title.length < firstMessage.trim().length ? `${title}...` : title;
  }
}
