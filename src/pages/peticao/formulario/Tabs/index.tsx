import { ReactNode } from "react";
import { Perfil } from "./Perfil";
import { Congregacao } from "./Congregacao";
import { Disponibilidade } from "./Disponibilidade";

export function HandlerTabs() {
  return (
    <div className="flex flex-col col-span-1">
      <Tab>Perfil</Tab>
      <Perfil />
      <br />
      <br />
      <Tab>Congregação</Tab>
      <br />
      <Congregacao />
      <br />
      <br />
      <Tab>Disponibilidade</Tab>
      <br />
      <Disponibilidade />
    </div>
  );
}

interface TabProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const Tab = ({ children, ...rest }: TabProps) => (
  <div
    className="flex items-center py-1 gap-2 text-primary-600 font-semibold text-xl"
    {...rest}
  >
    {children}
  </div>
);
