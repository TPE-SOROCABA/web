import { Button } from "@material-tailwind/react";
import { BoxScreen } from "../../components/box";
import { useCallback, useEffect, useState } from "react";
import { FileIcon } from "lucide-react";
import { useHttp } from "./useHttpDev";
import { Link } from "react-router-dom";
import { IPetition } from "./types";

export function Peticao() {
  const [petitions, setPetitions] = useState<IPetition[]>([]);
  const [loading, setLoading] = useState(true);
  const http = useHttp();

  const listPetitions = useCallback(async () => {
    try {
      const response = await http.get("petitions");
      setPetitions(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [http]);

  useEffect(() => {
    listPetitions();
  }, [listPetitions]);

  return (
    <BoxScreen
      showBreadcrumbs
      loader={loading}
      rightContent={<AddPetitionButton />}
    >
      <Header />
      <Petitions petitions={petitions} />
    </BoxScreen>
  );
}

function Header() {
  return (
    <div className="w-full flex flex-col items-center justify-center gap-4 text-black">
      <h1 className="text-lg font-bold">Enviar Petições</h1>
      <p className="max-w-[40%] text-base font-medium text-center">
        Estas petições estão faltando informações. Conclua o cadastro para
        atualizar o status de cada petição.
      </p>
    </div>
  );
}

function AddPetitionButton() {
  return (
    <Link to="upload">
      <Button
        className="rounded-2xl bg-primary-600 px-11 py-4"
        placeholder={"Nova Petição"}
      >
        Nova Petição
      </Button>
    </Link>
  );
}

function Petitions({ petitions }: { petitions: IPetition[] }) {
  return (
    <div className="w-full flex flex-col">
      <div className="grid grid-cols-12 gap-4 w-full items-end">
        <div className="col-span-1">
          <FileIcon size={40} className="invisible" />
        </div>
        <div className="col-span-3">Nome</div>
        <div className="col-span-3">Protocolo</div>
        <div className="col-span-3">Mensagem de erro</div>
        <div className="col-span-2"></div>
      </div>
      <div className="w-full flex flex-col gap-4">
        {petitions.map((petition) => (
          <PetitionRow key={petition.id} petition={petition} />
        ))}
      </div>
    </div>
  );
}

function PetitionRow({ petition }: { petition: IPetition }) {
  return (
    <div className="py-10 grid grid-cols-12 gap-4 items-center last:border-0 border-b border-primary-200 text-black font-medium text-lg">
      <div className="col-span-1ds">
        <FileIcon size={40} />
      </div>
      <div className="col-span-3">-</div>
      <div className="col-span-3">{petition.protocol}</div>
      <div className="col-span-3">-</div>
      <div className="col-span-2">
        <Button
          placeholder={"Vizualizar"}
          className="rounded-3xl bg-primary-600 px-11 py-4 w-full"
        >
          Vizualizar
        </Button>
      </div>
    </div>
  );
}
