
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
        setError('Por favor, selecione um arquivo CSV válido.');
        setFile(null);
        return;
      }
      
      setFile(selectedFile);
      setError(null);
      
      // Preview do CSV
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const rows = text.split('\n').map(row => row.split(','));
        setPreviewData(rows.slice(0, 5)); // Mostrar apenas as primeiras 5 linhas
      };
      reader.readAsText(selectedFile);
    }
  };

  const processCSVData = async (text: string): Promise<number> => {
    try {
      // Parse CSV
      const rows = text.split('\n');
      const headers = rows[0].split(',');
      
      // Map headers to lead fields
      const nameIndex = headers.findIndex(h => 
        h.toLowerCase().includes('nome') || h.toLowerCase().includes('name'));
      const emailIndex = headers.findIndex(h => 
        h.toLowerCase().includes('email'));
      const phoneIndex = headers.findIndex(h => 
        h.toLowerCase().includes('tel') || h.toLowerCase().includes('phone'));
      
      if (nameIndex === -1) {
        throw new Error('O arquivo CSV deve conter uma coluna de nome (nome ou name)');
      }

      // Process data rows
      const leads = [];
      for (let i = 1; i < rows.length; i++) {
        // Skip empty rows
        if (!rows[i].trim()) continue;
        
        const values = rows[i].split(',');
        
        // Basic validation
        const name = values[nameIndex]?.trim();
        if (!name) continue; // Skip if no name
        
        const lead = {
          name,
          email: emailIndex >= 0 ? values[emailIndex]?.trim() || null : null,
          phone: phoneIndex >= 0 ? values[phoneIndex]?.trim() || null : null,
          status: 'novo'
        };
        
        leads.push(lead);
      }
      
      // Import in batches to show realistic progress
      const batchSize = 10;
      const batches = Math.ceil(leads.length / batchSize);
      
      for (let i = 0; i < batches; i++) {
        const batch = leads.slice(i * batchSize, (i + 1) * batchSize);
        
        // Insert batch into database
        const { error } = await supabase.from('leads').insert(batch);
        
        if (error) throw error;
        
        // Update progress
        setProgress(Math.floor(((i + 1) / batches) * 100));
        
        // Brief pause to show progress (can be removed in production)
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      return leads.length;
    } catch (error) {
      console.error('Erro ao processar CSV:', error);
      throw error;
    }
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
          const importedCount = await processCSVData(text);
          
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

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      <div 
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${file ? 'border-primary/50 bg-primary/5' : 'border-gray-300 hover:border-primary/30 hover:bg-gray-50'}`}
        onClick={triggerFileSelect}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".csv"
        />
        <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
        {file ? (
          <>
            <p className="font-medium text-lg">{file.name}</p>
            <p className="text-sm text-muted-foreground">
              {(file.size / 1024).toFixed(2)} KB
            </p>
          </>
        ) : (
          <>
            <p className="font-medium text-lg">Clique para selecionar um arquivo CSV</p>
            <p className="text-sm text-muted-foreground">
              ou arraste e solte o arquivo aqui
            </p>
          </>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isSuccess && (
        <Alert variant="default" className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">Importação concluída com sucesso!</AlertDescription>
        </Alert>
      )}

      {file && previewData.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium">Prévia dos dados:</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border rounded">
              <thead className="bg-muted">
                <tr>
                  {previewData[0].map((header, i) => (
                    <th key={i} className="px-4 py-2 text-left text-sm font-medium">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewData.slice(1).map((row, i) => (
                  <tr key={i} className="border-t">
                    {row.map((cell, j) => (
                      <td key={j} className="px-4 py-2 text-sm">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Mostrando apenas as primeiras linhas. O arquivo completo será processado durante a importação.
          </p>
        </div>
      )}

      {uploading && (
        <div className="space-y-2">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-center">{progress}% - Processando leads...</p>
        </div>
      )}

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
