
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

      // If no API key is set, call the local backend
      if (!this.apiKey) {
        console.log('No API key set, using local backend');
        try {
          const resp = await fetch('http://localhost:8000/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMessage })
          });
          if (resp.ok) {
            const data = await resp.json();
            return data.response as string;
          }
          console.error('Local backend error:', resp.status);
        } catch (err) {
          console.error('Error calling local backend:', err);
        }

        return this.responseGenerationService.generateKnowledgeBasedResponse(userMessage, knowledgeBase);
      }

      // Use OpenAI with knowledge base as context
      const systemPrompt = this.responseGenerationService.createSystemPrompt(knowledgeBase);
      
      const messages: ChatMessage[] = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory.slice(-4), // Keep last 4 messages for context
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
          model: 'gpt-4o-mini',
          messages: messages,
          max_tokens: 800,
          temperature: 0.7,
          top_p: 0.9,
          frequency_penalty: 0.5
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
      
      const aiResponse = data.choices?.[0]?.message?.content;
      
      // Se a resposta da OpenAI está vazia ou é muito genérica, usar fallback
      if (!aiResponse || aiResponse.length < 50) {
        console.log('OpenAI response too short, using knowledge-based fallback');
        return this.responseGenerationService.generateKnowledgeBasedResponse(userMessage, knowledgeBase);
      }
      
      return aiResponse;
             
    } catch (error) {
      console.error('Error in generateResponse:', error);
      
      // Fallback to knowledge-based response
      try {
        const knowledgeBase = await this.knowledgeBaseService.getKnowledgeBase();
        if (knowledgeBase) {
          return this.responseGenerationService.generateKnowledgeBasedResponse(userMessage, knowledgeBase);
        }
      } catch (kbError) {
        console.error('Error accessing knowledge base:', kbError);
      }
      
      return 'Desculpe, ocorreu um erro temporário. Tente novamente em alguns instantes. Para questões urgentes, sempre procure seu pediatra. 💜';
    }
  }
}
