import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import List "mo:core/List";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Array "mo:core/Array";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Types
  module Attendance {
    public type Status = { #present; #absent };
    public type Record = {
      date : Time.Time;
      status : Status;
    };
  };

  type ExamResult = {
    subject : Text;
    score : Nat;
    grade : Text;
  };

  type Certificate = {
    title : Text;
    date : Time.Time;
  };

  type StudentProfile = {
    name : Text;
    gradeLevel : Text;
    teacherId : TeacherId;
    fieldExecId : FieldExecId;
    attendance : [Attendance.Record];
    examResults : [ExamResult];
    certificates : [Certificate];
  };

  type TeacherProfile = {
    name : Text;
    subjects : [Text];
    schedule : [ScheduleEntry];
  };

  type ScheduleEntry = {
    day : Text;
    time : Text;
    className : Text;
    subject : Text;
  };

  module Lead {
    public type Status = { #new; #contacted; #enrolled; #lost };
    public type Record = {
      name : Text;
      phone : Text;
      status : Status;
      notes : Text;
    };
  };

  type CheckIn = {
    date : Time.Time;
    location : Text;
    notes : Text;
  };

  type FieldExecProfile = {
    name : Text;
    checkIns : [CheckIn];
    leads : [Lead.Record];
  };

  type BlogPost = {
    title : Text;
    excerpt : Text;
    category : Text;
    authorName : Text;
    publishedAt : Time.Time;
    content : Text;
  };

  type DemoBooking = {
    name : Text;
    phone : Text;
    email : Text;
    grade : Text;
    preferredTime : Time.Time;
    createdAt : Time.Time;
  };

  type ContactSubmission = {
    name : Text;
    email : Text;
    phone : Text;
    message : Text;
    createdAt : Time.Time;
  };

  type StudentId = Nat;
  type TeacherId = Nat;
  type FieldExecId = Nat;

  public type UserProfile = {
    name : Text;
    role : Text; // "student", "teacher", "admin", "field_executive"
  };

  // State
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  var nextStudentId = 1;
  var nextTeacherId = 1;
  var nextFieldExecId = 1;

  let userProfiles = Map.empty<Principal, UserProfile>();
  let students = Map.empty<Principal, StudentProfile>();
  let teachers = Map.empty<Principal, TeacherProfile>();
  let fieldExecs = Map.empty<Principal, FieldExecProfile>();
  let blogPosts = Map.empty<Nat, BlogPost>();
  let demoBookings = Map.empty<Nat, DemoBooking>();
  let contactSubmissions = Map.empty<Nat, ContactSubmission>();

  // Required user profile functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Student functions
  public shared ({ caller }) func createStudentProfile(name : Text, gradeLevel : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create profiles");
    };

    let profile : StudentProfile = {
      name;
      gradeLevel;
      teacherId = 0;
      fieldExecId = 0;
      attendance = [];
      examResults = [];
      certificates = [];
    };
    students.add(caller, profile);
  };

  public query ({ caller }) func getStudentProfile(studentPrincipal : Principal) : async StudentProfile {
    // Students can view own profile, admins can view any profile
    if (caller != studentPrincipal and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile or be an admin");
    };

    switch (students.get(studentPrincipal)) {
      case (null) { Runtime.trap("Student not found") };
      case (?profile) { profile };
    };
  };

  public query ({ caller }) func getAllStudentProfiles() : async [StudentProfile] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can fetch all student profiles");
    };
    students.values().toArray();
  };

  public shared ({ caller }) func markStudentAttendance(
    studentPrincipal : Principal,
    date : Time.Time,
    status : Attendance.Status
  ) : async () {
    // Only users (teachers) and admins can mark attendance
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only teachers can mark attendance");
    };

    switch (students.get(studentPrincipal)) {
      case (null) { Runtime.trap("Student not found") };
      case (?profile) {
        let newRecord : Attendance.Record = { date; status };
        let updatedAttendance = profile.attendance.concat([newRecord]);
        let updatedProfile = {
          name = profile.name;
          gradeLevel = profile.gradeLevel;
          teacherId = profile.teacherId;
          fieldExecId = profile.fieldExecId;
          attendance = updatedAttendance;
          examResults = profile.examResults;
          certificates = profile.certificates;
        };
        students.add(studentPrincipal, updatedProfile);
      };
    };
  };

  // Teacher functions
  public shared ({ caller }) func createTeacherProfile(name : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create profiles");
    };

    let profile : TeacherProfile = {
      name;
      subjects = [];
      schedule = [];
    };
    teachers.add(caller, profile);
  };

  public query ({ caller }) func getTeacherProfile(teacherPrincipal : Principal) : async TeacherProfile {
    // Teachers can view own profile, admins can view any profile
    if (caller != teacherPrincipal and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile or be an admin");
    };

    switch (teachers.get(teacherPrincipal)) {
      case (null) { Runtime.trap("Teacher not found") };
      case (?profile) { profile };
    };
  };

  public query ({ caller }) func getAllTeacherProfiles() : async [TeacherProfile] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can fetch all teacher profiles");
    };
    teachers.values().toArray();
  };

  // Field exec functions
  public shared ({ caller }) func createFieldExecProfile(name : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create profiles");
    };

    let profile : FieldExecProfile = {
      name;
      checkIns = [];
      leads = [];
    };
    fieldExecs.add(caller, profile);
  };

  public query ({ caller }) func getFieldExecProfile(fieldExecPrincipal : Principal) : async FieldExecProfile {
    // Field execs can view own profile, admins can view any profile
    if (caller != fieldExecPrincipal and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile or be an admin");
    };

    switch (fieldExecs.get(fieldExecPrincipal)) {
      case (null) { Runtime.trap("Field executive not found") };
      case (?profile) { profile };
    };
  };

  public query ({ caller }) func getAllFieldExecProfiles() : async [FieldExecProfile] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can fetch all field exec profiles");
    };
    fieldExecs.values().toArray();
  };

  public shared ({ caller }) func addCheckIn(checkIn : CheckIn) : async () {
    // Field execs manage their own check-ins
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only field executives can add check-ins");
    };

    switch (fieldExecs.get(caller)) {
      case (null) { Runtime.trap("Field executive profile not found") };
      case (?profile) {
        let updatedCheckIns = profile.checkIns.concat([checkIn]);
        let updatedProfile = {
          name = profile.name;
          checkIns = updatedCheckIns;
          leads = profile.leads;
        };
        fieldExecs.add(caller, updatedProfile);
      };
    };
  };

  public shared ({ caller }) func addLead(lead : Lead.Record) : async () {
    // Field execs manage their own leads
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only field executives can add leads");
    };

    switch (fieldExecs.get(caller)) {
      case (null) { Runtime.trap("Field executive profile not found") };
      case (?profile) {
        let updatedLeads = profile.leads.concat([lead]);
        let updatedProfile = {
          name = profile.name;
          checkIns = profile.checkIns;
          leads = updatedLeads;
        };
        fieldExecs.add(caller, updatedProfile);
      };
    };
  };

  public shared ({ caller }) func updateLead(leadIndex : Nat, updatedLead : Lead.Record) : async () {
    // Field execs manage their own leads
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only field executives can update leads");
    };

    switch (fieldExecs.get(caller)) {
      case (null) { Runtime.trap("Field executive profile not found") };
      case (?profile) {
        if (leadIndex >= profile.leads.size()) {
          Runtime.trap("Lead index out of bounds");
        };
        let leadsArray = Array.tabulate(
          profile.leads.size(),
          func(i : Nat) : Lead.Record {
            if (i == leadIndex) { updatedLead } else { profile.leads[i] };
          }
        );
        let updatedProfile = {
          name = profile.name;
          checkIns = profile.checkIns;
          leads = leadsArray;
        };
        fieldExecs.add(caller, updatedProfile);
      };
    };
  };

  // Blog posts
  public shared ({ caller }) func createOrUpdateBlogPost(id : ?Nat, post : BlogPost) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create or update blog posts");
    };

    let postId = switch (id) {
      case (null) { blogPosts.size() + 1 };
      case (?existingId) { existingId };
    };
    blogPosts.add(postId, post);
  };

  public query ({ caller }) func getBlogPosts() : async [BlogPost] {
    // Public access - no authorization check needed
    blogPosts.values().toArray();
  };

  // Demo bookings
  public shared ({ caller }) func submitDemoBooking(booking : DemoBooking) : async () {
    // Public access - no authorization check needed
    let id = demoBookings.size() + 1;
    demoBookings.add(id, booking);
  };

  public query ({ caller }) func getDemoBookings() : async [DemoBooking] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can fetch demo bookings");
    };
    demoBookings.values().toArray();
  };

  // Contact submissions
  public shared ({ caller }) func submitContact(contact : ContactSubmission) : async () {
    // Public access - no authorization check needed
    let id = contactSubmissions.size() + 1;
    contactSubmissions.add(id, contact);
  };

  public query ({ caller }) func getContactSubmissions() : async [ContactSubmission] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can fetch contact submissions");
    };
    contactSubmissions.values().toArray();
  };
};
