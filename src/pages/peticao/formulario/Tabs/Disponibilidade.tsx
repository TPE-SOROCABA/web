import { Checkbox } from "@material-tailwind/react";

export function Disponibilidade() {
  return (
    <>
      <div className="grid grid-cols-2 w-full gap-6">
        <div className="flex flex-col col-span-1 gap-2">
          <div className="flex items-center">
            <span className="block w-32">Segunda-Feira:</span>
            <Periodos onChange={() => {}} />
          </div>
          <div className="flex items-center">
            <span className="block w-32">Terça-Feira:</span>
            <Periodos onChange={() => {}} />
          </div>
          <div className="flex items-center">
            <span className="block w-32">Quarta-Feira:</span>
            <Periodos onChange={() => {}} />
          </div>
          <div className="flex items-center">
            <span className="block w-32">Quinta-Feira:</span>
            <Periodos onChange={() => {}} />
          </div>
        </div>
        <div className="flex flex-col col-span-1 gap-2 border-l-2 pl-4">
          <div className="flex items-center">
            <span className="block w-32">Sexta-Feira:</span>
            <Periodos onChange={() => {}} />
          </div>
          <div className="flex items-center">
            <span className="block w-32">Sábado:</span>
            <Periodos onChange={() => {}} />
          </div>
          <div className="flex items-center">
            <span className="block w-32">Domingo:</span>
            <Periodos onChange={() => {}} />
          </div>
        </div>
      </div>
    </>
  );
}

interface PeriodosProps {
  onChange: (value: string) => void;
}
function Periodos({ onChange }: PeriodosProps) {
  return (
    <div className="flex items-center justify-between gap-5">
      <Checkbox label="Manhã" crossOrigin onChange={() => onChange("M")} />
      <Checkbox label="Tarde" crossOrigin onChange={() => onChange("T")} />
      <Checkbox label="Noite" crossOrigin onChange={() => onChange("N")} />
    </div>
  );
}
