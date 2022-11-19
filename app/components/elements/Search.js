import { SearchNormal1 } from "iconsax-react";

export const Search = () => {
  return (
		<div className="w-full pt-2 relative mx-auto text-gray-600">
			<input
				className="w-full bg-primary-50 h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
				type="search"
				name="search"
				placeholder="Search"
			/>
			<button type="submit" className="absolute right-0 top-0 mt-5 mr-4">
				<SearchNormal1 size={15} />
			</button>
		</div>
  );
}