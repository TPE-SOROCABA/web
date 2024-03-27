import { Loader } from "../loadder";

interface BoxScreenProps {
  children: React.ReactNode;
  loader?: boolean;
}

export function BoxScreen({ children, loader }: BoxScreenProps) {
  return (
    <div className="h-full w-full bg-gray-200 m-8">
      <div className="bg-white rounded-lg min-h-full flex flex-col gap-10 p-9">
        {loader ? <Loader /> : children}
      </div>
    </div>
  );
}
