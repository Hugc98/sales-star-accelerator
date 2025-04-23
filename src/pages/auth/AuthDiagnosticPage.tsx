
import { useEffect, useState } from "react";
import { getCurrentSession, isSessionExpired } from "@/lib/security";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from "lucide-react";

const AuthDiagnosticPage = () => {
  const [sessionData, setSessionData] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [storageItems, setStorageItems] = useState<{key: string, value: string}[]>([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    refreshStatus();
  }, []);
  
  const refreshStatus = () => {
    setLoading(true);
    
    // Verifica o status da sessão
    const session = getCurrentSession();
    setIsAuthenticated(!!session);
    
    // Formata e sanitiza os dados da sessão para exibição segura
    if (session) {
      setSessionData({
        id: session.id,
        name: session.name,
        email: session.email,
        role: session.role,
        permissions: session.permissions,
        exp: new Date(session.exp * 1000).toLocaleString(),
        lastActivity: new Date(session.lastActivity).toLocaleString(),
        expired: isSessionExpired(session)
      });
    } else {
      setSessionData(null);
    }
    
    // Lista itens relevantes do localStorage para diagnóstico
    const items: {key: string, value: string}[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i) || '';
      if (key.startsWith('crm_')) {
        // Evita mostrar conteúdo sensível
        if (key === 'crm_session') {
          items.push({key, value: '[Conteúdo sensível ocultado]'});
        } else {
          items.push({key, value: localStorage.getItem(key) || ''});
        }
      }
    }
    setStorageItems(items);
    
    setLoading(false);
  };
  
  const clearAllStorage = () => {
    // Remove apenas os itens do CRM do localStorage
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.startsWith('crm_')) {
        localStorage.removeItem(key);
      }
    }
    
    refreshStatus();
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Diagnóstico de Autenticação</h1>
            <p className="text-muted-foreground">
              Esta página exibe informações sobre o estado atual da autenticação
            </p>
          </div>
          <Button onClick={refreshStatus} variant="outline" size="sm" disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
        
        {/* Status da autenticação */}
        <div className="bg-card rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-medium mb-4 flex items-center">
            Status da Autenticação
            {isAuthenticated ? (
              <CheckCircle className="ml-2 h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="ml-2 h-5 w-5 text-destructive" />
            )}
          </h2>
          
          <div>
            <p className="mb-2">
              <span className="font-medium">Status:</span>{" "}
              <span className={isAuthenticated ? "text-green-600" : "text-destructive"}>
                {isAuthenticated ? "Autenticado" : "Não autenticado"}
              </span>
            </p>
            
            {sessionData ? (
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">ID:</span> {sessionData.id}</p>
                <p><span className="font-medium">Nome:</span> {sessionData.name}</p>
                <p><span className="font-medium">Email:</span> {sessionData.email}</p>
                <p><span className="font-medium">Função:</span> {sessionData.role}</p>
                <p><span className="font-medium">Expira em:</span> {sessionData.exp}</p>
                <p><span className="font-medium">Última atividade:</span> {sessionData.lastActivity}</p>
                <p>
                  <span className="font-medium">Sessão válida:</span>{" "}
                  <span className={sessionData.expired ? "text-destructive" : "text-green-600"}>
                    {sessionData.expired ? "Não (expirada)" : "Sim"}
                  </span>
                </p>
              </div>
            ) : (
              <div className="bg-secondary/30 p-3 rounded text-sm">
                <AlertTriangle className="inline-block h-4 w-4 mr-1 text-amber-500" />
                Nenhuma sessão ativa encontrada. Faça login para criar uma nova sessão.
              </div>
            )}
          </div>
        </div>
        
        {/* Dados de armazenamento */}
        <div className="bg-card rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Dados de Armazenamento Local</h2>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={clearAllStorage}
              disabled={storageItems.length === 0}
            >
              Limpar dados
            </Button>
          </div>
          
          {storageItems.length > 0 ? (
            <div className="border rounded-md overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-2 text-left">Chave</th>
                    <th className="px-4 py-2 text-left">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {storageItems.map((item, index) => (
                    <tr key={index} className="hover:bg-muted/20">
                      <td className="px-4 py-2 font-mono text-xs">{item.key}</td>
                      <td className="px-4 py-2 font-mono text-xs truncate max-w-xs">
                        {item.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">Nenhum dado de autenticação encontrado.</p>
          )}
        </div>
        
        {/* Ações disponíveis */}
        <div className="bg-card rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-medium mb-4">Ações</h2>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/login">Ir para Login</Link>
            </Button>
            
            <Button asChild variant="outline">
              <Link to="/registro">Ir para Registro</Link>
            </Button>
            
            <Button asChild variant="secondary">
              <Link to="/">Ir para Dashboard</Link>
            </Button>
          </div>
        </div>
        
        <div className="text-center text-xs text-muted-foreground mt-8">
          <p>Esta página é destinada apenas para fins de diagnóstico e teste.</p>
          <p>Não disponibilize esta rota em ambientes de produção.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthDiagnosticPage;
