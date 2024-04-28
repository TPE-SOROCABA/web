import { IParticipant } from "../../../entity";

export interface Designation {
  id: string;
  group: Group;
  status: "OPEN" | "CLOSED" | "ARCHIVED" | "CANCELLED" | "IN_PROGRESS";
  assignments: Assignment[];
  assignmentsFiltered: Assignment[];
  participants: IParticipant[];
  incidents: IParticipant[];
  createdAt: string;
  updatedAt: string;
}

export interface Assignment {
  point: Point;
  publication_carts: PublicationCart[];
  participants: IParticipant[];
  config: {
    max: number;
    min: number;
  };
}

export interface PublicationCart {
  id: string;
  name: string;
}

export interface Point {
  id: string;
  name: string;
  status: boolean;
}

export interface Group {
  id: string;
  name: string;
  config: {
    startHour: string;
    endHour: string;
    weekday: string;
    minParticipants: number;
    maxParticipants: number;
  };
}

export interface GroupDetails {
  id: string;
  name: string;
  configWeekday: string;
  cordinator: Cordinator;
  designation: {
    id: string;
    name: string;
    groupId: string;
    status: "OPEN" | "CLOSED" | "ARCHIVED" | "CANCELLED" | "IN_PROGRESS";
    createdAt: string;
    updatedAt: string;
    designationDate: string;
    mandatoryPresence: boolean;
    cancellationJustification: string;
  };
}

export interface Cordinator {
  id: string;
  name: string;
  cpf: string;
  email: string | null;
  phone: string;
  profile_photo: string;
  profile: string;
  computed: string;
  sex: "MALE" | "FEMALE";
}
