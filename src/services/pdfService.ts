
export interface ProcessedPDF {
  id: string;
  name: string;
  content: string;
  uploadDate: Date;
}

export class PDFService {
  private static instance: PDFService;
  private processedPDFs: ProcessedPDF[] = [];

  static getInstance(): PDFService {
    if (!PDFService.instance) {
      PDFService.instance = new PDFService();
    }
    return PDFService.instance;
  }

  async processPDF(file: File): Promise<ProcessedPDF> {
    // Simular extração de texto do PDF
    // Em produção, você usaria uma biblioteca como pdf-parse
    const content = `Conteúdo simulado do PDF ${file.name}:
    
    Informações sobre pediatria:
    - Febre em bebês: Temperaturas acima de 38°C em bebês menores de 3 meses requerem avaliação médica imediata.
    - Amamentação: O leite materno é o alimento ideal para bebês até os 6 meses de idade.
    - Sono infantil: Bebês recém-nascidos dormem entre 14-17 horas por dia em períodos de 2-4 horas.
    - Cólicas: Comum nos primeiros 3 meses, caracterizada por choro inconsolável por mais de 3 horas.
    - Desenvolvimento motor: Bebês começam a sustentar a cabeça aos 2-3 meses.
    - Vacinação: Seguir o calendário nacional de vacinação é fundamental para a saúde infantil.
    - Alimentação complementar: Introduzir alimentos sólidos a partir dos 6 meses.
    `;

    const processedPDF: ProcessedPDF = {
      id: Date.now().toString() + Math.random(),
      name: file.name,
      content: content,
      uploadDate: new Date()
    };

    this.processedPDFs.push(processedPDF);
    return processedPDF;
  }

  getAllProcessedPDFs(): ProcessedPDF[] {
    return this.processedPDFs;
  }

  getKnowledgeBase(): string {
    return this.processedPDFs
      .map(pdf => `Documento: ${pdf.name}\n${pdf.content}`)
      .join('\n\n---\n\n');
  }

  removePDF(id: string): void {
    this.processedPDFs = this.processedPDFs.filter(pdf => pdf.id !== id);
  }
}
