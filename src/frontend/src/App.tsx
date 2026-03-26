import { Toaster } from "@/components/ui/sonner";
import {
  Navigate,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { UserRole } from "./backend.d";
import Navbar from "./components/Navbar";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useCallerUserProfile } from "./hooks/useQueries";
import JuniorDashboard from "./pages/JuniorDashboard";
import LandingPage from "./pages/LandingPage";
import RegistrationPage from "./pages/RegistrationPage";
import ResourcesPage from "./pages/ResourcesPage";
import SeniorDashboard from "./pages/SeniorDashboard";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: profile, isLoading: profileLoading } = useCallerUserProfile();

  if (isInitializing || (identity && profileLoading)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">Loading NodeTutor...</p>
        </div>
      </div>
    );
  }

  if (!identity) {
    return <Navigate to="/" />;
  }

  if (!profile) {
    return <Navigate to="/register" />;
  }

  return (
    <>
      <Navbar profile={profile} />
      {children}
    </>
  );
}

function RoleRedirect() {
  const { identity } = useInternetIdentity();
  const { data: profile } = useCallerUserProfile();

  if (!identity || !profile) return <Navigate to="/" />;
  if (profile.role === UserRole.junior) return <Navigate to="/dashboard" />;
  return <Navigate to="/senior" />;
}

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster />
    </>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: function Index() {
    const { identity } = useInternetIdentity();
    const { data: profile } = useCallerUserProfile();
    if (identity && profile) return <RoleRedirect />;
    if (identity && !profile) return <Navigate to="/register" />;
    return <LandingPage />;
  },
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: function Register() {
    const { identity } = useInternetIdentity();
    if (!identity) return <Navigate to="/" />;
    return <RegistrationPage />;
  },
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: function Dashboard() {
    return (
      <AuthGuard>
        <JuniorDashboard />
      </AuthGuard>
    );
  },
});

const seniorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/senior",
  component: function Senior() {
    return (
      <AuthGuard>
        <SeniorDashboard />
      </AuthGuard>
    );
  },
});

const resourcesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/resources",
  component: function Resources() {
    return (
      <AuthGuard>
        <ResourcesPage />
      </AuthGuard>
    );
  },
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  registerRoute,
  dashboardRoute,
  seniorRoute,
  resourcesRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
