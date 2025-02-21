import { useCookies } from ".";

const useProfile = () => {
    const cookie = useCookies();
    const token = cookie.decodeToken();
    const mode = token?.profile === "COORDINATOR" ? "coordinator" : "analyst";
    const isCoordinator = mode === "coordinator";
    const isAnalyst = mode === "analyst";

    return {
        isCoordinator,
        isAnalyst,
        mode
    }
}

export { useProfile }
