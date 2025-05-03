
import React from "react";
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from "@/components/ui/command"; 
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

interface QuickReply {
  id: string;
  title: string;
  content: string;
  category: string;
}

interface QuickReplyMenuProps {
  onSelectReply: (content: string) => void;
}

// Sample quick replies
const quickReplies: QuickReply[] = [
  {
    id: "qr1",
    title: "Saudação",
    content: "Olá, como posso ajudar você hoje?",
    category: "Geral"
  },
  {
    id: "qr2",
    title: "Agradecimento",
    content: "Obrigado pelo seu contato! Estamos aqui para ajudar com qualquer dúvida.",
    category: "Geral"
  },
  {
    id: "qr3",
    title: "Orçamento",
    content: "Posso preparar um orçamento personalizado para você. Poderia me fornecer mais detalhes sobre suas necessidades?",
    category: "Vendas"
  },
  {
    id: "qr4",
    title: "Reunião",
    content: "Gostaria de agendar uma reunião para discutirmos melhor? Tenho disponibilidade nos próximos dias.",
    category: "Agendamento"
  },
  {
    id: "qr5",
    title: "Follow-up",
    content: "Estou fazendo um follow-up do nosso último contato. Conseguiu analisar a proposta que enviamos?",
    category: "Vendas"
  }
];

const QuickReplyMenu = ({ onSelectReply }: QuickReplyMenuProps) => {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (content: string) => {
    onSelectReply(content);
    setOpen(false);
  };

  const categories = Array.from(new Set(quickReplies.map(reply => reply.category)));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full"
          title="Respostas rápidas"
        >
          <MessageSquare className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" side="top" align="start" alignOffset={-40} sideOffset={10}>
        <Command className="w-[320px]">
          <CommandInput placeholder="Buscar resposta rápida..." />
          <CommandList>
            <CommandEmpty>Nenhuma resposta encontrada</CommandEmpty>
            {categories.map(category => (
              <CommandGroup key={category} heading={category}>
                {quickReplies
                  .filter(reply => reply.category === category)
                  .map(reply => (
                    <CommandItem
                      key={reply.id}
                      className="flex flex-col items-start py-2"
                      onSelect={() => handleSelect(reply.content)}
                    >
                      <span className="font-medium">{reply.title}</span>
                      <span className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                        {reply.content}
                      </span>
                    </CommandItem>
                  ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default QuickReplyMenu;
