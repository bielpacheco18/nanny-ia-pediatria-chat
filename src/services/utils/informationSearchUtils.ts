
import { TextCleaningUtils } from './textCleaningUtils';

export class InformationSearchUtils {
  static findRelevantInformation(knowledge: string, keywords: string[], originalMessage: string): string[] {
    const sentences = TextCleaningUtils.cleanAndSplitSentences(knowledge);
    const relevantSentences: string[] = [];

    // Buscar por palavras-chave
    keywords.forEach(keyword => {
      const matchingSentences = sentences.filter(sentence => {
        const sentenceLower = sentence.toLowerCase();
        return sentenceLower.includes(keyword.toLowerCase()) && TextCleaningUtils.isValidSentence(sentence);
      });
      relevantSentences.push(...matchingSentences);
    });

    // Busca por palavras da mensagem se não encontrou nada
    if (relevantSentences.length === 0) {
      const messageWords = originalMessage.toLowerCase().split(/\s+/).filter(word => word.length > 3);
      messageWords.forEach(word => {
        const matchingSentences = sentences.filter(sentence => {
          return sentence.toLowerCase().includes(word) && TextCleaningUtils.isValidSentence(sentence);
        });
        relevantSentences.push(...matchingSentences);
      });
    }

    return [...new Set(relevantSentences)].slice(0, 2);
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
      .filter(sentence => TextCleaningUtils.isValidSentence(sentence));
      
    const topicSentences = sentences.filter(sentence => {
      const sentenceLower = sentence.toLowerCase();
      return terms.some(term => sentenceLower.includes(term));
    });

    return topicSentences.slice(0, 2).join('. ').trim();
  }
}
