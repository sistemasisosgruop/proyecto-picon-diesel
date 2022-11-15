import Header from "./header/Header";
import Sidebar from "./sidebar/Sidebar";

export default function Layout({ children }) {
	return (
		<div className="flex h-screen">
			<Sidebar />
			<div className="flex-1 flex flex-col overflow-hidden">
				<Header />
				<main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
					<div className="mx-auto px-6 py-8">
						{children}
					</div>
				</main>
			</div>
		</div>
	);
}
