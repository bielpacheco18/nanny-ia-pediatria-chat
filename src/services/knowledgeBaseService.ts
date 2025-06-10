
import { supabase } from '@/integrations/supabase/client';
import type { KnowledgeBaseItem } from '@/types/chat';

export class KnowledgeBaseService {
  async getKnowledgeBase(): Promise<string> {
    try {
      console.log('Fetching knowledge base from Supabase...');
      const { data: knowledgeBase, error } = await supabase
        .from('knowledge_base')
        .select('title, content')
        .eq('status', 'processed');

      if (error) {
        console.error('Error fetching knowledge base:', error);
        return '';
      }

      console.log('Knowledge base data:', knowledgeBase);
      console.log('Number of documents found:', knowledgeBase?.length || 0);

      if (!knowledgeBase || knowledgeBase.length === 0) {
        console.log('No processed documents found in knowledge base');
        return '';
      }

      const combinedContent = knowledgeBase
        .filter(item => item.content && item.content.trim().length > 0)
        .map(item => `Título: ${item.title}\n\nConteúdo:\n${item.content}`)
        .join('\n\n---\n\n');

      console.log('Combined content length:', combinedContent.length);
      return combinedContent;
    } catch (error) {
      console.error('Error accessing Supabase:', error);
      return '';
    }
  }
}
