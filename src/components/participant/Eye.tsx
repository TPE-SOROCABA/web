// import { Button } from "@material-tailwind/react";
import { Button, Popover, PopoverContent, PopoverHandler } from "@material-tailwind/react";
import { Eye } from "lucide-react";

interface EyeComponentProps {
  moreText: string;
  buttonEvent: () => void;
}
export function EyeComponent({
  moreText,
  buttonEvent
}: EyeComponentProps) {

  return (
    <div className=" relative">
      <Popover
        placement="bottom-end"
      >
        <PopoverHandler
          animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0, y: 25 },
          }}
        >
          <div className="flex justify-center items-center text-primary-600 fill-current h-7 w-7 hover:scale-105 cursor-pointer transition-all ease-in-out duration-300 hover:drop-shadow-lg z-50">
            <Eye />
          </div>
        </PopoverHandler>
        <PopoverContent
          className="mt-1 flex flex-col gap-4 border-b border-blue-gray-50 p-4 z-50 w-[270px]"
          placeholder={"Motivos de ausência"}
        >
          <div>{moreText}</div>
          <div className="flex gap-2">
            <Button
              placeholder="Botão de ausência"
              className={`
                flex items-center justify-center gap-2
                h-full w-1/2 rounded-r-lg 
              `}
              disabled
              type="button"
              variant="outlined"
            >
              Histórico
            </Button>
            <Button
              placeholder="Botão de ausência"
              className={`
                flex items-center justify-center gap-2
                h-full w-1/2 rounded-r-lg bg-green-400 border border-green-400
              `}
              onClick={buttonEvent}
              type="button"
            >
              Ativar
            </Button>
          </div>

        </PopoverContent>
      </Popover>
    </div>
  );
}
