import { useState } from "react";
import { http } from "../../../infra";
import { Button, Input } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies, useToast } from "../../../lib";
import { AuthLayout } from "../components";
import { AxiosError } from "axios";
import { formatPhone } from "../../../utils";

export function Login() {
  const [inputLogin, setInputLogin] = useState({
    phone: "",
    password: "",
  });
  const navigate = useNavigate();
  const cookies = useCookies();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data } = await http.post("/auth/login", {
        phone: inputLogin.phone.replace(/\D/g, ""),
        password: inputLogin.password,
      });
      const token = data.token;
      cookies.set("token", token, { secure: true });
      // navigate("/dashboard");
      navigate("/lista-designacao");
    } catch (e) {
      if (e instanceof AxiosError && e.response?.status === 401) {
        return toast.error("Telefone ou senha inválidos");
      }
      toast.error("Algo deu errado, tente novamente mais tarde");
    }
  };

  const updatePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phoneRaw = e.target.value.trim().replace(/\D/g, "");
    const phoneFormatted = formatPhone(phoneRaw);
    setInputLogin({ ...inputLogin, phone: phoneFormatted });
  };

  return (
    <AuthLayout onSubmit={handleSubmit}>
      <div className="h-4/6 flex flex-col gap-8 p-4 md:w-1/2 md:justify-center">
        <div className="md:h-40 h-4/5 flex flex-col justify-evenly items-center">
          <h1 className="font-bold text-xl text-gray-800 md:hidden">
            Insira suas informações para realizar o login
          </h1>
          <div className="md:w-80 w-full flex flex-col items-center md:gap-12 gap-6">
            <Input
              crossOrigin
              value={inputLogin.phone}
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
            <Input
              crossOrigin
              value={inputLogin.password}
              onChange={(e) =>
                setInputLogin({ ...inputLogin, password: e.target.value })
              }
              name="password"
              label="Senha"
              type="password"
              minLength={6}
              variant={window?.innerWidth < 768 ? "outlined" : "static"}
              size="lg"
            />
          </div>
        </div>
        <div className="h-1/5 min-h-[40px] flex flex-col justify-center items-center gap-4">
          <Button
            placeholder={"Entrar ou Login"}
            type="submit"
            className="
            md:w-64 w-40 h-[60px] p-7 
            flex justify-center items-center rounded-2xl 
            bg-primary-600
            focus:opacity-65
            "
            size="lg"
          >
            Entrar
          </Button>
          <div className="text-gray-700 md:text-base text-sm">
            <Link to="/forgot-password">Esqueci minha senha</Link>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
