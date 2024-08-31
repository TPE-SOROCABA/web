export interface IPetition {
  id: string;
  name: string;
  protocol: string;
  pageOneUrl: string;
  pageTwoUrl: string;
  status: string;
  city: string;
  phone: string;
  state: string;
  email: string;
  languages: string;
  congregation: string;
  dateOfBirth: string;
  dateOfBaptism: string;
  gender: "FEMALE" | "MALE";
}
