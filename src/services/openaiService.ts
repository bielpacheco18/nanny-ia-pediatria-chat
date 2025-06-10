
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
      console.log('Fetching knowledge base from Supabase...');
      const { data: knowledgeBase, error } = await supabase
        .from('knowledge_base')
        .select('title, content')
        .eq('status', 'processed');

      if (error) {
        console.error('Error fetching knowledge base:', error);
        return '';
      }

      console.log('Knowledge base data:', knowledgeBase);
      console.log('Number of documents found:', knowledgeBase?.length || 0);

      if (!knowledgeBase || knowledgeBase.length === 0) {
        console.log('No processed documents found in knowledge base');
        return '';
      }

      const combinedContent = knowledgeBase
        .filter(item => item.content && item.content.trim().length > 0)
        .map(item => `Título: ${item.title}\n\nConteúdo:\n${item.content}`)
        .join('\n\n---\n\n');

      console.log('Combined content length:', combinedContent.length);
      return combinedContent;
    } catch (error) {
      console.error('Error accessing Supabase:', error);
      return '';
    }
  }

  async generateResponse(userMessage: string, conversationHistory: ChatMessage[] = []): Promise<string> {
    console.log('Generating response for:', userMessage);
    
    // Buscar base de conhecimento primeiro
    const knowledgeBase = await this.getKnowledgeBaseFromSupabase();
    console.log('Knowledge base available:', knowledgeBase.length > 0);
    
    // Se não há chave da API, usar respostas baseadas na base de conhecimento
    if (!this.apiKey) {
      console.log('Using knowledge-based response - no API key');
      return this.generateKnowledgeBasedResponse(userMessage, knowledgeBase);
    }

    try {
      const systemPrompt = `Você é a Nanny, uma pediatra virtual acolhedora e empática especializada em cuidados infantis. 

PERSONA: Você é calorosa, compreensiva e sempre valida os sentimentos dos pais. Use expressões como "Respira comigo", "Isso não é frescura", "Vamos juntas descobrir". Seja técnica quando necessário, mas sempre de forma acessível.

IMPORTANTE: Baseie suas respostas EXCLUSIVAMENTE nas informações médicas e pediátricas fornecidas abaixo. Se a informação específica não estiver disponível no conteúdo fornecido, diga que precisa de mais informações para dar uma orientação específica.

BASE DE CONHECIMENTO MÉDICO:
${knowledgeBase}

INSTRUÇÕES IMPORTANTES:
- Responda APENAS com base nas informações médicas fornecidas acima
- NUNCA mencione "base de conhecimento", "documentos", "materiais" ou "PDFs" em suas respostas
- Responda como se fosse seu conhecimento médico natural e experiência como pediatra
- Se a informação específica não estiver disponível no conteúdo médico fornecido, seja honesta e diga que precisa de mais detalhes
- Seja empática e acolhedora no tom
- Mantenha o foco em orientações pediátricas baseadas no conteúdo médico disponível
- Se for uma emergência, sempre oriente a procurar ajuda médica imediata
- Use o conteúdo médico fornecido para dar respostas específicas e detalhadas

LEMBRETE: Você é um apoio educativo baseado em conhecimento médico específico. Em casos sérios ou emergências, sempre oriente a buscar um pediatra presencialmente.`;

      const messages: ChatMessage[] = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory.slice(-6), // Manter apenas as últimas 6 mensagens para contexto
        { role: 'user', content: userMessage }
      ];

      console.log('Sending request to OpenAI...');
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
      const aiResponse = data.choices[0]?.message?.content || 'Desculpe, não consegui gerar uma resposta no momento.';
      console.log('OpenAI response received');
      return aiResponse;
    } catch (error) {
      console.error('Erro ao chamar OpenAI:', error);
      return this.generateKnowledgeBasedResponse(userMessage, knowledgeBase);
    }
  }

  private async generateKnowledgeBasedResponse(userMessage: string, knowledgeBase: string): Promise<string> {
    const lowerMessage = userMessage.toLowerCase();
    console.log('Generating knowledge-based response...');
    console.log('Knowledge base content length:', knowledgeBase?.length || 0);
    console.log('User message:', userMessage);
    
    // Se há base de conhecimento, procurar informações relevantes
    if (knowledgeBase && knowledgeBase.trim().length > 0) {
      console.log('Using knowledge base for response');
      
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
          return `Com base no meu conhecimento médico: ${info}. Lembre-se que cada criança é única e pode ter variações. Se tiver dúvidas específicas sobre seu pequeno, sempre consulte seu pediatra de confiança. Você está fazendo um ótimo trabalho! 💜`;
        }
      }
      
      // Respostas específicas baseadas no conhecimento disponível
      if (lowerMessage.includes('febre')) {
        const feverInfo = knowledgeBase.toLowerCase().includes('febre') ? 
          knowledgeBase.split(/[.!?]+/).filter(s => s.toLowerCase().includes('febre')).slice(0, 2).join('. ') : '';
        if (feverInfo) {
          return `Sobre febre infantil: ${feverInfo}. Respira comigo - você está cuidando bem do seu bebê. Para orientações específicas sobre o seu caso, consulte seu pediatra.`;
        }
      }
      
      if (lowerMessage.includes('amament') || lowerMessage.includes('leite')) {
        const breastfeedingInfo = knowledgeBase.toLowerCase().includes('amament') ? 
          knowledgeBase.split(/[.!?]+/).filter(s => s.toLowerCase().includes('amament')).slice(0, 2).join('. ') : '';
        if (breastfeedingInfo) {
          return `Sobre amamentação: ${breastfeedingInfo}. Isso não é frescura - você está fazendo o melhor para seu pequeno! 💜`;
        }
      }
      
      if (lowerMessage.includes('sono') || lowerMessage.includes('dormir')) {
        const sleepInfo = knowledgeBase.toLowerCase().includes('sono') ? 
          knowledgeBase.split(/[.!?]+/).filter(s => s.toLowerCase().includes('sono')).slice(0, 2).join('. ') : '';
        if (sleepInfo) {
          return `Sobre o sono dos bebês: ${sleepInfo}. Respira comigo - essa fase passa e vocês vão encontrar o equilíbrio. 💜`;
        }
      }
      
      // Resposta geral quando há base de conhecimento mas não é específica
      const generalInfo = knowledgeBase.split(/[.!?]+/).slice(0, 2).join('. ').trim();
      return `Com base no meu conhecimento pediátrico: ${generalInfo}. Para te dar uma orientação mais precisa e personalizada para seu bebê, seria importante conversar sobre mais detalhes da situação. Cada criança é única e merece cuidado individualizado. Você está fazendo um trabalho incrível! 💜`;
    }
    
    // Se não há base de conhecimento, resposta padrão
    console.log('No knowledge base available, using default response');
    if (lowerMessage.includes('olá') || lowerMessage.includes('oi') || lowerMessage.includes('hello')) {
      return 'Olá! Eu sou a Nanny, sua pediatra virtual. Estou aqui para te ajudar com questões sobre cuidados infantis baseado no conhecimento médico disponível. Como posso te apoiar hoje? 💜';
    }
    
    return 'Ainda não tenho informações médicas suficientes para responder de forma específica a essa questão. Te encorajo a adicionar materiais pediátricos na seção "Base de Conhecimento" para que eu possa te ajudar melhor com conhecimento médico especializado. Para questões urgentes, sempre consulte seu pediatra. Você está fazendo um ótimo trabalho! 💜';
  }
}
