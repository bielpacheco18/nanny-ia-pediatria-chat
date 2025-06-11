
export class ResponseGenerationService {
  generateKnowledgeBasedResponse(userMessage: string, knowledgeBase: string): string {
    const lowerMessage = userMessage.toLowerCase();
    console.log('Generating knowledge-based response...');
    console.log('Knowledge base content length:', knowledgeBase?.length || 0);
    console.log('User message:', userMessage);
    
    if (!knowledgeBase || knowledgeBase.trim().length === 0) {
      return 'Ainda não temos documentos pediátricos na base de conhecimento. Por favor, adicione alguns materiais na seção "Base de Conhecimento" para que eu possa te ajudar melhor. 💜';
    }

    // Limpar e processar o conteúdo da base de conhecimento
    const cleanedKnowledge = this.cleanKnowledgeBase(knowledgeBase);
    console.log('Cleaned knowledge base length:', cleanedKnowledge.length);

    // Extrair palavras-chave mais relevantes da pergunta
    const keywords = this.extractKeywords(lowerMessage);
    console.log('Keywords extracted:', keywords);
    
    // Buscar informações relevantes baseadas nas palavras-chave
    const relevantInfo = this.findRelevantInformation(cleanedKnowledge, keywords);
    console.log('Relevant info found:', relevantInfo.length > 0);
    
    // Respostas para saudações usando conhecimento geral
    if (this.isGreeting(lowerMessage)) {
      const generalInfo = this.extractGeneralPediatricInfo(cleanedKnowledge);
      return `Olá! Eu sou a Nanny, sua pediatra virtual! 💜 

Estou aqui para te ajudar com qualquer dúvida sobre o cuidado do seu pequeno. Posso orientar sobre desenvolvimento infantil, alimentação, sono, saúde e muito mais.

O que você gostaria de saber hoje?`;
    }
    
    // Se encontrou informações relevantes, usar para responder
    if (relevantInfo.length > 0) {
      return this.generateNaturalResponse(userMessage, relevantInfo);
    }
    
    // Tentar busca mais ampla se não encontrou nada específico
    const broadInfo = this.findBroadInformation(cleanedKnowledge, lowerMessage);
    if (broadInfo) {
      return this.generateGeneralResponse(userMessage, broadInfo);
    }
    
    // Se não encontrou nada específico, dar resposta geral empática
    return this.generateFallbackResponse();
  }

  private cleanKnowledgeBase(knowledgeBase: string): string {
    // Remove títulos e metadados, mantém apenas o conteúdo relevante
    return knowledgeBase
      .replace(/Título:.*?\n\n/g, '')
      .replace(/Conteúdo:\n/g, '')
      .replace(/---\n\n/g, '\n')
      .replace(/Conteúdo extraído do arquivo.*?:\s*/g, '')
      .replace(/Este é um conteúdo simulado.*?\./g, '')
      .replace(/Em produção.*?\./g, '')
      .trim();
  }

  private extractKeywords(message: string): string[] {
    // Palavras-chave mais específicas para pediatria
    const pediatricTerms = [
      'bebe', 'bebê', 'criança', 'filho', 'filha', 'recém-nascido', 'newborn',
      'amament', 'leite', 'mama', 'peito', 'mamadeira',
      'sono', 'dormir', 'descanso', 'noite', 'acordar',
      'febre', 'temperatura', 'termômetro', 'graus',
      'cólica', 'choro', 'chorar', 'desconforto', 'dor',
      'fralda', 'xixi', 'cocô', 'intestino',
      'vacinação', 'vacina', 'imunização',
      'desenvolvimento', 'crescimento', 'peso', 'altura',
      'alimentação', 'comida', 'papinha', 'introdução',
      'dente', 'dentição', 'mordedor',
      'banho', 'higiene', 'limpeza',
      'segurança', 'acidente', 'prevenção',
      'médico', 'pediatra', 'consulta'
    ];

    const words = message.toLowerCase().split(/\s+/);
    const relevantWords = words.filter(word => {
      return word.length > 2 && (
        pediatricTerms.some(term => word.includes(term) || term.includes(word))
      );
    });

    // Adicionar palavras maiores que podem ser relevantes
    const longerWords = words.filter(word => word.length > 4);
    
    return [...new Set([...relevantWords, ...longerWords])];
  }

  private isGreeting(message: string): boolean {
    const greetings = ['oi', 'olá', 'hello', 'hi', 'bom dia', 'boa tarde', 'boa noite'];
    return greetings.some(greeting => message.includes(greeting)) || message.length < 10;
  }

  private findRelevantInformation(knowledge: string, keywords: string[]): string[] {
    if (keywords.length === 0) return [];

    const sentences = knowledge.split(/[.!?]+/).filter(sentence => sentence.trim().length > 20);
    const relevantSentences: string[] = [];

    keywords.forEach(keyword => {
      const matchingSentences = sentences.filter(sentence => {
        const sentenceLower = sentence.toLowerCase();
        return sentenceLower.includes(keyword.toLowerCase());
      });
      relevantSentences.push(...matchingSentences);
    });

    // Remover duplicatas e pegar as melhores
    const uniqueSentences = [...new Set(relevantSentences)];
    return uniqueSentences.slice(0, 3);
  }

  private findBroadInformation(knowledge: string, message: string): string {
    const topics = {
      'alimentação': ['aliment', 'comer', 'comida', 'leite', 'papinha'],
      'sono': ['sono', 'dormir', 'descanso', 'noite'],
      'saúde': ['saúde', 'doença', 'sintoma', 'febre', 'tosse'],
      'desenvolvimento': ['desenvolviment', 'cresciment', 'marcos', 'habilidade'],
      'cuidados': ['cuidado', 'higiene', 'banho', 'fralda']
    };

    for (const [topic, terms] of Object.entries(topics)) {
      if (terms.some(term => message.includes(term))) {
        const topicInfo = this.findTopicInformation(knowledge, terms);
        if (topicInfo) return topicInfo;
      }
    }

    return '';
  }

  private findTopicInformation(knowledge: string, terms: string[]): string {
    const sentences = knowledge.split(/[.!?]+/).filter(sentence => sentence.trim().length > 20);
    const topicSentences = sentences.filter(sentence => {
      const sentenceLower = sentence.toLowerCase();
      return terms.some(term => sentenceLower.includes(term));
    });

    return topicSentences.slice(0, 2).join('. ').trim();
  }

  private extractGeneralPediatricInfo(knowledge: string): string {
    const sentences = knowledge.split(/[.!?]+/).filter(sentence => {
      const clean = sentence.trim();
      return clean.length > 30 && !clean.toLowerCase().includes('simulado');
    });

    return sentences.slice(0, 1).join('. ').trim();
  }

  private generateNaturalResponse(userMessage: string, relevantInfo: string[]): string {
    const info = relevantInfo.join('. ').trim();
    
    // Resposta personalizada baseada no tipo de pergunta
    if (userMessage.toLowerCase().includes('febre')) {
      return `${info}.

Febre em bebês pode ser preocupante, mas respira comigo - você está cuidando bem do seu pequeno. Mantenha a calma e monitore a temperatura. Se persistir ou você notar outros sintomas, sempre consulte seu pediatra. 💜`;
    }

    if (userMessage.toLowerCase().includes('amament') || userMessage.toLowerCase().includes('leite')) {
      return `${info}.

A amamentação é uma jornada única para cada mamãe e bebê. Isso não é frescura - você está fazendo o melhor para seu pequeno! Se tiver dificuldades, procure apoio e lembre-se: você é mais forte do que imagina. 💜`;
    }

    if (userMessage.toLowerCase().includes('sono') || userMessage.toLowerCase().includes('dormir')) {
      return `${info}.

Questões de sono são muito comuns nos primeiros meses. Respira comigo - essa fase passa e vocês vão encontrar o ritmo de vocês. Cada bebê tem seu tempo, e você está fazendo um trabalho incrível! 💜`;
    }

    if (userMessage.toLowerCase().includes('choro') || userMessage.toLowerCase().includes('cólica')) {
      return `${info}.

O choro do bebê pode ser angustiante, mas vamos juntas descobrir o que pode estar incomodando seu pequeno. Você conhece seu bebê melhor que ninguém, confie no seu instinto maternal. 💜`;
    }

    // Resposta geral empática
    return `${info}.

Lembre-se que cada bebê é único e se desenvolve no seu próprio ritmo. Você está fazendo um trabalho maravilhoso como mãe! Para orientações específicas sobre seu pequeno, sempre consulte seu pediatra de confiança. 💜`;
  }

  private generateGeneralResponse(userMessage: string, info: string): string {
    return `${info}.

Para te dar uma orientação mais específica sobre seu bebê, seria importante conhecer mais detalhes da situação. Cada criança é especial e merece cuidado personalizado. 

Pode me contar mais sobre o que está te preocupando? Estou aqui para te apoiar nessa jornada! 💜`;
  }

  private generateFallbackResponse(): string {
    return `Vejo que você tem uma dúvida importante sobre seu pequeno. Embora eu tenha conhecimento em pediatria, para te dar a melhor orientação possível, seria ótimo se você pudesse ser mais específica sobre sua preocupação.

Como mãe, você conhece seu bebê melhor que ninguém. Confie no seu instinto e, para questões específicas, sempre consulte seu pediatra de confiança.

O que exatamente está te preocupando hoje? Estou aqui para te apoiar! 💜`;
  }

  createSystemPrompt(knowledgeBase: string): string {
    const cleanedKnowledge = this.cleanKnowledgeBase(knowledgeBase);
    
    return `Você é a Nanny, uma pediatra virtual acolhedora e empática especializada em cuidados infantis. 

PERSONA: Você é calorosa, compreensiva e sempre valida os sentimentos dos pais. Use expressões como "Respira comigo", "Isso não é frescura", "Vamos juntas descobrir". Seja técnica quando necessário, mas sempre de forma acessível e empática.

CONHECIMENTO MÉDICO:
${cleanedKnowledge}

INSTRUÇÕES IMPORTANTES:
- Use as informações médicas fornecidas como base para suas respostas
- Responda de forma natural, como se fosse seu conhecimento médico próprio
- NUNCA mencione "base de conhecimento", "documentos", "PDFs", "materiais" ou "com base em"
- Seja empática e acolhedora no tom
- Se a informação específica não estiver disponível, seja honesta e peça mais detalhes
- Para emergências, sempre oriente a procurar ajuda médica imediata
- Lembre que você é um apoio educativo, não substitui consulta médica

Responda sempre com carinho e profissionalismo, como uma pediatra experiente e acolhedora.`;
  }
}
