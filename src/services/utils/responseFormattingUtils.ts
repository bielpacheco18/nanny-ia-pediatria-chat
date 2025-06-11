
import { TextCleaningUtils } from './textCleaningUtils';

export class ResponseFormattingUtils {
  static generateClearResponse(userMessage: string, relevantInfo: string[]): string {
    const cleanInfo = this.formatInformation(relevantInfo);
    
    if (!cleanInfo || cleanInfo.length < 20) {
      return 'Não encontrei informações específicas para sua pergunta na base de conhecimento.';
    }
    
    return cleanInfo;
  }

  static hasProblematicContent(text: string): boolean {
    const problematicTerms = /\b(encefalo|bilir|mie.*linização|neurônios|gestacional|patológico|etiológico|fisiopatológico|RN\s*<?\s*\d+\s*semanas)\b/i;
    const brokenText = /\d+,\d+\s+Em\s+especial|devido\s+à\s+provável|induzida\s+pela/i;
    
    return problematicTerms.test(text) || brokenText.test(text);
  }

  static formatInformation(info: string[]): string {
    const formatted = info
      .map(text => TextCleaningUtils.simplifyText(text))
      .filter(text => text && text.length > 10 && !this.hasProblematicContent(text))
      .join('. ')
      .replace(/\s+/g, ' ')
      .replace(/\.\s*\./g, '.')
      .trim();
      
    return formatted;
  }

  static generateQuickResponse(userMessage: string, info: string): string {
    const simplified = TextCleaningUtils.simplifyText(info);
    
    if (!simplified || simplified.length < 20) {
      return 'Não encontrei informações específicas para sua pergunta na base de conhecimento.';
    }
    
    return simplified;
  }

  static generateSupportiveResponse(userMessage: string): string {
    return 'Não encontrei informações específicas para sua pergunta na base de conhecimento.';
  }

  static generateGreetingResponse(): string {
    return 'Como posso ajudar?';
  }
}
