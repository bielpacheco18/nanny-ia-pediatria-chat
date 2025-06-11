
import { TextCleaningUtils } from './textCleaningUtils';

export class InformationSearchUtils {
  static findRelevantInformation(knowledge: string, keywords: string[], originalMessage: string): string[] {
    const sentences = TextCleaningUtils.cleanAndSplitSentences(knowledge);
    const relevantSentences: string[] = [];

    // Buscar por palavras-chave, mas filtrar conteúdo problemático
    keywords.forEach(keyword => {
      const matchingSentences = sentences.filter(sentence => {
        const sentenceLower = sentence.toLowerCase();
        return sentenceLower.includes(keyword.toLowerCase()) && 
               TextCleaningUtils.isValidSentence(sentence) &&
               this.isMotherFriendly(sentence);
      });
      relevantSentences.push(...matchingSentences);
    });

    // Busca por palavras da mensagem se não encontrou nada
    if (relevantSentences.length === 0) {
      const messageWords = originalMessage.toLowerCase().split(/\s+/).filter(word => word.length > 3);
      messageWords.forEach(word => {
        const matchingSentences = sentences.filter(sentence => {
          return sentence.toLowerCase().includes(word) && 
                 TextCleaningUtils.isValidSentence(sentence) &&
                 this.isMotherFriendly(sentence);
        });
        relevantSentences.push(...matchingSentences);
      });
    }

    return [...new Set(relevantSentences)].slice(0, 2);
  }

  static isMotherFriendly(sentence: string): boolean {
    // Rejeita completamente textos com termos muito técnicos ou problemáticos
    const problematicTerms = /\b(encefalo|bilir|mie.*linização|neurônios|gestacional|RN\s*<?\s*\d+\s*semanas|patológico|etiológico|fisiopatológico)\b/i;
    const brokenText = /\d+,\d+\s+Em\s+especial|devido\s+à\s+provável|induzida\s+pela/i;
    
    if (problematicTerms.test(sentence) || brokenText.test(sentence)) {
      return false;
    }

    // Prefere informações práticas e úteis para mães
    const motherlyTopics = /\b(bebê|criança|mama|leite|sono|choro|fralda|banho|alimentação|cuidado|desenvolvimento|crescimento|vacina|médico|pediatra|temperatura|febre)\b/i;
    return motherlyTopics.test(sentence);
  }

  static findBroadInformation(knowledge: string, message: string): string {
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

  static findTopicInfo(knowledge: string, terms: string[]): string {
    const sentences = knowledge.split(/[.!?]+/)
      .filter(sentence => sentence.trim().length > 15)
      .filter(sentence => TextCleaningUtils.isValidSentence(sentence))
      .filter(sentence => this.isMotherFriendly(sentence));
      
    const topicSentences = sentences.filter(sentence => {
      const sentenceLower = sentence.toLowerCase();
      return terms.some(term => sentenceLower.includes(term));
    });

    return topicSentences.slice(0, 2).join('. ').trim();
  }
}
