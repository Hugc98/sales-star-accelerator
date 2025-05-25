
import React from 'react';
import { CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

interface ImportProgressProps {
  uploading: boolean;
  progress: number;
  isSuccess: boolean;
}

const ImportProgress: React.FC<ImportProgressProps> = ({ uploading, progress, isSuccess }) => {
  if (isSuccess) {
    return (
      <Alert variant="default" className="bg-green-50 border-green-200">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          Importação concluída com sucesso!
        </AlertDescription>
      </Alert>
    );
  }

  if (uploading) {
    return (
      <div className="space-y-2">
        <Progress value={progress} className="w-full" />
        <p className="text-sm text-center">{progress}% - Processando leads...</p>
      </div>
    );
  }

  return null;
};

export default ImportProgress;
