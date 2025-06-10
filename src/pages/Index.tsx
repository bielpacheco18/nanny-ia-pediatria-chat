
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Brain, Stethoscope, Clock, Users, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      
      {/* Seção de Características */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-nanny-800 mb-4">
              Por que escolher a Nanny IA?
            </h2>
            <p className="text-xl text-nanny-600 max-w-3xl mx-auto">
              Uma assistente virtual especializada que combina conhecimento científico 
              com o carinho e empatia que toda mãe merece.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 border-nanny-200 hover:shadow-lg transition-shadow">
              <div className="bg-nanny-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-nanny-600" />
              </div>
              <h3 className="text-lg font-semibold text-nanny-800 mb-2">
                Inteligência Artificial Avançada
              </h3>
              <p className="text-nanny-600">
                Powered by OpenAI (ChatGPT) para respostas inteligentes e contextualizadas.
              </p>
            </Card>

            <Card className="p-6 border-nanny-200 hover:shadow-lg transition-shadow">
              <div className="bg-nanny-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Stethoscope className="h-6 w-6 text-nanny-600" />
              </div>
              <h3 className="text-lg font-semibold text-nanny-800 mb-2">
                Especialização Pediátrica
              </h3>
              <p className="text-nanny-600">
                Focada exclusivamente em pediatria, com 50 anos de experiência simulada.
              </p>
            </Card>

            <Card className="p-6 border-nanny-200 hover:shadow-lg transition-shadow">
              <div className="bg-nanny-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-nanny-600" />
              </div>
              <h3 className="text-lg font-semibold text-nanny-800 mb-2">
                Disponível 24/7
              </h3>
              <p className="text-nanny-600">
                Acesso sem autenticação, funcionando como visitante a qualquer momento.
              </p>
            </Card>

            <Card className="p-6 border-nanny-200 hover:shadow-lg transition-shadow">
              <div className="bg-nanny-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-nanny-600" />
              </div>
              <h3 className="text-lg font-semibold text-nanny-800 mb-2">
                Personalidade Acolhedora
              </h3>
              <p className="text-nanny-600">
                Trata você como mulher adulta e consciente, oferecendo suporte emocional.
              </p>
            </Card>

            <Card className="p-6 border-nanny-200 hover:shadow-lg transition-shadow">
              <div className="bg-nanny-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-nanny-600" />
              </div>
              <h3 className="text-lg font-semibold text-nanny-800 mb-2">
                Base Científica
              </h3>
              <p className="text-nanny-600">
                Conhecimento baseado em PDFs e artigos científicos atualizados.
              </p>
            </Card>

            <Card className="p-6 border-nanny-200 hover:shadow-lg transition-shadow">
              <div className="bg-nanny-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="h-6 w-6 text-nanny-600" />
              </div>
              <h3 className="text-lg font-semibold text-nanny-800 mb-2">
                Comunicação Natural
              </h3>
              <p className="text-nanny-600">
                Conversação fluida e empática, adaptada ao seu perfil e necessidades.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 nanny-gradient">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-nanny-800 mb-4">
            Pronta para conversar com a Nanny?
          </h2>
          <p className="text-xl text-nanny-600 mb-8 max-w-2xl mx-auto">
            Comece agora mesmo! Faça suas perguntas sobre pediatria e receba 
            orientações acolhedoras e baseadas em ciência.
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/chat')}
            className="chat-gradient text-white px-8 py-4 text-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Iniciar Conversa
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-nanny-200 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <img 
              src="/lovable-uploads/67174e24-3d9f-42fb-a19f-849b4dd158ac.png" 
              alt="Nanny IA" 
              className="h-8 w-8"
            />
            <span className="text-lg font-semibold text-nanny-700">Nanny IA</span>
          </div>
          <p className="text-nanny-600 mb-4">
            Sua pediatra virtual especializada • Sempre com carinho e base científica
          </p>
          <p className="text-sm text-nanny-500">
            ⚠️ Lembre-se: A Nanny IA é um apoio educativo. Em emergências, procure sempre um médico.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
