import { useState } from "react";
import TpeDigitalCircle from "../../assets/tpe-digital-circle.svg";
import { Button, Input } from "@material-tailwind/react";

export function Login() {
  const [inputLogin, setInputLogin] = useState({
    cpf: "",
    password: "",
  });

  const updateCPF = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cpfRaw = e.target.value;
    const cpf = cpfRaw
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    setInputLogin({ ...inputLogin, cpf });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert(JSON.stringify(inputLogin, null, 2));
  };

  const haveEmptyFields = !inputLogin.cpf || !inputLogin.password;
  return (
    <form
      onSubmit={handleSubmit}
      className="md:h-screen sm:h-[96vh] h-[95vh] w-full flex flex-col items-center justify-center"
    >
      <div className="h-2/6 flex justify-center items-center">
        <img src={TpeDigitalCircle} alt="TPE Digital" />
      </div>
      <div className="h-3/6 flex flex-col justify-evenly items-center">
        <h1 className="font-bold text-xl text-gray-800">
          Insira suas informações para realizar o login
        </h1>
        <div className="w-full flex flex-col items-center gap-6">
          <Input
            crossOrigin
            value={inputLogin.cpf}
            onChange={updateCPF}
            name="cpf"
            label="CPF"
            autoFocus
            type="text"
            maxLength={14}
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
          />
        </div>
      </div>
      <div className="h-1/6 flex justify-center items-center">
        <Button
          color="blue"
          placeholder={"Entrar ou Login"}
          disabled={haveEmptyFields}
          type="submit"
        >
          Entrar
        </Button>
      </div>
    </form>
  );
}
