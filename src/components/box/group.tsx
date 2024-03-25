interface BoxGroupProps {
  children: React.ReactNode;
  pointName: string;
  pointCars: string;
}

export function BoxGroup({ children, pointName, pointCars }: BoxGroupProps) {
  return (
    <>
      <div className="w-80 h-64 flex flex-col items-center justify-start gap-5 p-4 rounded-lg border border-primary-200 shadow-lg drop-shadow-lg">
        <div className="flex justify-around items-center w-full gap-2">
          <span
            className="font-bold text-base truncate w-[62%]"
            title={pointName}
          >
            {pointName}
          </span>
          <span className="text-base text-end w-[38%]" title={pointCars}>
            Carrinho: {pointCars}
          </span>
        </div>
        {children}
      </div>
    </>
  );
}
