import { Select, Option, Input, Button } from "@material-tailwind/react";
import { usePetitionFormStore } from "../store/useContextForm";
import { CheckboxGroup } from "@/components/checkboxGroup";
import { useCallback, useEffect, useState } from "react";
import { useHttp } from "../../useHttpDev";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/index";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/components/lib/utils";

const congregacao = [
  { value: "Magnólia", label: "Magnólia" },
  { value: "Jardim", label: "Jardim" },
  { value: "Cidade", label: "Cidade" },
  { value: "Vila", label: "Vila" },
  { value: "Bairro", label: "Bairro" },
  { value: "Parque", label: "Parque" },
  { value: "Conjunto", label: "Conjunto" },
  { value: "Residencial", label: "Residencial" },
  { value: "Chácara", label: "Chácara" },
  { value: "Sítio", label: "Sítio" },
  { value: "Fazenda", label: "Fazenda" },
  { value: "Recanto", label: "Recanto" },
  { value: "Loteamento", label: "Loteamento" },
  { value: "Vale", label: "Vale" },
  { value: "Morro", label: "Morro" },
  { value: "Serra", label: "Serra" },
  { value: "Monte", label: "Monte" },
  { value: "Várzea", label: "Várzea" },
  { value: "Praia", label: "Praia" },
  { value: "Ilha", label: "Ilha" },
  { value: "Estrada", label: "Estrada" },
  { value: "Travessa", label: "Travessa" },
  { value: "Rua", label: "Rua" },
  { value: "Avenida", label: "Avenida" },
  { value: "Alameda", label: "Alameda" },
  { value: "Largo", label: "Largo" },
  { value: "Praça", label: "Praça" },
  { value: "Viela", label: "Viela" },
  { value: "Rodovia", label: "Rodovia" },
  { value: "Via", label: "Via" },
  { value: "Passarela", label: "Passarela" },
  { value: "Passagem", label: "Passagem" },
  { value: "Escadaria", label: "Escadaria" },
  { value: "Travessão", label: "Travessão" },
  { value: "Vereda", label: "Vereda" },
  { value: "Vereda", label: "Vereda" },
];

const languages = [
  { id: "PORTUGUÊS", label: "Português" },
  { id: "INGLÊS", label: "Inglês" },
  { id: "ESPANHOL", label: "Espanhol" },
  { id: "FRANCÊS", label: "Francês" },
  { id: "ALEMÃO", label: "Alemão" },
  { id: "LIBRAS", label: "Libras" },
];

interface ComboboxProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}
function Combobox({
  label,
  placeholder,
  value,
  onChange,
  options,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  // const [newValue, setNewValue] = useState(value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="col-span-2">
        <Button
          placeholder={placeholder}
          role="combobox"
          aria-expanded={open}
          className="h-10 justify-between flex items-center bg-inherit border border-blue-gray-200 text-gray-600 text-left p-3 m-0 shadow-none cursor-default hover:shadow-none"
        >
          {/* {value
            ? frameworks.find((framework) => framework.value === value)?.label
            : "Select framework..."} */}
          <span className="truncate max-w-[90%] block">
            {value ? value : label}
          </span>
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command>
          <CommandInput placeholder="Search framework..." className="h-9" />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {option.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export function Congregacao() {
  const { petition, updatePetition, congregations } = usePetitionFormStore();

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 space-y-2 gap-4">
        <Combobox
          label="Selecionar uma congregação"
          placeholder="Selecione"
          value={
            congregations?.find(
              (c) => c.id === petition.participants[0]?.congregationId
            )?.name ?? ""
          }
          onChange={(newCongregation) => {
            const congregation = congregations?.find(
              (c) => c.name === newCongregation
            );
            updatePetition({
              name: "congregationId",
              value: congregation?.id,
            });
          }}
          options={congregations.map((item) => ({
            value: item.name,
            label: item.name,
          }))}
        />
        <Input
          crossOrigin
          label="Cidade"
          containerProps={{ className: "col-span-1" }}
          value={petition.participants[0]?.city}
          name="city"
          onChange={(e) => updatePetition(e.target)}
        />
        <Input
          crossOrigin
          label="Estado"
          containerProps={{ className: "col-span-1" }}
          value={petition.participants[0]?.state}
          name="state"
          onChange={(e) => updatePetition(e.target)}
        />
        <Input
          crossOrigin
          label="Data de batismo"
          containerProps={{ className: "col-span-1" }}
          value={formatDateToInput(
            petition.participants[0]?.baptismDate as any as string
          )}
          name="baptismDate"
          onChange={(e) => updatePetition(e.target)}
          type="date"
        />
        <Select
          label="Atualmente serve como"
          placeholder={"Selecione"}
          containerProps={{ className: "col-span-1" }}
          value={petition.participants[0]?.attributions[0]}
          onChange={(value) =>
            updatePetition({
              name: "attributions",
              value: [value],
            })
          }
        >
          <Option value="SERVO MINISTERIAL">Servo Ministerial</Option>
          <Option value="ANCIÃO">Ancião</Option>
          <Option value="PUBLICADOR(A)">Publicador(a)</Option>
          <Option value="PIONEIRO(A) REGULAR">Pioneiro(a) Regular</Option>
        </Select>
        <CheckboxGroup
          options={languages}
          value={petition.participants[0]?.languages?.map((l) => ({
            id: l,
            label: languages.find((lang) => lang.id === l)?.label ?? "",
          }))}
          onChange={(value) => {
            updatePetition({
              name: "languages",
              value: petition.participants[0]?.languages.includes(
                value.id as string
              )
                ? petition.participants[0]?.languages.filter(
                    (lang) => lang !== value.id
                  )
                : petition.participants[0]?.languages.concat(
                    value.id as string
                  ),
            });
          }}
        >
          {petition.participants[0]?.languages?.length ? (
            <span
              className="truncate w-[95%] block"
              title={petition.participants[0]?.languages.join(", ")}
            >
              {petition.participants[0]?.languages.join(", ")}
            </span>
          ) : (
            <div>Escolher o idioma</div>
          )}
        </CheckboxGroup>
      </div>
    </div>
  );
}

const formatDateToInput = (date: string) => {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
};
