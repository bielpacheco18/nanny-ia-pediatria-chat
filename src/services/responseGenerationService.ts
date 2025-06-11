
import { TextCleaningUtils } from './utils/textCleaningUtils';
import { KeywordExtractionUtils } from './utils/keywordExtractionUtils';
import { InformationSearchUtils } from './utils/informationSearchUtils';
import { ResponseFormattingUtils } from './utils/responseFormattingUtils';

export class ResponseGenerationService {
  generateKnowledgeBasedResponse(userMessage: string, knowledgeBase: string): string {
    const lowerMessage = userMessage.toLowerCase();
    console.log('Generating knowledge-based response...');
    
    if (!knowledgeBase || knowledgeBase.trim().length === 0) {
      return 'Ainda não temos materiais na base de conhecimento. Adicione alguns documentos na seção "Base de Conhecimento" para que eu possa te ajudar melhor!';
    }

    const cleanedKnowledge = TextCleaningUtils.cleanKnowledgeBase(knowledgeBase);
    const keywords = KeywordExtractionUtils.extractKeywords(lowerMessage);
    const relevantInfo = InformationSearchUtils.findRelevantInformation(cleanedKnowledge, keywords, lowerMessage);
    
    if (KeywordExtractionUtils.isGreeting(lowerMessage)) {
      return ResponseFormattingUtils.generateGreetingResponse();
    }
    
    if (relevantInfo.length > 0) {
      const hasValidInfo = relevantInfo.some(info => {
        const cleaned = TextCleaningUtils.simplifyText(info);
        return cleaned && cleaned.length > 15 && !ResponseFormattingUtils.hasProblematicContent(cleaned);
      });
      
      if (hasValidInfo) {
        return ResponseFormattingUtils.generateClearResponse(userMessage, relevantInfo);
      }
    }
    
    const broadInfo = InformationSearchUtils.findBroadInformation(cleanedKnowledge, lowerMessage);
    if (broadInfo && broadInfo.length > 30 && !ResponseFormattingUtils.hasProblematicContent(broadInfo)) {
      return ResponseFormattingUtils.generateQuickResponse(userMessage, broadInfo);
    }
    
    return ResponseFormattingUtils.generateSupportiveResponse(userMessage);
  }

  createSystemPrompt(knowledgeBase: string): string {
    const cleanedKnowledge = TextCleaningUtils.cleanKnowledgeBase(knowledgeBase);
    
    return `Você é um assistente especializado em pediatria. Forneça informações claras e objetivas baseadas no conhecimento médico disponível.

CONHECIMENTO MÉDICO:
${cleanedKnowledge}

REGRAS DE RESPOSTA:
- Seja claro e objetivo
- Use linguagem simples
- Para emergências, oriente buscar ajuda médica
- Inclua informações práticas
- NUNCA mencione "base de conhecimento"
- Use termos simples (bebê ao invés de lactente)
- Máximo 3 parágrafos

Responda de forma direta e útil às perguntas sobre cuidados pediátricos.`;
  }
}
