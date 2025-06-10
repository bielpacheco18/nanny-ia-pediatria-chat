
export class ResponseGenerationService {
  generateKnowledgeBasedResponse(userMessage: string, knowledgeBase: string): string {
    const lowerMessage = userMessage.toLowerCase();
    console.log('Generating knowledge-based response...');
    console.log('Knowledge base content length:', knowledgeBase?.length || 0);
    console.log('User message:', userMessage);
    
    if (!knowledgeBase || knowledgeBase.trim().length === 0) {
      return 'Ainda não temos documentos pediátricos na base de conhecimento. Por favor, adicione alguns materiais na seção "Base de Conhecimento" para que eu possa te ajudar melhor. 💜';
    }

    // Buscar por palavras-chave na base de conhecimento de forma mais ampla
    const knowledgeWords = knowledgeBase.toLowerCase();
    
    // Extrair palavras-chave da pergunta do usuário (incluindo palavras menores)
    const keywords = lowerMessage.split(' ').filter(word => word.length > 2);
    console.log('Keywords found:', keywords);
    
    // Verificar se alguma palavra-chave está presente na base de conhecimento
    const relevantInfo = keywords.some(keyword => knowledgeWords.includes(keyword));
    console.log('Relevant info found in knowledge base:', relevantInfo);
    
    // Respostas para saudações e mensagens curtas usando a base de conhecimento
    if (lowerMessage.includes('oi') || lowerMessage.includes('olá') || lowerMessage.includes('hello') || lowerMessage.length < 4) {
      const introInfo = this.extractGeneralInfo(knowledgeBase);
      return `Olá! Eu sou a Nanny, sua pediatra virtual! 💜 

${introInfo}

Estou aqui para te ajudar com qualquer dúvida sobre o cuidado do seu pequeno. O que você gostaria de saber hoje?`;
    }
    
    if (relevantInfo) {
      // Tentar encontrar seções relevantes da base de conhecimento
      const sentences = knowledgeBase.split(/[.!?]+/).filter(sentence => sentence.trim().length > 15);
      const relevantSentences = sentences.filter(sentence => {
        const sentenceLower = sentence.toLowerCase();
        return keywords.some(keyword => sentenceLower.includes(keyword));
      });
      
      console.log('Relevant sentences found:', relevantSentences.length);
      
      if (relevantSentences.length > 0) {
        // Usar as informações relevantes para construir uma resposta natural
        const info = relevantSentences.slice(0, 3).join('. ').trim();
        return `${info}. 

Lembre-se que cada criança é única e pode ter variações. Se tiver dúvidas específicas sobre seu pequeno, sempre consulte seu pediatra de confiança. Você está fazendo um ótimo trabalho! 💜`;
      }
    }
    
    // Respostas específicas baseadas no conhecimento disponível
    if (lowerMessage.includes('febre')) {
      const feverInfo = this.findSpecificInfo(knowledgeBase, ['febre', 'temperatura']);
      if (feverInfo) {
        return `${feverInfo}

Respira comigo - você está cuidando bem do seu bebê. Para orientações específicas sobre o seu caso, consulte seu pediatra. 💜`;
      }
    }
    
    if (lowerMessage.includes('amament') || lowerMessage.includes('leite')) {
      const breastfeedingInfo = this.findSpecificInfo(knowledgeBase, ['amament', 'leite', 'mama']);
      if (breastfeedingInfo) {
        return `${breastfeedingInfo}

Isso não é frescura - você está fazendo o melhor para seu pequeno! 💜`;
      }
    }
    
    if (lowerMessage.includes('sono') || lowerMessage.includes('dormir')) {
      const sleepInfo = this.findSpecificInfo(knowledgeBase, ['sono', 'dormir', 'descanso']);
      if (sleepInfo) {
        return `${sleepInfo}

Respira comigo - essa fase passa e vocês vão encontrar o equilíbrio. 💜`;
      }
    }

    if (lowerMessage.includes('cólica') || lowerMessage.includes('choro')) {
      const colicInfo = this.findSpecificInfo(knowledgeBase, ['cólica', 'choro', 'desconforto']);
      if (colicInfo) {
        return `${colicInfo}

Vamos juntas descobrir o que pode estar causando esse desconforto. Você está sendo uma mãe incrível! 💜`;
      }
    }
    
    // Se há base de conhecimento mas não encontrou algo específico, dar uma resposta mais geral
    const generalInfo = this.extractGeneralInfo(knowledgeBase);
    if (generalInfo) {
      return `${generalInfo}

Para te dar uma orientação mais precisa e personalizada para seu bebê, seria importante conversar sobre mais detalhes da situação. Cada criança é única e merece cuidado individualizado. 

Pode me contar mais sobre o que está te preocupando? Você está fazendo um trabalho incrível! 💜`;
    }
    
    // Se chegou até aqui, significa que não conseguiu extrair informações úteis
    return 'Vejo que temos alguns documentos na base de conhecimento, mas não consegui encontrar informações específicas sobre sua questão. Te encorajo a adicionar mais materiais pediátricos detalhados na seção "Base de Conhecimento" para que eu possa te ajudar melhor. Para questões urgentes, sempre consulte seu pediatra. Você está fazendo um ótimo trabalho! 💜';
  }

  private findSpecificInfo(knowledgeBase: string, keywords: string[]): string {
    const sentences = knowledgeBase.split(/[.!?]+/).filter(sentence => sentence.trim().length > 15);
    const relevantSentences = sentences.filter(sentence => {
      const sentenceLower = sentence.toLowerCase();
      return keywords.some(keyword => sentenceLower.includes(keyword));
    });
    
    if (relevantSentences.length > 0) {
      return relevantSentences.slice(0, 2).join('. ').trim();
    }
    
    return '';
  }

  private extractGeneralInfo(knowledgeBase: string): string {
    // Extrair informações gerais mais úteis da base de conhecimento
    const sentences = knowledgeBase.split(/[.!?]+/).filter(sentence => {
      const sentence_clean = sentence.trim();
      return sentence_clean.length > 20 && 
             !sentence_clean.toLowerCase().includes('conteúdo extraído') &&
             !sentence_clean.toLowerCase().includes('este é um conteúdo simulado');
    });
    
    if (sentences.length > 0) {
      return sentences.slice(0, 2).join('. ').trim();
    }
    
    return '';
  }

  createSystemPrompt(knowledgeBase: string): string {
    return `Você é a Nanny, uma pediatra virtual acolhedora e empática especializada em cuidados infantis. 

PERSONA: Você é calorosa, compreensiva e sempre valida os sentimentos dos pais. Use expressões como "Respira comigo", "Isso não é frescura", "Vamos juntas descobrir". Seja técnica quando necessário, mas sempre de forma acessível.

IMPORTANTE: Baseie suas respostas EXCLUSIVAMENTE nas informações médicas e pediátricas fornecidas abaixo. Responda de forma natural, como se fossem seus conhecimentos como pediatra. NUNCA mencione que está consultando documentos ou base de conhecimento.

BASE DE CONHECIMENTO MÉDICO:
${knowledgeBase}

INSTRUÇÕES IMPORTANTES:
- Responda APENAS com base nas informações médicas fornecidas acima
- NUNCA mencione "base de conhecimento", "documentos", "materiais", "PDFs" ou "com base no meu conhecimento médico"
- Responda de forma natural, como se fosse seu conhecimento médico próprio e experiência como pediatra
- Se a informação específica não estiver disponível no conteúdo médico fornecido, seja honesta e diga que precisa de mais detalhes para dar uma orientação específica
- Seja empática e acolhedora no tom
- Mantenha o foco em orientações pediátricas baseadas no conteúdo médico disponível
- Se for uma emergência, sempre oriente a procurar ajuda médica imediata
- Use o conteúdo médico fornecido para dar respostas específicas e detalhadas de forma natural

LEMBRETE: Você é um apoio educativo. Em casos sérios ou emergências, sempre oriente a buscar um pediatra presencialmente.`;
  }
}
