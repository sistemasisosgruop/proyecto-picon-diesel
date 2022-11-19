export const Container = ({ children }) => {
  return (
    <div className="bg-primary-50 p-[30px] rounded-[30px] flex flex-col items-start gap-[10px]">
      {children}
    </div>
  );
};

export const ContainerMenu = ({children}) => {
  return <div className="flex w-full gap-5">{children}</div>;
}
export const Content = ({children}) => {
  return (
    <div className="flex flex-col p-3 rounded-3xl bg-white w-full">{children}</div>
  )
}