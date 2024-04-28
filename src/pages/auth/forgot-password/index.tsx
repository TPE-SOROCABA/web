import { Input, Button } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "../components";
import { useState } from "react";
import { useHttp, useToast } from "../../../lib";
import { AxiosError } from "axios";
import { formatPhone } from "../../../utils";

export const ForgotPassword = () => {
  const [inputForgotPassword, setInputForgotPassword] = useState({
    phone: "",
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
        phone: inputForgotPassword.phone.replace(/\D/g, ""),
        // cellphone: inputForgotPassword.cellphone.replace(/\D/g, ""),
      });
      navigate("/forgot-password/check-number", {
        state: { phone: inputForgotPassword.phone },
      });
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        if (status === 404) {
          return toast.error("Telefone não encontrado");
        }
        if (status === 400) {
          return toast.error("Telefone inválido");
        }
        return toast.error(
          "Ops! Um erro inesperado ocorreu ao enviar o seu código"
        );
      }
    } finally {
      toast.dismiss(toastId as string);
    }
  };

  const updatePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phoneRaw = e.target.value.replace(/\D/g, "");
    const phone = formatPhone(phoneRaw);
    setInputForgotPassword({ ...inputForgotPassword, phone });
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
    !inputForgotPassword.phone ||
    inputForgotPassword.phone.trim().replace(/\D/g, "").length < 11;
  return (
    <AuthLayout onSubmit={onSubmit}>
      <div className="h-4/6 flex flex-col p-4 md:w-1/2 md:justify-center gap-6">
        <div className="md:h-40 h-4/5 flex flex-col justify-evenly items-center">
          <h1 className="font-bold text-xl text-gray-800 md:hidden">
            Insira seu CPF e seu telefone para recuperar a senha
          </h1>
          <div className="md:w-80 w-full flex flex-col items-center md:gap-12 gap-6">
            <Input
              crossOrigin
              value={inputForgotPassword.phone}
              onChange={updatePhone}
              name="phone"
              label="Telefone (Celular) com DDD"
              autoFocus
              type="text"
              maxLength={15}
              minLength={14}
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
        <div className="h-1/5 min-h-[40px] flex flex-col justify-center items-center gap-4">
          <Button
            placeholder={"Entrar ou Login"}
            disabled={haveEmptyFields}
            type="submit"
            className="      md:w-64 w-40 h-[60px] p-7 
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
};
