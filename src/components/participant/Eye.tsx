import { Button } from "@material-tailwind/react";
import { Eye } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface EyeComponentProps {
  show?: boolean;
  showMore: boolean;
  setShowMore: Dispatch<SetStateAction<boolean>>;
  moreText: string;
}
export function EyeComponent({
  show,
  showMore,
  setShowMore,
  moreText,
}: EyeComponentProps) {
  if (!show) return null;

  return (
    <>
      <div
        onClick={() => {
          console.log("click");
          setShowMore((old) => !old);
        }}
        className="flex justify-center items-center text-primary-600 fill-current h-7 w-7 hover:scale-105 cursor-pointer transition-all ease-in-out duration-300 hover:drop-shadow-lg z-50"
      >
        <Eye />
      </div>
      <div
        className={`
              absolute top-[105%] left-0 w-72 p-2 bg-white rounded-bl-lg rounded-br-lg shadow-2xl drop-shadow-2xl z-50
              flex items-center flex-col gap-2
              ${showMore ? "block" : "hidden"}
           `}
      >
        <p className="text-primary-600 text-md">{moreText}</p>
        <div className="flex flex-row justify-around items-center w-full">
          <Button
            variant="outlined"
            className="w-2/5 border-primary-300 flex justify-center items-center text-sm p-2"
            placeholder="Histórico do participante"
          >
            Histórico
          </Button>
          <Button
            variant="outlined"
            className="w-2/5 border-primary-300 flex justify-center items-center text-sm p-2"
            placeholder="Editar participante"
          >
            Editar
          </Button>
        </div>
      </div>
    </>
  );
}
