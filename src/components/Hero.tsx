
import { Button } from "@/components/ui/button";
import { MessageCircle, Shield, Heart, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const Hero = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <section className="py-12 md:py-20 nanny-gradient">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <img 
            src="/lovable-uploads/67174e24-3d9f-42fb-a19f-849b4dd158ac.png" 
            alt="Nanny IA" 
            className="h-16 w-16 md:h-24 md:w-24 mx-auto mb-6 md:mb-8"
          />
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-nanny-800 mb-4 md:mb-6">
            Nanny IA
          </h1>
          
          <p className="text-lg md:text-xl lg:text-2xl text-nanny-700 mb-6 md:mb-8 font-medium">
            Sua pediatra virtual especializada
          </p>
          
          <p className="text-base md:text-lg text-nanny-600 mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
            Um chatbot inteligente que oferece orientações pediátricas baseadas em conhecimento científico. 
            Acolhedora, empática e sempre pronta para ajudar você a cuidar do seu bebê com segurança e carinho.
          </p>
          
          <div className="flex flex-col gap-4 justify-center mb-12 md:mb-16 px-4">
            <Button
              size={isMobile ? "default" : "lg"}
              onClick={() => navigate('/chat')}
              className="chat-gradient text-white px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all w-full sm:w-auto"
            >
              <MessageCircle className="mr-2 h-4 w-4 md:h-5 md:w-5" />
              Conversar com a Nanny
            </Button>
            
            <Button
              size={isMobile ? "default" : "lg"}
              variant="outline"
              onClick={() => navigate('/upload')}
              className="border-nanny-300 text-nanny-700 hover:bg-nanny-50 px-6 md:px-8 py-3 md:py-4 text-base md:text-lg w-full sm:w-auto"
            >
              <BookOpen className="mr-2 h-4 w-4 md:h-5 md:w-5" />
              Base de Conhecimento
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto px-4">
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 md:p-6 border border-nanny-200">
              <div className="bg-nanny-100 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Heart className="h-5 w-5 md:h-6 md:w-6 text-nanny-600" />
              </div>
              <h3 className="text-base md:text-lg font-semibold text-nanny-800 mb-2">Acolhedora</h3>
              <p className="text-sm md:text-base text-nanny-600">
                Trata você como uma mãe consciente e oferece apoio emocional em momentos difíceis.
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 md:p-6 border border-nanny-200">
              <div className="bg-nanny-100 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Shield className="h-5 w-5 md:h-6 md:w-6 text-nanny-600" />
              </div>
              <h3 className="text-base md:text-lg font-semibold text-nanny-800 mb-2">Segura</h3>
              <p className="text-sm md:text-base text-nanny-600">
                Baseada em conhecimento científico atualizado e sempre indica quando procurar ajuda médica.
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 md:p-6 border border-nanny-200">
              <div className="bg-nanny-100 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <BookOpen className="h-5 w-5 md:h-6 md:w-6 text-nanny-600" />
              </div>
              <h3 className="text-base md:text-lg font-semibold text-nanny-800 mb-2">Atualizada</h3>
              <p className="text-sm md:text-base text-nanny-600">
                Conhecimento baseado em artigos científicos e práticas modernas da pediatria.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
