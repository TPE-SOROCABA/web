import { Switch } from "@material-tailwind/react";
interface BoxGroupProps {
  children: React.ReactNode;
  pointName: string;
  pointCars: string;
  pointStatus: boolean;
  boxGroupEvent: (value: boolean) => void;
}

export function BoxGroup({ children, pointName, pointCars, pointStatus, boxGroupEvent }: BoxGroupProps) {
  return (
    <>
      <div className="w-80 h-72 flex flex-col items-center justify-start gap-4 p-4 rounded-lg border border-primary-200 shadow-lg relative">
        <div className="flex justify-around items-center w-full gap-2">
          <span
            className="font-bold text-base truncate w-[62%]"
            title={pointName}
          >
            {pointName}
          </span>
          <span className="text-base text-end w-[38%]" title={pointCars}>
            Carrinho: {pointCars}
          </span>

        </div>
        <div className="flex flex-col items-center gap-4">
          {children}
        </div>
        <div className="p-2 absolute bottom-2 left-3">
          <Switch
            className="h-full w-full checked:bg-primary-700"
            defaultChecked={pointStatus}
            crossOrigin={""}
            label={pointStatus ? "Ponto Ativo" : "Ponto Inativo"}
            onChange={(e) => { boxGroupEvent(e.target.checked); }}
          />
        </div>
      </div>
    </>
  );
}
