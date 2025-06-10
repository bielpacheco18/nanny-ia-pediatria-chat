
import { Button } from "@/components/ui/button";
import { MessageCircle, Shield, Heart, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 nanny-gradient">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <img 
            src="/lovable-uploads/67174e24-3d9f-42fb-a19f-849b4dd158ac.png" 
            alt="Nanny IA" 
            className="h-24 w-24 mx-auto mb-8"
          />
          
          <h1 className="text-5xl md:text-6xl font-bold text-nanny-800 mb-6">
            Nanny IA
          </h1>
          
          <p className="text-xl md:text-2xl text-nanny-700 mb-8 font-medium">
            Sua pediatra virtual especializada
          </p>
          
          <p className="text-lg text-nanny-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Um chatbot inteligente que oferece orientações pediátricas baseadas em conhecimento científico. 
            Acolhedora, empática e sempre pronta para ajudar você a cuidar do seu bebê com segurança e carinho.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              size="lg"
              onClick={() => navigate('/chat')}
              className="chat-gradient text-white px-8 py-4 text-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Conversar com a Nanny
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/upload')}
              className="border-nanny-300 text-nanny-700 hover:bg-nanny-50 px-8 py-4 text-lg"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Base de Conhecimento
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-nanny-200">
              <div className="bg-nanny-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-6 w-6 text-nanny-600" />
              </div>
              <h3 className="text-lg font-semibold text-nanny-800 mb-2">Acolhedora</h3>
              <p className="text-nanny-600">
                Trata você como uma mãe consciente e oferece apoio emocional em momentos difíceis.
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-nanny-200">
              <div className="bg-nanny-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-nanny-600" />
              </div>
              <h3 className="text-lg font-semibold text-nanny-800 mb-2">Segura</h3>
              <p className="text-nanny-600">
                Baseada em conhecimento científico atualizado e sempre indica quando procurar ajuda médica.
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-nanny-200">
              <div className="bg-nanny-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-6 w-6 text-nanny-600" />
              </div>
              <h3 className="text-lg font-semibold text-nanny-800 mb-2">Atualizada</h3>
              <p className="text-nanny-600">
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
