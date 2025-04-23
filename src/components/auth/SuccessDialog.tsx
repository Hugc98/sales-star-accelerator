
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  userName: string;
}

const SuccessDialog = ({ open, onOpenChange, onConfirm, userName }: SuccessDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Registro concluído!</DialogTitle>
          <DialogDescription>
            Sua conta foi criada com sucesso. Clique no botão abaixo para continuar.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col space-y-3 mt-4">
          <p className="text-sm">
            Em um ambiente de produção, você receberia um email de confirmação antes de poder acessar o sistema. Para esta demonstração, você será redirecionado diretamente para o dashboard.
          </p>
          
          <Button onClick={onConfirm} className="w-full">
            Acessar o Dashboard
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessDialog;
