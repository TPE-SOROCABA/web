import { useState } from "react";

interface ButtonComponentProps {
  show?: boolean;
  children: ({ showButton }: { showButton: boolean }) => JSX.Element;
}
export function ButtonComponent({
  show = true,
  children: Children,
}: ButtonComponentProps) {
  const [showButton, setShowButton] = useState(false);
  if (!show) return null;
  return (
    <>
      <div
        className="absolute top-0 left-0 z-30 w-full h-full transition-all ease-in-out duration-300"
        onMouseEnter={() => setShowButton(true)}
        onMouseLeave={() => setShowButton(false)}
      >
        <Children showButton={showButton} />
      </div>
    </>
  );
}
