import { IParticipant } from "../../../entity";

export interface Designation {
  id: string;
  group: Group;
  status: "OPEN" | "CLOSED";
  assignments: Assignment[];
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
