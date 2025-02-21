import { Checkbox, /*Switch*/ } from "@material-tailwind/react";
import { usePetitionFormStore } from "../store/useContextForm";

const DAYS = [
  { weekday: 0, label: "Domingo" },
  { weekday: 1, label: "Segunda-Feira" },
  { weekday: 2, label: "Terça-Feira" },
  { weekday: 3, label: "Quarta-Feira" },
  { weekday: 4, label: "Quinta-Feira" },
  { weekday: 5, label: "Sexta-Feira" },
  { weekday: 6, label: "Sábado" },
];

export function Disponibilidade() {
  const { petition, updatePetition, mode } = usePetitionFormStore();
  const statusIsCreated = petition?.status === "CREATED";
  const isAnalyst = mode === "analyst";
  const disableInputs = isAnalyst && statusIsCreated;

  return (
    <div className="flex flex-col col-span-1 gap-2">
      {DAYS.map((day) => (
        <div key={day.weekday} className="flex items-center">
          <span className="block w-32">{day.label}:</span>
          <Periodos
            onChange={(period) => {
              const oldAvailability = petition?.participants[0]?.availability;
              const periodExists = oldAvailability?.find((a) => {
                return a.weekDay === day.weekday;
              });
              if (!periodExists) {
                oldAvailability.push({
                  weekDay: day.weekday,
                  morning: false,
                  afternoon: false,
                  evening: false,
                  [period]: true,
                });
              } else {
                oldAvailability[oldAvailability.indexOf(periodExists)][period] =
                  !oldAvailability[oldAvailability.indexOf(periodExists)][
                  period
                  ];
              }

              updatePetition({
                name: "availability",
                value: oldAvailability,
              });
            }}
            availability={petition?.participants[0]?.availability?.find((a) => {
              return a.weekDay === day.weekday;
            })}
            disabled={disableInputs}
          />
        </div>
      ))}
      {/* <SwitchInput checked={petition?.participants[0]?.hasMinorChild} onChange={(value) => updatePetition({ name: "hasMinorChild", value })} label="Tem filho menor de idade participante do TPE?" /> */}
    </div>
  );
}

// interface SwitchInputProps {
//   checked: boolean;
//   onChange: (value: boolean) => void;
//   label: string;
// }
// function SwitchInput({ checked, onChange, label }: SwitchInputProps) {
//   return (
//     <div className="flex items-center gap-2 w-full border border-red-500">
//       <label htmlFor={label}>{label}</label>
//       <Switch crossOrigin id={label} className="w-12 h-6 bg-primary-500" checked={checked} onChange={(event) => {
//         event.preventDefault();
//         event.stopPropagation();
//         onChange(event.target.checked);
//       }}  />
//     </div>
//   )
// }

interface PeriodosProps {
  onChange: (value: string) => void;
  availability?: {
    morning: boolean;
    afternoon: boolean;
    evening: boolean;
  };
  disabled?: boolean;
}
function Periodos({ onChange, availability, disabled = false }: PeriodosProps) {
  return (
    <div className="flex items-center justify-between gap-5">
      <Checkbox
        containerProps={{ className: "p-0 m-3 !rounded-none" }}
        className="!rounded-none border-primary-700 hover:before:opacity-0 checked:bg-primary-500"
        label="Manhã"
        crossOrigin
        onChange={() => onChange("morning")}
        checked={availability?.morning}
        disabled={disabled}
      />
      <Checkbox
        containerProps={{ className: "p-0 m-3 !rounded-none" }}
        className="!rounded-none border-primary-700 hover:before:opacity-0 checked:bg-primary-500"
        label="Tarde"
        crossOrigin
        onChange={() => onChange("afternoon")}
        checked={availability?.afternoon}
        disabled={disabled}
      />
      <Checkbox
        containerProps={{ className: "p-0 m-3 !rounded-none" }}
        className="!rounded-none border-primary-700 hover:before:opacity-0 checked:bg-primary-500"
        label="Noite"
        crossOrigin
        onChange={() => onChange("evening")}
        checked={availability?.evening}
        disabled={disabled}
      />
    </div>
  );
}
