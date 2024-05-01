export const addOneFakeImage = (participant: {
  name: string;
  profile_photo: string;
}) => {
  if (!participant.profile_photo) {
    participant.profile_photo = `https://ui-avatars.com/api/?name=${participant.name}&background=2d3477&color=fff`;
  }

  return participant;
};
