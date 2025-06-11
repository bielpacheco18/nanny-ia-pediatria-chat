
import { Button } from "@/components/ui/button";
import { MessageCircle, Upload, Home, Menu } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationItems = [
    { path: '/', icon: Home, label: 'Início' },
    { path: '/chat', icon: MessageCircle, label: 'Chat' },
    { path: '/upload', icon: Upload, label: 'Base de Conhecimento' }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-nanny-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div 
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <img 
            src="/lovable-uploads/67174e24-3d9f-42fb-a19f-849b4dd158ac.png" 
            alt="Nanny IA" 
            className="h-8 w-8 md:h-10 md:w-10"
          />
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-nanny-700">Nanny IA</h1>
            <p className="text-xs md:text-sm text-nanny-600">Sua pediatra virtual</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navigationItems.map((item) => (
            <Button
              key={item.path}
              variant={location.pathname === item.path ? 'default' : 'ghost'}
              onClick={() => navigate(item.path)}
              className="flex items-center space-x-2"
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Button>
          ))}
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="flex flex-col space-y-4 mt-8">
                <div className="flex items-center space-x-3 mb-6">
                  <img 
                    src="/lovable-uploads/67174e24-3d9f-42fb-a19f-849b4dd158ac.png" 
                    alt="Nanny IA" 
                    className="h-8 w-8"
                  />
                  <div>
                    <h2 className="text-lg font-bold text-nanny-700">Nanny IA</h2>
                    <p className="text-sm text-nanny-600">Menu</p>
                  </div>
                </div>
                
                {navigationItems.map((item) => (
                  <Button
                    key={item.path}
                    variant={location.pathname === item.path ? 'default' : 'ghost'}
                    onClick={() => handleNavigation(item.path)}
                    className="flex items-center justify-start space-x-3 w-full h-12"
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="text-base">{item.label}</span>
                  </Button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
