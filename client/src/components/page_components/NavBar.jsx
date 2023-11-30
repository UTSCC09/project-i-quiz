import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "media/iquiz_logo.svg";
import DropdownMenu from "components/elements/DropdownMenu";
import { BellIcon, CogIcon } from "components/elements/SVGIcons";

export default function NavBar({ additionalButtons }) {
  /* Scroll to top on load */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <header className="fixed top-0 left-0 h-24 sm:h-28 w-full bg-white shadow-sm flex items-center px-6 md:px-20 justify-between z-10 transition-all">
      <Link to="/">
        <img src={logo} alt="iQuiz! Logo" className="ml-2 h-6 sm:h-7" />
      </Link>
      <div className="flex items-center gap-4 md:gap-8">
        {additionalButtons}
        <div className="flex items-center gap-2 md:gap-4">
          {/* <NotificationButton /> */}
          <SettingsButton />
        </div>
      </div>
    </header>
  );
}

function NotificationButton() {
  return (
    <div className="w-10 h-10 flex shrink-0 sitems-center justify-center rounded-full text-slate-500 hover:bg-gray-150 hover:text-slate-600 transition-all cursor-pointer">
      <BellIcon className="w-4 sm:w-5" />
    </div>
  );
}

function SettingsButton() {
  return (
    <DropdownMenu
      buttonElement={
        <button className="w-10 h-10 flex shrink-0 items-center justify-center rounded-full text-slate-500 hover:bg-gray-150 hover:text-slate-600 transition-all">
          <CogIcon className="w-6 sm:w-7" />
        </button>
      }
      options={[
        {
          label: <div className="text-red-600">Log out</div>,
          onClick: async () => {
            await fetch("/api/users/logout", { method: "GET" }).then(() => {
              window.location.reload();
            });
          },
        },
      ]}
    />
  );
}
