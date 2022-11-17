export const Table = ({ children }) => {
	return (
		<div className="overflow-x-auto w-full rounded-xl bg-white">
			<table className="w-full whitespace-nowrap">{children}</table>
		</div>
	);
};
export const TableRH = ({ children }) => {
	return <tr className="border-b-2 border-b-primary-50">{children}</tr>;
};
export const TableH = ({ children }) => {
	return <th className="p-5 text-left text-xs font-semibold">{children}</th>;
};
export const TableD = ({children}) => {
  return <td className="p-5 text-gray-900 whitespace-no-wrap">{children}</td>;
}
export const TableDOptions = ({children}) => {
  return (
    <td className="p-5 flex gap-2">{children}</td>
  )
}
