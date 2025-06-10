
import { Button } from "@/components/ui/button";
import { MessageCircle, Upload, Home } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-nanny-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div 
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <img 
            src="/lovable-uploads/67174e24-3d9f-42fb-a19f-849b4dd158ac.png" 
            alt="Nanny IA" 
            className="h-10 w-10"
          />
          <div>
            <h1 className="text-2xl font-bold text-nanny-700">Nanny IA</h1>
            <p className="text-sm text-nanny-600">Sua pediatra virtual</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <Button
            variant={location.pathname === '/' ? 'default' : 'ghost'}
            onClick={() => navigate('/')}
            className="flex items-center space-x-2"
          >
            <Home className="h-4 w-4" />
            <span>Início</span>
          </Button>
          
          <Button
            variant={location.pathname === '/chat' ? 'default' : 'ghost'}
            onClick={() => navigate('/chat')}
            className="flex items-center space-x-2"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Chat</span>
          </Button>
          
          <Button
            variant={location.pathname === '/upload' ? 'default' : 'ghost'}
            onClick={() => navigate('/upload')}
            className="flex items-center space-x-2"
          >
            <Upload className="h-4 w-4" />
            <span>Base de Conhecimento</span>
          </Button>
        </nav>

        <div className="md:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/chat')}
            className="chat-gradient text-white"
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
