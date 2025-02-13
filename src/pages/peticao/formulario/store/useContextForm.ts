import { useContext } from "react";

import { PetitionFormContext } from ".";

export function usePetitionFormStore() {
  return useContext(PetitionFormContext);
}
