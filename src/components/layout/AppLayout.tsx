import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";
import AppHeader from "./AppHeader";
interface AppLayoutProps {
  children: React.ReactNode;
}
const AppLayout = ({
  children
}: AppLayoutProps) => {
  return <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <AppHeader />
          <main className="flex-1 p-4 md:p-6 overflow-y-auto animate-fade-in bg-gray-50">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>;
};
export default AppLayout;