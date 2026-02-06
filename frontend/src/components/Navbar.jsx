import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import {
  BellIcon,
  LogOutIcon,
  ShipWheelIcon,
  BookOpenIcon,
  CrownIcon,
} from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");
  const { logoutMutation } = useLogout();

  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center w-full">

          {/* LOGO - ONLY ON CHAT PAGE */}
          {isChatPage && (
            <Link to="/" className="flex items-center gap-2.5">
              <ShipWheelIcon className="size-9 text-primary" />
              <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                Hellofy
              </span>
            </Link>
          )}

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-3 sm:gap-4 ml-auto">

            {/* Resources */}
            <Link to="/resources">
              <button className="btn btn-ghost btn-circle">
                <BookOpenIcon className="h-6 w-6 opacity-70" />
              </button>
            </Link>

            {/* Notifications */}
            <Link to="/notifications">
              <button className="btn btn-ghost btn-circle">
                <BellIcon className="h-6 w-6 opacity-70" />
              </button>
            </Link>

            {/* Theme Selector */}
            <ThemeSelector />

            {/* Avatar with Premium Badge */}
            <div className="relative avatar">
              <div className="w-9 rounded-full">
                <img
                  src={authUser?.profilePic}
                  alt="User Avatar"
                />
              </div>

              {authUser?.isPremium && (
                <span className="absolute -top-1 -right-1 bg-warning rounded-full p-1">
                  <CrownIcon size={12} className="text-black" />
                </span>
              )}
            </div>

            {/* Logout */}
            <button
              className="btn btn-ghost btn-circle"
              onClick={logoutMutation}
            >
              <LogOutIcon className="h-6 w-6 opacity-70" />
            </button>

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
