
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload, FileText, Trash2, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  uploadDate: Date;
  status: 'uploading' | 'processed' | 'error';
}

const UploadSection = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([
    {
      id: '1',
      name: 'Manual_Pediatria_Basica.pdf',
      size: 2560000,
      uploadDate: new Date(),
      status: 'processed'
    },
    {
      id: '2',
      name: 'Guia_Amamentacao.pdf',
      size: 1840000,
      uploadDate: new Date(Date.now() - 86400000),
      status: 'processed'
    }
  ]);
  const { toast } = useToast();

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.type !== 'application/pdf') {
        toast({
          title: "Formato não suportado",
          description: "Por favor, envie apenas arquivos PDF.",
          variant: "destructive",
        });
        return;
      }

      const newFile: UploadedFile = {
        id: Date.now().toString() + Math.random(),
        name: file.name,
        size: file.size,
        uploadDate: new Date(),
        status: 'uploading'
      };

      setUploadedFiles(prev => [...prev, newFile]);

      // Simular processamento
      setTimeout(() => {
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === newFile.id 
              ? { ...f, status: 'processed' }
              : f
          )
        );
        
        toast({
          title: "PDF processado com sucesso!",
          description: `${file.name} foi adicionado à base de conhecimento da Nanny.`,
        });
      }, 2000 + Math.random() * 3000);
    });

    // Limpar input
    event.target.value = '';
  };

  const handleDeleteFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    toast({
      title: "Arquivo removido",
      description: "O arquivo foi removido da base de conhecimento.",
    });
  };

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
                      file.status === 'uploading' ? 'bg-nanny-100' : 'bg-red-100'
                    }`}>
                      {file.status === 'processed' ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : file.status === 'uploading' ? (
                        <Upload className="h-5 w-5 text-nanny-600 animate-pulse" />
                      ) : (
                        <FileText className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900">{file.name}</h4>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(file.size)} • {file.uploadDate.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      file.status === 'processed' ? 'bg-green-100 text-green-800' :
                      file.status === 'uploading' ? 'bg-nanny-100 text-nanny-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {file.status === 'processed' ? 'Processado' :
                       file.status === 'uploading' ? 'Processando...' : 'Erro'}
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
