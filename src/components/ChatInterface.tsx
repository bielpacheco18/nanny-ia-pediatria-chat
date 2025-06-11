
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Send, Bot, User, Loader2, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { OpenAIService, ChatMessage } from "@/services/openaiService";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>([]);
  const [apiKey, setApiKey] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const openaiService = new OpenAIService();

  // Load API key from localStorage on component mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('openai_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      openaiService.setApiKey(savedApiKey);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira uma chave de API válida.",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem('openai_api_key', apiKey);
    openaiService.setApiKey(apiKey);
    setIsDialogOpen(false);
    
    toast({
      title: "Chave de API salva",
      description: "Sua chave OpenAI foi salva com sucesso!",
    });
  };

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
      <div className="flex justify-end p-2">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Configurar API Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Configurar Chave OpenAI</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Insira sua chave de API da OpenAI para usar o chat com IA real. 
                A chave será salva localmente no seu navegador.
              </p>
              <Input
                type="password"
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full"
              />
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveApiKey}>
                  Salvar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex justify-center items-center h-full">
            <div className="text-center text-gray-500">
              <Bot className="h-12 w-12 mx-auto mb-4 text-nanny-400" />
              <h3 className="text-lg font-medium mb-2">Olá! Eu sou a Nanny 💜</h3>
              <p className="text-sm">Sua pediatra virtual está pronta para ajudar com qualquer dúvida sobre seu bebê.</p>
              <p className="text-xs mt-2">Digite sua primeira pergunta para começarmos!</p>
            </div>
          </div>
        )}

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
