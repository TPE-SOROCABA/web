import sairIcon from "../../assets/icons/menu/sair.svg";

import tpeDigital from "../../assets/tpe-digital-circle-white.svg";
import { tv } from "tailwind-variants";
import { Link } from "react-router-dom";
import { useCookies } from "../../lib";
import { pages } from "./const";

import { Drawer, IconButton } from "@material-tailwind/react";

const menuTw = tv({
  base: "flex gap-9 w-[87.666667%] mx-auto border-[#D7D7D7] pb-2 h-11 items-center transition-all cursor-pointer hover:scale-110",
  variants: {
    menu: {
      open: "border-b-[1px] hover:bg-[#374192] hover:w-full hover:border-none hover:px-4 hover:text-lg",
      close: "justify-center",
    },
    link: {
      open: "w-full",
      close: "w-16",
    },
  },
});

interface SidebarProps {
  open: boolean;
  closeDrawer: () => void;
}

export function Sidebar({ open, closeDrawer }: SidebarProps) {
  const cookie = useCookies();

  const logout = () => {
    cookie.erase("token");
  };

  const Pages = () => {
    return pages.map((page) => (
      <Link
        key={page.name}
        to={page.path}
        className={menuTw({
          menu: open ? "open" : "close",
          link: open ? "open" : "close",
        })}
        title={page.name}
      >
        <img src={page.icon} alt={page.altName} className="w-6" />
        {open && <h2 className="text-white">{page.name}</h2>}
      </Link>
    ));
  };

  const Options = () => (
    <div className="pt-0 p-4">
      <ul className="flex flex-col gap-3 items-center">
        <Pages />
      </ul>
      <ul
        className={`
          ${open ? "w-[254px]" : "w-16"}
          flex items-center justify-center flex-col gap-9 fixed bottom-0
        `}
      >
        <img src={tpeDigital} alt="tpe" />
        <li
          onClick={logout}
          className={menuTw({
            menu: open ? "open" : "close",
            link: open ? "open" : "close",
          })}
        >
          <img src={sairIcon} alt="sair" className="w-6" />
          {open && <h2 className="text-white">Sair</h2>}
        </li>
      </ul>
    </div>
  );

  return (
    <>
      <Drawer open={open} onClose={closeDrawer} placeholder={""}>
        <div
          className={`w-full h-full bg-gradient-to-b from-primary-900 to-primary-500 pt-5 flex flex-col`}
        >
          <div className="flex items-center justify-between p-4 pt-0">
            <h2 className="text-white">TPE - Digital</h2>

            <IconButton
              variant="text"
              color="white"
              onClick={closeDrawer}
              placeholder={undefined}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </IconButton>
          </div>
          <Options />
        </div>
      </Drawer>
      {!open && (
        <>
          <div className="flex flex-col items-center justify-between w-16 bg-gradient-to-b from-primary-900 to-primary-600 h-[calc(100vh_-_4rem)] p-4 pt-0 fixed">
            <Options />
          </div>
          <div className="invisible w-16 h-[calc(100vh_-_4rem)] bg-gradient-to-b from-primary-900 to-primary-600">
            {/* <Options /> */}
          </div>
        </>
      )}
    </>
  );
}
