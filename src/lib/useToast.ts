import { toast as toastMobile } from "react-hot-toast";
import { toast as toastDesktop } from "react-toastify";

interface Toaster {
  success: typeof toastMobile.success | typeof toastDesktop.success;
  error: typeof toastMobile.error | typeof toastDesktop.error;
  loading: typeof toastMobile.loading | typeof toastDesktop.loading;
  dismiss: typeof toastMobile.dismiss | typeof toastDesktop.dismiss;
}

export const useToast = (): Toaster => {
  const isMobile = window.innerWidth < 768;
  const toast = isMobile ? toastMobile : toastDesktop;
  return toast;
};
