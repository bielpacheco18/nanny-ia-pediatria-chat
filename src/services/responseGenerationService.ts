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
    
    // Buscar informações relevantes de forma mais ampla
    const relevantInfo = this.findRelevantInformation(cleanedKnowledge, keywords, lowerMessage);
    console.log('Relevant info found:', relevantInfo.length > 0);
    
    // Respostas para saudações usando conhecimento geral
    if (this.isGreeting(lowerMessage)) {
      return `Olá! Como posso te ajudar hoje? 

Estou aqui para esclarecer suas dúvidas sobre pediatria com base na nossa base de conhecimento. Pode me fazer qualquer pergunta sobre cuidados com seu bebê! 💜`;
    }
    
    // Se encontrou informações relevantes, usar para responder
    if (relevantInfo.length > 0) {
      return this.generateNaturalResponse(userMessage, relevantInfo);
    }
    
    // Tentar busca mais ampla se não encontrou nada específico
    const broadInfo = this.findBroadInformation(cleanedKnowledge, lowerMessage);
    if (broadInfo && broadInfo.length > 50) {
      return this.generateGeneralResponse(userMessage, broadInfo);
    }
    
    // Buscar qualquer conteúdo relacionado mesmo que remotamente
    const anyRelatedInfo = this.findAnyRelatedContent(cleanedKnowledge, lowerMessage);
    if (anyRelatedInfo && anyRelatedInfo.length > 50) {
      return `Com base na nossa base de conhecimento, posso te ajudar com essa informação:

${anyRelatedInfo}

Para orientações mais específicas sobre seu caso, sempre consulte seu pediatra de confiança. 💜`;
    }
    
    // Se realmente não encontrou nada, dar uma resposta mais útil
    return this.generateHelpfulFallbackResponse(userMessage);
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
      'amament', 'leite', 'mama', 'peito', 'mamadeira', 'aleitamento',
      'sono', 'dormir', 'descanso', 'noite', 'acordar', 'insônia',
      'febre', 'temperatura', 'termômetro', 'graus', 'febril',
      'cólica', 'choro', 'chorar', 'desconforto', 'dor', 'irritação',
      'fralda', 'xixi', 'cocô', 'intestino', 'evacuação', 'urina',
      'vacinação', 'vacina', 'imunização', 'calendário',
      'desenvolvimento', 'crescimento', 'peso', 'altura', 'marcos',
      'alimentação', 'comida', 'papinha', 'introdução', 'nutricão',
      'dente', 'dentição', 'mordedor', 'dental',
      'banho', 'higiene', 'limpeza', 'cuidado',
      'segurança', 'acidente', 'prevenção', 'proteção',
      'médico', 'pediatra', 'consulta', 'exame',
      'gripe', 'resfriado', 'tosse', 'espirro', 'coriza',
      'pele', 'assadura', 'alergia', 'coceira', 'vermelhidão',
      'desenvolvimento', 'motor', 'cognitivo', 'social',
      'verrugas', 'zinco', 'vitamina', 'suplemento'
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

  private findRelevantInformation(knowledge: string, keywords: string[], originalMessage: string): string[] {
    const sentences = knowledge.split(/[.!?]+/).filter(sentence => sentence.trim().length > 20);
    const relevantSentences: string[] = [];

    // Buscar por palavras-chave específicas
    keywords.forEach(keyword => {
      const matchingSentences = sentences.filter(sentence => {
        const sentenceLower = sentence.toLowerCase();
        return sentenceLower.includes(keyword.toLowerCase());
      });
      relevantSentences.push(...matchingSentences);
    });

    // Se não encontrou nada com keywords, tentar busca por proximidade de palavras
    if (relevantSentences.length === 0) {
      const messageWords = originalMessage.toLowerCase().split(/\s+/).filter(word => word.length > 3);
      messageWords.forEach(word => {
        const matchingSentences = sentences.filter(sentence => {
          const sentenceLower = sentence.toLowerCase();
          return sentenceLower.includes(word);
        });
        relevantSentences.push(...matchingSentences);
      });
    }

    // Remover duplicatas e pegar as melhores
    const uniqueSentences = [...new Set(relevantSentences)];
    return uniqueSentences.slice(0, 3);
  }

  private findBroadInformation(knowledge: string, message: string): string {
    const topics = {
      'alimentação': ['aliment', 'comer', 'comida', 'leite', 'papinha', 'nutri'],
      'sono': ['sono', 'dormir', 'descanso', 'noite', 'acordar'],
      'saúde': ['saúde', 'doença', 'sintoma', 'febre', 'tosse', 'gripe', 'resfriado'],
      'desenvolvimento': ['desenvolviment', 'cresciment', 'marcos', 'habilidade', 'motor'],
      'cuidados': ['cuidado', 'higiene', 'banho', 'fralda', 'limpeza'],
      'pele': ['pele', 'assadura', 'alergia', 'coceira', 'vermelhidão'],
      'medicamentos': ['remédio', 'medicament', 'vitamina', 'suplemento', 'zinco'],
      'vacinação': ['vacina', 'imunização', 'calendário']
    };

    for (const [topic, terms] of Object.entries(topics)) {
      if (terms.some(term => message.toLowerCase().includes(term))) {
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

    return topicSentences.slice(0, 3).join('. ').trim();
  }

  private findAnyRelatedContent(knowledge: string, message: string): string {
    const messageWords = message.toLowerCase().split(/\s+/).filter(word => word.length > 3);
    const sentences = knowledge.split(/[.!?]+/).filter(sentence => sentence.trim().length > 30);
    
    // Buscar sentenças que contenham pelo menos uma palavra da mensagem
    const relatedSentences = sentences.filter(sentence => {
      const sentenceLower = sentence.toLowerCase();
      return messageWords.some(word => sentenceLower.includes(word));
    });

    if (relatedSentences.length > 0) {
      return relatedSentences.slice(0, 2).join('. ').trim();
    }

    // Se ainda não encontrou, pegar uma amostra geral da base de conhecimento
    const generalSentences = sentences.filter(sentence => {
      const clean = sentence.trim();
      return clean.length > 30 && !clean.toLowerCase().includes('simulado');
    });

    return generalSentences.slice(0, 1).join('. ').trim();
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

  private generateHelpfulFallbackResponse(userMessage: string): string {
    return `Entendi sua pergunta sobre "${userMessage}". 

Baseando-me na nossa base de conhecimento, posso te ajudar com diversas questões pediátricas como desenvolvimento infantil, alimentação, sono, cuidados gerais e saúde do bebê.

Poderia reformular sua pergunta de forma mais específica? Por exemplo:
- "Como tratar assadura do bebê?"
- "Quando introduzir papinha?"
- "O que fazer quando o bebê não dorme?"

Estou aqui para te ajudar! 💜`;
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
