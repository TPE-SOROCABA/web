import { useState } from "react";
import { http } from "../../../infra";
import { Button, Input } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies, useToast } from "../../../lib";
import { AuthLayout } from "../components";
import { AxiosError } from "axios";

export function Login() {
  const [inputLogin, setInputLogin] = useState({
    cpf: "",
    password: "",
  });
  const navigate = useNavigate();
  const cookies = useCookies();
  const toast = useToast();

  const updateCPF = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cpfRaw = e.target.value;
    const cpf = cpfRaw
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    setInputLogin({ ...inputLogin, cpf });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data } = await http.post("/login", {
        cpf: inputLogin.cpf.replace(/\D/g, ""),
        password: inputLogin.password,
      });
      const token = data.token;
      cookies.set("token", token, { secure: true });
      navigate("/dashboard");
    } catch (e) {
      if (e instanceof AxiosError && e.response?.status === 401) {
        return toast.error("CPF ou senha inválidos");
      }
      toast.error("Algo deu errado, tente novamente mais tarde");
    }
  };

  const haveEmptyFields = !inputLogin.cpf || !inputLogin.password;
  return (
    <AuthLayout onSubmit={handleSubmit}>
      <div className="h-4/6 flex flex-col md:w-1/2 md:justify-center">
        <div className="md:h-40 h-4/5 flex flex-col justify-evenly items-center">
          <h1 className="font-bold text-xl text-gray-800 md:hidden">
            Insira suas informações para realizar o login
          </h1>
          <div className="md:w-96 w-full flex flex-col items-center md:gap-12 gap-6">
            <Input
              crossOrigin
              value={inputLogin.cpf}
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
        <div className="h-1/5 flex flex-col justify-center items-center gap-4">
          <Button
            placeholder={"Entrar ou Login"}
            disabled={haveEmptyFields}
            type="submit"
            className="md:w-96 w-40 md:rounded-xl bg-primary-600"
            size="lg"
          >
            Entrar
          </Button>
          <div className="md:w-96 w-40 flex justify-center md:justify-end text-gray-700 md:text-base text-sm">
            <Link to="/forgot-password">Esqueci minha senha</Link>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
