
import { HelpCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const HelpPage = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <HelpCircle className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Central de Ajuda</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Perguntas Frequentes</CardTitle>
            <CardDescription>
              Encontre respostas para as dúvidas mais comuns sobre o sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Como faço para adicionar um novo lead?</AccordionTrigger>
                <AccordionContent>
                  Para adicionar um novo lead, acesse a seção "Leads" no menu lateral e clique no botão "Novo Lead". 
                  Preencha as informações necessárias no formulário e clique em "Salvar".
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Como gerenciar as conversas com clientes?</AccordionTrigger>
                <AccordionContent>
                  Na seção "Conversas", você pode visualizar e gerenciar todas as interações com seus clientes. 
                  É possível filtrar por canal de comunicação e status da conversa.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Como funciona o pipeline de vendas?</AccordionTrigger>
                <AccordionContent>
                  O pipeline de vendas mostra o progresso dos seus leads através das diferentes etapas do processo de venda. 
                  Você pode arrastar e soltar os cards para atualizar o status de cada lead.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Precisa de mais ajuda?</CardTitle>
            <CardDescription>
              Entre em contato com nossa equipe de suporte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Nossa equipe está disponível para ajudar você com qualquer dúvida ou problema que possa ter.
              </p>
              <Button variant="outline" className="w-full">
                Contatar Suporte
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HelpPage;
