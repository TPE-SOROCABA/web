import { AxiosError } from "axios";
import { BoxScreen } from "../../../components/box";
import { useToast } from "../../../lib";
import { useHttp } from "../useHttpDev";
import toast from "react-hot-toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IPetition } from "../types";

export function UploadPeticao() {
  const [loading, setLoading] = useState(false);
  const http = useHttp();
  const router = useNavigate();

  const isPDF = (file: File) => file.type === "application/pdf";

  const uploadFile = async (file: File) => {
    if (!isPDF(file)) {
      toast.error("O arquivo precisa ser um PDF");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);

    const TEN_MINUTES = 10 * 60 * 1000;
    const toastId = toast.loading("Enviando petição...", {
      duration: TEN_MINUTES,
    });
    try {
      const endpoint = location.hostname.includes("localhost")
        ? "/petition/upload-test"
        : "/petition/upload";
      const { status, data } = await http.postForm<IPetition>(
        endpoint,
        formData
      );
      if (status !== 201) {
        toast.error("Erro ao enviar arquivo", { id: toastId });
      }

      toast.success("Petição enviada com sucesso", { id: toastId });
      router("/peticao/form", {
        state: { petition: data },
      });
    } catch (e) {
      toast.error("Erro ao enviar arquivo", { id: toastId });

      const error = e instanceof AxiosError ? e.response?.data : e;
      console.error(error);
    } finally {
      setLoading(false);
      setTimeout(() => toast.dismiss(toastId), 3000);
    }
  };

  return (
    <BoxScreen showBreadcrumbs loader={loading}>
      <div className="w-full min-h-96 flex justify-center items-center flex-col gap-6">
        <h1 className="text-3xl font-bold">Enviar Petição</h1>
        <p className="max-w-[40%] text-center font-medium text-lg">
          Clique em enviar Petição ou arraste o arquivo em PDF. Selecione uma e
          confira o sucesso da petição e protocolo da petição.
        </p>
        <UploadArea uploadFile={uploadFile} />
      </div>
    </BoxScreen>
  );
}

interface UploadAreaProps {
  uploadFile: (file: File) => void;
}

const UploadArea = ({ uploadFile }: UploadAreaProps) => {
  const toast = useToast();

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer?.files?.[0];
    if (!file) {
      toast.error("Arquivo não encontrado");
      return;
    }
    const quantityFiles = event.dataTransfer?.files?.length;
    if (quantityFiles !== 1) {
      toast.error("Arraste apenas um arquivo");
      return;
    }
    uploadFile(file);
  };

  const handleInputFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      toast.error("Arquivo não encontrado");
      return;
    }
    const quantityFiles = event.target.files?.length;
    if (quantityFiles !== 1) {
      toast.error("Selecione apenas um arquivo");
      return;
    }
    uploadFile(file);
  };

  return (
    <div
      className="w-1/3 bg-gray-200 h-48 flex flex-col justify-center items-center gap-4 border-dashed border-4 border-gray-300 rounded-3xl"
      onDrop={handleDrop}
      onDragOver={(event) => event.preventDefault()}
    >
      <p className="text-lg font-medium">Arraste um arquivo</p>
      <p className="text-md font-normal">ou</p>
      <InputFile onChange={handleInputFile} />
    </div>
  );
};

const InputFile = (
  inputProps: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
) => (
  <label className="flex flex-col justify-center items-center text-center gap-2 relative w-60 h-12 rounded-xl text-white bg-primary-600 hover:opacity-90 cursor-pointer transition-all ease-in-out duration-300 py-1 px-2">
    <input
      type="file"
      className="hidden absolute z-50 w-full h-full"
      {...inputProps}
      accept=".pdf"
    />
    Selecione a petição
  </label>
);
