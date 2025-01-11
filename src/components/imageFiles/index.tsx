import { ArrowLeft, ArrowRight, ZoomIn, ZoomOut } from "lucide-react";
import { useState, Fragment, useEffect } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { tv } from "tailwind-variants";

interface ImageFilesProps {
  contents: string[];
  initialPage?: number;
}

const zoomButtonGroupTW = tv({
  base: "z-40 absolute -bottom-8 left-0 flex items-center gap-4",
  variants: {
    withoutPagination: {
      true: "left-1/2 transform -translate-x-1/2",
    },
  },
});
const paginationTW = tv({
  base: "z-40 flex gap-4 justify-end items-center absolute -bottom-8 right-0",
  variants: {
    noPagination: {
      true: "hidden",
    },
  },
});
const buttonPaginationTW = tv({
  base: "flex justify-center items-center h-6 w-6 hover:shadow-md rounded-lg hover:bg-gray-200 p-1 cursor-pointer transition-all ease-in-out duration-300",
  variants: {
    disabled: {
      true: "opacity-50 cursor-not-allowed",
    },
  },
});

export const ImageFiles = ({ contents, initialPage = 1 }: ImageFilesProps) => {
  const [files, setFiles] = useState(contents);
  const [page, setPage] = useState(initialPage);
  const src = files[page - 1];

  useEffect(() => {
    if (contents.filter(Boolean)?.length > 0) {
      setFiles(contents);
    }
  }, [contents]);

  if (!files.filter(Boolean)?.length) {
    return null;
  }
  return (
    <div className="flex flex-col col-span-1 gap-1 relative">
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
                <div
                  className={zoomButtonGroupTW({
                    withoutPagination: contents?.length === 1,
                  })}
                >
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
                <div
                  className={paginationTW({
                    noPagination: contents?.length === 1,
                  })}
                >
                  <button
                    className={buttonPaginationTW({
                      disabled: page === 1,
                    })}
                    onClick={(e) =>
                      page !== 1
                        ? setPage((old) => old - 1)
                        : e.preventDefault()
                    }
                    type="button"
                    disabled={page === 1}
                    title={
                      page !== 1 ? "Página anterior" : "Não há página anterior"
                    }
                  >
                    <ArrowLeft />
                  </button>
                  {page}
                  <button
                    className={buttonPaginationTW({
                      disabled: page === contents?.length,
                    })}
                    onClick={(e) =>
                      page !== contents?.length
                        ? setPage((old) => old + 1)
                        : e.preventDefault()
                    }
                    type="button"
                    disabled={page === contents?.length}
                    title={
                      page !== contents?.length
                        ? "Próxima página"
                        : "Não há próxima página"
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
