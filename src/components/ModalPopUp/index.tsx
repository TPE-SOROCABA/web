import { ReactNode } from "react";
import { createPortal } from "react-dom";
import "./index.css";
import { XIcon } from "lucide-react";

interface ModalPopUpProps {
  status: boolean;
  title?: string | ReactNode;
  text?: string | ReactNode;
  onClickCancel: (value: boolean) => void;
  children: ReactNode;
  className?: string;
  listRender?: any;
  classNameTitle?: string;
  classNameChildren?: string;
  classNameGrandson?: string;
}

export function ModalPopUp({
  status,
  title,
  text,
  onClickCancel,
  children,
  className,
  classNameTitle,
  classNameChildren,
  classNameGrandson,
}: ModalPopUpProps) {
  if (!status) return null;

  return createPortal(
    <>
      <div
        className="fixed w-screen z-10 h-screen left-0 top-0 bg-black bg-opacity-50"
        onClick={() => onClickCancel(!status)}
      ></div>
      <div
        className={`absolute bg-white py-4 px-8 gap-8 flex flex-col rounded-md z-20 inset-1/2 transform -translate-x-1/2 -translate-y-1/2 ${className}`}
      >
        <div className="flex justify-between items-center">
          {title && (
            <div className={`box-shadow title-modal ${classNameTitle}`}>
              {title}
            </div>
          )}
          <XIcon className="iconX" onClick={() => onClickCancel(!status)} />
        </div>
        <div className={classNameChildren}>
          {children}
        </div>
      </div>
    </>,
    document.body
  );
}
