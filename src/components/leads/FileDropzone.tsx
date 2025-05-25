
import React, { useRef } from 'react';
import { Upload, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { parseCSVText } from './utils/csvProcessor';

interface FileDropzoneProps {
  file: File | null;
  onFileChange: (file: File | null, previewData: string[][]) => void;
  error: string | null;
}

const FileDropzone: React.FC<FileDropzoneProps> = ({ file, onFileChange, error }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
        onFileChange(null, []);
        return;
      }
      
      // Preview do CSV
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const rows = parseCSVText(text);
        onFileChange(selectedFile, rows.slice(0, 5)); // Mostrar apenas as primeiras 5 linhas
      };
      reader.readAsText(selectedFile);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
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
    </div>
  );
};

export default FileDropzone;
