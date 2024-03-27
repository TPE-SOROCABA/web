export interface IParticipant {
  id: string;
  name: string;
  phone: string;
  profile_photo: string;
  profile: string;
  incident_history: {
    reason: string;
    id: string;
  };
}
