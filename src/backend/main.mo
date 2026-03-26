import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
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
  //----------------------------- Custom Types ---------------------------//

  type UserRole = {
    #junior;
    #senior;
  };

  type BookingStatus = {
    #pending;
    #confirmed;
    #completed;
  };

  type SessionId = Nat;
  type ResourceId = Nat;

  type FileType = {
    #pdf;
    #link;
  };

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
    public func compare(tutor1 : TutorProfile, tutor2 : TutorProfile) : Order.Order {
      tutor1.user.toText().compare(tutor2.user.toText());
    };

    public func compareByRating(tutor1 : TutorProfile, tutor2 : TutorProfile) : Order.Order {
      switch (tutor1.rating, tutor2.rating) {
        case (null, null) { #equal };
        case (null, _) { #greater };
        case (_, null) { #less };
        case (?rating1, ?rating2) { Float.compare(rating2, rating1) };
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
    public func compare(resource1 : Resource, resource2 : Resource) : Order.Order {
      Nat.compare(resource2.id, resource1.id);
    };
  };

  // -------------------- Authorization --------------------------- //
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // -------------------- Persistent State ------------------------ //
  var nextSessionId = 1;
  var nextResourceId = 1;
  var bookingCleanupTimerId : ?Timer.TimerId = null;

  let userProfiles = Map.empty<Principal, UserProfile>();
  let tutorProfiles = Map.empty<Principal, TutorProfile>();
  let sessionBookings = Map.empty<SessionId, SessionBooking>();
  let resources = Map.empty<Nat, Resource>();

  //---------------------- Registration ----------------------------//

  public shared ({ caller }) func registerCallerUserProfile(userProfile : UserProfile) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Anonymous callers cannot register");
    };
    if (userProfiles.containsKey(caller)) {
      Runtime.trap("User already registered");
    };
    // Auto-assign user role if not already in access control system
    switch (accessControlState.userRoles.get(caller)) {
      case (null) { accessControlState.userRoles.add(caller, #user) };
      case (?_) {};
    };
    userProfiles.add(caller, userProfile);

    if (userProfile.role == #senior) {
      let tutorProfile : TutorProfile = {
        user = caller;
        avatarUrl = "";
        isVerified = false;
        isAvailable = false;
        rating = null;
        masteredSubjects = [];
      };
      tutorProfiles.add(caller, tutorProfile);
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
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public query ({ caller }) func getTutorProfile(user : Principal) : async ?TutorProfile {
    // Public information - no authorization needed
    tutorProfiles.get(user);
  };

  //---------------------- Tutoring ----------------------------//

  public shared ({ caller }) func updateTutorAvailability(isAvailable : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update tutor availability");
    };
    switch (tutorProfiles.get(caller)) {
      case (?profile) {
        let updatedProfile : TutorProfile = {
          profile with
          isAvailable;
        };
        tutorProfiles.add(caller, updatedProfile);
      };
      case (null) {
        Runtime.trap("Tutor profile does not exist");
      };
    };
  };

  public shared ({ caller }) func updateTutorSubjects(subjects : [Text]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update tutor subjects");
    };
    switch (tutorProfiles.get(caller)) {
      case (?profile) {
        let updatedProfile : TutorProfile = {
          profile with
          masteredSubjects = subjects;
        };
        tutorProfiles.add(caller, updatedProfile);
      };
      case (null) {
        Runtime.trap("Tutor profile does not exist");
      };
    };
  };

  public query ({ caller }) func getAvailableTutors() : async [TutorProfile] {
    // Public information - no authorization needed
    tutorProfiles.values().toArray().filter(func(tutor) { tutor.isAvailable });
  };

  public query ({ caller }) func searchTutorsBySubject(subjectCode : Text) : async [TutorProfile] {
    // Public information - no authorization needed
    tutorProfiles.values().toArray().filter(
      func(tutor) {
        tutor.masteredSubjects.find(func(s) { s == subjectCode }) != null;
      }
    );
  };

  public query ({ caller }) func getVerifiedTutors() : async [TutorProfile] {
    // Public information - no authorization needed
    tutorProfiles.values().toArray().filter(func(tutor) { tutor.isVerified });
  };

  //---------------------- Booking ----------------------------//

  public shared ({ caller }) func bookSession(booking : SessionBooking) : async SessionId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can book sessions");
    };
    let bookingId = nextSessionId;
    nextSessionId += 1;

    let newBooking : SessionBooking = {
      id = bookingId;
      junior = caller;
      senior = booking.senior;
      subjectCode = booking.subjectCode;
      dateTime = booking.dateTime;
      status = #pending;
      price = booking.price;
    };

    sessionBookings.add(bookingId, newBooking);
    bookingId;
  };

  public shared ({ caller }) func updateSessionStatus(bookingId : SessionId, status : BookingStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update session status");
    };
    switch (sessionBookings.get(bookingId)) {
      case (?booking) {
        if (caller != booking.junior and caller != booking.senior) {
          Runtime.trap("Unauthorized: Only users can update their own booking");
        };
        let updatedBooking = {
          booking with
          status;
        };
        sessionBookings.add(bookingId, updatedBooking);
      };
      case (null) {
        Runtime.trap("Booking does not exist");
      };
    };
  };

  public query ({ caller }) func getSessionsForUser(user : Principal) : async [SessionBooking] {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own sessions");
    };
    sessionBookings.values().toArray().filter(
      func(booking) { booking.junior == user or booking.senior == user }
    );
  };

  public query ({ caller }) func getCallerSessions() : async [SessionBooking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view sessions");
    };
    sessionBookings.values().toArray().filter(
      func(booking) { booking.junior == caller or booking.senior == caller }
    );
  };

  public query ({ caller }) func getBookingsByStatus(status : BookingStatus) : async [SessionBooking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view bookings");
    };
    sessionBookings.values().toArray().filter(
      func(booking) { 
        (booking.junior == caller or booking.senior == caller) and booking.status == status 
      }
    );
  };

  //---------------------- Learn Resources ----------------------------//

  public shared ({ caller }) func addResource(resource : Resource) : async ResourceId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add resources");
    };
    let resourceId = nextResourceId;
    nextResourceId += 1;

    let newResource = {
      resource with
      id = resourceId;
      uploader = caller;
    };

    resources.add(resourceId, newResource);
    resourceId;
  };

  public query ({ caller }) func getAllResources() : async [Resource] {
    // Public information - no authorization needed
    resources.values().toArray();
  };

  public query ({ caller }) func getResourcesBySemester(semester : Nat) : async [Resource] {
    // Public information - no authorization needed
    resources.values().toArray().filter(func(resource) { resource.semester == semester });
  };

  public query ({ caller }) func getResourcesBySubject(subjectCode : Text) : async [Resource] {
    // Public information - no authorization needed
    resources.values().toArray().filter(func(resource) { resource.subjectCode == subjectCode });
  };

  public query ({ caller }) func getResourcesBySemesterAndSubject(semester : Nat, subjectCode : Text) : async [Resource] {
    // Public information - no authorization needed
    resources.values().toArray().filter(
      func(resource) {
        resource.semester == semester and resource.subjectCode == subjectCode
      }
    );
  };

  //---------------------- Admin ----------------------------//

  public shared ({ caller }) func verifyTutor(user : Principal) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (tutorProfiles.get(user)) {
      case (?profile) {
        let updatedProfile = {
          profile with
          isVerified = true;
        };
        tutorProfiles.add(user, updatedProfile);
      };
      case (null) { Runtime.trap("Tutor profile does not exist") };
    };
  };

  //---------------------- Initialization ----------------------------//

  public shared ({ caller }) func initialize() : async () {
    switch (bookingCleanupTimerId) {
      case (null) {
        let id = Timer.recurringTimer<system>(#nanoseconds (24 * 60 * 60 * 1_000_000_000), cleanupOldBookings);
        bookingCleanupTimerId := ?id;
      };
      case (?_id) {};
    };
  };

  //---------------------- Internal Cleanup ----------------------------//

  func cleanupOldBookings() : async () {
    let now = Time.now();
    let oneDayNanos : Int = 24 * 60 * 60 * 1_000_000_000;
    let oldBookingIds = List.empty<SessionId>();

    sessionBookings.entries().forEach(
      func((id, booking)) {
        if (now - booking.dateTime > oneDayNanos) {
          oldBookingIds.add(id);
        };
      }
    );
    oldBookingIds.values().forEach(
      func(id) {
        sessionBookings.remove(id);
      }
    );
  };
};
