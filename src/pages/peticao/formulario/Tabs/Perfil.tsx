import { Input, Option, Select } from "@material-tailwind/react";
import { usePetitionFormStore } from "../store/useContextForm";
import { formatPhone, formatZipCode } from "../../../../utils";
import { debounce, useToast } from "src/lib";
import axios from "axios";
import dayjs from "dayjs";

export function Perfil() {
  const { petition, updatePetition, mode } = usePetitionFormStore();
  const statusIsCreated = petition?.status === "CREATED";
  const isAnalyst = mode === "analyst";
  const disableInputs = isAnalyst && statusIsCreated;
  const toast = useToast();

  const updatePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phoneRaw = e.target.value.trim().replace(/\D/g, "");
    updatePetition({ name: "phone", value: phoneRaw });
  };

  const updateGender = (value: string) => {
    if (!value) return;
    const attribution = petition?.participants[0]?.attributions?.[0];
    const onlyMaleAttributions = ["ANCIÃO", "SERVO MINISTERIAL"];
    if (onlyMaleAttributions.includes(attribution) && value === "feminino") {
      toast.error(`Uma irmã não pode ser ${attribution}, \nPor isso foi atribuido como Publicadora automaticamente`);
      updatePetition({
        name: "attributions",
        value: ['PUBLICADOR(A)'],
      });
    }
    updatePetition({
      name: "sex",
      value: value === "masculino" ? "MALE" : "FEMALE",
    })
  }

  const findAddressByZipCode = async (zipCode: string) => {
    const { data, status } = await axios.get(`https://viacep.com.br/ws/${zipCode}/json/`);
    if (status > 299) return;
    const { logradouro, localidade, uf } = data;
    updatePetition({
      name: "address",
      value: logradouro,
    })
    updatePetition({
      name: "city",
      value: localidade,
    })
    updatePetition({
      name: "state",
      value: uf,
    })
  }
  const debouncedFindAddressByZipCode = debounce(findAddressByZipCode, 1000);

  const updateBirthDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = dayjs(e.target.value);
    if (date > dayjs()) {
      toast.error("Data de nascimento não pode ser maior que a data atual");
      return;
    }
    updatePetition({ name: "birthDate", value: date.format("YYYY-MM-DD") });
  }


  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 space-y-2 gap-4">
        <Input
          crossOrigin
          label="Nome"
          containerProps={{ className: "col-span-2" }}
          value={petition.participants[0]?.name}
          name="name"
          onChange={(e) => updatePetition(e.target)}
          disabled={disableInputs}
        />
        <Input
          crossOrigin
          label="Email"
          containerProps={{ className: "col-span-1" }}
          value={petition.participants[0]?.email}
          name="email"
          onChange={(e) => updatePetition(e.target)}
          disabled={disableInputs}
        />
        <Input
          crossOrigin
          label="Celular"
          containerProps={{ className: "col-span-1" }}
          value={formatPhone(petition.participants[0]?.phone)}
          onChange={updatePhone}
          maxLength={15}
          disabled={disableInputs}
        />
        <Input
          crossOrigin
          label="Data de Nascimento"
          containerProps={{ className: "col-span-1" }}
          value={formatDateToInput(
            petition.participants[0]?.birthDate as any as string
          )}
          max={dayjs().subtract(14, "year").format("YYYY-MM-DD")}
          name="birthDate"
          onChange={updateBirthDate}
          type="date"
          disabled={disableInputs}
        />
        <Select
          label="Estado Civil"
          placeholder={"Selecione"}
          containerProps={{ className: "col-span-1" }}
          value={petition.participants[0]?.civilStatus}
          onChange={(value) =>
            updatePetition({ name: "civilStatus", value: value })
          }
          disabled={disableInputs}
        >
          <Option value="MARRIED">Casado</Option>
          <Option value="SINGLE">Solteiro</Option>
        </Select>
        <Select
          label="Gênero"
          placeholder={"Selecione"}
          containerProps={{ className: "col-span-1" }}
          value={
            petition.participants[0]?.sex === "MALE" ? "masculino" : petition.participants[0]?.sex === "FEMALE" ? "feminino" : "nao-declarado"
          }
          onChange={(value) => updateGender(value ?? "")}
          disabled={disableInputs}
          defaultValue="nao-declarado"
        >
          <Option value="nao-declarado" defaultValue="nao-declarado" disabled>Não Declarado</Option>
          <Option value="masculino">Masculino</Option>
          <Option value="feminino">Feminino</Option>
        </Select>
        <Input
          crossOrigin
          label="Endereço"
          containerProps={{ className: "col-span-1" }}
          value={petition.participants[0]?.address}
          name="address"
          onChange={(e) => updatePetition(e.target)}
          disabled={disableInputs}
        />
        <Input
          crossOrigin
          label="Cidade"
          containerProps={{ className: "col-span-1" }}
          value={petition.participants[0]?.city}
          name="city"
          onChange={(e) => updatePetition(e.target)}
          disabled={disableInputs}
        />
        <Input
          crossOrigin
          label="Estado"
          containerProps={{ className: "col-span-1" }}
          value={petition.participants[0]?.state}
          name="state"
          onChange={(e) => updatePetition(e.target)}
          disabled={disableInputs}
        />
        <Input
          crossOrigin
          label="CEP"
          containerProps={{ className: "col-span-1" }}
          value={formatZipCode(petition.participants[0]?.zipCode)}
          onChange={(e) => {
            updatePetition({
              name: 'zipCode',
              value: e.target.value.replace(/\D/g, "")
            })
            debouncedFindAddressByZipCode(e.target.value.replace(/\D/g, ""))
          }}
          disabled={disableInputs}
        />
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

const formatDateToInput = (date: string) => {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
};
