export const Table = ({ children }) => {
	return (
		<div className="overflow-x-auto min-w-full whitespace-nowrap relative rounded-xl bg-white">
			<table className="min-w-full">{children}</table>
		</div>
	);
};
export const TableRH = ({ children }) => {
	return <tr className="border-b-2 border-b-primary-50">{children}</tr>;
};
export const TableH = ({ children }) => {
	return (
		<th className="p-5 text-left text-xs font-semibold">
			<p className="flex">{children}</p>
		</th>
	);
};
export const TableHOptions = ({ children }) => {
	return (
		<td className="p-5 text-left text-xs font-semibold flex gap-2 justify-end right-0 sticky w-30 bg-white">
			{children}
		</td>
	);
};
export const TableD = ({children}) => {
  return <td className="p-5 text-gray-600 text-sm whitespace-no-wrap">{children}</td>;
}
export const TableDOptions = ({children}) => {
  return (
		<td className="p-5 flex gap-2 justify-end right-0 sticky w-30 bg-white">
			{children}
		</td>
  );
}
