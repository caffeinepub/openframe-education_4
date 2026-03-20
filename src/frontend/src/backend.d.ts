import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface BlogPost {
    title: string;
    content: string;
    authorName: string;
    publishedAt: Time;
    excerpt: string;
    category: string;
}
export type Time = bigint;
export interface ContactSubmission {
    name: string;
    createdAt: Time;
    email: string;
    message: string;
    phone: string;
}
export interface ScheduleEntry {
    day: string;
    subject: string;
    time: string;
    className: string;
}
export interface FieldExecProfile {
    name: string;
    leads: Array<Record_>;
    checkIns: Array<CheckIn>;
}
export interface TeacherProfile {
    subjects: Array<string>;
    name: string;
    schedule: Array<ScheduleEntry>;
}
export type TeacherId = bigint;
export interface DemoBooking {
    name: string;
    createdAt: Time;
    email: string;
    grade: string;
    preferredTime: Time;
    phone: string;
}
export interface StudentProfile {
    name: string;
    examResults: Array<ExamResult>;
    attendance: Array<Record__1>;
    gradeLevel: string;
    teacherId: TeacherId;
    certificates: Array<Certificate>;
    fieldExecId: FieldExecId;
}
export interface CheckIn {
    date: Time;
    notes: string;
    location: string;
}
export interface Record_ {
    status: Status;
    name: string;
    notes: string;
    phone: string;
}
export interface Record__1 {
    status: Status__1;
    date: Time;
}
export interface ExamResult {
    subject: string;
    score: bigint;
    grade: string;
}
export type FieldExecId = bigint;
export interface UserProfile {
    name: string;
    role: string;
}
export interface Certificate {
    title: string;
    date: Time;
}
export enum Status {
    new_ = "new",
    enrolled = "enrolled",
    lost = "lost",
    contacted = "contacted"
}
export enum Status__1 {
    present = "present",
    absent = "absent"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addCheckIn(checkIn: CheckIn): Promise<void>;
    addLead(lead: Record_): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createFieldExecProfile(name: string): Promise<void>;
    createOrUpdateBlogPost(id: bigint | null, post: BlogPost): Promise<void>;
    createStudentProfile(name: string, gradeLevel: string): Promise<void>;
    createTeacherProfile(name: string): Promise<void>;
    getAllFieldExecProfiles(): Promise<Array<FieldExecProfile>>;
    getAllStudentProfiles(): Promise<Array<StudentProfile>>;
    getAllTeacherProfiles(): Promise<Array<TeacherProfile>>;
    getBlogPosts(): Promise<Array<BlogPost>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getContactSubmissions(): Promise<Array<ContactSubmission>>;
    getDemoBookings(): Promise<Array<DemoBooking>>;
    getFieldExecProfile(fieldExecPrincipal: Principal): Promise<FieldExecProfile>;
    getStudentProfile(studentPrincipal: Principal): Promise<StudentProfile>;
    getTeacherProfile(teacherPrincipal: Principal): Promise<TeacherProfile>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    markStudentAttendance(studentPrincipal: Principal, date: Time, status: Status__1): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitContact(contact: ContactSubmission): Promise<void>;
    submitDemoBooking(booking: DemoBooking): Promise<void>;
    updateLead(leadIndex: bigint, updatedLead: Record_): Promise<void>;
}
