
import { KnowledgeBaseService } from './knowledgeBaseService';
import { ResponseGenerationService } from './responseGenerationService';
import type { ChatMessage } from '@/types/chat';

export { type ChatMessage } from '@/types/chat';

export class OpenAIService {
  private apiKey: string = '';
  private knowledgeBaseService: KnowledgeBaseService;
  private responseGenerationService: ResponseGenerationService;

  constructor() {
    this.knowledgeBaseService = new KnowledgeBaseService();
    this.responseGenerationService = new ResponseGenerationService();
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateResponse(userMessage: string, conversationHistory: ChatMessage[] = []): Promise<string> {
    console.log('Generating response for:', userMessage);
    
    try {
      // Get knowledge base from Supabase
      const knowledgeBase = await this.knowledgeBaseService.getKnowledgeBase();
      
      if (!knowledgeBase) {
        return 'Ainda não temos documentos pediátricos na base de conhecimento. Por favor, adicione alguns materiais na seção "Base de Conhecimento" para que eu possa te ajudar melhor. Para questões urgentes, sempre consulte seu pediatra. 💜';
      }

      // If no API key is set, use knowledge-based response
      if (!this.apiKey) {
        console.log('No API key set, using knowledge-based response');
        return this.responseGenerationService.generateKnowledgeBasedResponse(userMessage, knowledgeBase);
      }

      // Use OpenAI with knowledge base as context
      const systemPrompt = this.responseGenerationService.createSystemPrompt(knowledgeBase);
      
      const messages: ChatMessage[] = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory.slice(-6), // Keep last 6 messages for context
        { role: 'user', content: userMessage }
      ];

      console.log('Sending request to OpenAI...');
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: messages,
          max_tokens: 800,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('OpenAI API error:', errorData);
        
        if (response.status === 401) {
          return 'Erro de autenticação com a OpenAI. Verifique se sua chave de API está correta. Enquanto isso, estou usando minha base de conhecimento: ' + 
                 this.responseGenerationService.generateKnowledgeBasedResponse(userMessage, knowledgeBase);
        }
        
        return 'Ocorreu um erro na comunicação com a IA. Vou usar minha base de conhecimento: ' + 
               this.responseGenerationService.generateKnowledgeBasedResponse(userMessage, knowledgeBase);
      }

      const data = await response.json();
      console.log('OpenAI response received');
      
      return data.choices?.[0]?.message?.content || 
             this.responseGenerationService.generateKnowledgeBasedResponse(userMessage, knowledgeBase);
             
    } catch (error) {
      console.error('Error in generateResponse:', error);
      
      // Fallback to knowledge-based response
      const knowledgeBase = await this.knowledgeBaseService.getKnowledgeBase();
      if (knowledgeBase) {
        return this.responseGenerationService.generateKnowledgeBasedResponse(userMessage, knowledgeBase);
      }
      
      return 'Desculpe, ocorreu um erro. Tente novamente em alguns instantes.';
    }
  }
}
