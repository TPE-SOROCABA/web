import sairIcon from "../../assets/icons/menu/sair.svg";

import tpeDigital from "../../assets/tpe-digital-circle-white.svg";
import { tv } from "tailwind-variants";
import { Link } from "react-router-dom";
import { useCookies } from "../../lib";
import { pages } from "./const";

interface Props {
  open: boolean;
}

const menuTw = tv({
  base: "flex gap-9 w-[87.666667%] mx-auto border-[#D7D7D7] pb-2 h-11 items-center transition-all cursor-pointer hover:bg-[#374192] hover:w-full hover:border-none hover:px-4 hover:h-[50px]",
  variants: {
    menu: {
      open: "border-b-[1px]",
      close: "justify-center",
    },
  },
});

export function Sidebar({ open }: Props) {
  const cookie = useCookies();

  const logout = () => {
    cookie.erase("token");
  };

  return (
    <div
      className={`${
        open
          ? "w-[254px] left-0 absolute top-0 z-[9999]"
          : "w-[65px] -left-[68px] relative"
      } md:left-0 h-full min-h-[calc(100vh_-_64px)] max-w-[254px] bg-gradient-to-b from-primary-900 to-primary-500 pt-5 transition-all flex flex-col justify-between `}
    >
      <ul className="flex flex-col gap-3">
        {pages.map((page) => (
          <Link
            key={page.name}
            to={page.path}
            className={menuTw({ menu: open ? "open" : "close" })}
          >
            <img src={page.icon} alt={page.altName} className="w-6" />
            {open && <h2 className="text-white">{page.name}</h2>}
          </Link>
        ))}
      </ul>
      <ul className="flex items-center flex-col gap-9 pb-10">
        {open && <img src={tpeDigital} alt="tpe" />}
        <li
          onClick={logout}
          className={menuTw({ menu: open ? "open" : "close" })}
        >
          <img src={sairIcon} alt="sair" className="w-6" />
          {open && <h2 className="text-white">Sair</h2>}
        </li>
      </ul>
    </div>
  );
}
