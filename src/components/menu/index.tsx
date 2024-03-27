import { useState } from "react";
import { AlignJustify, Bell, X } from "lucide-react";
import { Avatar } from "@material-tailwind/react";
import { Outlet, useLocation } from "react-router-dom";

import CountdownTimer from "./time";
import { Sidebar } from "./sidebar";
import { pages } from "./const";

export const Menu = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const changeMenu = () => {
    setOpen((value) => !value);
  };

  const currentDate = new Date();
  const time = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);

  const path = location.pathname;
  const currentPage = pages.find((page) => page.path === path);

  return (
    <div>
      <header className="flex flex-row justify-between bg-gradient-to-r from-primary-900 to-primary-500 h-16 px-4">
        <div className="flex flex-row items-center gap-5">
          <button onClick={changeMenu}>
            {open ? <X color="#fff" /> : <AlignJustify color="#fff" />}
          </button>
          <h2 className="text-white text-1xl">{currentPage?.name || ""}</h2>
        </div>
        <div className="flex flex-row items-center gap-3">
          <CountdownTimer targetDate={time} />
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
      <div className="flex items-start relative">
        <Sidebar open={open} />
        <div className="flex justify-start items-start p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
