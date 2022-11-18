import { Divider } from "./Divider";

export const Title = ({ children }) => {
  return (
		<div className="py-4 w-full flex flex-col gap-5">
			<div className="w-full flex justify-between items-center">
				{children}
			</div>
      <Divider />
		</div>
  );
};
