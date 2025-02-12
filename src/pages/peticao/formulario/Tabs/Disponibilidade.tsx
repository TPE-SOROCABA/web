import { Checkbox } from "@material-tailwind/react";
import { usePetitionFormStore } from "../store/useContextForm";
import { onChange } from "node_modules/react-toastify/dist/core/store";

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
  const { petition, updatePetition } = usePetitionFormStore();

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
          />
        </div>
      ))}
    </div>
  );
}

interface PeriodosProps {
  onChange: (value: string) => void;
  availability?: {
    morning: boolean;
    afternoon: boolean;
    evening: boolean;
  };
}
function Periodos({ onChange, availability }: PeriodosProps) {
  return (
    <div className="flex items-center justify-between gap-5">
      <Checkbox
        label="Manhã"
        crossOrigin
        onChange={() => onChange("morning")}
        checked={availability?.morning}
      />
      <Checkbox
        label="Tarde"
        crossOrigin
        onChange={() => onChange("afternoon")}
        checked={availability?.afternoon}
      />
      <Checkbox
        label="Noite"
        crossOrigin
        onChange={() => onChange("evening")}
        checked={availability?.evening}
      />
    </div>
  );
}
