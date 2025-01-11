import { Button, Select, Option, Input } from "@material-tailwind/react";
import { usePetitionFormStore } from "../store/useContextForm";
import { XIcon } from "lucide-react";

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
  { value: "Português", label: "Português" },
  { value: "Inglês", label: "Inglês" },
  { value: "Espanhol", label: "Espanhol" },
  { value: "Francês", label: "Francês" },
  { value: "Alemão", label: "Alemão" },
  { value: "Libras", label: "Libras" },
];

export function Congregacao() {
  const { petition, setActiveTab, updatePetition } = usePetitionFormStore();

  console.log(petition.languages);
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 space-y-2 gap-4">
        <Select
          label="Congregação"
          placeholder="Selecione"
          containerProps={{ className: "col-span-2" }}
          name="congregation"
          value={petition.congregation}
          onChange={(e) => updatePetition({ name: "congregation", value: e })}
        >
          {congregacao.map((item) => (
            <Option key={item.value} value={item.value}>
              {item.label}
            </Option>
          ))}
        </Select>
        <Input
          crossOrigin
          label="Cidade"
          containerProps={{ className: "col-span-1" }}
          value={petition.city}
          name="city"
          onChange={(e) => updatePetition(e.target)}
        />
        <Input
          crossOrigin
          label="Estado"
          containerProps={{ className: "col-span-1" }}
          value={petition.state}
          name="state"
          onChange={(e) => updatePetition(e.target)}
        />
        <Input
          crossOrigin
          label="Data de batismo"
          containerProps={{ className: "col-span-1" }}
          value={formatDateToInput(petition.dateOfBaptism)}
          name="dateOfBaptism"
          onChange={(e) => updatePetition(e.target)}
          type="date"
        />
        <Select
          label="Atualmente serve como"
          placeholder={"Selecione"}
          containerProps={{ className: "col-span-1" }}
          value={petition.privileges}
          onChange={(value) =>
            updatePetition({
              name: "privileges",
              value: value,
            })
          }
        >
          <Option value="Servo Ministerial">Servo Ministerial</Option>
          <Option value="Ancião">Ancião</Option>
          <Option value="Publicador(a)">Publicador(a)</Option>
          <Option value="Pioneiro(a) Regular">Pioneiro(a) Regular</Option>
        </Select>
        <Select
          label="Idioma"
          placeholder={"Selecione"}
          value="Selecione 1 ou mais idiomas"
          containerProps={{ className: "col-span-1" }}
          onChange={(value) =>
            updatePetition({
              name: "languages",
              value: petition.languages
                .split(",")
                .concat(value ?? "")
                .join(","),
            })
          }
        >
          <Option disabled value="Selecione 1 ou mais idiomas">
            Selecione 1 ou mais idiomas
          </Option>
          {languages.map((item) => (
            <Option
              key={item.value}
              value={item.value}
              disabled={petition.languages.includes(item.value)}
            >
              {item.label}
            </Option>
          ))}
        </Select>
        <div className="flex gap-2 items-center col-span-1 flex-wrap">
          {petition.languages.split(",").map((item) => (
            <span
              key={item}
              className="hover:border-primary-600 border-transparent border-b-2 cursor-pointer text-sm opacity-85 font-normal transition-all ease-in-out duration-300 flex items-center gap-0.5"
              onClick={() =>
                updatePetition({
                  name: "languages",
                  value: petition.languages
                    .split(",")
                    .filter((lang) => lang !== item)
                    .join(","),
                })
              }
              title={`Remover idioma: ${item}`}
            >
              {item}{" "}
              <span className="text-red-500">
                <XIcon size={14} />
              </span>
            </span>
          ))}
        </div>

        {/* <div className="flex col-span-2 justify-end items-center">
          <Button
            placeholder={"Próximo"}
            className="bg-primary-600 rounded-full"
            type="button"
            onClick={() => {
              setActiveTab((old) => old + 1);
              console.log(petition);
            }}
          >
            Próximo
          </Button>
        </div> */}
      </div>
    </div>
  );
}

const formatDateToInput = (date: string) =>
  new Date(date).toISOString().split("T")[0];
