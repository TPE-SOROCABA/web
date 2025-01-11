import { useState } from "react";
import { tv } from "tailwind-variants";

interface ChildrenProps {
  showButton: boolean;
  hidden: () => void;
}

interface ButtonComponentProps {
  show?: boolean;
  children: (p: ChildrenProps) => JSX.Element;
  className?: HTMLElement["className"];
}
const buttonClass = tv({
  base: "absolute top-0 left-0 z-30 w-full h-full transition-all ease-in-out duration-300",
});

/**
 * @example
 * <ButtonComponent show={true} className="bg-blue-500">
 *  {({ showButton, hidden }) => {
 *   // showButton é um booleano que indica se o mouse está sobre o botão
 *   // hidden é uma função que esconde o botão
 *   if (!showButton) return null;
 *   return (
 *    <button
 *      className="bg-blue-500"
 *      onClick={() => {
 *       console.log("Button clicked");
 *       hidden();
 *      }}
 *    >
 *      Click me
 *    </button>
 *   );
 *  }}
 * </ButtonComponent>
 */
export function ButtonComponent({
  show = true,
  children: Children,
  className,
}: ButtonComponentProps) {
  const [showButton, setShowButton] = useState(false);
  if (!show) return null;
  return (
    <>
      <div
        className={buttonClass({
          className,
        })}
        onMouseEnter={() => setShowButton(true)}
        onMouseLeave={() => setShowButton(false)}
      >
        <Children showButton={showButton} hidden={() => setShowButton(false)} />
      </div>
    </>
  );
}
