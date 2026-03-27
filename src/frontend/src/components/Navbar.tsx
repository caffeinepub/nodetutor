import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  BookOpen,
  ChevronDown,
  GraduationCap,
  Menu,
  Wallet,
  X,
} from "lucide-react";
import { useState } from "react";
import type { UserProfile } from "../backend.d";
import { UserRole } from "../backend.d";
import { clearDemoProfile } from "../hooks/useDemoAuth";

interface NavbarProps {
  profile: UserProfile;
  onLogout?: () => void;
}

export default function Navbar({ profile, onLogout }: NavbarProps) {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const isJunior = profile.role === UserRole.junior;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    onLogout?.();
    clearDemoProfile();
    navigate({ to: "/" });
  };

  const nameParts = profile.name.trim().split(" ");
  const firstName = nameParts[0];
  const lastInitial =
    nameParts.length > 1 ? `${nameParts[nameParts.length - 1][0]}.` : "";
  const displayName = lastInitial ? `${firstName} ${lastInitial}` : firstName;
  const initials = nameParts
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const juniorLinks = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "KTU Resources", path: "/resources" },
  ];

  const seniorLinks = [
    { label: "My Sessions", path: "/senior" },
    { label: "KTU Resources", path: "/resources" },
  ];

  const navLinks = isJunior ? juniorLinks : seniorLinks;

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(`${path}/`);

  return (
    <header>
      {/* Skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[#0071E3] focus:text-white focus:rounded-full focus:font-semibold focus:shadow-lg"
      >
        Skip to main content
      </a>

      <nav
        aria-label="Site navigation"
        className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-gray-200/50"
      >
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          {/* Zone A: Brand */}
          <Link
            to={isJunior ? "/dashboard" : "/senior"}
            className="flex items-center gap-2"
            data-ocid="nav.link"
            aria-label="NodeTutor home"
          >
            <GraduationCap
              className="w-5 h-5 text-[#0071E3]"
              aria-hidden="true"
            />
            <span className="text-xl font-bold tracking-tight text-[#0071E3]">
              NodeTutor
            </span>
          </Link>

          {/* Zone B: Nav links (desktop) */}
          <div className="hidden md:flex items-center gap-1" role="menubar">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={
                  isActive(link.path)
                    ? "text-sm font-medium text-[#1D1D1F] px-4 py-2 rounded-full bg-gray-100/80"
                    : "text-sm text-[#86868B] px-4 py-2 rounded-full hover:text-[#1D1D1F] hover:bg-gray-100/80 transition-colors"
                }
                data-ocid={`nav.${link.label.toLowerCase().replace(/\s+/g, "_")}.link`}
                role="menuitem"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Zone C: Actions (desktop) */}
          <div className="flex items-center gap-3">
            {/* Wallet pill */}
            <span className="hidden lg:flex items-center gap-1.5 text-sm text-[#1D1D1F] border border-gray-200 rounded-full px-3 py-1.5">
              <Wallet
                className="w-3.5 h-3.5 text-[#0071E3]"
                aria-hidden="true"
              />
              ₹150 NodeCredits
            </span>

            {/* Bell */}
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full hidden md:inline-flex"
              data-ocid="nav.notifications.button"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4 text-[#86868B]" aria-hidden="true" />
              <span
                className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full"
                aria-hidden="true"
              />
            </Button>

            {/* User dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 hover:bg-gray-100/80 transition-colors"
                  data-ocid="nav.user.dropdown_menu"
                  aria-label={`User menu for ${firstName}`}
                  aria-haspopup="true"
                >
                  <Avatar className="w-7 h-7">
                    <AvatarFallback className="bg-[#0071E3] text-white text-xs font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-[#1D1D1F]">
                    {displayName}
                  </span>
                  <ChevronDown
                    className="w-3 h-3 text-[#86868B]"
                    aria-hidden="true"
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 rounded-2xl shadow-md"
              >
                <DropdownMenuItem disabled className="flex items-center gap-2">
                  {isJunior ? (
                    <BookOpen className="w-4 h-4" aria-hidden="true" />
                  ) : (
                    <GraduationCap className="w-4 h-4" aria-hidden="true" />
                  )}
                  <span className="text-xs">
                    {isJunior ? "Junior" : "Senior Tutor"}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive focus:text-destructive"
                  data-ocid="nav.logout.button"
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Hamburger (mobile) */}
            <button
              type="button"
              className="md:hidden p-2 rounded-full hover:bg-gray-100/80 transition-colors"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              data-ocid="nav.toggle"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-[#1D1D1F]" aria-hidden="true" />
              ) : (
                <Menu className="w-5 h-5 text-[#1D1D1F]" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile slide-down menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute w-full bg-white/90 backdrop-blur-md shadow-lg rounded-b-2xl p-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={
                  isActive(link.path)
                    ? "text-sm font-medium text-[#1D1D1F] px-4 py-3 rounded-full bg-gray-100/80"
                    : "text-sm text-[#86868B] px-4 py-3 rounded-full hover:text-[#1D1D1F] hover:bg-gray-100/80 transition-colors"
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 pt-2 border-t border-gray-200/60 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-sm text-[#1D1D1F]">
                <Wallet
                  className="w-3.5 h-3.5 text-[#0071E3]"
                  aria-hidden="true"
                />
                ₹150 NodeCredits
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="text-sm text-red-500 font-medium px-3 py-1.5 rounded-full hover:bg-red-50 transition-colors"
                data-ocid="nav.logout.button"
              >
                Log out
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
