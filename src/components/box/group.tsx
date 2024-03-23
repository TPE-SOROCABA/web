interface BoxGroupProps {
  children: React.ReactNode;
  pointName: string;
  pointCars: string;
}

export function BoxGroup({ children, pointName, pointCars }: BoxGroupProps) {
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-5 p-4 rounded-lg border border-primary-200 shadow-lg drop-shadow-lg">
        <div className="flex justify-around items-center w-full">
          <span className="font-bold text-base">{pointName}</span>
          <span className="text-base">Carrinho: {pointCars}</span>
        </div>
        {children}
      </div>
    </>
  );
}
