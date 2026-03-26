import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface TutorProfile {
    user: Principal;
    isAvailable: boolean;
    isVerified: boolean;
    avatarUrl: string;
    rating?: number;
    masteredSubjects: Array<string>;
}
export type SessionId = bigint;
export interface Resource {
    id: ResourceId;
    url: string;
    title: string;
    semester: bigint;
    subjectCode: string;
    fileType: FileType;
    uploader: Principal;
}
export type ResourceId = bigint;
export interface SessionBooking {
    id: SessionId;
    status: BookingStatus;
    junior: Principal;
    subjectCode: string;
    senior: Principal;
    price: bigint;
    dateTime: Time;
}
export interface UserProfile {
    branch: string;
    semester: bigint;
    name: string;
    role: UserRole;
    email: string;
    university: string;
}
export enum BookingStatus {
    pending = "pending",
    completed = "completed",
    confirmed = "confirmed"
}
export enum FileType {
    pdf = "pdf",
    link = "link"
}
export enum UserRole {
    junior = "junior",
    senior = "senior"
}
export enum UserRole__1 {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addResource(resource: Resource): Promise<ResourceId>;
    assignCallerUserRole(user: Principal, role: UserRole__1): Promise<void>;
    bookSession(booking: SessionBooking): Promise<SessionId>;
    getAllResources(): Promise<Array<Resource>>;
    getAvailableTutors(): Promise<Array<TutorProfile>>;
    getBookingsByStatus(status: BookingStatus): Promise<Array<SessionBooking>>;
    getCallerSessions(): Promise<Array<SessionBooking>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole__1>;
    getResourcesBySemester(semester: bigint): Promise<Array<Resource>>;
    getResourcesBySemesterAndSubject(semester: bigint, subjectCode: string): Promise<Array<Resource>>;
    getResourcesBySubject(subjectCode: string): Promise<Array<Resource>>;
    getSessionsForUser(user: Principal): Promise<Array<SessionBooking>>;
    getTutorProfile(user: Principal): Promise<TutorProfile | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVerifiedTutors(): Promise<Array<TutorProfile>>;
    initialize(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    registerCallerUserProfile(userProfile: UserProfile): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchTutorsBySubject(subjectCode: string): Promise<Array<TutorProfile>>;
    updateSessionStatus(bookingId: SessionId, status: BookingStatus): Promise<void>;
    updateTutorAvailability(isAvailable: boolean): Promise<void>;
    updateTutorSubjects(subjects: Array<string>): Promise<void>;
    verifyTutor(user: Principal): Promise<void>;
}
