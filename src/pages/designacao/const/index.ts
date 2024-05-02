import { Designation } from "../interfaces";

export const statusDesignation: Record<Designation["status"], string> = {
  OPEN: "Aberta",
  CLOSED: "Fechada",
  ARCHIVED: "Arquivada",
  CANCELLED: "Cancelada",
  IN_PROGRESS: "Em progresso",
};

type DesignationWithColor = {
  color: string;
  text: string;
};

export const statusDesignationWithColor: Record<
  Designation["status"],
  DesignationWithColor
> = {
  OPEN: {
    color: "text-yellow-700",
    text: "Em aberto",
  },
  IN_PROGRESS: {
    color: "text-purple-500",
    text: "Em progresso",
  },
  CANCELLED: {
    color: "text-red-500",
    text: "Cancelado",
  },
  CLOSED: {
    color: "text-green-500",
    text: "Concluído",
  },
  ARCHIVED: {
    color: "text-primary-500",
    text: "Arquivado",
  },
};
