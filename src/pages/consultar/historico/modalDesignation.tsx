import { Button } from "@material-tailwind/react";
import { Alert, Participant } from "../../../components";
import { EyeIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useCookies, useHttp } from "../../../lib";
import { addFakeImage } from "../../../lib/addFakeImage";
import { Assignment, Designation } from "../../designacao/interfaces";
import { IParticipant } from "../../../entity";
import { BoxGroup } from "../../../components/box";
import dayjs from "dayjs";
import { statusDesignation } from "../../designacao/const";

interface ModalDesignationProps {
  designationId: string;
  designationDate: string;
}

export function ModalDesignation({
  designationId,
  designationDate,
}: ModalDesignationProps) {
  const [showDesignation, setShowDesignation] = useState<string>("");
  const http = useHttp();
  const cookie = useCookies();
  const groupId = cookie.decodeToken()?.groupId;
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [desigantion, setDesignation] = useState<Omit<
    Designation,
    "assignments" | "participants" | "incidents" | "assignmentsFiltered"
  > | null>();

  const getDesignation = useCallback(
    async (props?: { random?: boolean; filter?: string }) => {
      if (!groupId) return console.log("groupId not found");
      const params = {
        groupId,
        filter: props?.filter ?? undefined,
        random: props?.random ?? undefined,
      };
      const { data } = await http.get<Designation>(
        `/groups/${groupId}/designations/week`,
        {
          params,
        }
      );

      setAssignments(
        shadowCards(
          data.assignments.map((a) => ({
            ...a,
            participants: addFakeImage(a.participants),
          }))
        )
      );

      setDesignation({
        id: data.id,
        group: data.group,
        status: data.status,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    getDesignation();

    const resize = () => {
      setAssignments((a) => shadowCards(a));
    };

    addEventListener("resize", resize);

    return () => {
      removeEventListener("resize", resize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shadowCards = (assignments: Assignment[]): Assignment[] => {
    const CARD_WIDTH = 330;
    const SIDE_BAR_WIDTH = 64;
    const WINDOW_WIDTH =
      window.innerWidth - window.innerWidth * 0.3 - SIDE_BAR_WIDTH - 208;

    const quantityCards = assignments.filter((a) => a.point.id).length;
    const cardsByRow = Math.floor(WINDOW_WIDTH / CARD_WIDTH);

    type LineRaw = Assignment[];
    type Line = LineRaw[];

    const lines: Line = [];
    let currentLine = 0;
    Array.from({ length: quantityCards }).forEach((_, index) => {
      if (lines[currentLine]?.length === cardsByRow) {
        currentLine++;
      }
      if (!lines[currentLine]?.length) {
        lines[currentLine] = [];
      }
      lines[currentLine].push(assignments[index]);
    });

    const lastLine = lines.at(-1);
    const lastLineLength = lastLine?.length || 0;
    if (lastLineLength < cardsByRow && lastLine) {
      const emptyCards = cardsByRow - lastLineLength;
      Array.from({ length: emptyCards }).forEach(() => {
        lastLine.push(SHADOW_ASSIGNMENT);
      });
    }

    const newAssignments = lines.flat();
    return newAssignments;
  };
  return (
    <>
      <button type="button" onClick={() => setShowDesignation(designationId)}>
        <EyeIcon className="fill-primary-600 stroke-white" />
      </button>
      <Alert
        show={Boolean(showDesignation)}
        close={() => setShowDesignation("")}
      >
        <div className="flex justify-between items-center flex-col gap-2 bg-white p-4 rounded-lg min-w-[70vw] max-w-96 h-[80vh]">
          <h1 className="text-left w-full font-bold text-xl pb-4">
            Designação de {desigantion?.group.name} (
            {dayjs(designationDate).format("DD/MM/YYYY")}){" "}
            <span className="text-primary-800 ml-4">
              {desigantion?.status && statusDesignation[desigantion.status]}
            </span>
          </h1>
          <div className="flex max-h-[95%] w-full overflow-auto flex-wrap gap-8 justify-between">
            {assignments.map((assignment) => {
              const perPoint = assignment.publication_carts
                .map((cart) => cart.name)
                .join(", ");

              return (
                <div id={assignment.point.id} key={assignment.point.id}>
                  <BoxGroup
                    pointName={assignment.point.name}
                    pointCars={perPoint}
                    pointStatus={assignment.point.status}
                    boxGroupEvent={() => {}}
                    readonly
                  >
                    {assignment.participants.map((participant) => (
                      <Participant.Root
                        name={participant.name}
                        key={participant.id}
                        avatar={participant.profile_photo}
                        incident_history={isAbsent(participant)}
                      />
                    ))}
                  </BoxGroup>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end w-full pt-4">
            <Button
              className="bg-primary-500 text-white"
              placeholder={"Cancelar designação"}
              onClick={() => setShowDesignation("")}
            >
              Voltar
            </Button>
          </div>
        </div>
      </Alert>
    </>
  );
}

const isAbsent = (participant: IParticipant) =>
  participant.incident_history?.status === "OPEN";

const SHADOW_ASSIGNMENT: Assignment = {
  point: {
    id: "",
    name: "",
    status: false,
  },
  publication_carts: [],
  participants: [],
  config: {
    max: 0,
    min: 0,
  },
};
