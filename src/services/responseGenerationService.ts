
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
      return this.generateClearResponse(userMessage, relevantInfo);
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
      // Remove textos quebrados e mal formatados mais agressivamente
      .replace(/\d+\s+de\s+crianças\s+ao\s+ano,?\s*estima-se\s+que\s+entre\s+\d*\.?\d*%?\.?/gi, '')
      .replace(/Os\s+níveis\s+mé\s*-?\s*dios\s+estimados\s+.*?(?=\.|$)/gi, '')
      .replace(/(\d+)º\s+dia/g, '$1° dia')
      .replace(/\d+%?\s+de\s+crianças?\s+.*?(?=\.|$)/gi, '')
      .replace(/com\s+redução\s+para\s+\d+%\s+de\s+crianças?\s+.*?(?=\.|$)/gi, '')
      .replace(/se\s+mantiveram\s+no\s+\d+º\s+dia.*?(?=\.|$)/gi, '')
      .replace(/níveis?\s+.*?estimados?\s+.*?(?=\.|$)/gi, '')
      // Remove linhas muito curtas ou fragmentadas
      .replace(/^\s*\d+\s*\.?\s*$/gm, '')
      .replace(/^\s*[A-Za-z]{1,3}\s*\.?\s*$/gm, '')
      // Remove espaços múltiplos
      .replace(/\s+/g, ' ')
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
    const sentences = this.cleanAndSplitSentences(knowledge);
    const relevantSentences: string[] = [];

    // Buscar por palavras-chave
    keywords.forEach(keyword => {
      const matchingSentences = sentences.filter(sentence => {
        const sentenceLower = sentence.toLowerCase();
        return sentenceLower.includes(keyword.toLowerCase()) && this.isValidSentence(sentence);
      });
      relevantSentences.push(...matchingSentences);
    });

    // Busca por palavras da mensagem se não encontrou nada
    if (relevantSentences.length === 0) {
      const messageWords = originalMessage.toLowerCase().split(/\s+/).filter(word => word.length > 3);
      messageWords.forEach(word => {
        const matchingSentences = sentences.filter(sentence => {
          return sentence.toLowerCase().includes(word) && this.isValidSentence(sentence);
        });
        relevantSentences.push(...matchingSentences);
      });
    }

    return [...new Set(relevantSentences)].slice(0, 2);
  }

  private cleanAndSplitSentences(text: string): string[] {
    return text
      .split(/[.!?]+/)
      .map(sentence => sentence.trim())
      .filter(sentence => this.isValidSentence(sentence));
  }

  private isValidSentence(sentence: string): boolean {
    // Verifica se a frase é válida e útil
    return sentence.length > 20 && 
           sentence.length < 200 &&
           !sentence.includes('...') &&
           !sentence.match(/\d+\s*%?\s+de\s+crianças?/i) &&
           !sentence.match(/níveis?\s+.*?estimados?/i) &&
           !sentence.match(/\d+º\s+dia.*?com\s+redução/i) &&
           !sentence.match(/estima-se\s+que\s+entre/i) &&
           !sentence.includes('mé -') &&
           !sentence.includes('000 de') &&
           this.hasValidStructure(sentence);
  }

  private hasValidStructure(sentence: string): boolean {
    // Verifica se a frase tem estrutura válida
    const hasVerb = /\b(é|são|pode|deve|tem|têm|faz|fazem|está|estão|fica|ficam|acontece|ocorre|recomenda|indica|ajuda|causa|evita)\b/i.test(sentence);
    const hasUsefulInfo = /\b(bebê|criança|mês|meses|ano|anos|dia|dias|idade|peso|altura|temperatura|febre|sono|alimentação|leite|mama|fralda|cuidado|tratamento|sintoma)\b/i.test(sentence);
    
    return hasVerb || hasUsefulInfo;
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
    const sentences = knowledge.split(/[.!?]+/)
      .filter(sentence => sentence.trim().length > 15)
      .filter(sentence => this.isValidSentence(sentence));
      
    const topicSentences = sentences.filter(sentence => {
      const sentenceLower = sentence.toLowerCase();
      return terms.some(term => sentenceLower.includes(term));
    });

    return topicSentences.slice(0, 2).join('. ').trim();
  }

  private generateClearResponse(userMessage: string, relevantInfo: string[]): string {
    const cleanInfo = this.formatInformation(relevantInfo);
    
    // Se não há informação útil após limpeza, usar resposta genérica
    if (!cleanInfo || cleanInfo.length < 20) {
      return this.generateHelpfulResponse(userMessage);
    }
    
    if (userMessage.toLowerCase().includes('febre')) {
      return `${cleanInfo}

🌡️ **Importante**: Se a febre não baixar ou surgir outros sintomas, procure o pediatra imediatamente. 💜`;
    }

    if (userMessage.toLowerCase().includes('amament') || userMessage.toLowerCase().includes('leite')) {
      return `${cleanInfo}

🤱 **Lembre-se**: Cada bebê tem seu ritmo. Tenha paciência! 💜`;
    }

    if (userMessage.toLowerCase().includes('sono') || userMessage.toLowerCase().includes('dormir')) {
      return `${cleanInfo}

😴 **Tranquilize-se**: Problemas de sono são normais nos primeiros meses. 💜`;
    }

    if (userMessage.toLowerCase().includes('choro') || userMessage.toLowerCase().includes('cólica')) {
      return `${cleanInfo}

👶 **Calma**: O choro é normal - é como o bebê se comunica! 💜`;
    }

    return `${cleanInfo}

✨ **Dica**: Para dúvidas específicas, sempre consulte seu pediatra. 💜`;
  }

  private formatInformation(info: string[]): string {
    const formatted = info
      .map(text => this.simplifyText(text))
      .filter(text => text && text.length > 10)
      .join('. ')
      .replace(/\s+/g, ' ')
      .replace(/\.\s*\./g, '.')
      .trim();
      
    return formatted;
  }

  private simplifyText(text: string): string {
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
      // Remove estatísticas confusas
      .replace(/\d+\s*%?\s+de\s+crianças?\s+.*?(?=\.|$)/gi, '')
      .replace(/níveis?\s+.*?estimados?\s+.*?(?=\.|$)/gi, '')
      .replace(/\d+º\s+dia.*?(?=\.|$)/gi, '')
      .replace(/com\s+redução.*?(?=\.|$)/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private generateQuickResponse(userMessage: string, info: string): string {
    const simplified = this.simplifyText(info);
    
    if (!simplified || simplified.length < 20) {
      return this.generateHelpfulResponse(userMessage);
    }
    
    return `${simplified}

💡 **Quer mais detalhes?** Me conte mais sobre sua situação específica! 💜`;
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
- IGNORE estatísticas confusas ou incompletas
- NUNCA use informações truncadas ou mal formatadas

EXEMPLOS de linguagem simples:
- "temperatura" em vez de "temperatura corporal"
- "bebê" em vez de "lactente" 
- "cocô" em vez de "evacuação"
- "dar" em vez de "administrar"

Seja uma pediatra que explica as coisas como se fosse para sua melhor amiga que acabou de ser mãe.`;
  }
}
