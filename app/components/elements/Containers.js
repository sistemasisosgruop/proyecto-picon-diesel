export const Container = ({ children }) => {
  return (
    <div className="bg-primary-50 p-[30px] rounded-[30px] flex flex-col items-start gap-[10px]">
      {children}
    </div>
  );
};
