import { Button, Option, Select } from "@material-tailwind/react";
import { BoxScreen } from "../../components/box";
import { useCallback, useEffect, useState } from "react";
import { FileIcon } from "lucide-react";
import { useHttp } from "./useHttpDev";
import { Link, useNavigate } from "react-router-dom";
import { IPetition } from "./types";
import { PetitionProvider } from "./store";
import { usePetitionStore } from "./store/useContextForm";
import { FilterText } from "../../components/filter";

export function Peticao() {
  return (
    <PetitionProvider>
      <Petition />
    </PetitionProvider>
  );
}

function Petition() {
  const http = useHttp();
  const { mode, searchProtocol, searchStatus } = usePetitionStore();
  const [petitions, setPetitions] = useState<IPetition[]>([]);
  const [loading, setLoading] = useState(true);

  const listPetitions = useCallback(async () => {
    try {
      const url = new URLSearchParams({
        ...(searchProtocol && { protocol: searchProtocol }),
        ...(searchStatus !== "ALL" && { status: searchStatus }),
      });
      const querie = url.toString() ? `?${url.toString()}` : "";
      const response = await http.get("petitions" + querie);
      setPetitions(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [http, searchProtocol, searchStatus]);

  useEffect(() => {
    listPetitions();
  }, [listPetitions]);

  return (
    <BoxScreen
      showBreadcrumbs
      loader={loading}
      rightContent={<AddPetitionButton />}
    >
      {mode === "coordinator" ? <Header /> : <Filter />}
      <Petitions petitions={petitions} />
    </BoxScreen>
  );
}
const OPTIONS_STATUS = [
  { label: "Todos", value: "ALL" },
  { label: "Ativo", value: "ACTIVE" },
  { label: "Aguardando Informações", value: "WAITING_INFORMATION" },
  { label: "Em espera", value: "WAITING" },
  // { label: "Inativo", value: "inactive" },
  // { label: "Expirado", value: "expired" },
  { label: "Suspensa", value: "SUSPENDED" },
  { label: "Excluído", value: "EXCLUDED" },
  // { label: "Temporário", value: "temporary" },
];
function Filter() {
  const {
    setSearchProtocol: setSearch,
    searchStatus,
    setSearchStatus,
  } = usePetitionStore();
  return (
    <div className="w-full grid grid-cols-4 gap-4 text-black">
      <FilterText
        toSearch="Pesquisar por protocolo"
        showButton={false}
        className="col-span-2"
        handleSearchEvent={(search) => setSearch(search)}
      />
      <div className="col-span-1" />
      <Select
        placeholder="Selecionar"
        label="Filtrar"
        containerProps={{ className: "col-span-1" }}
        size="lg"
        value={searchStatus}
        onChange={(value) => setSearchStatus(value as any)}
      >
        {OPTIONS_STATUS.map((option) => (
          <Option key={option.value} value={option.value} defaultValue={"ALL"}>
            {option.label}
          </Option>
        ))}
      </Select>
    </div>
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
  const { mode } = usePetitionStore();
  if (mode === "analyst") return null;
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
  const { mode } = usePetitionStore();
  return (
    <div className="w-full flex flex-col">
      <div className="grid grid-cols-12 gap-4 w-full items-end text-center">
        <div className="col-span-1">
          <FileIcon size={40} className="invisible" />
        </div>
        <div className={`col-span-${mode === "analyst" ? 2 : 3}`}>Nome</div>
        <div className="col-span-3">Protocolo</div>
        <div className={`col-span-${mode === "analyst" ? 2 : 3}`}>
          {mode === "analyst" ? "Status" : "Mensagem de erro"}
        </div>
        <div className="col-span-2" hidden={mode !== "analyst"}>
          Data
        </div>
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
  const { mode } = usePetitionStore();
  const router = useNavigate();

  const buttonLabel = () => {
    if (mode === "coordinator") {
      return "Visualizar";
    }
    const labels = {
      WAITING_INFORMATION: "Completar",
      WAITING: "Editar",
      ACTIVE: "Visualizar",
      SUSPENDED: "Visualizar",
      EXCLUDED: "Visualizar",
      CREATED: "Completar",
    };
    return labels[petition.status] || "Visualizar";
  };

  const status = {
    WAITING_INFORMATION: "Aguardando Informações",
    WAITING: "Em espera",
    ACTIVE: "Ativo",
    SUSPENDED: "Suspensa",
    EXCLUDED: "Excluída",
    CREATED: "Aguardando Informações",
  };

  const openPetition = (petition: IPetition) => {
    router("/peticao/form", {
      state: { petition },
    });
  };

  return (
    <div className="py-4 grid grid-cols-12 gap-4 items-center last:border-0 border-b border-primary-200 text-black font-medium text-lg text-center">
      <div className="col-span-1ds">
        <FileIcon size={40} />
      </div>
      <div className={`col-span-${mode === "analyst" ? 2 : 3}`}>
        {petition?.participants[0]?.name || "- - -"}
      </div>
      <div className="col-span-3">{petition.protocol}</div>
      <div className={`col-span-${mode === "analyst" ? 2 : 3}`}>
        {status[petition.status] || "- - -"}
      </div>
      <div className="col-span-2 text-center" hidden={mode !== "analyst"}>
        {new Date(petition.createdAt).toLocaleDateString()}
      </div>
      <div className="col-span-2">
        <Button
          placeholder={"Vizualizar"}
          className="rounded-3xl bg-primary-600 px-11 py-4 w-full"
          onClick={() => openPetition(petition)}
        >
          {buttonLabel()}
        </Button>
      </div>
    </div>
  );
}
