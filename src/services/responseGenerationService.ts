
export class ResponseGenerationService {
  generateKnowledgeBasedResponse(userMessage: string, knowledgeBase: string): string {
    const lowerMessage = userMessage.toLowerCase();
    console.log('Generating knowledge-based response...');
    console.log('Knowledge base content length:', knowledgeBase?.length || 0);
    console.log('User message:', userMessage);
    
    if (!knowledgeBase || knowledgeBase.trim().length === 0) {
      return 'Ainda não temos materiais na base de conhecimento. Adicione alguns documentos na seção "Base de Conhecimento" para que eu possa te ajudar! 💜';
    }

    const cleanedKnowledge = this.cleanKnowledgeBase(knowledgeBase);
    const keywords = this.extractKeywords(lowerMessage);
    const relevantInfo = this.findRelevantInformation(cleanedKnowledge, keywords, lowerMessage);
    
    // Saudações simples
    if (this.isGreeting(lowerMessage)) {
      return `Oi! 👋 Como posso te ajudar com seu bebê hoje? 

Pode me perguntar sobre alimentação, sono, cuidados ou qualquer dúvida! 💜`;
    }
    
    // Se encontrou informações relevantes
    if (relevantInfo.length > 0) {
      return this.generateSimpleResponse(userMessage, relevantInfo);
    }
    
    // Busca mais ampla
    const broadInfo = this.findBroadInformation(cleanedKnowledge, lowerMessage);
    if (broadInfo && broadInfo.length > 30) {
      return this.generateQuickResponse(userMessage, broadInfo);
    }
    
    // Resposta de apoio
    return this.generateHelpfulResponse(userMessage);
  }

  private cleanKnowledgeBase(knowledgeBase: string): string {
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
    const pediatricTerms = [
      'bebe', 'bebê', 'criança', 'filho', 'filha', 'recém-nascido',
      'amament', 'leite', 'mama', 'peito', 'mamadeira',
      'sono', 'dormir', 'noite', 'acordar',
      'febre', 'temperatura', 'graus',
      'cólica', 'choro', 'chorar', 'dor',
      'fralda', 'xixi', 'cocô',
      'vacina', 'vacinação',
      'peso', 'altura', 'crescimento',
      'comida', 'papinha', 'alimentação',
      'dente', 'dentição',
      'banho', 'higiene',
      'médico', 'pediatra',
      'gripe', 'resfriado', 'tosse',
      'pele', 'assadura', 'alergia'
    ];

    const words = message.toLowerCase().split(/\s+/);
    const relevantWords = words.filter(word => {
      return word.length > 2 && pediatricTerms.some(term => 
        word.includes(term) || term.includes(word)
      );
    });

    return [...new Set([...relevantWords, ...words.filter(word => word.length > 4)])];
  }

  private isGreeting(message: string): boolean {
    const greetings = ['oi', 'olá', 'hello', 'hi', 'bom dia', 'boa tarde', 'boa noite'];
    return greetings.some(greeting => message.includes(greeting)) || message.length < 10;
  }

  private findRelevantInformation(knowledge: string, keywords: string[], originalMessage: string): string[] {
    const sentences = knowledge.split(/[.!?]+/).filter(sentence => sentence.trim().length > 15);
    const relevantSentences: string[] = [];

    // Buscar por palavras-chave
    keywords.forEach(keyword => {
      const matchingSentences = sentences.filter(sentence => {
        const sentenceLower = sentence.toLowerCase();
        return sentenceLower.includes(keyword.toLowerCase());
      });
      relevantSentences.push(...matchingSentences);
    });

    // Busca por palavras da mensagem
    if (relevantSentences.length === 0) {
      const messageWords = originalMessage.toLowerCase().split(/\s+/).filter(word => word.length > 3);
      messageWords.forEach(word => {
        const matchingSentences = sentences.filter(sentence => {
          return sentence.toLowerCase().includes(word);
        });
        relevantSentences.push(...matchingSentences);
      });
    }

    return [...new Set(relevantSentences)].slice(0, 2);
  }

  private findBroadInformation(knowledge: string, message: string): string {
    const topics = {
      'alimentação': ['aliment', 'comer', 'leite', 'papinha'],
      'sono': ['sono', 'dormir', 'noite'],
      'saúde': ['febre', 'tosse', 'gripe', 'doente'],
      'cuidados': ['banho', 'fralda', 'higiene'],
      'desenvolvimento': ['crescer', 'peso', 'altura']
    };

    for (const [topic, terms] of Object.entries(topics)) {
      if (terms.some(term => message.toLowerCase().includes(term))) {
        return this.findTopicInfo(knowledge, terms);
      }
    }
    return '';
  }

  private findTopicInfo(knowledge: string, terms: string[]): string {
    const sentences = knowledge.split(/[.!?]+/).filter(sentence => sentence.trim().length > 15);
    const topicSentences = sentences.filter(sentence => {
      const sentenceLower = sentence.toLowerCase();
      return terms.some(term => sentenceLower.includes(term));
    });

    return topicSentences.slice(0, 2).join('. ').trim();
  }

  private generateSimpleResponse(userMessage: string, relevantInfo: string[]): string {
    const info = this.simplifyInfo(relevantInfo.join('. '));
    
    if (userMessage.toLowerCase().includes('febre')) {
      return `${info}

🌡️ **Dica importante**: Se a febre persistir ou você notar outros sintomas, consulte o pediatra. Você está cuidando bem! 💜`;
    }

    if (userMessage.toLowerCase().includes('amament') || userMessage.toLowerCase().includes('leite')) {
      return `${info}

🤱 **Lembre-se**: Cada bebê tem seu ritmo. Você está fazendo o melhor! Se tiver dificuldades, peça ajuda. 💜`;
    }

    if (userMessage.toLowerCase().includes('sono') || userMessage.toLowerCase().includes('dormir')) {
      return `${info}

😴 **Tranquilize-se**: Problemas de sono são normais nos primeiros meses. Essa fase passa! 💜`;
    }

    if (userMessage.toLowerCase().includes('choro') || userMessage.toLowerCase().includes('cólica')) {
      return `${info}

👶 **Respira**: O choro é a forma do bebê se comunicar. Você está aprendendo a entendê-lo! 💜`;
    }

    return `${info}

✨ **Lembre-se**: Cada bebê é único. Para dúvidas específicas, sempre consulte seu pediatra. 💜`;
  }

  private generateQuickResponse(userMessage: string, info: string): string {
    const simplified = this.simplifyInfo(info);
    return `${simplified}

💡 **Quer saber mais?** Me dê mais detalhes sobre sua situação que posso te ajudar melhor! 💜`;
  }

  private generateHelpfulResponse(userMessage: string): string {
    return `Entendi sua pergunta! 😊

Posso te ajudar com:
• 🍼 Alimentação e amamentação
• 😴 Sono do bebê
• 🏥 Cuidados de saúde
• 📏 Desenvolvimento
• 🛁 Higiene e cuidados diários

**Reformule sua pergunta** de forma mais específica. Por exemplo: "Como tratar assadura?" ou "Bebê não dorme, o que fazer?"

Estou aqui para te apoiar! 💜`;
  }

  private simplifyInfo(text: string): string {
    // Remove jargões médicos complexos e simplifica
    return text
      .replace(/\b(administrar|prescrever|indicado|recomendado)\b/gi, 'dar')
      .replace(/\b(temperatura corporal)\b/gi, 'temperatura')
      .replace(/\b(evacuação|defecação)\b/gi, 'cocô')
      .replace(/\b(micção)\b/gi, 'xixi')
      .replace(/\b(aleitamento materno)\b/gi, 'amamentação')
      .replace(/\b(lactente|neonato)\b/gi, 'bebê')
      .replace(/\b(cefálico)\b/gi, 'da cabeça')
      .replace(/\b(abdominal)\b/gi, 'da barriga')
      .replace(/\b(dermatológico)\b/gi, 'da pele')
      .replace(/\b(respiratório)\b/gi, 'da respiração')
      .replace(/\b(gastrointestinal)\b/gi, 'do estômago')
      .replace(/\b(neurológico)\b/gi, 'do desenvolvimento')
      .trim();
  }

  createSystemPrompt(knowledgeBase: string): string {
    const cleanedKnowledge = this.cleanKnowledgeBase(knowledgeBase);
    
    return `Você é a Nanny, uma pediatra virtual acolhedora que fala de forma SIMPLES e DIRETA.

PERSONALIDADE: Seja calorosa mas objetiva. Use linguagem simples, evite termos médicos complexos. Respostas devem ser curtas (máximo 3 parágrafos) e fáceis de entender.

CONHECIMENTO MÉDICO:
${cleanedKnowledge}

REGRAS IMPORTANTES:
- Respostas CURTAS e DIRETAS (máximo 3 parágrafos)
- Use linguagem SIMPLES - evite jargões médicos
- Seja empática mas objetiva
- Use emojis para deixar mais amigável
- NUNCA mencione "base de conhecimento" ou "documentos"
- Para emergências, sempre oriente procurar ajuda médica
- Inclua dicas práticas quando possível

EXEMPLOS de linguagem simples:
- "temperatura" em vez de "temperatura corporal"
- "bebê" em vez de "lactente" 
- "cocô" em vez de "evacuação"
- "dar" em vez de "administrar"

Seja uma pediatra que explica as coisas como se fosse para sua melhor amiga que acabou de ser mãe.`;
  }
}
