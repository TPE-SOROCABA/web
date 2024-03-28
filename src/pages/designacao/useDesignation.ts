import { useState, useCallback, useEffect } from "react";
import { IParticipant } from "../../entity";
import { useHttp, useToastHot } from "../../lib";
import { addFakeImage } from "../../lib/addFakeImage";
import { Assignment, Designation } from "./interfaces";
let timeout: NodeJS.Timeout;
export const useDesignation = () => {
  const http = useHttp();
  const toast = useToastHot();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [participants, setParticipants] = useState<IParticipant[]>([]);
  const [desigantion, setDesignation] = useState<Omit<
    Designation,
    "assignments" | "participants" | "incidents"
  > | null>();

  const getParticipants = useCallback(
    async (props?: { random?: boolean; filter?: string }) => {
      const groupId = "65fe068c81870be5412f90fd";
      const params = {
        groupId,
        filter: props?.filter ?? undefined,
        random: props?.random ?? undefined,
      };
      const { data } = await http.get<Designation>("/designations/week", {
        params,
      });

      setAssignments(
        data.assignments.map((a) => ({
          ...a,
          participants: addFakeImage(a.participants),
        }))
      );
      setParticipants(addFakeImage([...data.participants, ...data.incidents]));

      setDesignation({
        id: data.id,
        group: data.group,
        status: data.status,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      });
    },
    [http]
  );

  useEffect(() => {
    getParticipants();
  }, [getParticipants]);

  const handleRandom = async () => {
    await toast.promise(getParticipants({ random: true }), {
      loading: "Designando automaticamente...",
      success: "Designação automática realizada com sucesso",
      error: (error) =>
        error?.response?.data?.message || "Erro ao designar automaticamente",
    });
  };

  const handleSearch = async (search: string) => {
    timeout && clearTimeout(timeout);
    if (!search) return getParticipants();
    timeout = setTimeout(async () => {
      await toast.promise(getParticipants({ filter: search }), {
        loading: "Buscando participantes e pontos...",
        success: "Busca realizada com sucesso",
        error: "Erro ao buscar participantes e pontos",
      });
    }, 800);
  };

  const handleUpdatePoint = async (pointId: string, status: boolean) => {
    await toast.promise(
      http.patch<Designation>(
        `/designations/${desigantion!.id}/points/${pointId}`,
        {
          status,
        }
      ),
      {
        loading: "Atualizando ponto...",
        success: "Ponto atualizado com sucesso",
        error: (error) =>
          error?.response?.data?.message || "Erro ao atualizar ponto",
      }
    );
  };

  const handleUpdatePointParticipants = async (
    pointId: string,
    participantIds: string[]
  ) => {
    await toast.promise(
      http.put<Designation>(
        `/designations/${desigantion!.id}/points/${pointId}/participants`,
        {
          participants: participantIds,
        }
      ),
      {
        loading: "Atualizando participantes do ponto...",
        success: "Ponto atualizado com sucesso",
        error: (error) =>
          error?.response?.data?.message || "Erro ao atualizar ponto",
      }
    );
  };

  const createIncidentParticipants = async (
    participantId: string,
    reason: string
  ) => {
    await toast.promise(
      http.post<Designation>(`/participants/${participantId}/incidences`, {
        reason,
      }),
      {
        loading: "Atualizando participantes do ponto...",
        success: "Ponto atualizado com sucesso",
        error: (error) =>
          error?.response?.data?.message || "Erro ao atualizar ponto",
      }
    );
    await getParticipants();
  };

  return {
    assignments,
    participants,
    desigantion,
    getParticipants,
    handleUpdatePoint,
    handleUpdatePointParticipants,
    createIncidentParticipants,
    handleRandom,
    handleSearch,
    setAssignments,
    setParticipants,
  };
};
