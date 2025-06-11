
import { TextCleaningUtils } from './utils/textCleaningUtils';
import { KeywordExtractionUtils } from './utils/keywordExtractionUtils';
import { InformationSearchUtils } from './utils/informationSearchUtils';
import { ResponseFormattingUtils } from './utils/responseFormattingUtils';

export class ResponseGenerationService {
  generateKnowledgeBasedResponse(userMessage: string, knowledgeBase: string): string {
    const lowerMessage = userMessage.toLowerCase();
    console.log('Generating knowledge-based response...');
    console.log('Knowledge base content length:', knowledgeBase?.length || 0);
    console.log('User message:', userMessage);
    
    if (!knowledgeBase || knowledgeBase.trim().length === 0) {
      return 'Ainda não temos materiais na base de conhecimento. Adicione alguns documentos na seção "Base de Conhecimento" para que eu possa te ajudar! 💜';
    }

    const cleanedKnowledge = TextCleaningUtils.cleanKnowledgeBase(knowledgeBase);
    const keywords = KeywordExtractionUtils.extractKeywords(lowerMessage);
    const relevantInfo = InformationSearchUtils.findRelevantInformation(cleanedKnowledge, keywords, lowerMessage);
    
    // Saudações simples
    if (KeywordExtractionUtils.isGreeting(lowerMessage)) {
      return `Oi! 👋 Como posso te ajudar com seu bebê hoje? 

Pode me perguntar sobre alimentação, sono, cuidados ou qualquer dúvida! 💜`;
    }
    
    // Se encontrou informações relevantes
    if (relevantInfo.length > 0) {
      return ResponseFormattingUtils.generateClearResponse(userMessage, relevantInfo);
    }
    
    // Busca mais ampla
    const broadInfo = InformationSearchUtils.findBroadInformation(cleanedKnowledge, lowerMessage);
    if (broadInfo && broadInfo.length > 30) {
      return ResponseFormattingUtils.generateQuickResponse(userMessage, broadInfo);
    }
    
    // Resposta de apoio
    return ResponseFormattingUtils.generateHelpfulResponse(userMessage);
  }

  createSystemPrompt(knowledgeBase: string): string {
    const cleanedKnowledge = TextCleaningUtils.cleanKnowledgeBase(knowledgeBase);
    
    return `Você é a Nanny, uma pediatra virtual acolhedora que fala de forma SIMPLES e DIRETA.

PERSONALIDADE: Seja calorosa mas objetiva. Use linguagem simples, evite termos médicos complexos. Respostas devem ser curtas (máximo 3 parágrafos) e fáceis de entender.

CONHECIMENTO MÉDICO:
${cleanedKnowledge}

REGRAS IMPORTANTES:
- Respostas CURTAS e DIRETAS (máximo 3 parágrafos)
- Use linguagem SIMPLES - evite jargões médicos
- Seja empática mas objetiva
- Use emojis para deixar mais amigável
- NUNCA mencione "base de conhecimento" ou "documentos"
- Para emergências, sempre oriente procurar ajuda médica
- Inclua dicas práticas quando possível
- IGNORE estatísticas confusas ou incompletas
- NUNCA use informações truncadas ou mal formatadas

EXEMPLOS de linguagem simples:
- "temperatura" em vez de "temperatura corporal"
- "bebê" em vez de "lactente" 
- "cocô" em vez de "evacuação"
- "dar" em vez de "administrar"

Seja uma pediatra que explica as coisas como se fosse para sua melhor amiga que acabou de ser mãe.`;
  }
}
