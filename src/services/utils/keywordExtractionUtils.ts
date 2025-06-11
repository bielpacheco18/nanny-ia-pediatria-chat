
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

    const words = message.toLowerCase().split(/\s+/);
    const relevantWords = words.filter(word => {
      return word.length > 2 && pediatricTerms.some(term => 
        word.includes(term) || term.includes(word)
      );
    });

    return [...new Set([...relevantWords, ...words.filter(word => word.length > 4)])];
  }

  static isGreeting(message: string): boolean {
    const greetings = ['oi', 'olá', 'hello', 'hi', 'bom dia', 'boa tarde', 'boa noite'];
    return greetings.some(greeting => message.includes(greeting)) || message.length < 10;
  }
}
