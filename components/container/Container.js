export const Container = ({bg, children}) => {
	return <div className={`${bg} p-[30px] rounded-[30px] flex flex-col items-start gap-[10px]`} >{children}</div>;
}
