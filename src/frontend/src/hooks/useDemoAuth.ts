import { useState } from "react";

export interface DemoProfile {
  name: string;
  email: string;
  role: "junior" | "senior";
  university: string;
  semester: string;
  branch: string;
  urn: string;
}

const KEY = "nodetutor_demo_profile";

export function getDemoProfile(): DemoProfile | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setDemoProfile(profile: DemoProfile) {
  localStorage.setItem(KEY, JSON.stringify(profile));
}

export function clearDemoProfile() {
  localStorage.removeItem(KEY);
}

export function useDemoAuth() {
  const [profile, setProfile] = useState<DemoProfile | null>(getDemoProfile);

  const login = (p: DemoProfile) => {
    setDemoProfile(p);
    setProfile(p);
  };

  const logout = () => {
    clearDemoProfile();
    setProfile(null);
  };

  return { profile, login, logout };
}
