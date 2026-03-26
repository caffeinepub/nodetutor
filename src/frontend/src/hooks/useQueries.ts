import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  BookingStatus,
  Resource,
  SessionBooking,
  TutorProfile,
  UserProfile,
} from "../backend.d";
import { useActor } from "./useActor";

export function useCallerUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["callerUserProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useVerifiedTutors() {
  const { actor, isFetching } = useActor();
  return useQuery<TutorProfile[]>({
    queryKey: ["verifiedTutors"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getVerifiedTutors();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSearchTutors(subjectCode: string) {
  const { actor, isFetching } = useActor();
  return useQuery<TutorProfile[]>({
    queryKey: ["searchTutors", subjectCode],
    queryFn: async () => {
      if (!actor) return [];
      if (!subjectCode.trim()) return actor.getVerifiedTutors();
      return actor.searchTutorsBySubject(subjectCode);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUserProfile(principal: Principal | undefined) {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["userProfile", principal?.toString()],
    queryFn: async () => {
      if (!actor || !principal) return null;
      return actor.getUserProfile(principal);
    },
    enabled: !!actor && !isFetching && !!principal,
  });
}

export function useCallerSessions() {
  const { actor, isFetching } = useActor();
  return useQuery<SessionBooking[]>({
    queryKey: ["callerSessions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCallerSessions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllResources() {
  const { actor, isFetching } = useActor();
  return useQuery<Resource[]>({
    queryKey: ["allResources"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllResources();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useFilteredResources(
  semester: bigint | null,
  subjectCode: string,
) {
  const { actor, isFetching } = useActor();
  return useQuery<Resource[]>({
    queryKey: ["filteredResources", semester?.toString(), subjectCode],
    queryFn: async () => {
      if (!actor) return [];
      if (semester && subjectCode.trim()) {
        return actor.getResourcesBySemesterAndSubject(semester, subjectCode);
      }
      if (semester) return actor.getResourcesBySemester(semester);
      if (subjectCode.trim()) return actor.getResourcesBySubject(subjectCode);
      return actor.getAllResources();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRegisterProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      profile,
      subjects,
    }: {
      profile: UserProfile;
      subjects?: string[];
    }) => {
      if (!actor) throw new Error("Not connected");
      await actor.registerCallerUserProfile(profile);
      if (subjects && subjects.length > 0) {
        await actor.updateTutorSubjects(subjects);
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["callerUserProfile"] });
    },
  });
}

export function useBookSession() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (booking: SessionBooking) => {
      if (!actor) throw new Error("Not connected");
      return actor.bookSession(booking);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["callerSessions"] });
    },
  });
}

export function useUpdateSessionStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: { id: bigint; status: BookingStatus }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateSessionStatus(id, status);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["callerSessions"] });
    },
  });
}

export function useUpdateAvailability() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (isAvailable: boolean) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateTutorAvailability(isAvailable);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["verifiedTutors"] });
    },
  });
}

export function useUpdateSubjects() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (subjects: string[]) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateTutorSubjects(subjects);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["verifiedTutors"] });
    },
  });
}

export function useTutorProfile(principal: Principal | undefined) {
  const { actor, isFetching } = useActor();
  return useQuery<TutorProfile | null>({
    queryKey: ["tutorProfile", principal?.toString()],
    queryFn: async () => {
      if (!actor || !principal) return null;
      return actor.getTutorProfile(principal);
    },
    enabled: !!actor && !isFetching && !!principal,
  });
}
