
import { Phone, Mail, Building, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Contact } from "@/types/crm";

interface ContactInfoProps {
  contact: Contact;
}

export const ContactInfo = ({ contact }: ContactInfoProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <Phone className="h-4 w-4 mt-0.5 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">Telefone</p>
          <p className="text-sm">{contact.phone || 'Não informado'}</p>
        </div>
      </div>
      
      <div className="flex items-start gap-3">
        <Mail className="h-4 w-4 mt-0.5 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">Email</p>
          <p className="text-sm">{contact.email || 'Não informado'}</p>
        </div>
      </div>
      
      <div className="flex items-start gap-3">
        <Building className="h-4 w-4 mt-0.5 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">Empresa</p>
          <p className="text-sm">{contact.company || 'Não informado'}</p>
        </div>
      </div>
      
      <div className="flex items-start gap-3">
        <Tag className="h-4 w-4 mt-0.5 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">Tags</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {contact.tags && contact.tags.length > 0 ? (
              contact.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))
            ) : (
              <p className="text-sm">Nenhuma tag</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
