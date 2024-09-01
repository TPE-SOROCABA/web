import { Button, Input, Option, Select } from "@material-tailwind/react";
import { usePetitionFormStore } from "../store/useContextForm";
import { formatPhone, formatZipCode } from "../../../../utils";

export function Perfil() {
  const { petition, setActiveTab, updatePetition } = usePetitionFormStore();

  const updatePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phoneRaw = e.target.value.trim().replace(/\D/g, "");
    updatePetition({ name: "phone", value: phoneRaw });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="h-20">upload de imagem</div>
      <div className="grid grid-cols-2 space-y-2 gap-4">
        <Input
          crossOrigin
          label="Nome"
          containerProps={{ className: "col-span-2" }}
          value={petition.name}
          name="name"
          onChange={(e) => updatePetition(e.target)}
        />
        <Input
          crossOrigin
          label="Endereço"
          containerProps={{ className: "col-span-1" }}
          value={petition.address}
          name="address"
          onChange={(e) => updatePetition(e.target)}
        />
        <Input
          crossOrigin
          label="Email"
          containerProps={{ className: "col-span-1" }}
          value={petition.email}
          name="email"
          onChange={(e) => updatePetition(e.target)}
        />
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
          label="CEP"
          containerProps={{ className: "col-span-1" }}
          value={formatZipCode(petition.zipCode)}
          onChange={(e) =>
            updatePetition({
              name: "zipCode",
              value: e.target.value.replace(/\D/g, ""),
            })
          }
        />
        <Input
          crossOrigin
          label="Celular"
          containerProps={{ className: "col-span-1" }}
          value={formatPhone(petition.phone)}
          onChange={updatePhone}
        />
        <Input
          crossOrigin
          label="Data de Nascimento"
          containerProps={{ className: "col-span-1" }}
          value={formatDateToInput(petition.dateOfBirth)}
          name="dateOfBirth"
          onChange={(e) => updatePetition(e.target)}
          type="date"
        />
        <Select
          label="Estado Civil"
          placeholder={"Selecione"}
          containerProps={{ className: "col-span-1" }}
          value={petition.maritalStatus}
          onChange={(value) =>
            updatePetition({ name: "maritalStatus", value: value })
          }
        >
          <Option value="solteiro">Solteiro</Option>
          <Option value="casado">Casado</Option>
        </Select>
        <Select
          label="Sexo"
          placeholder={"Selecione"}
          containerProps={{ className: "col-span-1" }}
          value={petition.gender === "MALE" ? "masculino" : "feminino"}
          onChange={(value) =>
            updatePetition({
              name: "gender",
              value: value === "masculino" ? "MALE" : "FEMALE",
            })
          }
        >
          <Option value="masculino">Masculino</Option>
          <Option value="feminino">Feminino</Option>
        </Select>
        <div className="flex col-span-2 justify-end items-center">
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
        </div>
      </div>
    </div>
  );
}

const formatDateToInput = (date: string) =>
  new Date(date).toISOString().split("T")[0];
