import { useState } from "react";
import { BoxScreen } from "../../../components/box";
import { PetitionFormProvider } from "./store";
import { usePetitionFormStore } from "./store/useContextForm";
import { HandlerTabs } from "./Tabs";
import { ArrowLeft, ArrowRight } from "lucide-react";

export function FormularioPeticao() {
  return (
    <PetitionFormProvider>
      <BoxScreen showBreadcrumbs>
        <div className="grid grid-cols-3 gap-4">
          <HandlerTabs />
          <Files />
        </div>
      </BoxScreen>
    </PetitionFormProvider>
  );
}

const Files = () => {
  const { petition } = usePetitionFormStore();
  const { pageOneUrl, pageTwoUrl } = petition;
  const [page, setPage] = useState(1);

  const renderFile = (url: string) => {
    return <img src={url} alt="peticao" className="rounded-lg shadow-md" />;
  };

  return (
    <div className="flex flex-col col-span-1 gap-1">
      {page === 1 ? renderFile(pageOneUrl) : renderFile(pageTwoUrl)}
      <div className="flex gap-4 w-full justify-end items-center">
        <button
          className={
            "flex justify-center items-center h-6 w-6 hover:shadow-md rounded-lg hover:bg-gray-200 p-1 cursor-pointer transition-all ease-in-out duration-300"
          }
          onClick={(e) => (page !== 1 ? setPage(1) : e.preventDefault())}
          type="button"
          disabled={page === 1}
          title={page === 2 ? "Página anterior" : "Não há página anterior"}
        >
          <ArrowLeft />
        </button>
        {page}
        <button
          className={
            "flex justify-center items-center h-6 w-6 hover:shadow-md rounded-lg hover:bg-gray-200 p-1 cursor-pointer transition-all ease-in-out duration-300"
          }
          onClick={(e) => (page !== 2 ? setPage(2) : e.preventDefault())}
          type="button"
          disabled={page === 2}
          title={page === 1 ? "Próxima página" : "Não há próxima página"}
        >
          <ArrowRight />
        </button>
      </div>
    </div>
  );
};
