
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { OpenAIService, ChatMessage } from "@/services/openaiService";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Olá! Eu sou a Nanny, sua pediatra virtual. Como posso ajudar você e seu bebê hoje? 💜',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const openaiService = new OpenAIService();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Adicionar mensagem do usuário ao histórico da conversa
      const newHistory: ChatMessage[] = [
        ...conversationHistory,
        { role: 'user', content: inputMessage }
      ];

      // Gerar resposta baseada na base de conhecimento
      const response = await openaiService.generateResponse(inputMessage, newHistory);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        isUser: false,
        timestamp: new Date()
      };

      // Atualizar histórico da conversa
      setConversationHistory([
        ...newHistory,
        { role: 'assistant', content: response }
      ]);

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Erro ao gerar resposta:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente em alguns instantes.',
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Erro na conversa",
        description: "Não foi possível gerar uma resposta. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <Card className={`max-w-[80%] p-4 ${
              message.isUser 
                ? 'bg-nanny-500 text-white' 
                : 'bg-white border-nanny-200'
            }`}>
              <div className="flex items-start space-x-3">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.isUser 
                    ? 'bg-white/20' 
                    : 'bg-nanny-100'
                }`}>
                  {message.isUser ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4 text-nanny-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className={`text-sm ${
                    message.isUser ? 'text-white' : 'text-gray-700'
                  }`}>
                    {message.content}
                  </p>
                  <span className={`text-xs ${
                    message.isUser ? 'text-white/70' : 'text-gray-500'
                  } mt-1 block`}>
                    {message.timestamp.toLocaleTimeString('pt-BR')}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <Card className="max-w-[80%] p-4 bg-white border-nanny-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-nanny-100 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-nanny-600" />
                </div>
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin text-nanny-500" />
                  <span className="text-sm text-gray-500">Nanny está consultando a base de conhecimento...</span>
                </div>
              </div>
            </Card>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t border-nanny-200 p-4 bg-white">
        <div className="flex space-x-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua pergunta sobre pediatria..."
            className="flex-1 border-nanny-200 focus:border-nanny-500"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="chat-gradient text-white hover:shadow-lg"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Respostas baseadas na base de conhecimento carregada. Em caso de emergência, procure sempre um médico.
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
