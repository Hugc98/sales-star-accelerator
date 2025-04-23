
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QrCode, Facebook, Instagram } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

// Componentes de seções específicas
import WhatsAppIntegration from "./integrations/WhatsAppIntegration";
import SocialMediaIntegration from "./integrations/SocialMediaIntegration";
import AdsIntegration from "./integrations/AdsIntegration";

const ExternalToolsSection = () => {
  const { toast } = useToast();
  const [activeIntegration, setActiveIntegration] = useState("whatsapp");

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-2">Conexões com Ferramentas Externas</h2>
        <p className="text-muted-foreground">
          Conecte suas ferramentas e plataformas externas para centralizar seu atendimento e campanhas.
        </p>
      </div>
      
      <Tabs value={activeIntegration} onValueChange={setActiveIntegration} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="whatsapp" className="flex items-center gap-2">
            <QrCode className="h-4 w-4" />
            <span>WhatsApp</span>
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center gap-2">
            <Instagram className="h-4 w-4" />
            <span>Redes Sociais</span>
          </TabsTrigger>
          <TabsTrigger value="ads" className="flex items-center gap-2">
            <Facebook className="h-4 w-4" />
            <span>Anúncios</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="whatsapp" className="mt-4">
          <WhatsAppIntegration />
        </TabsContent>
        
        <TabsContent value="social" className="mt-4">
          <SocialMediaIntegration />
        </TabsContent>
        
        <TabsContent value="ads" className="mt-4">
          <AdsIntegration />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExternalToolsSection;
