import { Link, useLocation } from "wouter";
import { useAuth } from "@workspace/replit-auth-web";
import { Terminal, LogOut, User, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function Navbar() {
  const [location] = useLocation();
  const { user, isAuthenticated, login, logout, isLoading } = useAuth();

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Pricing", path: "/pricing" },
    ...(isAuthenticated ? [
      { label: "Script Library", path: "/library" },
      { label: "AI Generator", path: "/generate" },
    ] : [])
  ];

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 inset-x-0 z-50 glass border-b border-border/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary p-0.5 shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all duration-300">
            <div className="w-full h-full bg-background rounded-[10px] flex items-center justify-center">
              <Terminal className="w-5 h-5 text-primary" />
            </div>
          </div>
          <span className="font-display font-bold text-xl tracking-tight hidden sm:block">
            Automation<span className="text-primary">Station</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                location === item.path 
                  ? "text-foreground" 
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              {item.label === "AI Generator" && <Sparkles className="w-4 h-4 inline-block mr-2 text-secondary" />}
              {item.label}
              {location === item.path && (
                <motion.div 
                  layoutId="navbar-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {!isLoading && (
            isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link 
                  href="/account"
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors overflow-hidden"
                >
                  {user?.profileImageUrl ? (
                    <img src={user.profileImageUrl} alt={user.firstName || "User"} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-5 h-5 text-muted-foreground" />
                  )}
                </Link>
                <button 
                  onClick={logout}
                  className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  aria-label="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={login}
                className="px-6 py-2.5 rounded-xl font-semibold bg-primary text-primary-foreground neon-shadow neon-shadow-hover transition-all duration-300 hover:-translate-y-0.5"
              >
                Sign In
              </button>
            )
          )}
        </div>
      </div>
    </motion.header>
  );
}
