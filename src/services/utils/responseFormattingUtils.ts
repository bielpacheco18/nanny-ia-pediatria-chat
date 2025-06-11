
import { TextCleaningUtils } from './textCleaningUtils';

export class ResponseFormattingUtils {
  static generateClearResponse(userMessage: string, relevantInfo: string[]): string {
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

  static formatInformation(info: string[]): string {
    const formatted = info
      .map(text => TextCleaningUtils.simplifyText(text))
      .filter(text => text && text.length > 10)
      .join('. ')
      .replace(/\s+/g, ' ')
      .replace(/\.\s*\./g, '.')
      .trim();
      
    return formatted;
  }

  static generateQuickResponse(userMessage: string, info: string): string {
    const simplified = TextCleaningUtils.simplifyText(info);
    
    if (!simplified || simplified.length < 20) {
      return this.generateHelpfulResponse(userMessage);
    }
    
    return `${simplified}

💡 **Quer mais detalhes?** Me conte mais sobre sua situação específica! 💜`;
  }

  static generateHelpfulResponse(userMessage: string): string {
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
}
