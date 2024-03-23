interface BoxScreenProps {
  children: React.ReactNode;
}

export function BoxScreen({ children }: BoxScreenProps) {
  return (
    <div className="h-screen w-full bg-gray-200 p-8">
      <div className="bg-white rounded-lg flex flex-col gap-10 p-9">
        {children}
      </div>
    </div>
  );
}
