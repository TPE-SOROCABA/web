import { useState } from "react";
import { useToastHot } from "../../../lib";
import { Designation } from "../interfaces";
import { useDesignation } from "../useDesignation";
import { Button } from "@material-tailwind/react";
import { Alert } from "../../../components";

interface AutoDesignationProps {
  assignments: ReturnType<typeof useDesignation>["assignments"];
  getDesignation: ReturnType<typeof useDesignation>["getDesignation"];
  designationStatus: Designation["status"] | undefined;
}
export const AutoDesignation = ({
  assignments,
  getDesignation,
  designationStatus,
}: AutoDesignationProps) => {
  const toast = useToastHot();
  const [show, setShow] = useState(false);

  const handleRandomize = async () => {
    await toast.promise(getDesignation({ random: true }), {
      loading: "Designando automaticamente...",
      success: "Designação automática realizada com sucesso",
      error: (error) =>
        error?.response?.data?.message || "Erro ao designar automaticamente",
    });
    setShow(false);
  };

  const handleRandom = async () => {
    const haveAOneAssignment = assignments.some(
      (assignment) => assignment.participants.length >= 1
    );
    if (!haveAOneAssignment) {
      return handleRandomize();
    }
    setShow(true);
  };

  const close = () => setShow(false);
  return (
    <>
      <Button
        className="bg-primary-600 text-white"
        placeholder={"Designar Automaticamente"}
        onClick={handleRandom}
        hidden={designationStatus !== "OPEN"}
      >
        Designação Automática
      </Button>
      <Alert show={show} close={close}>
        <div className="flex justify-between items-center flex-col gap-2 bg-white p-4 rounded-lg min-w-[20vw] max-w-96">
          <h6 className="text-lg font-bold text-left w-full">
            Deseja mesmo fazer isso?
          </h6>
          <p className="text-primary-400 pt-3 pb-2">
            Existem pontos com voluntários designados, fazer isso irá substituir
            os voluntários designados.
          </p>
          <div className="flex justify-between w-full gap-4">
            <Button
              className="bg-white border border-primary-600 text-primary-600 font-bold"
              placeholder={"Designar Automaticamente"}
              onClick={handleRandomize}
            >
              Confirmar
            </Button>
            <Button
              className="bg-primary-500 text-white"
              placeholder={"Designar Automaticamente"}
              onClick={close}
            >
              Voltar
            </Button>
          </div>
        </div>
      </Alert>
    </>
  );
};
