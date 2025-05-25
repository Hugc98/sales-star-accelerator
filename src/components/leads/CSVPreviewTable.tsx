
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

interface CSVPreviewTableProps {
  previewData: string[][];
}

const CSVPreviewTable: React.FC<CSVPreviewTableProps> = ({ previewData }) => {
  if (previewData.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="font-medium">Prévia dos dados:</h3>
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted hover:bg-muted">
              {previewData[0].map((header, i) => (
                <TableHead key={i} className="font-semibold whitespace-nowrap">
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {previewData.slice(1).map((row, i) => (
              <TableRow key={i}>
                {row.map((cell, j) => (
                  <TableCell key={j} className="whitespace-nowrap">
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        Mostrando apenas as primeiras linhas. O arquivo completo será processado durante a importação.
      </p>
    </div>
  );
};

export default CSVPreviewTable;
