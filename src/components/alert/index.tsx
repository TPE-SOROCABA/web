import ReactDOM from "react-dom";
import { tv } from "tailwind-variants";

interface AlertProps {
  show: boolean;
  close: () => void;
  children: React.ReactNode;
  className?: HTMLBaseElement["className"];
}

const alert = tv({
  base: "fixed inset-0 flex items-center justify-center z-[9999]",
});
export const Alert = ({ show, close, children, className }: AlertProps) => {
  if (!show) return null;
  return (
    <AlertPortal>
      <Overlay onClick={close} />
      <div
        className={alert({
          className,
        })}
      >
        {children}
      </div>
    </AlertPortal>
  );
};

const AlertPortal = ({ children }: { children: React.ReactNode }) => {
  return ReactDOM.createPortal(
    children,
    document.getElementById("alert-root")!
  );
};

const Overlay = ({ onClick }: { onClick: () => void }) => (
  <div
    className="fixed inset-0 bg-opacity-50 z-[9998] bg-gray-700 backdrop-filter backdrop-blur-[2px] backdrop-saturate-50"
    onClick={onClick}
  ></div>
);
