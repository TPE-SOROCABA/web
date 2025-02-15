export interface IPetition {
  id: string;
  protocol: string;
  status: string;
  publicUrl: string;
  privateUrl: string;
  createdAt: Date;
  updatedAt: Date;
  participants: IParticipant[];
}

export interface IParticipant {
  id: string;
  name: string;
  phone: string;
  profilePhoto: string;
  profile: string;
  computed: null;
  sex: string;
  email: string;
  address: string;
  attributions: string[];
  availability: Availability[];
  baptismDate: Date;
  birthDate: Date;
  city: string;
  civilStatus: string;
  congregationId: number;
  hasMinorChild: boolean;
  languages: string[];
  petitionId: string;
  spouseParticipant: boolean;
  state: string;
  zipCode: string;
  cpf: null;
}

export interface Availability {
  weekDay: number;
  morning: boolean;
  afternoon: boolean;
  evening: boolean;
}

export interface Day {
  evening: boolean;
  morning: boolean;
  afternoon: boolean;
}
