
export class TextCleaningUtils {
  static cleanKnowledgeBase(knowledgeBase: string): string {
    return knowledgeBase
      .replace(/Título:.*?\n\n/g, '')
      .replace(/Conteúdo:\n/g, '')
      .replace(/---\n\n/g, '\n')
      .replace(/Conteúdo extraído do arquivo.*?:\s*/g, '')
      .replace(/Este é um conteúdo simulado.*?\./g, '')
      .replace(/Em produção.*?\./g, '')
      // Remove textos médicos técnicos complexos
      .replace(/\b(encefalo\s*-?\s*patia|bilir\s*-?\s*rubina|mie\s*-?\s*linização|neurônios|gestacional)\b.*?(?=\.|$)/gi, '')
      .replace(/\bRN\s*<?\s*\d+\s*semanas.*?(?=\.|$)/gi, '')
      .replace(/\d+,\d+\s+Em\s+especial.*?(?=\.|$)/gi, '')
      .replace(/devido\s+à\s+provável.*?(?=\.|$)/gi, '')
      .replace(/induzida\s+pela.*?(?=\.|$)/gi, '')
      .replace(/dos\s+outros\s+fatores\s+que\s+contribuem.*?(?=\.|$)/gi, '')
      // Remove textos quebrados e mal formatados mais agressivamente
      .replace(/\d+\s+de\s+crianças\s+ao\s+ano,?\s*estima-se\s+que\s+entre\s+\d*\.?\d*%?\.?/gi, '')
      .replace(/Os\s+níveis\s+mé\s*-?\s*dios\s+estimados\s+.*?(?=\.|$)/gi, '')
      .replace(/(\d+)º\s+dia/g, '$1° dia')
      .replace(/\d+%?\s+de\s+crianças?\s+.*?(?=\.|$)/gi, '')
      .replace(/com\s+redução\s+para\s+\d+%\s+de\s+crianças?\s+.*?(?=\.|$)/gi, '')
      .replace(/se\s+mantiveram\s+no\s+\d+º\s+dia.*?(?=\.|$)/gi, '')
      .replace(/níveis?\s+.*?estimados?\s+.*?(?=\.|$)/gi, '')
      // Remove qualquer texto com termos muito técnicos
      .replace(/\b(patológico|etiológico|fisiopatológico|diagnóstico diferencial|prognóstico)\b.*?(?=\.|$)/gi, '')
      .replace(/\b(prevalência|incidência|morbimortalidade|epidemiológico)\b.*?(?=\.|$)/gi, '')
      // Remove linhas muito curtas ou fragmentadas
      .replace(/^\s*\d+\s*\.?\s*$/gm, '')
      .replace(/^\s*[A-Za-z]{1,3}\s*\.?\s*$/gm, '')
      // Remove espaços múltiplos
      .replace(/\s+/g, ' ')
      .trim();
  }

  static cleanAndSplitSentences(text: string): string[] {
    return text
      .split(/[.!?]+/)
      .map(sentence => sentence.trim())
      .filter(sentence => this.isValidSentence(sentence));
  }

  static isValidSentence(sentence: string): boolean {
    // Rejeita frases com termos muito técnicos
    const technicalTerms = /\b(encefalo|bilir|mie.*linização|neurônios|gestacional|patológico|etiológico|fisiopatológico|prevalência|incidência|morbimortalidade)\b/i;
    
    if (technicalTerms.test(sentence)) {
      return false;
    }

    // Verifica se a frase é válida e útil para mães
    return sentence.length > 20 && 
           sentence.length < 200 &&
           !sentence.includes('...') &&
           !sentence.match(/\d+\s*%?\s+de\s+crianças?/i) &&
           !sentence.match(/níveis?\s+.*?estimados?/i) &&
           !sentence.match(/\d+º\s+dia.*?com\s+redução/i) &&
           !sentence.match(/estima-se\s+que\s+entre/i) &&
           !sentence.includes('mé -') &&
           !sentence.includes('000 de') &&
           !sentence.match(/RN\s*<?\s*\d+\s*semanas/i) &&
           this.hasValidStructure(sentence) &&
           this.isUsefulForMothers(sentence);
  }

  static hasValidStructure(sentence: string): boolean {
    // Verifica se a frase tem estrutura válida
    const hasVerb = /\b(é|são|pode|deve|tem|têm|faz|fazem|está|estão|fica|ficam|acontece|ocorre|recomenda|indica|ajuda|causa|evita)\b/i.test(sentence);
    const hasUsefulInfo = /\b(bebê|criança|mês|meses|ano|anos|dia|dias|idade|peso|altura|temperatura|febre|sono|alimentação|leite|mama|fralda|cuidado|tratamento|sintoma)\b/i.test(sentence);
    
    return hasVerb || hasUsefulInfo;
  }

  static isUsefulForMothers(sentence: string): boolean {
    // Verifica se a informação é útil para mães
    const motherlyTerms = /\b(bebê|criança|filho|filha|mama|leite|sono|choro|fralda|banho|alimentação|cuidado|desenvolvimento|crescimento|peso|altura|vacina|médico|pediatra)\b/i;
    const practicalTerms = /\b(como|quando|onde|por que|deve|pode|recomenda|evita|ajuda|normal|cuidado)\b/i;
    
    return motherlyTerms.test(sentence) || practicalTerms.test(sentence);
  }

  static simplifyText(text: string): string {
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
      // Remove completamente textos técnicos problemáticos
      .replace(/\b(encefalo\s*-?\s*patia|bilir\s*-?\s*rubina|mie\s*-?\s*linização).*?(?=\.|$)/gi, '')
      .replace(/\bRN\s*<?\s*\d+\s*semanas.*?(?=\.|$)/gi, '')
      .replace(/devido\s+à\s+provável.*?(?=\.|$)/gi, '')
      // Remove estatísticas confusas
      .replace(/\d+\s*%?\s+de\s+crianças?\s+.*?(?=\.|$)/gi, '')
      .replace(/níveis?\s+.*?estimados?\s+.*?(?=\.|$)/gi, '')
      .replace(/\d+º\s+dia.*?(?=\.|$)/gi, '')
      .replace(/com\s+redução.*?(?=\.|$)/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
}
