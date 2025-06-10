
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload, FileText, Trash2, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UploadedFile {
  id: string;
  title: string;
  file_name: string;
  file_size: number | null;
  upload_date: string;
  status: 'pending' | 'processed' | 'error';
}

const UploadSection = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Carregar arquivos do Supabase
  useEffect(() => {
    loadFilesFromSupabase();
  }, []);

  const loadFilesFromSupabase = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('knowledge_base')
        .select('id, title, file_name, file_size, upload_date, status')
        .order('upload_date', { ascending: false });

      if (error) {
        console.error('Error loading files:', error);
        toast({
          title: "Erro ao carregar arquivos",
          description: "Não foi possível carregar os arquivos da base de conhecimento.",
          variant: "destructive",
        });
      } else {
        // Properly type the status field when mapping from Supabase
        const typedFiles: UploadedFile[] = (data || []).map(file => ({
          ...file,
          status: file.status as 'pending' | 'processed' | 'error'
        }));
        setUploadedFiles(typedFiles);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes || bytes === 0) return 'Tamanho não disponível';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const simulateTextExtraction = (fileName: string): string => {
    return `Conteúdo extraído do arquivo ${fileName}:
    
    Informações sobre pediatria extraídas do documento:
    - Desenvolvimento infantil: Marcos importantes do crescimento e desenvolvimento motor, cognitivo e social.
    - Cuidados com recém-nascidos: Orientações essenciais para os primeiros dias de vida.
    - Alimentação: Diretrizes sobre amamentação e introdução alimentar.
    - Vacinação: Importância do calendário vacinal para proteção infantil.
    - Sinais de alerta: Quando procurar ajuda médica urgente.
    - Sono infantil: Padrões de sono saudáveis por faixa etária.
    - Prevenção de acidentes: Medidas de segurança para cada fase do desenvolvimento.
    - Cólicas e desconfortos: Manejo de situações comuns nos primeiros meses.
    
    Este é um conteúdo simulado baseado no nome do arquivo. Em produção, seria extraído o texto real do PDF.`;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      if (file.type !== 'application/pdf') {
        toast({
          title: "Formato não suportado",
          description: "Por favor, envie apenas arquivos PDF.",
          variant: "destructive",
        });
        continue;
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "Arquivo muito grande",
          description: "O arquivo deve ter no máximo 10MB.",
          variant: "destructive",
        });
        continue;
      }

      try {
        // Simular extração de texto do PDF
        const extractedContent = simulateTextExtraction(file.name);
        
        // Inserir no Supabase
        const { data, error } = await supabase
          .from('knowledge_base')
          .insert({
            title: file.name.replace('.pdf', ''),
            file_name: file.name,
            file_path: '/uploads/' + file.name, // Caminho simulado
            file_size: file.size,
            content: extractedContent,
            status: 'processed'
          })
          .select()
          .single();

        if (error) {
          console.error('Error inserting file:', error);
          toast({
            title: "Erro ao salvar PDF",
            description: `Não foi possível salvar ${file.name} na base de conhecimento.`,
            variant: "destructive",
          });
        } else {
          toast({
            title: "PDF processado com sucesso!",
            description: `${file.name} foi adicionado à base de conhecimento da Nanny.`,
          });
          
          // Recarregar lista de arquivos
          loadFilesFromSupabase();
        }
      } catch (error) {
        console.error('Error processing file:', error);
        toast({
          title: "Erro ao processar PDF",
          description: `Não foi possível processar ${file.name}.`,
          variant: "destructive",
        });
      }
    }

    // Limpar input
    event.target.value = '';
  };

  const handleDeleteFile = async (fileId: string) => {
    try {
      const { error } = await supabase
        .from('knowledge_base')
        .delete()
        .eq('id', fileId);

      if (error) {
        console.error('Error deleting file:', error);
        toast({
          title: "Erro ao remover arquivo",
          description: "Não foi possível remover o arquivo.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Arquivo removido",
          description: "O arquivo foi removido da base de conhecimento.",
        });
        
        // Recarregar lista de arquivos
        loadFilesFromSupabase();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-nanny-800 mb-4">
            Base de Conhecimento
          </h2>
          <p className="text-lg text-nanny-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-nanny-800 mb-4">
          Base de Conhecimento
        </h2>
        <p className="text-lg text-nanny-600">
          Adicione PDFs com conteúdo pediátrico para enriquecer o conhecimento da Nanny
        </p>
      </div>

      <Card className="p-8 border-dashed border-2 border-nanny-300 bg-nanny-50/50">
        <div className="text-center">
          <Upload className="h-12 w-12 text-nanny-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-nanny-700 mb-2">
            Upload de Documentos PDF
          </h3>
          <p className="text-nanny-600 mb-6">
            Arraste e solte ou clique para selecionar arquivos PDF
          </p>
          
          <Input
            type="file"
            accept=".pdf"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            id="pdf-upload"
          />
          
          <Button
            asChild
            className="chat-gradient text-white hover:shadow-lg"
          >
            <label htmlFor="pdf-upload" className="cursor-pointer">
              <Upload className="mr-2 h-4 w-4" />
              Selecionar PDFs
            </label>
          </Button>
          
          <p className="text-xs text-nanny-500 mt-4">
            Apenas arquivos PDF são aceitos. Máximo 10MB por arquivo.
          </p>
        </div>
      </Card>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-nanny-800">
          Arquivos na Base de Conhecimento ({uploadedFiles.length})
        </h3>
        
        {uploadedFiles.length === 0 ? (
          <Card className="p-8 text-center">
            <FileText className="h-12 w-12 text-nanny-300 mx-auto mb-4" />
            <p className="text-nanny-500">
              Nenhum arquivo carregado ainda. Adicione PDFs para começar!
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {uploadedFiles.map((file) => (
              <Card key={file.id} className="p-4 border-nanny-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      file.status === 'processed' ? 'bg-green-100' : 
                      file.status === 'pending' ? 'bg-nanny-100' : 'bg-red-100'
                    }`}>
                      {file.status === 'processed' ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : file.status === 'pending' ? (
                        <Upload className="h-5 w-5 text-nanny-600 animate-pulse" />
                      ) : (
                        <FileText className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900">{file.title}</h4>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(file.file_size)} • {new Date(file.upload_date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      file.status === 'processed' ? 'bg-green-100 text-green-800' :
                      file.status === 'pending' ? 'bg-nanny-100 text-nanny-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {file.status === 'processed' ? 'Processado' :
                       file.status === 'pending' ? 'Processando...' : 'Erro'}
                    </span>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteFile(file.id)}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadSection;
