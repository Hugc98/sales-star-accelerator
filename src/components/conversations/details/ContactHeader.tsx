
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Contact } from "@/types/crm";

interface ContactHeaderProps {
  contact: Contact;
}

export const ContactHeader = ({ contact }: ContactHeaderProps) => {
  return (
    <div className="text-center">
      <Avatar className="h-16 w-16 mx-auto mb-3">
        <AvatarImage src={contact.avatar} alt={contact.name} />
        <AvatarFallback className="text-lg">{contact.initials}</AvatarFallback>
      </Avatar>
      <h3 className="text-lg font-semibold">{contact.name}</h3>
      {contact.company && (
        <p className="text-muted-foreground text-sm">{contact.company}</p>
      )}
    </div>
  );
};
