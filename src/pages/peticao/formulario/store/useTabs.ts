import { useState } from "react";

export const useTabs = () => {
  const availableTabs = ["Perfil", "Congregação", "Disponibilidade"];
  const [activeTab, setActiveTab] = useState<number>(0);
  return {
    availableTabs,
    activeTab,
    setActiveTab,
  };
};
