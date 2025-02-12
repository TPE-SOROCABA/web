import { useContext } from "react";

import { PetitionContext } from ".";

export function usePetitionStore() {
  return useContext(PetitionContext);
}
