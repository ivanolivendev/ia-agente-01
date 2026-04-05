import { createContext, useContext, useState, ReactNode } from 'react';

interface SidebarContextType {
  sideBarVisible: boolean;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [sideBarVisible, setSideBarVisible] = useState(true);

  const toggleSidebar = () => setSideBarVisible((prev) => !prev);

  return (
    <SidebarContext.Provider value={{ sideBarVisible, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebarContext() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebarContext must be used within a SidebarProvider');
  }
  return context;
}
