import { Input, Button } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "../components";
import { useState } from "react";
import { useHttp, useToast } from "../../../lib";
import { AxiosError } from "axios";

export const ForgotPassword = () => {
  const [inputForgotPassword, setInputForgotPassword] = useState({
    cpf: "",
    // cellphone: "",
  });
  const navigate = useNavigate();
  const http = useHttp();
  const toast = useToast();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const toastId = toast.loading("Enviando código de recuperação");
    try {
      await http.post("/auth/recover-password", {
        cpf: inputForgotPassword.cpf.replace(/\D/g, ""),
        // cellphone: inputForgotPassword.cellphone.replace(/\D/g, ""),
      });
      navigate("/forgot-password/check-number", {
        state: { cpf: inputForgotPassword.cpf },
      });
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        if (status === 404) {
          return toast.error("CPF não encontrado");
        }
        if (status === 400) {
          return toast.error("CPF ou telefone inválidos");
        }
      }
    } finally {
      toast.dismiss(toastId as string);
    }
  };

  const updateCPF = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cpfRaw = e.target.value;
    const cpf = cpfRaw
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    setInputForgotPassword({ ...inputForgotPassword, cpf });
  };

  // const updateCellphone = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const cellphoneRaw = e.target.value.replace(/\D/g, "");
  //   const length = cellphoneRaw.length;
  //   const cellphone = cellphoneRaw.replace(
  //     length === 11 ? /(\d{2})(\d{5})(\d{4})/ : /(\d{2})(\d{4})(\d{4})/,
  //     "($1) $2-$3"
  //   );
  //   setInputForgotPassword({ ...inputForgotPassword, cellphone });
  // };

  const haveEmptyFields =
    !inputForgotPassword.cpf || inputForgotPassword.cpf.length < 14;
  return (
    <AuthLayout onSubmit={onSubmit}>
      <div className="h-4/6 flex flex-col md:w-1/2 md:justify-center">
        <div className="md:h-40 h-4/5 flex flex-col justify-evenly items-center">
          <h1 className="font-bold text-xl text-gray-800 md:hidden">
            Insira seu CPF e seu telefone para recuperar a senha
          </h1>
          <div className="md:w-96 w-full flex flex-col items-center md:gap-12 gap-6">
            <Input
              crossOrigin
              value={inputForgotPassword.cpf}
              onChange={updateCPF}
              name="cpf"
              label="CPF"
              autoFocus
              type="text"
              maxLength={14}
              minLength={14}
              pattern="\d{3}\.\d{3}\.\d{3}-\d{2}"
              variant={window?.innerWidth < 768 ? "outlined" : "static"}
              size="lg"
            />
            {/* <Input
              crossOrigin
              value={inputForgotPassword.cellphone}
              onChange={updateCellphone}
              name="cellphone"
              label="Telefone"
              minLength={14}
              maxLength={15}
              variant={window?.innerWidth < 768 ? "outlined" : "static"}
              size="lg"
            /> */}
          </div>
        </div>
        <div className="h-1/5 flex flex-col justify-center items-center gap-4">
          <Button
            placeholder={"Entrar ou Login"}
            disabled={haveEmptyFields}
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
};
