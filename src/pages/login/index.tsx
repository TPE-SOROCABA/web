import { useState } from "react";
import TpeDigitalCircle from "../../assets/tpe-digital-circle.svg";
import TpeDigitalLoginDesktop from "../../assets/tpe-digital-login-desktop.svg";
import RectangleBlue from "../../assets/rectangle-blue.svg";
import RectangleGray from "../../assets/rectangle-gray.svg";
import MackbookTpeLogin from "../../assets/mackbook-iphone-login.png";
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
      className="md:h-screen sm:h-[96vh] h-[95vh] w-full flex flex-col md:flex-row items-center justify-center"
    >
      <div className="h-2/6 relative flex justify-center items-center md:w-1/2 md:h-full">
        <img src={TpeDigitalCircle} alt="TPE Digital" className="md:hidden" />
        <img
          src={MackbookTpeLogin}
          alt="Mackbook TPE"
          className="hidden md:block z-30"
        />
        <img
          src={RectangleBlue}
          alt="Rectangle Blue"
          className="hidden md:block absolute h-full z-20 left-0 top-0"
        />
        <img
          src={RectangleGray}
          alt="Rectangle Gray"
          className="hidden md:block absolute h-full z-10 left-0 top-0"
        />
        <img
          src={TpeDigitalLoginDesktop}
          alt="TPE Digital"
          className="hidden md:block absolute z-30 top-[15%] right-32"
        />
      </div>
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
              size={window?.innerWidth < 768 ? "md" : "lg"}
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
              size={window?.innerWidth < 768 ? "md" : "lg"}
            />
          </div>
        </div>
        <div className="h-1/5 flex justify-center items-center">
          <Button
            placeholder={"Entrar ou Login"}
            disabled={haveEmptyFields}
            type="submit"
            className="md:w-96 md:rounded-xl bg-primary-600"
            size={window?.innerWidth < 768 ? "md" : "lg"}
          >
            Entrar
          </Button>
        </div>
      </div>
    </form>
  );
}
