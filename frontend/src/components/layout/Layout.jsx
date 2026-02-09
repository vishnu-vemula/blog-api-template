import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/button";
import { 
  Home, 
  Users, 
  Key, 
  User, 
  LogOut,
  PenSquare, 
  Bell,
  Menu,
  X,
  TrendingUp,
  Zap,
  Settings,
  Book
} from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isFullWidthPage = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/docs';

  const isAdmin = user?.role === 'admin';

  const allNavItems = [
    { icon: Home, label: "Feed", path: "/blogs" },
    { icon: Users, label: "People", path: "/users", adminOnly: true },
    { icon: TrendingUp, label: "Explore", path: "/" },
    { icon: Book, label: "Docs", path: "/docs" },
  ];

  const navItems = allNavItems.filter(item => !item.adminOnly || isAdmin);

  const personalItems = [
    { icon: Key, label: "API Keys", path: "/api-keys" },
    { icon: User, label: "Profile", path: user ? `/profile/${user.id}` : "/login" },
  ];

  return (
    <div className="min-h-screen bg-background font-sans text-foreground flex flex-col">
      
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full glass border-b border-black/[0.06]">
        <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
          
          {/* Left: Logo + Nav Links */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-shadow">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight hidden sm:block">WorksAndBlogs</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path}>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className={`text-sm font-medium transition-colors ${
                      location.pathname === item.path 
                        ? 'text-foreground bg-black/[0.05]' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {item.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground h-9 w-9">
                  <Bell className="h-4 w-4" />
                </Button>
                <Link to="/write">
                  <Button size="sm" className="hidden md:flex rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white gap-2 shadow-lg shadow-violet-500/20 border-0">
                    <PenSquare className="h-3.5 w-3.5" />
                    Write
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="focus:outline-none">
                      <Avatar className="h-8 w-8 border-2 border-black/10 cursor-pointer hover:border-violet-500/50 transition-colors">
                        <AvatarImage src={user.avatar} alt={user.username} />
                        <AvatarFallback className="bg-violet-100 text-violet-600 text-xs font-semibold">{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-white border border-black/[0.08] rounded-xl p-1.5 mt-2 shadow-xl">
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium text-foreground">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-muted-foreground">@{user.username}</p>
                    </div>
                    <DropdownMenuSeparator className="bg-black/[0.06]" />
                    <DropdownMenuItem asChild className="rounded-lg cursor-pointer focus:bg-black/[0.04] text-foreground">
                      <Link to={`/profile/${user.id}`} className="flex items-center gap-2.5 px-3 py-2">
                        <User className="h-3.5 w-3.5" /> View Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-lg cursor-pointer focus:bg-black/[0.04] text-foreground">
                      <Link to="/edit-profile" className="flex items-center gap-2.5 px-3 py-2">
                        <Settings className="h-3.5 w-3.5" /> Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-lg cursor-pointer focus:bg-black/[0.04] text-foreground">
                      <Link to="/api-keys" className="flex items-center gap-2.5 px-3 py-2">
                        <Key className="h-3.5 w-3.5" /> API Keys
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-black/[0.06]" />
                    <DropdownMenuItem
                      onClick={logout}
                      className="rounded-lg cursor-pointer text-red-500 focus:text-red-600 focus:bg-red-50 flex items-center gap-2.5 px-3 py-2"
                    >
                      <LogOut className="h-3.5 w-3.5" /> Log Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">Log in</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-500/20 border-0 px-5">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
            <Button variant="ghost" size="icon" className="md:hidden h-9 w-9 text-muted-foreground" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </nav>
      </header>

      {/* Main Content — flex-1 ensures it fills remaining space, NO max-width restriction on children */}
      <div className="flex-1 flex flex-col">
        {isFullWidthPage ? (
          <main className="flex-1">
            <Outlet />
          </main>
        ) : (
          <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8">
            <Outlet />
          </main>
        )}
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 bg-white border-r border-black/[0.06] p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                  <Zap className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="font-bold">WorksAndBlogs</span>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsMobileMenuOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path} onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start gap-3 text-sm h-10 text-muted-foreground hover:text-foreground">
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              ))}
              <div className="h-px bg-black/[0.06] my-3" />
              {personalItems.map((item) => (
                <Link key={item.path} to={item.path} onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start gap-3 text-sm h-10 text-muted-foreground hover:text-foreground">
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Layout;
