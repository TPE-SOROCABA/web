import { useState } from "react";
import { useHttp, useToastHot } from "../../../lib";
import { Button, Textarea } from "@material-tailwind/react";
import { Alert } from "../../../components";

export const CancelDesignation = ({
  designationId,
  designationStatus,
}: {
  designationId: string;
  designationStatus: string;
}) => {
  const [justification, setJustification] = useState("");
  const [show, setShow] = useState(false);
  const http = useHttp();
  const toast = useToastHot();

  const cancelDesignation = async () => {
    if (!designationId) return;
    if (!justification) {
      toast.error("Justificativa é obrigatória");
      return;
    }
    if (justification.length < 3) {
      toast.error("Justificativa deve ter no mínimo 3 caracteres");
      return;
    }
    await toast.promise(
      http.patch(`/designations/${designationId}/cancel`, {
        justification: "Cancelamento da designação",
      }),
      {
        loading: "Cancelando designação...",
        success: () => {
          setShow(false);
          setJustification("");
          return "Designação cancelada com sucesso";
        },
        error: (error) =>
          error?.response?.data?.message || "Erro ao cancelar designação",
      }
    );
    setShow(false);
  };

  return (
    <>
      <Button
        className="bg-red-600 text-white h-12"
        placeholder={"Cancelar designação"}
        hidden={
          designationStatus !== "OPEN" && designationStatus !== "IN_PROGRESS"
        }
        onClick={() => {
          setShow(true);
          setJustification("");
        }}
      >
        Cancelar designação
      </Button>
      <Alert
        show={show}
        close={() => {
          setShow(false);
          setJustification("");
        }}
      >
        <div className="flex justify-between items-center flex-col gap-2 bg-white p-4 rounded-lg min-w-[20vw] max-w-96">
          <h6 className="text-xl">
            Deseja mesmo cancelar a Designação desta semana?
          </h6>
          <p className="text-primary-400 pt-3 pb-2">
            Se estiver correto, deixe uma nota para justificar o cancelamento.
          </p>
          <Textarea
            label="Justificativa para o cancelamento"
            className="w-full bg-primary-100 focus:bg-primary-200"
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
          />
          <div className="flex justify-between w-full gap-4">
            <Button
              className="bg-white border border-primary-600 text-primary-600 font-bold"
              placeholder={"Cancelar designação"}
              onClick={cancelDesignation}
            >
              Concluir
            </Button>
            <Button
              className="bg-primary-500 text-white"
              placeholder={"Cancelar designação"}
              onClick={() => {
                setShow(false);
                setJustification("");
              }}
            >
              Voltar
            </Button>
          </div>
        </div>
      </Alert>
    </>
  );
};
