
import { supabase } from "@/integrations/supabase/client";

export interface ProcessedLead {
  name: string;
  email: string | null;
  phone: string | null;
  status: 'novo';
}

export const parseCSVText = (text: string): string[][] => {
  const rows = text.split('\n').map(row => {
    // Handle quoted CSV values properly
    const values = [];
    let inQuotes = false;
    let currentValue = '';
    
    for (let i = 0; i < row.length; i++) {
      const char = row[i];
      
      if (char === '"' && (i === 0 || row[i-1] !== '\\')) {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(currentValue.trim());
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    
    if (currentValue.trim()) {
      values.push(currentValue.trim());
    }
    
    return values.length > 0 ? values : row.split(',');
  });
  
  return rows;
};

export const processCSVData = async (
  text: string,
  onProgress: (progress: number) => void
): Promise<number> => {
  try {
    // Parse CSV
    const rows = parseCSVText(text);
    const headers = rows[0];
    
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
    const leads: ProcessedLead[] = [];
    for (let i = 1; i < rows.length; i++) {
      // Skip empty rows
      if (!rows[i].join('').trim()) continue;
      
      const values = rows[i];
      
      // Basic validation
      const name = values[nameIndex]?.trim();
      if (!name) continue; // Skip if no name
      
      const lead: ProcessedLead = {
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
      onProgress(Math.floor(((i + 1) / batches) * 100));
      
      // Brief pause to show progress (can be removed in production)
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    return leads.length;
  } catch (error) {
    console.error('Erro ao processar CSV:', error);
    throw error;
  }
};
