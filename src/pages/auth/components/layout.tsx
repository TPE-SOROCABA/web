import { FormEvent, HtmlHTMLAttributes, ReactNode } from "react";
import TpeDigitalCircle from "../../../assets/tpe-digital-circle.svg";
import TpeDigitalLoginDesktop from "../../../assets/tpe-digital-login-desktop.svg";
import RectangleBlue from "../../../assets/rectangle-blue.svg";
import RectangleGray from "../../../assets/rectangle-gray.svg";
import MackbookTpeLogin from "../../../assets/mackbook-iphone-login.png";

interface AuthLayoutProps extends HtmlHTMLAttributes<HTMLFormElement> {
  children: ReactNode;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export const AuthLayout = ({
  children,
  onSubmit,
  className,
  ...rest
}: AuthLayoutProps) => {
  return (
    <form
      onSubmit={onSubmit}
      className={`
         md:h-screen sm:h-[96vh] h-[90vh] w-full flex flex-col md:flex-row items-center justify-center
         ${className}
      `}
      {...rest}
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
      <>{children}</>
    </form>
  );
};
