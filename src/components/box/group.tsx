import { Switch } from "@material-tailwind/react";
import carSvg from "../../assets/car.svg";
interface BoxGroupProps {
  children: React.ReactNode;
  pointName: string;
  pointCars: string;
  pointStatus: boolean;
  boxGroupEvent: (value: boolean) => void;
  readonly?: boolean;
}

export function BoxGroup({
  children,
  pointName,
  pointCars,
  pointStatus,
  boxGroupEvent,
  readonly = false,
}: BoxGroupProps) {
  return (
    <>
      <div
        className={`
        w-80 h-72 flex flex-col items-center justify-start gap-4 p-4 rounded-lg border border-primary-200 shadow-lg relative
        ${!pointName && "invisible"}
      `}
      >
        <div className="flex justify-start items-center w-full gap-2">
          <span className="font-bold text-base truncate" title={pointName}>
            {pointName}
          </span>
        </div>
        <div className="flex flex-col items-center gap-4">{children}</div>
        <div className="p-2 absolute bottom-2 left-3">
          <Switch
            className="h-full w-full checked:bg-primary-700"
            defaultChecked={pointStatus}
            crossOrigin={""}
            label={pointStatus ? "Ponto Ativo" : "Ponto Inativo"}
            onChange={(e) => {
              boxGroupEvent(e.target.checked);
            }}
            disabled={readonly}
          />
        </div>
        <div className="absolute bottom-5 right-3">
          <div className="flex items-end gap-2 h-fit" title={pointCars}>
            <span className="text-base text-end -mb-1">{pointCars}</span>
            <img className="w-3" src={carSvg} />
          </div>
        </div>
      </div>
    </>
  );
}
