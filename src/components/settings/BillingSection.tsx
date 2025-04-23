
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  CreditCard, 
  Check, 
  Clock, 
  Download, 
  ChevronRight,
  ArrowUp,
  CreditCardIcon
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Dados de exemplo
const currentPlan = {
  name: "Profissional",
  price: "R$ 199,90",
  nextBilling: "23/05/2025",
  features: [
    "Número ilimitado de leads",
    "Até 5 usuários",
    "Integração com WhatsApp",
    "Conexão com Meta Ads",
    "Conexão com Google Ads",
    "Suporte prioritário",
  ]
};

const billingHistory = [
  {
    id: "INV-001",
    date: "23/03/2025",
    amount: "R$ 199,90",
    status: "Pago",
    method: "Cartão de crédito"
  },
  {
    id: "INV-002",
    date: "23/02/2025",
    amount: "R$ 199,90",
    status: "Pago",
    method: "Cartão de crédito"
  },
  {
    id: "INV-003",
    date: "23/01/2025",
    amount: "R$ 199,90",
    status: "Pago",
    method: "Cartão de crédito"
  },
];

const BillingSection = () => {
  const { toast } = useToast();

  const handleDownloadInvoice = (id: string) => {
    toast({
      title: "Nota fiscal baixada",
      description: `O download da nota fiscal ${id} foi iniciado.`,
    });
  };

  const handleUpdatePayment = () => {
    toast({
      title: "Forma de pagamento",
      description: "Esta funcionalidade será disponibilizada em breve.",
    });
  };

  const handleChangePlan = () => {
    toast({
      title: "Alterar plano",
      description: "Esta funcionalidade será disponibilizada em breve.",
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-2">Faturamento e Plano</h2>
        <p className="text-muted-foreground">
          Gerencie seu plano de assinatura, forma de pagamento e histórico de faturas.
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              <CardTitle>Plano atual</CardTitle>
            </div>
            <CardDescription>
              Detalhes do seu plano de assinatura atual.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">{currentPlan.name}</h3>
                <p className="text-muted-foreground">{currentPlan.price}/mês</p>
              </div>
              <div className="text-right">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-1" />
                  Próxima cobrança em {currentPlan.nextBilling}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {currentPlan.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="ml-auto"
              onClick={handleChangePlan}
            >
              Alterar plano
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Forma de pagamento</CardTitle>
            <CardDescription>
              Gerencie seus métodos de pagamento.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                <CreditCardIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium">Mastercard terminando em 4321</p>
                <p className="text-xs text-muted-foreground">Vencimento 05/27</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={handleUpdatePayment}
            >
              Atualizar forma de pagamento
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Histórico de faturas</CardTitle>
          <CardDescription>
            Visualize e baixe suas faturas anteriores.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fatura</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Método</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {billingHistory.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.id}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>{invoice.amount}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                      {invoice.status}
                    </span>
                  </TableCell>
                  <TableCell>{invoice.method}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDownloadInvoice(invoice.id)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-center border-t">
          <Button variant="link" className="text-xs">
            Ver todas as faturas
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BillingSection;
