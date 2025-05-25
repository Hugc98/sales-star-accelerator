
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { processCSVData } from './utils/csvProcessor';
import FileDropzone from './FileDropzone';
import CSVPreviewTable from './CSVPreviewTable';
import ImportProgress from './ImportProgress';

interface LeadImportProps {
  onComplete: (count: number) => void;
  onCancel: () => void;
}

const LeadImport: React.FC<LeadImportProps> = ({ onComplete, onCancel }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<string[][]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (selectedFile: File | null, preview: string[][]) => {
    if (!selectedFile) {
      setError('Por favor, selecione um arquivo CSV válido.');
      setFile(null);
      setPreviewData([]);
      return;
    }
    
    setFile(selectedFile);
    setError(null);
    setPreviewData(preview);
  };

  const handleImport = async () => {
    if (!file) {
      setError('Nenhum arquivo selecionado.');
      return;
    }

    try {
      setUploading(true);
      setProgress(0);
      setError(null);
      
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        try {
          const text = event.target?.result as string;
          const importedCount = await processCSVData(text, setProgress);
          
          setIsSuccess(true);
          toast({
            title: "Importação concluída",
            description: `${importedCount} leads foram importados com sucesso!`,
            variant: "default",
          });
          
          // Allow the success state to be visible briefly before closing
          setTimeout(() => {
            setUploading(false);
            onComplete(importedCount);
          }, 1500);
          
        } catch (error: any) {
          setUploading(false);
          setError(error.message || 'Erro ao importar leads. Verifique o formato do arquivo.');
        }
      };
      
      reader.onerror = () => {
        setUploading(false);
        setError('Erro ao ler o arquivo. Por favor, tente novamente.');
      };
      
      reader.readAsText(file);
    } catch (error: any) {
      setUploading(false);
      setError(error.message || 'Erro desconhecido durante a importação.');
    }
  };

  return (
    <div className="space-y-6">
      <FileDropzone 
        file={file}
        onFileChange={handleFileChange}
        error={error}
      />

      <ImportProgress 
        uploading={uploading}
        progress={progress}
        isSuccess={isSuccess}
      />

      <CSVPreviewTable previewData={previewData} />

      <div className="flex justify-end gap-2 pt-4 border-t mt-6">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel} 
          disabled={uploading}
        >
          Cancelar
        </Button>
        
        {file && !uploading && !isSuccess && (
          <Button 
            onClick={handleImport} 
            className="flex gap-2"
            size="lg"
          >
            <Upload className="h-4 w-4" />
            Importar Leads Agora
          </Button>
        )}
        
        {uploading && (
          <Button disabled className="flex gap-2">
            Importando...
          </Button>
        )}
        
        {isSuccess && (
          <Button variant="outline" onClick={() => onComplete(0)} className="flex gap-2">
            <CheckCircle className="h-4 w-4" />
            Fechar
          </Button>
        )}
      </div>
    </div>
  );
};

export default LeadImport;
