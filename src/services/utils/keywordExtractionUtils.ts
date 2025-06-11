
export class KeywordExtractionUtils {
  static extractKeywords(message: string): string[] {
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

    // Termos emocionais para adaptar o tom da resposta
    const emotionalTerms = [
      'ansio', 'preocup', 'medo', 'insegur', 'nervos',
      'cansad', 'exaust', 'não aguento', 'estress',
      'culpa', 'sozinha', 'difícil', 'ajuda',
      'primeira', 'não sei', 'como fazer', 'normal'
    ];

    const words = message.toLowerCase().split(/\s+/);
    const relevantWords = words.filter(word => {
      return word.length > 2 && (
        pediatricTerms.some(term => word.includes(term) || term.includes(word)) ||
        emotionalTerms.some(term => word.includes(term) || term.includes(word))
      );
    });

    return [...new Set([...relevantWords, ...words.filter(word => word.length > 4)])];
  }

  static isGreeting(message: string): boolean {
    const greetings = ['oi', 'olá', 'hello', 'hi', 'bom dia', 'boa tarde', 'boa noite'];
    return greetings.some(greeting => message.toLowerCase().includes(greeting)) || message.length < 10;
  }

  static detectEmotionalState(message: string): 'anxious' | 'exhausted' | 'firstTime' | 'overwhelmed' | 'normal' {
    const lowerMessage = message.toLowerCase();
    
    if (/ansio|preocup|medo|insegur|nervos/.test(lowerMessage)) {
      return 'anxious';
    }
    
    if (/cansad|exaust|não aguento|estress/.test(lowerMessage)) {
      return 'exhausted';
    }
    
    if (/primeira|primeiro|não sei|como/.test(lowerMessage)) {
      return 'firstTime';
    }
    
    if (/culpa|sozinha|difícil|ajuda/.test(lowerMessage)) {
      return 'overwhelmed';
    }
    
    return 'normal';
  }
}
