import { Checkbox } from "@material-tailwind/react";

export function Disponibilidade() {
  return (
    <>
      <div className="flex flex-col col-span-1 gap-2">
        <div className="flex items-center">
          <div className="w-44">
            <Checkbox
              label="Segunda-Feira:"
              containerProps={{
                className: "block w-11",
              }}
              crossOrigin
              className="w-full"
            />
          </div>
          <Periodos onChange={() => {}} />
        </div>
        <div className="flex items-center">
          <div className="w-44">
            <Checkbox label="Terça-Feira:" crossOrigin onChange={() => {}} />
          </div>
          <Periodos onChange={() => {}} />
        </div>
        <div className="flex items-center">
          <div className="w-44">
            <Checkbox label="Quarta-Feira:" crossOrigin onChange={() => {}} />
          </div>
          <Periodos onChange={() => {}} />
        </div>
        <div className="flex items-center">
          <div className="w-44">
            <Checkbox label="Quinta-Feira:" crossOrigin onChange={() => {}} />
          </div>
          <Periodos onChange={() => {}} />
        </div>
        <div className="flex items-center">
          <div className="w-44">
            <Checkbox label="Sexta-Feira:" crossOrigin onChange={() => {}} />
          </div>
          <Periodos onChange={() => {}} />
        </div>
        <div className="flex items-center">
          <div className="w-44">
            <Checkbox label="Sábado:" crossOrigin onChange={() => {}} />
          </div>
          <Periodos onChange={() => {}} />
        </div>
        <div className="flex items-center">
          <div className="w-44">
            <Checkbox label="Domingo:" crossOrigin onChange={() => {}} />
          </div>
          <Periodos onChange={() => {}} />
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
