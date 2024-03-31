import { AlignJustify, Bell } from "lucide-react";
import { Avatar } from "@material-tailwind/react";
import { Outlet, useLocation } from "react-router-dom";

import CountdownTimer from "./time";
import { Sidebar } from "./sidebar";
import { pages } from "./const";
import { useState } from "react";
import { useCookies } from "../../lib";

export const Menu = () => {
  const cookie = useCookies();
  const token = cookie.decodeToken();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);

  const path = location.pathname;
  const currentPage = pages.find((page) => page.path === path);
  
  return (
    <div>
      <header className="flex flex-row justify-between bg-gradient-to-r from-primary-900 to-primary-500 h-16 px-4 sticky ">
        <div className="flex flex-row items-center gap-5">
          <button
            onClick={openDrawer}
            className="flex justify-center items-center w-[30px] h-11"
          >
            {<AlignJustify color="#fff" />}
          </button>
          <h2 className="text-white text-1xl">{currentPage?.name || ""}</h2>
        </div>
        <div className="flex flex-row items-center gap-3">
         {token && <CountdownTimer targetDate={token.designation.expiration} /> }
          <h2 className="text-white text-1xl hidden md:block">Coordenador</h2>
          <Bell color="#fff" />
          <Avatar
            src="https://docs.material-tailwind.com/img/face-2.jpg"
            alt="avatar"
            size="sm"
            placeholder="Avatar"
          />
        </div>
      </header>
      <div className="flex items-start">
        <Sidebar
          open={open}
          closeDrawer={closeDrawer}
        />
        <div className="flex justify-start items-start p-2 w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
