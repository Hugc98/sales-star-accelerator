
import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings, 
  QrCode, 
  Facebook, 
  Instagram, 
  Users, 
  UserPlus, 
  Palette, 
  CreditCard, 
  Lock, 
  Shield, 
  Database,
  Link
} from "lucide-react";

// Componentes das seções de configuração 
import ExternalToolsSection from "@/components/settings/ExternalToolsSection";
import TeamManagementSection from "@/components/settings/TeamManagementSection";
import PersonalPreferencesSection from "@/components/settings/PersonalPreferencesSection";
import BillingSection from "@/components/settings/BillingSection";
import SecuritySection from "@/components/settings/SecuritySection";
import DeveloperSection from "@/components/settings/DeveloperSection";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("external-tools");
  
  return (
    <AppLayout>
      <div className="container mx-auto animate-fade-in">
        <div className="flex items-center mb-6">
          <Settings className="h-6 w-6 mr-2" />
          <h1 className="text-2xl font-bold">Configurações</h1>
        </div>
        
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="w-full"
        >
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-64 shrink-0">
              <TabsList className="flex flex-col h-auto w-full bg-muted space-y-1 p-1 rounded-md">
                <TabsTrigger 
                  value="external-tools" 
                  className="w-full justify-start gap-2 p-2.5 text-left"
                >
                  <Link className="h-4 w-4" />
                  <span>Conexões</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="team-management" 
                  className="w-full justify-start gap-2 p-2.5 text-left"
                >
                  <Users className="h-4 w-4" />
                  <span>Gestão de Equipe</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="personal-preferences" 
                  className="w-full justify-start gap-2 p-2.5 text-left"
                >
                  <Palette className="h-4 w-4" />
                  <span>Preferências Pessoais</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="billing" 
                  className="w-full justify-start gap-2 p-2.5 text-left"
                >
                  <CreditCard className="h-4 w-4" />
                  <span>Faturamento e Plano</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="security" 
                  className="w-full justify-start gap-2 p-2.5 text-left"
                >
                  <Lock className="h-4 w-4" />
                  <span>Segurança e Acesso</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="developer" 
                  className="w-full justify-start gap-2 p-2.5 text-left"
                >
                  <Database className="h-4 w-4" />
                  <span>Avançado / Desenvolvedor</span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="flex-1 space-y-4">
              <TabsContent value="external-tools" className="m-0">
                <ExternalToolsSection />
              </TabsContent>
              <TabsContent value="team-management" className="m-0">
                <TeamManagementSection />
              </TabsContent>
              <TabsContent value="personal-preferences" className="m-0">
                <PersonalPreferencesSection />
              </TabsContent>
              <TabsContent value="billing" className="m-0">
                <BillingSection />
              </TabsContent>
              <TabsContent value="security" className="m-0">
                <SecuritySection />
              </TabsContent>
              <TabsContent value="developer" className="m-0">
                <DeveloperSection />
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default SettingsPage;
