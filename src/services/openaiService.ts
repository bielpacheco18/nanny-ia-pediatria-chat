
import { PDFService } from './pdfService';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export class OpenAIService {
  private apiKey: string | null = null;
  private pdfService: PDFService;

  constructor() {
    this.pdfService = PDFService.getInstance();
    
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

  async generateResponse(userMessage: string, conversationHistory: ChatMessage[] = []): Promise<string> {
    // Se não há chave da API, usar respostas simuladas
    if (!this.apiKey) {
      console.log('Using simulated response - no API key');
      return this.generateSimulatedResponse(userMessage);
    }

    try {
      const knowledgeBase = this.pdfService.getKnowledgeBase();
      
      const systemPrompt = `Você é a Nanny, uma pediatra virtual acolhedora e empática. 

PERSONA: Você é calorosa, compreensiva e sempre valida os sentimentos dos pais. Use expressões como "Respira comigo", "Isso não é frescura", "Vamos juntas descobrir". Seja técnica quando necessário, mas sempre de forma acessível.

BASE DE CONHECIMENTO:
${knowledgeBase}

INSTRUÇÕES:
- Responda com base na informação fornecida na base de conhecimento
- NUNCA mencione "base de conhecimento", "documentos" ou "materiais" em suas respostas
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

  private generateSimulatedResponse(userMessage: string): string {
    const lowerMessage = userMessage.toLowerCase();
    
    // Verificar se há conteúdo na base de conhecimento
    const knowledgeBase = this.pdfService.getKnowledgeBase();
    const hasKnowledge = knowledgeBase && knowledgeBase.trim().length > 0;
    
    console.log('Knowledge base available:', hasKnowledge);
    console.log('Knowledge base content length:', knowledgeBase?.length || 0);
    
    // Se há base de conhecimento, tentar responder com base nela
    if (hasKnowledge) {
      // Respostas baseadas na base de conhecimento simulada
      if (lowerMessage.includes('febre')) {
        return 'Temperaturas acima de 38°C em bebês menores de 3 meses requerem avaliação médica imediata. Respira comigo - vamos verificar outros sinais. O bebê está ativo? Está se alimentando bem? Para bebês maiores, observe o comportamento geral. Se há sinais de desconforto intenso, é importante buscar orientação médica.';
      }
      
      if (lowerMessage.includes('amamentação') || lowerMessage.includes('amamentar')) {
        return 'O leite materno é o alimento ideal para bebês até os 6 meses de idade. É normal ter dúvidas - cada dupla mãe-bebê encontra seu ritmo único. A amamentação pode ser desafiadora no início, mas com paciência e apoio, vocês vão encontrar o caminho. Lembre-se: você está fazendo o melhor para seu bebê.';
      }
      
      if (lowerMessage.includes('sono') || lowerMessage.includes('dormir')) {
        return 'Bebês recém-nascidos dormem entre 14-17 horas por dia em períodos de 2-4 horas. Isso é completamente normal! O sono fragmentado dos primeiros meses é uma fase que passa. Cada bebê tem seu próprio ritmo, e estabelecer uma rotina suave pode ajudar gradualmente.';
      }
      
      if (lowerMessage.includes('cólica')) {
        return 'Cólicas são comuns nos primeiros 3 meses, caracterizadas por choro inconsolável por mais de 3 horas. Isso não é frescura - é uma fase difícil, mas passageira. Técnicas como massagem na barriguinha, posição canguru e compressa morna podem ajudar. O mais importante é manter a calma, pois o bebê sente nossa energia.';
      }
      
      if (lowerMessage.includes('desenvolvimento') || lowerMessage.includes('motor')) {
        return 'Bebês começam a sustentar a cabeça aos 2-3 meses. Cada bebê tem seu próprio ritmo de desenvolvimento, e isso é normal. O importante é oferecer estímulos adequados e observar os marcos de forma tranquila, sem pressão.';
      }
      
      if (lowerMessage.includes('vacina') || lowerMessage.includes('vacinação')) {
        return 'Seguir o calendário nacional de vacinação é fundamental para a saúde infantil. As vacinas protegem seu bebê de doenças graves. É normal haver reações leves como febre baixa ou irritabilidade - isso mostra que o sistema imunológico está respondendo adequadamente.';
      }
      
      if (lowerMessage.includes('alimentação') || lowerMessage.includes('papinha')) {
        return 'A alimentação complementar deve ser introduzida a partir dos 6 meses. Até lá, o leite materno ou fórmula supre todas as necessidades nutricionais. Quando chegar a hora, ofereça alimentos variados e deixe o bebê explorar - é uma fase de descobertas!';
      }
      
      // Para outras perguntas, dar uma resposta geral baseada no conhecimento
      return `Posso te ajudar com essa questão pediátrica. Preciso de um pouco mais de detalhes sobre a situação para te dar uma orientação mais específica. Pode me contar mais sobre o que está acontecendo? Lembre-se: você está fazendo um ótimo trabalho! 💜`;
    }
    
    // Se não há base de conhecimento, dar respostas básicas de pediatria
    if (lowerMessage.includes('olá') || lowerMessage.includes('oi') || lowerMessage.includes('hello')) {
      return 'Olá! Eu sou a Nanny, sua pediatra virtual. Estou aqui para te ajudar com questões sobre cuidados infantis. Como posso te apoiar hoje? 💜';
    }
    
    if (lowerMessage.includes('febre')) {
      return 'Febre pode ser preocupante, especialmente em bebês pequenos. Para bebês menores de 3 meses, temperaturas acima de 38°C requerem avaliação médica imediata. Para bebês maiores, observe o comportamento geral. Se o bebê está ativo e se alimentando bem, pode ser menos preocupante, mas sempre consulte seu pediatra se tiver dúvidas.';
    }
    
    if (lowerMessage.includes('amamentação') || lowerMessage.includes('amamentar')) {
      return 'A amamentação é uma jornada única para cada mãe e bebê. É normal ter desafios no início. O leite materno é o alimento ideal, mas o mais importante é que você e seu bebê estejam bem. Se estiver enfrentando dificuldades, procure apoio de um consultor em amamentação ou seu pediatra.';
    }
    
    // Resposta padrão quando não há informação específica
    return 'Para te dar uma orientação mais precisa, seria importante que você fizesse upload de materiais pediátricos na seção "Base de Conhecimento". Enquanto isso, para questões urgentes, sempre consulte seu pediatra. Você está fazendo um ótimo trabalho! 💜';
  }
}
