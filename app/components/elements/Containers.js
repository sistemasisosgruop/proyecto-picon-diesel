export const Container = ({ children, whiteColor = false }) => {
  return (
    <div
      className={`${
        whiteColor ? "bg-white" : "bg-primary-50"
      } p-[30px] w-full rounded-[30px] flex flex-col items-start gap-[10px]`}
    >
      {children}
    </div>
  );
};

export const ContainerMenu = ({ children }) => {
  return (
    <div
      className="grid w-full gap-5"
      style={{
        gridTemplateColumns: "repeat(2, minmax(0, auto))",
      }}
    >
      {children}
    </div>
  );
};
export const Content = ({ children }) => {
  return (
    <div
      className="flex flex-col p-3 rounded-3xl  bg-white gap-5"
      style={{ minWidth: "calc(100vw - 556px)" }}
    >
      {children}
    </div>
  );
};
