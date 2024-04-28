import { Button, Input } from "@material-tailwind/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthLayout } from "../components";
import { useState } from "react";
import { useCookies, useHttp, useToast } from "../../../lib";
import { AxiosError } from "axios";
import { jwtDecode } from "jwt-decode";

export function CheckNumberCode() {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const jwtCode = query.get("code") as string;
  const { cpf: cpfJWT, code } = decode(jwtCode);
  const { cpf: cpfLocation } = location.state as { cpf?: string };
  const cpf = cpfLocation || cpfJWT;
  const [codeInput, setCodeInput] = useState(code);
  const navigate = useNavigate();
  const cookie = useCookies();
  const http = useHttp();
  const toast = useToast();

  const updateCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valueRaw = e.target.value;
    const value = valueRaw.replace(/\D/g, "");
    if (value.length > 6) return;
    setCodeInput(value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const toastId = toast.loading("Verificando código");
    try {
      const { data } = await http.post("/auth/login-code", {
        cpf: cpf.replace(/\D/g, ""),
        code: codeInput.toString(),
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
      <div className="h-4/6 flex flex-col p-4 md:w-1/2 md:justify-center gap-6">
        <div className="md:h-40 h-4/5 flex flex-col justify-evenly items-center">
          <h1 className="font-bold text-xl text-gray-800 md:w-96">
            Confirme o código de 6 dígitos enviado para o seu WhatsApp
          </h1>
          <div className="md:w-80 w-full flex items-center justify-between">
            <Input
              crossOrigin={false}
              className="flex justify-between"
              value={codeInput}
              onChange={updateCode}
              placeholder="Digite o código de 6 dígitos"
              label="Código"
            />
          </div>
        </div>
        <div className="h-1/5 flex flex-col justify-center items-center gap-4">
          <Button
            placeholder={"Entrar ou Login"}
            disabled={codeInput.length < 6}
            type="submit"
            className=" md:w-64 w-40 h-[60px] p-7 
            flex justify-center items-center rounded-2xl 
            bg-primary-600
            focus:opacity-65"
            size="lg"
          >
            Enviar
          </Button>
          <div className="text-gray-700 md:text-base text-sm">
            <Link to="/">Voltar</Link>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}

const decode = (
  str: string
): {
  code: string;
  cpf: string;
} => {
  try {
    return jwtDecode(str);
  } catch (error) {
    return { code: "", cpf: "" };
  }
};
