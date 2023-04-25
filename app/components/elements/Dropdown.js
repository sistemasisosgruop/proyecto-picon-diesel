import { Fragment } from "react";

export const Dropdown = ({ children, isOpen = false, elements = 0 }) => {
  return (
    <Fragment>
      <div
        id="dropdownUsers"
        className={`w-full z-10 bg-white ${
          elements === 0 ? "hidden" : "rounded shadow dark:bg-gray-700"
        } ${!isOpen ? "hidden" : ""}`}
      >
        <ul
          className={`${
            elements < 5 ? "h-auto" : "h-48"
          } py-1 overflow-y-auto text-gray-700 dark:text-gray-200`}
          aria-labelledby="dropdownUsersButton"
        >
          {children}
        </ul>
      </div>
    </Fragment>
  );
};

export const DropdownItem = ({ handleClick, name }) => {
  return (
    <li className="cursor-pointer">
      <a
        onClick={handleClick}
        className="flex items-center py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
      >
        {name}
      </a>
    </li>
  );
};
