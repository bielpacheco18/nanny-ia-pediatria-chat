
export class ResponseGenerationService {
  generateKnowledgeBasedResponse(userMessage: string, knowledgeBase: string): string {
    const lowerMessage = userMessage.toLowerCase();
    console.log('Generating knowledge-based response...');
    console.log('Knowledge base content length:', knowledgeBase?.length || 0);
    console.log('User message:', userMessage);
    
    // Buscar por palavras-chave na base de conhecimento
    const knowledgeWords = knowledgeBase.toLowerCase();
    
    // Extrair palavras-chave da pergunta do usuário
    const keywords = lowerMessage.split(' ').filter(word => word.length > 3);
    console.log('Keywords found:', keywords);
    
    // Verificar se alguma palavra-chave está presente na base de conhecimento
    const relevantInfo = keywords.some(keyword => knowledgeWords.includes(keyword));
    console.log('Relevant info found in knowledge base:', relevantInfo);
    
    if (relevantInfo) {
      // Tentar encontrar seções relevantes da base de conhecimento
      const sentences = knowledgeBase.split(/[.!?]+/).filter(sentence => sentence.trim().length > 20);
      const relevantSentences = sentences.filter(sentence => {
        const sentenceLower = sentence.toLowerCase();
        return keywords.some(keyword => sentenceLower.includes(keyword));
      });
      
      console.log('Relevant sentences found:', relevantSentences.length);
      
      if (relevantSentences.length > 0) {
        // Usar as informações relevantes para construir uma resposta natural
        const info = relevantSentences.slice(0, 3).join('. ').trim();
        return `${info}. Lembre-se que cada criança é única e pode ter variações. Se tiver dúvidas específicas sobre seu pequeno, sempre consulte seu pediatra de confiança. Você está fazendo um ótimo trabalho! 💜`;
      }
    }
    
    // Respostas específicas baseadas no conhecimento disponível
    if (lowerMessage.includes('febre')) {
      const feverInfo = knowledgeBase.toLowerCase().includes('febre') ? 
        knowledgeBase.split(/[.!?]+/).filter(s => s.toLowerCase().includes('febre')).slice(0, 2).join('. ') : '';
      if (feverInfo) {
        return `${feverInfo}. Respira comigo - você está cuidando bem do seu bebê. Para orientações específicas sobre o seu caso, consulte seu pediatra.`;
      }
    }
    
    if (lowerMessage.includes('amament') || lowerMessage.includes('leite')) {
      const breastfeedingInfo = knowledgeBase.toLowerCase().includes('amament') ? 
        knowledgeBase.split(/[.!?]+/).filter(s => s.toLowerCase().includes('amament')).slice(0, 2).join('. ') : '';
      if (breastfeedingInfo) {
        return `${breastfeedingInfo}. Isso não é frescura - você está fazendo o melhor para seu pequeno! 💜`;
      }
    }
    
    if (lowerMessage.includes('sono') || lowerMessage.includes('dormir')) {
      const sleepInfo = knowledgeBase.toLowerCase().includes('sono') ? 
        knowledgeBase.split(/[.!?]+/).filter(s => s.toLowerCase().includes('sono')).slice(0, 2).join('. ') : '';
      if (sleepInfo) {
        return `${sleepInfo}. Respira comigo - essa fase passa e vocês vão encontrar o equilíbrio. 💜`;
      }
    }
    
    // Resposta geral quando há base de conhecimento mas não é específica
    const generalInfo = knowledgeBase.split(/[.!?]+/).slice(0, 2).join('. ').trim();
    if (generalInfo) {
      return `${generalInfo}. Para te dar uma orientação mais precisa e personalizada para seu bebê, seria importante conversar sobre mais detalhes da situação. Cada criança é única e merece cuidado individualizado. Você está fazendo um trabalho incrível! 💜`;
    }
    
    // Se chegou até aqui, significa que não há informações relevantes
    return 'Não encontrei informações específicas sobre essa questão na minha base de conhecimento atual. Te encorajo a adicionar mais materiais pediátricos na seção "Base de Conhecimento" para que eu possa te ajudar melhor. Para questões urgentes, sempre consulte seu pediatra. Você está fazendo um ótimo trabalho! 💜';
  }

  createSystemPrompt(knowledgeBase: string): string {
    return `Você é a Nanny, uma pediatra virtual acolhedora e empática especializada em cuidados infantis. 

PERSONA: Você é calorosa, compreensiva e sempre valida os sentimentos dos pais. Use expressões como "Respira comigo", "Isso não é frescura", "Vamos juntas descobrir". Seja técnica quando necessário, mas sempre de forma acessível.

IMPORTANTE: Baseie suas respostas EXCLUSIVAMENTE nas informações médicas e pediátricas fornecidas abaixo. Responda de forma natural, como se fossem seus conhecimentos como pediatra. NUNCA mencione que está consultando documentos ou base de conhecimento.

BASE DE CONHECIMENTO MÉDICO:
${knowledgeBase}

INSTRUÇÕES IMPORTANTES:
- Responda APENAS com base nas informações médicas fornecidas acima
- NUNCA mencione "base de conhecimento", "documentos", "materiais", "PDFs" ou "com base no meu conhecimento médico"
- Responda de forma natural, como se fosse seu conhecimento médico próprio e experiência como pediatra
- Se a informação específica não estiver disponível no conteúdo médico fornecido, seja honesta e diga que precisa de mais detalhes para dar uma orientação específica
- Seja empática e acolhedora no tom
- Mantenha o foco em orientações pediátricas baseadas no conteúdo médico disponível
- Se for uma emergência, sempre oriente a procurar ajuda médica imediata
- Use o conteúdo médico fornecido para dar respostas específicas e detalhadas de forma natural

LEMBRETE: Você é um apoio educativo. Em casos sérios ou emergências, sempre oriente a buscar um pediatra presencialmente.`;
  }
}
