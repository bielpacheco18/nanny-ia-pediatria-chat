
import { supabase } from '@/integrations/supabase/client';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export class OpenAIService {
  private apiKey: string | null = null;

  constructor() {
    // Debug log to check environment
    console.log('Checking environment variables...');
    console.log('import.meta.env:', import.meta.env);
    
    // Em Vite, use import.meta.env ao invés de process.env
    try {
      this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || null;
      console.log('API Key loaded:', this.apiKey ? 'Yes (hidden)' : 'No');
    } catch (error) {
      console.error('Error accessing environment variable:', error);
      this.apiKey = null;
    }
  }

  setApiKey(key: string) {
    this.apiKey = key;
  }

  async getKnowledgeBaseFromSupabase(): Promise<string> {
    try {
      const { data: knowledgeBase, error } = await supabase
        .from('knowledge_base')
        .select('title, content')
        .eq('status', 'processed');

      if (error) {
        console.error('Error fetching knowledge base:', error);
        return '';
      }

      if (!knowledgeBase || knowledgeBase.length === 0) {
        return '';
      }

      return knowledgeBase
        .map(item => `${item.title}\n${item.content}`)
        .join('\n\n---\n\n');
    } catch (error) {
      console.error('Error accessing Supabase:', error);
      return '';
    }
  }

  async generateResponse(userMessage: string, conversationHistory: ChatMessage[] = []): Promise<string> {
    // Se não há chave da API, usar respostas simuladas
    if (!this.apiKey) {
      console.log('Using simulated response - no API key');
      return this.generateSimulatedResponse(userMessage);
    }

    try {
      const knowledgeBase = await this.getKnowledgeBaseFromSupabase();
      
      const systemPrompt = `Você é a Nanny, uma pediatra virtual acolhedora e empática. 

PERSONA: Você é calorosa, compreensiva e sempre valida os sentimentos dos pais. Use expressões como "Respira comigo", "Isso não é frescura", "Vamos juntas descobrir". Seja técnica quando necessário, mas sempre de forma acessível.

BASE DE CONHECIMENTO:
${knowledgeBase}

INSTRUÇÕES:
- Responda com base na informação fornecida na base de conhecimento
- NUNCA mencione "base de conhecimento", "documentos", "materiais" ou "PDFs" em suas respostas
- Responda como se fosse seu conhecimento médico natural
- Se a informação não estiver disponível, diga que precisa de mais informações para dar uma orientação específica
- Seja empática e acolhedora no tom
- Mantenha o foco em orientações pediátricas
- Se for uma emergência, sempre oriente a procurar ajuda médica imediata

IMPORTANTE: Você é um apoio educativo. Em casos sérios ou emergências, sempre oriente a buscar um pediatra presencialmente.`;

      const messages: ChatMessage[] = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory.slice(-6), // Manter apenas as últimas 6 mensagens para contexto
        { role: 'user', content: userMessage }
      ];

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: messages,
          temperature: 0.7,
          max_tokens: 800,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'Desculpe, não consegui gerar uma resposta no momento.';
    } catch (error) {
      console.error('Erro ao chamar OpenAI:', error);
      return this.generateSimulatedResponse(userMessage);
    }
  }

  private async generateSimulatedResponse(userMessage: string): Promise<string> {
    const lowerMessage = userMessage.toLowerCase();
    
    // Buscar conteúdo da base de conhecimento do Supabase
    const knowledgeBase = await this.getKnowledgeBaseFromSupabase();
    const hasKnowledge = knowledgeBase && knowledgeBase.trim().length > 0;
    
    console.log('Knowledge base available:', hasKnowledge);
    console.log('Knowledge base content length:', knowledgeBase?.length || 0);
    console.log('User message:', userMessage);
    
    // Se há base de conhecimento, procurar informações relevantes
    if (hasKnowledge) {
      // Buscar por palavras-chave na base de conhecimento
      const knowledgeWords = knowledgeBase.toLowerCase();
      
      // Extrair palavras-chave da pergunta do usuário
      const keywords = lowerMessage.split(' ').filter(word => word.length > 3);
      console.log('Keywords found:', keywords);
      
      // Verificar se alguma palavra-chave está presente na base de conhecimento
      const relevantInfo = keywords.some(keyword => knowledgeWords.includes(keyword));
      console.log('Relevant info found in knowledge base:', relevantInfo);
      
      if (relevantInfo) {
        // Tentar encontrar seções relevantes da base de conhecimento
        const sentences = knowledgeBase.split(/[.!?]+/).filter(sentence => sentence.trim().length > 20);
        const relevantSentences = sentences.filter(sentence => {
          const sentenceLower = sentence.toLowerCase();
          return keywords.some(keyword => sentenceLower.includes(keyword));
        });
        
        console.log('Relevant sentences found:', relevantSentences.length);
        
        if (relevantSentences.length > 0) {
          // Usar as informações relevantes para construir uma resposta
          const info = relevantSentences.slice(0, 3).join('. ').trim();
          return `${info}. Lembre-se que cada bebê é único e pode ter variações. Se tiver dúvidas específicas sobre seu pequeno, sempre consulte seu pediatra de confiança. Você está fazendo um ótimo trabalho! 💜`;
        }
      }
      
      // Respostas específicas baseadas no conhecimento disponível
      if (lowerMessage.includes('febre')) {
        return 'Sobre febre infantil: é importante monitorar a temperatura e o comportamento geral do bebê. Temperaturas persistentes ou muito altas, especialmente em bebês pequenos, merecem atenção médica. Respira comigo - você está cuidando bem do seu bebê. Para orientações específicas sobre o seu caso, consulte seu pediatra.';
      }
      
      if (lowerMessage.includes('amament') || lowerMessage.includes('leite')) {
        return 'A amamentação é uma jornada única para cada dupla mãe-bebê. É normal ter desafios e dúvidas no processo. O importante é que tanto você quanto seu bebê estejam bem. Se precisar de apoio específico, procure orientação profissional. Isso não é frescura - você está fazendo o melhor para seu pequeno! 💜';
      }
      
      if (lowerMessage.includes('sono') || lowerMessage.includes('dormir')) {
        return 'O sono dos bebês pode ser um desafio real para as famílias. Cada bebê tem seu próprio ritmo e isso vai se organizando com o tempo. Estabelecer rotinas suaves pode ajudar gradualmente. Respira comigo - essa fase passa e vocês vão encontrar o equilíbrio. Para dicas específicas sobre seu bebê, converse com seu pediatra.';
      }
      
      // Resposta geral quando há base de conhecimento mas não é específica
      return `Com base no meu conhecimento pediátrico, posso te ajudar com essa questão. Para te dar uma orientação mais precisa e personalizada para seu bebê, seria importante conversar sobre mais detalhes da situação. Cada criança é única e merece cuidado individualizado. Você está fazendo um trabalho incrível! 💜`;
    }
    
    // Se não há base de conhecimento, resposta padrão
    if (lowerMessage.includes('olá') || lowerMessage.includes('oi') || lowerMessage.includes('hello')) {
      return 'Olá! Eu sou a Nanny, sua pediatra virtual. Estou aqui para te ajudar com questões sobre cuidados infantis. Como posso te apoiar hoje? 💜';
    }
    
    return 'Ainda não tenho informações suficientes para responder de forma específica a essa questão. Te encorajo a adicionar materiais pediátricos na seção "Base de Conhecimento" para que eu possa te ajudar melhor. Para questões urgentes, sempre consulte seu pediatra. Você está fazendo um ótimo trabalho! 💜';
  }
}
