
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

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
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleImport = async () => {
    if (!file) {
      setError('Nenhum arquivo selecionado.');
      return;
    }

    setUploading(true);
    setProgress(0);

    // Simulação de upload e processamento
    const totalSteps = 10;
    for (let i = 0; i <= totalSteps; i++) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setProgress(Math.floor((i / totalSteps) * 100));
    }

    // Simular número de leads importados - em um caso real, isso viria da API
    const leadCount = Math.floor(Math.random() * 30) + 10;
    
    setUploading(false);
    onComplete(leadCount);
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

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={uploading}>
          Cancelar
        </Button>
        <Button 
          onClick={handleImport} 
          disabled={!file || uploading}
          className="flex gap-2"
        >
          {uploading ? "Importando..." : "Importar Leads"}
        </Button>
      </div>
    </div>
  );
};

export default LeadImport;
