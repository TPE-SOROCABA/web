const routes = [
  {
    path: "/dashboard",
    breadcrumbName: "Painel de Controle",
  },
  {
    path: "/lista-designacao",
    breadcrumbName: "Lista de Designação",
  },
  {
    path: "/lista-designacao/designar",
    breadcrumbName: "Designar",
  },
  {
    path: "/peticao",
    breadcrumbName: "Petição",
  },
  {
    path: "/peticao/upload",
    breadcrumbName: "Nova Petição",
  },
  {
    path: "/peticao/form",
    breadcrumbName: "Nova Petição",
  },
];

export const generateBreadcrumbs = (fullPath: string) => {
  const pathnames = fullPath.split("/").filter((x) => x);
  const breadcrumbs = pathnames.map((_, index) => ({
    path: `/${pathnames.slice(0, index + 1).join("/")}`,
    breadcrumbName: routes.find(
      (route) => route.path === `/${pathnames.slice(0, index + 1).join("/")}`
    )?.breadcrumbName,
  }));
  return breadcrumbs;
};
