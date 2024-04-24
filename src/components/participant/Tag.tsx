interface TagComponentProps {
  show?: boolean;
  tagTitle: string;
}

export function TagComponent({ show = true, tagTitle }: TagComponentProps) {
  if (!show) return null;
  return (
    <>
      <div className="flex justify-center items-center border border-primary-400 text-gray-700 h-7 w-fit p-0.5 rounded-lg">
        {tagTitle}
      </div>
    </>
  );
}
