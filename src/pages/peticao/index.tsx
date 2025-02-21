import { Button, Option, Select } from "@material-tailwind/react";
import { BoxScreen } from "../../components/box";
import { useCallback, useEffect, useState } from "react";
import { FileIcon, InfoIcon, ClockIcon, CheckIcon, BanIcon, XIcon } from "lucide-react";
import { useHttp } from "./useHttpDev";
import { Link, useNavigate } from "react-router-dom";
import { IPetition } from "./types";
import { PetitionProvider, Status } from "./store";
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
  const { search, searchStatus } = usePetitionStore();
  const [petitions, setPetitions] = useState<IPetition[]>([]);
  const [loading, setLoading] = useState(true);

  const listPetitions = useCallback(async () => {
    try {
      const url = new URLSearchParams({
        ...(search && { search }),
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
  }, [http, search, searchStatus]);

  useEffect(() => {
    listPetitions();
  }, [listPetitions]);

  return (
    <BoxScreen
      showBreadcrumbs
      loader={loading}
      rightContent={<AddPetitionButton />}
    >
      <Filter />
      {petitions?.length > 0 ? (
        <Petitions petitions={petitions} />
      ) : (
        <div className="w-full flex flex-col items-center justify-center h-40">
          <p className="text-lg font-bold text-primary-400">Nenhuma petição encontrada</p>
        </div>
      )}
    </BoxScreen>
  );
}
const OPTIONS_STATUS = [
  { label: "Todos", value: "ALL" },
  { label: "Ativo", value: "ACTIVE" },
  { label: "Aguardando confirmação", value: "CREATED" },
  { label: "Aguardando Informações", value: "WAITING_INFORMATION" },
  { label: "Em espera", value: "WAITING" },
  { label: "Suspensa", value: "SUSPENDED" },
  { label: "Excluído", value: "EXCLUDED" },
];
function Filter() {
  const {
    setSearch: setSearch,
    searchStatus,
    setSearchStatus,
  } = usePetitionStore();
  return (
    <div className="w-full grid grid-cols-4 gap-4 text-black">
      <FilterText
        toSearch="Pesquisar por protocolo ou nome"
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
          <Option key={option.value} value={option.value} defaultValue={"WAITING_INFORMATION"}>
            {option.label}
          </Option>
        ))}
      </Select>
    </div>
  );
}

// function Header() {
//   return (
//     <div className="w-full flex flex-col items-center justify-center gap-4 text-black">
//       <h1 className="text-lg font-bold">Enviar Petições</h1>
//       <p className="max-w-[40%] text-base font-medium text-center">
//         Estas petições estão faltando informações. Conclua o cadastro para
//         atualizar o status de cada petição.
//       </p>
//     </div>
//   );
// }

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
  const petitionsSorted = petitions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return (
    <div className="w-full flex flex-col">
      <div className="grid grid-cols-12 gap-4 w-full items-end text-center text-lg font-semibold text-primary-800">
        <div className="col-span-1">
          <FileIcon size={40} className="invisible" />
        </div>
        <div className={`col-span-2`}>Nome</div>
        <div className="col-span-3">Protocolo</div>
        <div className={`col-span-2`}>
          {mode === "analyst" ? "Status" : "Mensagem de erro"}
        </div>
        <div className="col-span-2">
          Data e Hora
        </div>
        <div className="col-span-2"></div>
      </div>
      <div className="w-full flex flex-col gap-4">
        {petitionsSorted.map((petition) => (
          <PetitionRow key={petition.id} petition={petition} />
        ))}
      </div>
    </div>
  );
}

function PetitionRow({ petition }: { petition: IPetition }) {
  const router = useNavigate();

  const buttonLabel = () => {
    const labels = {
      WAITING_INFORMATION: "Completar",
      WAITING: "Editar",
      ACTIVE: "Visualizar",
      SUSPENDED: "Visualizar",
      EXCLUDED: "Visualizar",
      CREATED: "Visualizar",
    };
    return labels[petition.status] || "Visualizar";
  };

  const status: Record<Status, string> = {
    WAITING_INFORMATION: "Aguardando Informações",
    WAITING: "Em espera",
    ACTIVE: "Ativo",
    SUSPENDED: "Suspensa",
    EXCLUDED: "Excluída",
    CREATED: "Aguardando confirmação",
    ALL: "Todos",
  };

  const openPetition = (petition: IPetition) => {
    router("/peticao/form", {
      state: { petition },
    });
  };

  const statusColor: Record<Status, string> = {
    WAITING_INFORMATION: "text-[#D4C159]",
    WAITING: "text-[#89B275]",
    ACTIVE: "",
    SUSPENDED: "",
    EXCLUDED: "",
    ALL: "",
    CREATED: "text-[#D48859]",
  };

  const statusIcon: Record<Status, React.ReactNode> = {
    WAITING_INFORMATION: <InfoIcon size={40} className="text-[#D4C159]" />,
    WAITING: <CheckIcon size={40} className="text-[#89B275]" />,
    ACTIVE: <CheckIcon size={40} className="text-[#89B275]" />,
    SUSPENDED: <BanIcon size={40} className="text-[#D4C159]" />,
    EXCLUDED: <XIcon size={40} className="text-[#D46559]" />,
    CREATED: <ClockIcon size={40} className="text-[#D48859]" />,
    ALL: <InfoIcon size={40} />,
  };

  return (
    <div className="py-4 grid grid-cols-12 gap-4 items-center last:border-0 border-b border-primary-200 text-black font-medium text-lg text-center">
      <div className="col-span-1">
        {statusIcon[petition.status]}
      </div>
      <div className={`col-span-2`}>
        {petition?.participants[0]?.name || "- - -"}
      </div>
      <div className="col-span-3">{petition.protocol}</div>
      <div className={`col-span-2 ${statusColor[petition.status]}`}>
        {status[petition.status] || "- - -"}
      </div>
      <div className="col-span-2 text-center">
        {new Date(petition.createdAt).toLocaleDateString() + " " + new Date(petition.createdAt).toLocaleTimeString()}
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
