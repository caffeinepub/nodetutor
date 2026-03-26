import { Toaster } from "@/components/ui/sonner";
import {
  Navigate,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import Navbar from "./components/Navbar";
import { getDemoProfile } from "./hooks/useDemoAuth";
import JuniorDashboard from "./pages/JuniorDashboard";
import LandingPage from "./pages/LandingPage";
import RegistrationPage from "./pages/RegistrationPage";
import ResourcesPage from "./pages/ResourcesPage";
import SeniorDashboard from "./pages/SeniorDashboard";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const profile = getDemoProfile();
  if (!profile) return <Navigate to="/" />;
  const navProfile = {
    name: profile.name,
    email: profile.email,
    role: profile.role === "junior" ? ("junior" as const) : ("senior" as const),
    university: profile.university,
    semester: BigInt(profile.semester || "1"),
    branch: profile.branch,
  };
  return (
    <>
      <Navbar profile={navProfile as any} onLogout={() => {}} />
      {children}
    </>
  );
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
    const profile = getDemoProfile();
    if (profile) {
      return profile.role === "junior" ? (
        <Navigate to="/dashboard" />
      ) : (
        <Navigate to="/senior" />
      );
    }
    return <LandingPage />;
  },
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: function Register() {
    const profile = getDemoProfile();
    if (profile) {
      return profile.role === "junior" ? (
        <Navigate to="/dashboard" />
      ) : (
        <Navigate to="/senior" />
      );
    }
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
