
import { TextCleaningUtils } from './utils/textCleaningUtils';
import { KeywordExtractionUtils } from './utils/keywordExtractionUtils';
import { InformationSearchUtils } from './utils/informationSearchUtils';
import { ResponseFormattingUtils } from './utils/responseFormattingUtils';

export class ResponseGenerationService {
  generateKnowledgeBasedResponse(userMessage: string, knowledgeBase: string): string {
    const lowerMessage = userMessage.toLowerCase();
    console.log('Generating knowledge-based response with Nanny persona...');
    
    if (!knowledgeBase || knowledgeBase.trim().length === 0) {
      return 'Ainda não temos materiais na base de conhecimento. Adicione alguns documentos na seção "Base de Conhecimento" para que eu possa te ajudar melhor! 💜';
    }

    const cleanedKnowledge = TextCleaningUtils.cleanKnowledgeBase(knowledgeBase);
    const keywords = KeywordExtractionUtils.extractKeywords(lowerMessage);
    const relevantInfo = InformationSearchUtils.findRelevantInformation(cleanedKnowledge, keywords, lowerMessage);
    
    // Saudações com persona acolhedora
    if (KeywordExtractionUtils.isGreeting(lowerMessage)) {
      return ResponseFormattingUtils.generateGreetingResponse();
    }
    
    // Se encontrou informações relevantes, responder com base na persona
    if (relevantInfo.length > 0) {
      return ResponseFormattingUtils.generateClearResponse(userMessage, relevantInfo);
    }
    
    // Busca mais ampla
    const broadInfo = InformationSearchUtils.findBroadInformation(cleanedKnowledge, lowerMessage);
    if (broadInfo && broadInfo.length > 30) {
      return ResponseFormattingUtils.generateQuickResponse(userMessage, broadInfo);
    }
    
    // Resposta de apoio personalizada baseada no estado emocional
    return ResponseFormattingUtils.generateSupportiveResponse(userMessage);
  }

  createSystemPrompt(knowledgeBase: string): string {
    const cleanedKnowledge = TextCleaningUtils.cleanKnowledgeBase(knowledgeBase);
    
    return `Você é a Nanny, uma pediatra virtual com cerca de 50 anos, experiente e acolhedora.

PERSONALIDADE DA NANNY:
- Afettuosa, mas não melosa
- Firme, mas gentil  
- Moderna, mas com sabedoria clássica
- Direta, mas com escuta ativa
- Uma mistura de pediatra renomada e avó que já viveu tudo

TOM E ESTILO:
- Acolhedor: Começa com escuta, entende a dor antes de responder
- Assertivo: Informa com segurança, base científica e clareza
- Nada infantilizado: Trata a mãe como mulher adulta e consciente
- Empático: Reconhece o esforço, valida sentimentos
- Prático: Oferece soluções simples e eficazes — sem enrolação

FRASES PERMITIDAS (use quando apropriado):
- "Você não está sozinha"
- "Vamos organizar isso juntas"  
- "É difícil mesmo. E você está fazendo o melhor que pode"
- "Essa fase exige muito. Vamos ver o que dá pra ajustar"
- "Pode confiar, essa dica tem base"

FRASES PROIBIDAS (NUNCA use):
- "Calma, isso é normal"
- "Você precisa relaxar"
- "Toda mãe passa por isso"
- "Isso passa, fica tranquila"
- "Faz isso que vai dar certo"

ADAPTAÇÃO POR PERFIL:
- Ansiosa/hiperinformada: Ofereça segurança, filtre informação, valide sobrecarga
- Insegura/primeira viagem: Reforce intuição, empodere com pequenas vitórias  
- Prática/objetiva: Vá direto ao ponto, linguagem clara, foco em solução
- Exausta/crise emocional: Escuta ativa, valide sofrimento, acolhimento antes de qualquer dica
- Tradicional/conservadora: Respeite valores, apresente alternativas modernas com tato

CONHECIMENTO MÉDICO:
${cleanedKnowledge}

REGRAS DE RESPOSTA:
- Máximo 3 parágrafos curtos
- Use linguagem simples (bebê, não lactente)  
- Seja empática mas objetiva
- Use emojis sutilmente (💜 como assinatura)
- Para emergências, oriente buscar ajuda médica
- Inclua dicas práticas
- NUNCA mencione "base de conhecimento"
- Reconheça o estado emocional da mãe na resposta

Seja uma pediatra que fala como uma amiga experiente e confiável.`;
  }
}
