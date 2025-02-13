import { AlignJustify, Bell } from "lucide-react";
import { Avatar } from "@material-tailwind/react";
import { Outlet, useLocation } from "react-router-dom";

import CountdownTimer from "./time";
import { Sidebar } from "./sidebar";
import { pagesHeader } from "./const";
import { ReactNode, useEffect, useState } from "react";
import { useCookies, useHttp } from "../../lib";
import { version } from "../../../package.json";

export const Menu = () => {
  const cookie = useCookies();
  const token = cookie.decodeToken();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const http = useHttp();
  const [groupDetails, setGroupDetails] = useState<IGroupDetails | null>(null);

  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);

  const path = location.pathname;
  const currentPage = pagesHeader.find((page) => {
    return page.path === path;
  });

  const PROFILE_BR = {
    ["COORDINATOR"]: "Coordenador",
    ["ASSISTANT_COORDINATOR"]: "Coordenador Assistente",
    ["CAPTAIN"]: "Capitão",
    ["ASSISTANT_CAPTAIN"]: "Capitão Assistente",
    ["PARTICIPANT"]: "Participante",
    ["ADMIN_ANALYST"]: "Analista Administrativo",
  };

  useEffect(() => {
    http
      .get(`/groups/${token?.groupId}/designations/week-details`)
      .then((response) => {
        setGroupDetails(response.data);
      });
  }, []);

  return (
    <div className="relative">
      <header className="flex flex-row justify-between bg-gradient-to-r from-primary-900 to-primary-500 h-16 px-4 fixed w-full z-[100]">
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
          {groupDetails?.designation?.designationDate && (
            <CountdownTimer
              targetDate={groupDetails.designation.designationDate}
            />
          )}
          <h2 className="text-white text-1xl hidden md:block">
            {PROFILE_BR[token?.profile as never] || ""}
          </h2>
          <Bell color="#fff" />
          {token?.profile_photo && (
            <Avatar
              src={token?.profile_photo}
              alt="avatar"
              size="sm"
              placeholder="Avatar"
            />
          )}
        </div>
      </header>
      <div className="h-16 invisible"></div>
      <div
        className={`${open ? "overflow-hidden" : ""} flex items-start h-[90hv]`}
      >
        <Sidebar open={open} closeDrawer={closeDrawer} />
        <div className="flex justify-start items-start p-2 pt-0 w-full">
          <Outlet />
        </div>
      </div>
      <BadgeOutline>{version}</BadgeOutline>
    </div>
  );
};

const BadgeOutline = ({ children }: { children: ReactNode }) => {
  return (
    <span className="flex items-center justify-center w-fit h-5 bg-primary-100 border border-primary-400 text-primary-700 text-xs rounded-lg p-0.5 bottom-1 right-1.5 fixed pointer-events-none">
      {children}
    </span>
  );
};

export interface IGroupDetails {
  id: string;
  name: string;
  configWeekday: string;
  coordinator: Coordinator;
  designation: Designation;
}

export interface Coordinator {
  id: string;
  name: string;
  cpf: string;
  email: null;
  phone: string;
  profile_photo: string;
  profile: string;
  computed: string;
  sex: string;
}

export interface Designation {
  id: string;
  name: string;
  groupId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  designationDate: Date;
  mandatoryPresence: boolean;
  cancellationJustification: string;
}
