
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { Plus, Trash2, MessageCircle, History } from "lucide-react";
import { Conversation, ChatHistoryService } from "@/services/chatHistoryService";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ChatHistoryProps {
  conversations: Conversation[];
  currentConversationId?: string;
  onSelectConversation: (conversation: Conversation) => void;
  onNewConversation: () => void;
  onDeleteConversation: (conversationId: string) => void;
  onClearHistory: () => void;
}

const ChatHistory = ({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  onClearHistory
}: ChatHistoryProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <div className="h-full flex flex-col bg-gray-50 border-r border-nanny-200">
      <div className="p-4 border-b border-nanny-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <History className="h-5 w-5 text-nanny-600" />
            <h3 className="font-semibold text-nanny-700">Conversas</h3>
          </div>
          <Button
            onClick={onNewConversation}
            size="sm"
            className="chat-gradient text-white"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        {conversations.length > 0 && (
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Limpar Histórico
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Limpar Histórico</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir todas as conversas? Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    onClearHistory();
                    setIsDeleteDialogOpen(false);
                  }}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Excluir Tudo
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {conversations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">Nenhuma conversa ainda</p>
              <p className="text-xs">Comece uma nova conversa!</p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-3 mb-2 rounded-lg cursor-pointer transition-colors hover:bg-white/50 ${
                  currentConversationId === conversation.id
                    ? 'bg-nanny-100 border border-nanny-300'
                    : 'bg-white border border-gray-200'
                }`}
                onClick={() => onSelectConversation(conversation)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {conversation.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {conversation.messages.length} mensagens
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDistanceToNow(conversation.updatedAt, { 
                        addSuffix: true,
                        locale: ptBR 
                      })}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConversation(conversation.id);
                    }}
                    className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatHistory;
