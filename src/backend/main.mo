import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Timer "mo:core/Timer";
import List "mo:core/List";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Float "mo:core/Float";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  type UserRole = { #junior; #senior };
  type BookingStatus = { #pending; #confirmed; #completed };
  type SessionId = Nat;
  type ResourceId = Nat;
  type FileType = { #pdf; #link };

  public type UserProfile = {
    name : Text;
    email : Text;
    role : UserRole;
    university : Text;
    semester : Nat;
    branch : Text;
  };

  type SessionBooking = {
    id : SessionId;
    junior : Principal;
    senior : Principal;
    subjectCode : Text;
    dateTime : Time.Time;
    status : BookingStatus;
    price : Nat;
  };

  type TutorProfile = {
    user : Principal;
    isAvailable : Bool;
    avatarUrl : Text;
    isVerified : Bool;
    rating : ?Float;
    masteredSubjects : [Text];
  };

  module TutorProfile {
    public func compare(t1 : TutorProfile, t2 : TutorProfile) : Order.Order {
      t1.user.toText().compare(t2.user.toText());
    };
    public func compareByRating(t1 : TutorProfile, t2 : TutorProfile) : Order.Order {
      switch (t1.rating, t2.rating) {
        case (null, null) { #equal };
        case (null, _) { #greater };
        case (_, null) { #less };
        case (?r1, ?r2) { Float.compare(r2, r1) };
      };
    };
  };

  type Resource = {
    id : ResourceId;
    title : Text;
    subjectCode : Text;
    fileType : FileType;
    url : Text;
    uploader : Principal;
    semester : Nat;
  };

  module Resource {
    public func compare(r1 : Resource, r2 : Resource) : Order.Order {
      Nat.compare(r2.id, r1.id);
    };
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  var nextSessionId = 1;
  var nextResourceId = 1;
  var bookingCleanupTimerId : ?Timer.TimerId = null;

  let userProfiles = Map.empty<Principal, UserProfile>();
  let tutorProfiles = Map.empty<Principal, TutorProfile>();
  let sessionBookings = Map.empty<SessionId, SessionBooking>();
  let resources = Map.empty<Nat, Resource>();

  // Upsert: allow re-registration to recover from partial failures
  public shared ({ caller }) func registerCallerUserProfile(userProfile : UserProfile) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Anonymous callers cannot register");
    };
    switch (accessControlState.userRoles.get(caller)) {
      case (null) { accessControlState.userRoles.add(caller, #user) };
      case (?_) {};
    };
    userProfiles.add(caller, userProfile);
    if (userProfile.role == #senior) {
      switch (tutorProfiles.get(caller)) {
        case (null) {
          tutorProfiles.add(caller, {
            user = caller;
            avatarUrl = "";
            isVerified = false;
            isAvailable = false;
            rating = null;
            masteredSubjects = [];
          });
        };
        case (?_) {};
      };
    };
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (caller.isAnonymous()) { return null };
    switch (accessControlState.userRoles.get(caller)) {
      case (null) { return null };
      case (?_) {};
    };
    userProfiles.get(caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized");
    };
    userProfiles.get(user);
  };

  public query ({ caller }) func getTutorProfile(user : Principal) : async ?TutorProfile {
    tutorProfiles.get(user);
  };

  public shared ({ caller }) func updateTutorAvailability(isAvailable : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    switch (tutorProfiles.get(caller)) {
      case (?profile) {
        tutorProfiles.add(caller, { profile with isAvailable });
      };
      case (null) { Runtime.trap("Tutor profile does not exist") };
    };
  };

  public shared ({ caller }) func updateTutorSubjects(subjects : [Text]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    switch (tutorProfiles.get(caller)) {
      case (?profile) {
        tutorProfiles.add(caller, { profile with masteredSubjects = subjects });
      };
      case (null) { Runtime.trap("Tutor profile does not exist") };
    };
  };

  public query ({ caller }) func getAvailableTutors() : async [TutorProfile] {
    tutorProfiles.values().toArray().filter(func(t) { t.isAvailable });
  };

  public query ({ caller }) func searchTutorsBySubject(subjectCode : Text) : async [TutorProfile] {
    tutorProfiles.values().toArray().filter(
      func(t) { t.masteredSubjects.find(func(s) { s == subjectCode }) != null }
    );
  };

  public query ({ caller }) func getVerifiedTutors() : async [TutorProfile] {
    tutorProfiles.values().toArray().filter(func(t) { t.isVerified });
  };

  public shared ({ caller }) func bookSession(booking : SessionBooking) : async SessionId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    let id = nextSessionId;
    nextSessionId += 1;
    sessionBookings.add(id, {
      id;
      junior = caller;
      senior = booking.senior;
      subjectCode = booking.subjectCode;
      dateTime = booking.dateTime;
      status = #pending;
      price = booking.price;
    });
    id;
  };

  public shared ({ caller }) func updateSessionStatus(bookingId : SessionId, status : BookingStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    switch (sessionBookings.get(bookingId)) {
      case (?booking) {
        if (caller != booking.junior and caller != booking.senior) {
          Runtime.trap("Unauthorized");
        };
        sessionBookings.add(bookingId, { booking with status });
      };
      case (null) { Runtime.trap("Booking does not exist") };
    };
  };

  public query ({ caller }) func getSessionsForUser(user : Principal) : async [SessionBooking] {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized");
    };
    sessionBookings.values().toArray().filter(
      func(b) { b.junior == user or b.senior == user }
    );
  };

  public query ({ caller }) func getCallerSessions() : async [SessionBooking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    sessionBookings.values().toArray().filter(
      func(b) { b.junior == caller or b.senior == caller }
    );
  };

  public query ({ caller }) func getBookingsByStatus(status : BookingStatus) : async [SessionBooking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    sessionBookings.values().toArray().filter(
      func(b) { (b.junior == caller or b.senior == caller) and b.status == status }
    );
  };

  public shared ({ caller }) func addResource(resource : Resource) : async ResourceId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    let id = nextResourceId;
    nextResourceId += 1;
    resources.add(id, { resource with id; uploader = caller });
    id;
  };

  public query ({ caller }) func getAllResources() : async [Resource] {
    resources.values().toArray();
  };

  public query ({ caller }) func getResourcesBySemester(semester : Nat) : async [Resource] {
    resources.values().toArray().filter(func(r) { r.semester == semester });
  };

  public query ({ caller }) func getResourcesBySubject(subjectCode : Text) : async [Resource] {
    resources.values().toArray().filter(func(r) { r.subjectCode == subjectCode });
  };

  public query ({ caller }) func getResourcesBySemesterAndSubject(semester : Nat, subjectCode : Text) : async [Resource] {
    resources.values().toArray().filter(
      func(r) { r.semester == semester and r.subjectCode == subjectCode }
    );
  };

  public shared ({ caller }) func verifyTutor(user : Principal) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (tutorProfiles.get(user)) {
      case (?profile) {
        tutorProfiles.add(user, { profile with isVerified = true });
      };
      case (null) { Runtime.trap("Tutor profile does not exist") };
    };
  };

  public shared ({ caller }) func initialize() : async () {
    switch (bookingCleanupTimerId) {
      case (null) {
        let id = Timer.recurringTimer<system>(#nanoseconds (24 * 60 * 60 * 1_000_000_000), cleanupOldBookings);
        bookingCleanupTimerId := ?id;
      };
      case (?_id) {};
    };
  };

  func cleanupOldBookings() : async () {
    let now = Time.now();
    let oneDayNanos : Int = 24 * 60 * 60 * 1_000_000_000;
    let oldBookingIds = List.empty<SessionId>();
    sessionBookings.entries().forEach(
      func((id, booking)) {
        if (now - booking.dateTime > oneDayNanos) { oldBookingIds.add(id) };
      }
    );
    oldBookingIds.values().forEach(func(id) { sessionBookings.remove(id) });
  };
};
