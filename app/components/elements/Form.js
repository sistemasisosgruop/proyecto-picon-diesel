export const Group = ({ title, children, onclick = undefined }) => {
  return (
    <div onClick={onclick} className="relative border border-primary-100 rounded-md p-6 z-100">
      <div className="absolute -top-2 left-4 -mt-2 -ml-2 px-2 py-0.5 bg-white text-sm font-medium text-primary-800">
        {title}
      </div>
      <div className="flex flex-col gap-5">{children}</div>
    </div>
  );
};

export const GroupInputs = ({ children }) => {
  return <div className="flex gap-3 w-full">{children}</div>;
};
