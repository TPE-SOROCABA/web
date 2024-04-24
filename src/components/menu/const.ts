import dashboardIcon from "../../assets/icons/menu/dashboard.svg";
import searchIcon from "../../assets/icons/menu/search.svg";
import designarIcon from "../../assets/icons/menu/designar.svg";
import cadastrarIcon from "../../assets/icons/menu/cadastrar.svg";

export type NamePage = "Dashboard" | "Consultar" | "Designar" | "Cadastrar";
type Page = {
  name: NamePage;
  altName: string;
  path: string;
  icon: string;
};

export const pages: Page[] = [
  {
    name: "Dashboard",
    altName: "dashboard",
    path: "/dashboard",
    icon: dashboardIcon,
  },
  {
    name: "Consultar",
    altName: "search",
    path: "/lista-designacao",
    icon: searchIcon,
  },
  {
    name: "Designar",
    altName: "designar",
    path: "/lista-designacao",
    icon: designarIcon,
  },
  {
    name: "Cadastrar",
    altName: "cadastrar",
    path: "/lista-designacao",
    icon: cadastrarIcon,
  },
];
