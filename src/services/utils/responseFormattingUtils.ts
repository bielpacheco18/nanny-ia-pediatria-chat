
import { TextCleaningUtils } from './textCleaningUtils';

export class ResponseFormattingUtils {
  static generateClearResponse(userMessage: string, relevantInfo: string[]): string {
    const cleanInfo = this.formatInformation(relevantInfo);
    
    // Se não há informação útil após limpeza, usar resposta acolhedora
    if (!cleanInfo || cleanInfo.length < 20) {
      return this.generateSupportiveResponse(userMessage);
    }
    
    // Personalizar resposta baseada no conteúdo da mensagem
    if (userMessage.toLowerCase().includes('febre')) {
      return `${cleanInfo}

🌡️ **Vamos entender o contexto**: O bebê está ativo? Está mamando bem? Observar o comportamento geral é tão importante quanto a temperatura.

💜 Se a febre persistir ou surgir outros sintomas, procure orientação médica.`;
    }

    if (userMessage.toLowerCase().includes('amament') || userMessage.toLowerCase().includes('leite')) {
      return `${cleanInfo}

🤱 **É difícil mesmo**: Você está fazendo o melhor que pode. Cada bebê tem seu ritmo e cada mãe também.

💜 Pode confiar, essa dica tem base científica e vai dar pra ajustar.`;
    }

    if (userMessage.toLowerCase().includes('sono') || userMessage.toLowerCase().includes('dormir')) {
      return `${cleanInfo}

😴 **Vamos organizar isso juntas**: Essa fase exige muito. Você está fazendo o melhor que pode.

💜 Todo bebê aprende a dormir no seu tempo. Vamos ver o que dá pra ajustar.`;
    }

    if (userMessage.toLowerCase().includes('choro') || userMessage.toLowerCase().includes('cólica')) {
      return `${cleanInfo}

👶 **Respira comigo**: Isso não é frescura, nem fraqueza. É sobrecarga e é normal sentir isso.

💜 A gente vai aliviar isso passo a passo, tá bem?`;
    }

    if (userMessage.toLowerCase().includes('culpa') || userMessage.toLowerCase().includes('ansio') || userMessage.toLowerCase().includes('preocup')) {
      return `${cleanInfo}

💙 **Você não está sozinha**: É difícil mesmo. Você está fazendo o melhor que pode.

💜 Pode confiar, essa dica tem base e vai te ajudar a se sentir mais segura.`;
    }

    return `${cleanInfo}

✨ **Pode confiar**: Essa dica tem base científica. Vamos ver o que dá pra ajustar na sua rotina.

💜 Estou aqui pra te apoiar nessa jornada.`;
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
      return this.generateSupportiveResponse(userMessage);
    }
    
    return `${simplified}

💡 **Vamos organizar isso juntas**: Me conte mais detalhes da sua situação para eu te ajudar melhor.

💜 Cada bebê é único, então vamos encontrar o que funciona para vocês.`;
  }

  static generateSupportiveResponse(userMessage: string): string {
    // Identificar o perfil da mãe pela mensagem para personalizar
    const isAnxious = /ansio|preocup|medo|insegur/i.test(userMessage);
    const isExhausted = /cansad|exaust|não aguento|dormir/i.test(userMessage);
    const isFirstTime = /primeira|primeiro|não sei|como/i.test(userMessage);
    
    if (isAnxious) {
      return `Entendo sua preocupação 💙

**Você não está sozinha** - é normal sentir isso. Vou te ajudar com informações seguras sobre:
• 🍼 Alimentação e amamentação  
• 😴 Sono do bebê
• 🏥 Sinais de alerta e cuidados
• 📏 Desenvolvimento normal
• 🛁 Cuidados diários

**É difícil mesmo**, mas você está fazendo o melhor que pode. Me conte mais sobre sua situação específica que vou te orientar passo a passo.

💜 Respira comigo - a gente vai aliviar essa ansiedade juntas.`;
    }
    
    if (isExhausted) {
      return `Entendo que você está exausta 😔

**Essa fase exige muito** mesmo. Posso te ajudar com:
• 😴 Estratégias para melhorar o sono
• 🍼 Rotinas de alimentação
• 👶 Entender o choro do bebê
• 🤱 Cuidados práticos e simples
• 💪 Sinais de que está tudo bem

**Vamos organizar isso juntas** - me fale mais sobre o que está mais difícil agora.

💜 Você está fazendo gigante, mesmo nos dias que parece pouco.`;
    }
    
    if (isFirstTime) {
      return `Primeira vez é assim mesmo 😊

**É normal não saber** - toda mãe passou por isso. Vou te orientar sobre:
• 🍼 Como saber se o bebê está bem alimentado
• 😴 Sono seguro e rotinas
• 🏥 Quando se preocupar (e quando não)  
• 📏 Marcos do desenvolvimento
• 🛁 Cuidados básicos do dia a dia

**Vamos ver o que dá pra ajustar** - me conte sua dúvida específica.

💜 Pode confiar, você vai pegar o jeito. Toda mãe aprende no dia a dia.`;
    }

    return `Oi! Como posso te ajudar hoje? 💙

Estou aqui para te orientar sobre:
• 🍼 Alimentação e amamentação
• 😴 Sono e rotinas  
• 🏥 Cuidados de saúde
• 📏 Desenvolvimento do bebê
• 🛁 Higiene e cuidados diários

**Me conte mais detalhes** da sua situação para eu te ajudar de forma mais específica.

💜 Você está fazendo o melhor que pode - vamos juntas nessa jornada.`;
  }

  static generateGreetingResponse(): string {
    return `Oi! 👋 Como posso te ajudar com seu bebê hoje?

**Você não está sozinha** - estou aqui pra te apoiar com orientações seguras sobre qualquer dúvida de maternidade.

💜 Me conte o que está acontecendo que eu te oriento passo a passo.`;
  }
}
