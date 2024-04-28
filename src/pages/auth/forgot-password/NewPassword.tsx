import { Button, Input } from "@material-tailwind/react";
import { AuthLayout } from "../components";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useHttp, useToast } from "../../../lib";
import { AxiosError } from "axios";

export function NewPassword() {
  const [password, setPassword] = useState({
    value: "",
    confirm: "",
  });
  const http = useHttp();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { cpf } = location.state as { cpf: string };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!password.value || !password.confirm) {
      return toast.error("Preencha todos os campos");
    }
    const dontIsEqual = password.value !== password.confirm;
    if (dontIsEqual) {
      return toast.error("As senhas não coincidem");
    }
    const toastId = toast.loading("Salvando nova senha");
    try {
      await http.post("/auth/reset-password", {
        cpf: cpf.replace(/\D/g, ""),
        password: password.value,
      });
      // navigate("/dashboard");
      navigate("/lista-designacao");
      toast.success("Senha salva com sucesso");
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        if (status === 404) {
          return toast.error("CPF não encontrado");
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
          <h1 className="font-bold text-xl text-gray-800 md:hidden">
            Insira aqui a sua nova senha
          </h1>
          <div className="md:w-80 w-full flex flex-col items-center md:gap-12 gap-6">
            <Input
              crossOrigin={false}
              className="flex justify-between"
              name="value"
              value={password.value}
              onChange={(e) =>
                setPassword({ ...password, value: e.target.value })
              }
              placeholder="Digite sua nova senha"
              label="Senha"
              type="password"
              variant={window?.innerWidth < 768 ? "outlined" : "static"}
              size="lg"
            />
            <Input
              crossOrigin={false}
              className="flex justify-between"
              name="confirm"
              value={password.confirm}
              onChange={(e) =>
                setPassword({ ...password, confirm: e.target.value })
              }
              placeholder="Confirme sua nova senha"
              label="Confirmar Senha"
              type="password"
              variant={window?.innerWidth < 768 ? "outlined" : "static"}
              size="lg"
            />
          </div>
        </div>
        <div className="h-1/5 flex flex-col justify-center items-center gap-4">
          <Button
            placeholder="Recuperar senha"
            type="submit"
            className=" md:w-64 w-40 h-[60px] p-7 
            flex justify-center items-center rounded-2xl 
            bg-primary-600
            focus:opacity-65"
            size="lg"
          >
            Salvar Senha
          </Button>
          <div className="text-gray-700 md:text-base text-sm">
            <Link to="/">Voltar</Link>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
