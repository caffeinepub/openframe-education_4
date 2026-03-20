import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  BlogPost,
  CheckIn,
  ContactSubmission,
  DemoBooking,
  FieldExecProfile,
  Record_,
  StudentProfile,
  TeacherProfile,
  UserProfile,
  UserRole,
} from "../backend.d";
import type { Status__1 } from "../backend.d";
import { useActor } from "./useActor";

export function useCallerRole() {
  const { actor, isFetching } = useActor();
  return useQuery<UserRole | null>({
    queryKey: ["callerRole"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCallerProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["callerProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useBlogPosts() {
  const { actor, isFetching } = useActor();
  return useQuery<BlogPost[]>({
    queryKey: ["blogPosts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getBlogPosts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllStudents() {
  const { actor, isFetching } = useActor();
  return useQuery<StudentProfile[]>({
    queryKey: ["allStudents"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllStudentProfiles();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllTeachers() {
  const { actor, isFetching } = useActor();
  return useQuery<TeacherProfile[]>({
    queryKey: ["allTeachers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTeacherProfiles();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllFieldExecs() {
  const { actor, isFetching } = useActor();
  return useQuery<FieldExecProfile[]>({
    queryKey: ["allFieldExecs"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllFieldExecProfiles();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useDemoBookings() {
  const { actor, isFetching } = useActor();
  return useQuery<DemoBooking[]>({
    queryKey: ["demoBookings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getDemoBookings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useContactSubmissions() {
  const { actor, isFetching } = useActor();
  return useQuery<ContactSubmission[]>({
    queryKey: ["contacts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getContactSubmissions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useStudentProfile(principal?: Principal) {
  const { actor, isFetching } = useActor();
  return useQuery<StudentProfile | null>({
    queryKey: ["studentProfile", principal?.toString()],
    queryFn: async () => {
      if (!actor || !principal) return null;
      return actor.getStudentProfile(principal);
    },
    enabled: !!actor && !isFetching && !!principal,
  });
}

export function useTeacherProfile(principal?: Principal) {
  const { actor, isFetching } = useActor();
  return useQuery<TeacherProfile | null>({
    queryKey: ["teacherProfile", principal?.toString()],
    queryFn: async () => {
      if (!actor || !principal) return null;
      return actor.getTeacherProfile(principal);
    },
    enabled: !!actor && !isFetching && !!principal,
  });
}

export function useFieldExecProfile(principal?: Principal) {
  const { actor, isFetching } = useActor();
  return useQuery<FieldExecProfile | null>({
    queryKey: ["fieldExecProfile", principal?.toString()],
    queryFn: async () => {
      if (!actor || !principal) return null;
      return actor.getFieldExecProfile(principal);
    },
    enabled: !!actor && !isFetching && !!principal,
  });
}

export function useSaveProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Not connected");
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["callerProfile"] }),
  });
}

export function useSubmitContact() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (contact: ContactSubmission) => {
      if (!actor) throw new Error("Not connected");
      await actor.submitContact(contact);
    },
  });
}

export function useSubmitDemoBooking() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (booking: DemoBooking) => {
      if (!actor) throw new Error("Not connected");
      await actor.submitDemoBooking(booking);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["demoBookings"] }),
  });
}

export function useCreateStudentProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      gradeLevel,
    }: { name: string; gradeLevel: string }) => {
      if (!actor) throw new Error("Not connected");
      await actor.createStudentProfile(name, gradeLevel);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allStudents"] }),
  });
}

export function useCreateTeacherProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error("Not connected");
      await actor.createTeacherProfile(name);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allTeachers"] }),
  });
}

export function useCreateFieldExecProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error("Not connected");
      await actor.createFieldExecProfile(name);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allFieldExecs"] }),
  });
}

export function useMarkAttendance() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      studentPrincipal,
      date,
      status,
    }: {
      studentPrincipal: Principal;
      date: bigint;
      status: Status__1;
    }) => {
      if (!actor) throw new Error("Not connected");
      await actor.markStudentAttendance(studentPrincipal, date, status);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allStudents"] }),
  });
}

export function useAddCheckIn() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (checkIn: CheckIn) => {
      if (!actor) throw new Error("Not connected");
      await actor.addCheckIn(checkIn);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["fieldExecProfile"] }),
  });
}

export function useAddLead() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (lead: Record_) => {
      if (!actor) throw new Error("Not connected");
      await actor.addLead(lead);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["fieldExecProfile"] }),
  });
}

export function useUpdateLead() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      leadIndex,
      updatedLead,
    }: { leadIndex: bigint; updatedLead: Record_ }) => {
      if (!actor) throw new Error("Not connected");
      await actor.updateLead(leadIndex, updatedLead);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["fieldExecProfile"] }),
  });
}

export function useCreateOrUpdateBlogPost() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, post }: { id: bigint | null; post: BlogPost }) => {
      if (!actor) throw new Error("Not connected");
      await actor.createOrUpdateBlogPost(id, post);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["blogPosts"] }),
  });
}
