import { Divider } from "./Divider";

export const Title = ({ text, children }) => {
  return (
		<div className="py-4 w-full flex flex-col gap-5">
			<div className="w-full flex justify-between items-center">
				<h1 className="text-2xl font-semibold">{text}</h1>
				{children}
			</div>
			<Divider />
		</div>
  );
};
