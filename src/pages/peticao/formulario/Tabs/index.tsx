import { ReactNode } from "react";
import { usePetitionFormStore } from "../store/useContextForm";
import { Perfil } from "./Perfil";
import { Congregacao } from "./Congregacao";
import { Disponibilidade } from "./Disponibilidade";

const pages = [
  () => <Perfil />,
  () => <Congregacao />,
  () => <Disponibilidade />,
];

export function HandlerTabs() {
  const { activeTab } = usePetitionFormStore();
  const Page = pages[activeTab];
  return (
    <div className="flex flex-col gap-4 col-span-2">
      <Tabs />
      <Page />
    </div>
  );
}

interface TabProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}
const Tab = ({ children, ...rest }: TabProps) => (
  <div
    className="flex items-center py-1 gap-2 cursor-pointer hover:opacity-80 transition-all ease-in-out duration-300 border-b-4 border-transparent hover:border-primary-600 text-primary-600 font-semibold text-xl"
    {...rest}
  >
    {children}
  </div>
);
const PositionTab = ({
  value,
  selected,
}: {
  value: string;
  selected: boolean;
}) => (
  <div
    className={`
       flex justify-center items-center w-10 h-10 rounded-full hover:opacity-80 transition-all ease-in-out duration-300
       ${selected ? "bg-primary-600 text-white" : "bg-gray-200 text-black"}   
    `}
  >
    {value}
  </div>
);
function Tabs() {
  const { availableTabs, activeTab, setActiveTab } = usePetitionFormStore();

  return (
    <div className="flex items-center gap-4">
      {availableTabs.map((tab, index) => (
        <Tab key={index} onClick={() => setActiveTab(index)}>
          <PositionTab value={`${index + 1}`} selected={activeTab === index} />
          {tab}
        </Tab>
      ))}
    </div>
  );
}
