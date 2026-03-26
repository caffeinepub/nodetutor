import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "@tanstack/react-router";
import { Bell, BookOpen, ChevronDown, GraduationCap } from "lucide-react";
import type { UserProfile } from "../backend.d";
import { UserRole } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface NavbarProps {
  profile: UserProfile;
}

export default function Navbar({ profile }: NavbarProps) {
  const { clear } = useInternetIdentity();
  const navigate = useNavigate();
  const isJunior = profile.role === UserRole.junior;

  const handleLogout = () => {
    clear();
    navigate({ to: "/" });
  };

  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <nav className="sticky top-0 z-50 bg-card border-b border-border shadow-xs">
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          to={isJunior ? "/dashboard" : "/senior"}
          className="flex items-center gap-2"
          data-ocid="nav.link"
        >
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">N</span>
          </div>
          <span className="font-bold text-lg text-foreground">NodeTutor</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {isJunior ? (
            <>
              <Link
                to="/dashboard"
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                data-ocid="nav.find_tutors.link"
              >
                Find Tutors
              </Link>
              <Link
                to="/resources"
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                data-ocid="nav.resources.link"
              >
                Resources
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/senior"
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                data-ocid="nav.schedule.link"
              >
                My Sessions
              </Link>
              <Link
                to="/resources"
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                data-ocid="nav.resources.link"
              >
                Resources
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            data-ocid="nav.notifications.button"
          >
            <Bell className="w-4 h-4 text-muted-foreground" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border hover:bg-accent transition-colors"
                data-ocid="nav.user.dropdown_menu"
              >
                <Avatar className="w-7 h-7">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-foreground hidden sm:block">
                  {profile.name.split(" ")[0]}
                </span>
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem disabled className="flex items-center gap-2">
                {isJunior ? (
                  <BookOpen className="w-4 h-4" />
                ) : (
                  <GraduationCap className="w-4 h-4" />
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
        </div>
      </div>
    </nav>
  );
}
