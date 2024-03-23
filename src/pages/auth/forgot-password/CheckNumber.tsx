import { Button, Input } from "@material-tailwind/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthLayout } from "../components";
import { useState } from "react";
import { useCookies, useHttp, useToast } from "../../../lib";
import { AxiosError } from "axios";

export function CheckNumberCode() {
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const cookie = useCookies();
  const http = useHttp();
  const toast = useToast();
  const { cpf } = location.state as { cpf: string };

  const updateCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valueRaw = e.target.value;
    const value = valueRaw.replace(/\D/g, "");
    if (value.length > 6) return;
    setCode(value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const toastId = toast.loading("Verificando código");
    try {
      const { data } = await http.post("/auth/login-code", {
        cpf: cpf.replace(/\D/g, ""),
        code,
      });
      cookie.set("token", data.token);
      navigate("/forgot-password/new-password", {
        state: { cpf },
      });
      toast.success("Código verificado com sucesso");
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        if (status === 404) {
          return toast.error("Código inválido");
        }
      }
    } finally {
      toast.dismiss(toastId as string);
    }
  };

  return (
    <AuthLayout onSubmit={onSubmit}>
      <div className="h-4/6 flex flex-col md:w-1/2 md:justify-center">
        <div className="md:h-40 h-4/5 flex flex-col justify-evenly items-center">
          <h1 className="font-bold text-xl text-gray-800 md:w-96">
            Confirme o código de 6 dígitos enviado para o seu WhatsApp
          </h1>
          <div className="md:w-96 w-full flex items-center justify-between">
            <Input
              crossOrigin={false}
              className="flex justify-between"
              value={code}
              onChange={updateCode}
              placeholder="Digite o código de 6 dígitos"
              label="Código"
            />
          </div>
        </div>
        <div className="h-1/5 flex flex-col justify-center items-center gap-4">
          <Button
            placeholder={"Entrar ou Login"}
            disabled={code.length < 6}
            type="submit"
            className="md:w-96 w-40 md:rounded-xl bg-primary-600"
            size="lg"
          >
            Enviar
          </Button>
          <div className="md:w-96 w-40 flex justify-center md:justify-end text-gray-700 md:text-base text-sm">
            <Link to="/">Voltar</Link>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
