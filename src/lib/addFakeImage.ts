import { IParticipant } from '../entity';
export const addFakeImage = (participants: IParticipant[]): IParticipant[] => {
    return participants.map((participant) => {
  
      if (!participant.profile_photo) {
        participant.profile_photo = `https://ui-avatars.com/api/?name=${participant.name}&background=2d3477&color=fff`;
      }
  
      return participant;
    });
  };