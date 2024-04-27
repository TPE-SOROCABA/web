import { Designation } from "../interfaces";

export const statusDesignation: Record<Designation["status"], string> = {
  OPEN: "Aberta",
  CLOSED: "Fechada",
  ARCHIVED: "Arquivada",
  CANCELLED: "Cancelada",
  IN_PROGRESS: "Em progresso",
};
