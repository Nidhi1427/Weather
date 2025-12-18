import { useTheme } from "@/context/theme-provider";
import { Link } from "react-router-dom";
import CitySearch from "./city-search";
import { Sun, Moon } from "lucide-react";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <header className="w-full bg-background/95 backdrop-blur py-6 px-6 border-b-[1px] border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between max-w-4xl mx-auto h-12">
        <Link to="/" className="flex items-center">
          <img
            src={isDark ? "/weather_lightmode.png" : "/weather_darkmode.png"}
            alt="Climate logo"
            className="h-6 w-6"
          />
        </Link>

        <div className="flex items-center gap-4">
          <CitySearch />
          <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="flex items-center justify-center w-10 h-10 rounded-full border hover:bg-muted transition-all"
          >
            {isDark ? (
              <Sun className="h-5 w-5 text-yellow-500" />
            ) : (
              <Moon className="h-5 w-5 text-blue-500" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
