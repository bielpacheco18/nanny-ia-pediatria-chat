
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateNannyResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Respostas baseadas na persona da Nanny
    if (lowerMessage.includes('febre')) {
      return 'Febre é um sinal de que o corpo está reagindo. Antes de medicar, observe: o bebê está ativo? Está mamando bem? Vamos juntas entender o contexto. Para bebês menores de 3 meses, é importante procurar orientação médica rapidamente. Você pode me contar mais sobre o estado geral do seu bebê?';
    }
    
    if (lowerMessage.includes('choro') || lowerMessage.includes('chorando')) {
      return 'Respira comigo. Isso não é frescura, nem fraqueza. É sobrecarga. A gente vai aliviar isso passo a passo, tá bem? O choro é a forma do bebê se comunicar. Vamos identificar juntas as possíveis causas: fome, sono, fralda, cólica ou necessidade de colo. O que você já tentou?';
    }
    
    if (lowerMessage.includes('sono') || lowerMessage.includes('dormir')) {
      return 'O sono do bebê pode ser desafiador mesmo. É importante lembrar que cada bebê tem seu ritmo. Vamos criar uma rotina suave e acolhedora. Você gostaria de algumas dicas práticas para estabelecer uma rotina de sono saudável?';
    }
    
    if (lowerMessage.includes('amamentação') || lowerMessage.includes('amamentar')) {
      return 'A amamentação é um momento especial, mas pode trazer dúvidas. É normal! Cada dupla mãe-bebê encontra seu próprio ritmo. Conte-me: qual sua principal preocupação sobre a amamentação? Estou aqui para te apoiar nessa jornada.';
    }
    
    if (lowerMessage.includes('cólica')) {
      return 'Cólicas são muito comuns nos primeiros meses e, embora angustiantes, geralmente são passageiras. Algumas técnicas podem ajudar: massagem na barriguinha, compressa morna, posição canguru. O mais importante é manter a calma - seu bebê sente sua energia. Quer que eu explique algumas técnicas de alívio?';
    }
    
    if (lowerMessage.includes('obrigad') || lowerMessage.includes('obrigat')) {
      return 'De nada! Fico feliz em poder ajudar você e seu bebê. Lembre-se: você está fazendo um trabalho incrível como mãe. Estou sempre aqui quando precisar de orientação ou apoio. 💜';
    }
    
    // Resposta padrão acolhedora
    return 'Entendo sua preocupação e estou aqui para te ajudar. Cada situação é única e merece atenção especial. Pode me contar mais detalhes sobre o que está acontecendo? Assim posso te orientar melhor, sempre lembrando que sou um apoio, mas em caso de dúvidas sérias, é importante consultar seu pediatra.';
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

    // Simular delay da IA
    setTimeout(() => {
      const response = generateNannyResponse(inputMessage);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000 + Math.random() * 2000); // 1-3 segundos de delay
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
                    {message.timestamp.toLocaleTimeString()}
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
                  <span className="text-sm text-gray-500">Nanny está pensando...</span>
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
          Lembre-se: Em caso de emergência, procure sempre um médico. A Nanny é um apoio educativo.
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
