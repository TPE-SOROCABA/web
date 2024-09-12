import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useState, Fragment } from "react";
import { BoxScreen } from "../../../components/box";
import { PetitionFormProvider } from "./store";
import { usePetitionFormStore } from "./store/useContextForm";
import { HandlerTabs } from "./Tabs";
import { ArrowLeft, ArrowRight, ZoomIn, ZoomOut } from "lucide-react";

export function FormularioPeticao() {
  return (
    <PetitionFormProvider>
      <BoxScreen showBreadcrumbs>
        <div className="grid grid-cols-2 gap-8">
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

  const src = page === 1 ? pageOneUrl : pageTwoUrl;

  return (
    <div className="flex flex-col col-span-1 gap-1 relative border rounded-2xl shadow-md">
      <div className="container mx-auto p-4">
        <TransformWrapper
          defaultScale={1}
          wheel={{ step: 0.1 }}
          pan={{ velocity: 0.5 }}
          zoomIn={{ step: 0.1 }}
          zoomOut={{ step: 0.1 }}
        >
          {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
            <Fragment>
              <div className="relative">
                <TransformComponent contentClass="cursor-grab selection:cursor-grabbing">
                  <img src={src} alt="Imagem" className="w-full h-auto" />
                </TransformComponent>
                <div className="z-40 absolute -bottom-3 left-0 flex items-center gap-4 bg-white">
                  <button
                    className="flex justify-center items-center h-6 w-6 hover:shadow-md rounded-lg hover:bg-gray-200 p-1 cursor-pointer transition-all ease-in-out duration-300"
                    onClick={() => zoomOut()}
                    type="button"
                  >
                    <ZoomOut />
                  </button>
                  <button
                    className="flex justify-center items-center h-6 w-6 hover:shadow-md rounded-lg hover:bg-gray-200 p-1 cursor-pointer transition-all ease-in-out duration-300"
                    onClick={() => zoomIn()}
                    type="button"
                  >
                    <ZoomIn />
                  </button>
                </div>
                <div className="z-40 flex gap-4 justify-end items-center absolute -bottom-3 right-0 bg-white">
                  <button
                    className={
                      "flex justify-center items-center h-6 w-6 hover:shadow-md rounded-lg hover:bg-gray-200 p-1 cursor-pointer transition-all ease-in-out duration-300"
                    }
                    onClick={(e) =>
                      page !== 1 ? setPage(1) : e.preventDefault()
                    }
                    type="button"
                    disabled={page === 1}
                    title={
                      page === 2 ? "Página anterior" : "Não há página anterior"
                    }
                  >
                    <ArrowLeft />
                  </button>
                  {page}
                  <button
                    className={
                      "flex justify-center items-center h-6 w-6 hover:shadow-md rounded-lg hover:bg-gray-200 p-1 cursor-pointer transition-all ease-in-out duration-300"
                    }
                    onClick={(e) =>
                      page !== 2 ? setPage(2) : e.preventDefault()
                    }
                    type="button"
                    disabled={page === 2}
                    title={
                      page === 1 ? "Próxima página" : "Não há próxima página"
                    }
                  >
                    <ArrowRight />
                  </button>
                </div>
              </div>
            </Fragment>
          )}
        </TransformWrapper>
      </div>
    </div>
  );
};
