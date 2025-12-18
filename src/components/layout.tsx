import Header from "@/components/header";
import type { PropsWithChildren } from "react";
import { useTheme } from "@/context/theme-provider";

const Layout = ({ children }: PropsWithChildren) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={`min-h-screen relative overflow-hidden ${
      isDark 
        ? "bg-gradient-to-br from-gray-900 via-blue-900 to-black" 
        : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
    }`}>
      {/* TWINKLING STARS */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={`star-${i}`}
            className={`absolute w-[2px] h-[2px] rounded-full animate-twinkle ${
              isDark ? "bg-white" : "bg-gray-600"
            }`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${1 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* METEORS */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={`meteor-${i}`}
            className={`absolute w-4 h-1 rounded-full animate-meteor-trail ${
              isDark 
                ? "bg-gradient-to-r from-yellow-400 via-white to-blue-400" 
                : "bg-gradient-to-r from-orange-400 via-yellow-300 to-pink-400"
            }`}
            style={{
              top: `${20 + Math.random() * 40}%`,
              left: `${Math.random() * 30}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="mx-auto w-full max-w-4xl px-4 lg:px-8 relative z-10">
        <Header />
        <main className="py-12">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
