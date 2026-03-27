import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Principal } from "@icp-sdk/core/principal";
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Flame,
  Loader2,
  Search,
  Star,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { BookingStatus } from "../backend.d";
import type { TutorProfile } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useBookSession,
  useCallerSessions,
  useSearchTutors,
} from "../hooks/useQueries";

const DUMMY_TUTORS: (TutorProfile & { displayName: string; branch: string })[] =
  [
    {
      user: "dummy-arjun" as unknown as Principal,
      displayName: "Arjun M.",
      branch: "S7, CSE",
      isAvailable: true,
      isVerified: true,
      avatarUrl: "",
      rating: 4.9,
      masteredSubjects: ["EST100 Mechanics", "MAT101 Calculus"],
    },
    {
      user: "dummy-lakshmi" as unknown as Principal,
      displayName: "Lakshmi S.",
      branch: "S5, ECE",
      isAvailable: true,
      isVerified: true,
      avatarUrl: "",
      rating: 4.8,
      masteredSubjects: ["EST102 C Programming", "Python"],
    },
    {
      user: "dummy-rahul" as unknown as Principal,
      displayName: "Rahul Krishnan",
      branch: "S7, ME",
      isAvailable: true,
      isVerified: true,
      avatarUrl: "",
      rating: 5.0,
      masteredSubjects: ["BE110 Engineering Graphics"],
    },
  ];

const TUTOR_COLORS: Record<string, string> = {
  "dummy-arjun": "#34C759",
  "dummy-lakshmi": "#007AFF",
  "dummy-rahul": "#FF9500",
};

const CRASH_PACKS = [
  {
    subject: "EST102 C Programming",
    examIn: "48 hrs : 12 mins",
    seatsLeft: 2,
    totalSeats: 5,
  },
  {
    subject: "Discrete Mathematics",
    examIn: "3 Days : 05 hrs",
    seatsLeft: 1,
    totalSeats: 5,
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

type DummyTutor = TutorProfile & { displayName: string; branch?: string };

interface BookingModalProps {
  tutor: DummyTutor | null;
  isDummy: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

function BookingModal({
  tutor,
  isDummy,
  onClose,
  triggerRef,
}: BookingModalProps) {
  const { identity } = useInternetIdentity();
  const [subject, setSubject] = useState(tutor?.masteredSubjects[0] ?? "");
  const [dateTime, setDateTime] = useState("");
  const { mutateAsync: bookSession, isPending } = useBookSession();
  const modalRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = "booking-modal-title";

  // Focus first element when modal opens
  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  // Trap focus within modal and close on Escape
  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    const focusableSelectors =
      'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      const focusableEls = Array.from(
        modal.querySelectorAll<HTMLElement>(focusableSelectors),
      ).filter((el) => !el.closest('[aria-hidden="true"]'));

      if (focusableEls.length === 0) return;
      const first = focusableEls[0];
      const last = focusableEls[focusableEls.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Return focus to trigger on close
  const handleClose = () => {
    onClose();
    triggerRef.current?.focus();
  };

  const handleConfirm = async () => {
    if (isDummy) {
      toast.success("Session requested! (Demo mode)");
      handleClose();
      return;
    }
    if (!tutor || !identity) return;
    if (!subject.trim()) {
      toast.error("Please enter a subject code");
      return;
    }
    if (!dateTime) {
      toast.error("Please select a date and time");
      return;
    }
    try {
      await bookSession({
        id: BigInt(0),
        status: BookingStatus.pending,
        junior: identity.getPrincipal(),
        senior: tutor.user,
        subjectCode: subject.trim(),
        price: BigInt(250),
        dateTime: BigInt(new Date(dateTime).getTime()) * BigInt(1_000_000),
      });
      toast.success("Session booked successfully!");
      handleClose();
    } catch {
      toast.error("Failed to book session. Please try again.");
    }
  };

  if (!tutor) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      data-ocid="booking.modal"
      role="presentation"
    >
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 backdrop-blur-md bg-black/20 cursor-default"
        onClick={handleClose}
        aria-label="Close booking modal"
        tabIndex={-1}
      />

      {/* Dialog */}
      <dialog
        ref={modalRef}
        open
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-8 w-full max-w-md"
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={handleClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-border transition-colors"
          data-ocid="booking.close.button"
          aria-label="Close booking modal"
        >
          <X className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
        </button>

        <h2
          id={titleId}
          className="text-xl font-bold text-foreground mb-6 tracking-tight"
        >
          Book a Micro-Session
        </h2>

        {/* Tutor info */}
        <div className="flex items-center gap-4 p-4 bg-background rounded-2xl mb-6">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-base flex-shrink-0"
            style={{
              background: TUTOR_COLORS[String(tutor.user)] ?? "#007AFF",
            }}
            aria-hidden="true"
          >
            {getInitials(tutor.displayName)}
          </div>
          <div>
            <div className="font-semibold text-foreground">
              {tutor.displayName}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
              <CheckCircle2
                className="w-3.5 h-3.5 text-green-500"
                aria-hidden="true"
              />
              Grade Card Verified Tutor
            </div>
          </div>
        </div>

        {/* Subject */}
        <div className="mb-4">
          <label
            className="text-sm font-medium text-foreground mb-1.5 block"
            htmlFor="booking-subject"
          >
            Subject
          </label>
          <input
            id="booking-subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. MAT101 Calculus"
            className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            data-ocid="booking.subject.input"
          />
        </div>

        {!isDummy && (
          <div className="mb-6">
            <label
              className="text-sm font-medium text-foreground mb-1.5 block"
              htmlFor="booking-datetime"
            >
              Date &amp; Time
            </label>
            <input
              id="booking-datetime"
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              data-ocid="booking.datetime.input"
            />
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between p-4 bg-background rounded-2xl mb-6">
          <span className="text-sm text-muted-foreground">Session Price</span>
          <span className="text-2xl font-bold text-foreground">
            ₹250 / session
          </span>
        </div>

        <Button
          onClick={handleConfirm}
          disabled={isPending}
          aria-disabled={isPending}
          className="w-full bg-primary text-white hover:bg-primary/90 rounded-full font-semibold py-3 text-base"
          data-ocid="booking.confirm.button"
        >
          {isPending ? (
            <>
              <Loader2
                className="mr-2 w-4 h-4 animate-spin"
                aria-hidden="true"
              />
              <span>Booking...</span>
            </>
          ) : (
            "Confirm Booking"
          )}
        </Button>

        <div className="flex items-center justify-center gap-1.5 mt-3">
          <span className="text-xs text-muted-foreground">
            <span aria-hidden="true">🔒</span> Secure UPI Payments
          </span>
        </div>
      </dialog>
    </div>
  );
}

interface TutorCardProps {
  tutor: DummyTutor;
  color?: string;
  onBook: (ref: React.RefObject<HTMLButtonElement | null>) => void;
  index: number;
}

function TutorCard({
  tutor,
  color = "#007AFF",
  onBook,
  index,
}: TutorCardProps) {
  const bookButtonRef = useRef<HTMLButtonElement>(null);
  const branch = (
    tutor as TutorProfile & { displayName: string; branch?: string }
  ).branch;
  return (
    <article
      className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4"
      data-ocid={`tutors.item.${index}`}
      aria-label={`Tutor: ${tutor.displayName}`}
    >
      <div className="flex items-start justify-between">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-base flex-shrink-0"
          style={{ background: color }}
          aria-hidden="true"
        >
          {getInitials(tutor.displayName)}
        </div>
        <div className="flex items-center gap-1">
          <Star
            className="w-3.5 h-3.5"
            style={{ fill: "#F4C542", color: "#F4C542" }}
            aria-hidden="true"
          />
          <span className="text-sm font-semibold text-foreground">
            <span className="sr-only">Rating: </span>
            {tutor.rating}/5
          </span>
        </div>
      </div>

      <div>
        <div className="font-semibold text-foreground text-base">
          {tutor.displayName}
        </div>
        {branch && (
          <div className="text-xs text-muted-foreground mt-0.5">{branch}</div>
        )}
        {tutor.isVerified && (
          <div className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-medium px-2.5 py-0.5 rounded-full mt-2">
            <CheckCircle2 className="w-3 h-3" aria-hidden="true" /> Grade Card
            Verified
          </div>
        )}
      </div>

      <div className="space-y-1.5">
        <div className="flex items-start gap-1.5">
          <BookOpen
            className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0"
            aria-hidden="true"
          />
          <span className="text-xs text-muted-foreground">
            <span className="sr-only">Subjects: </span>
            {tutor.masteredSubjects.join(", ")}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock
            className="w-3.5 h-3.5 text-muted-foreground"
            aria-hidden="true"
          />
          <span
            className={`text-xs ${
              tutor.isAvailable
                ? "text-green-600 font-medium"
                : "text-muted-foreground"
            }`}
          >
            {tutor.isAvailable ? "Available Now" : "Unavailable"}
          </span>
        </div>
      </div>

      <Button
        ref={bookButtonRef}
        className="w-full bg-primary text-white hover:bg-primary/90 rounded-full text-xs font-semibold mt-auto"
        size="sm"
        onClick={() => onBook(bookButtonRef)}
        data-ocid={`tutors.book.button.${index}`}
        aria-label={`Book a session with ${tutor.displayName}`}
      >
        Book a Micro-Session
      </Button>
    </article>
  );
}

export default function JuniorDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [bookingTutor, setBookingTutor] = useState<DummyTutor | null>(null);
  const [bookingIsDummy, setBookingIsDummy] = useState(false);
  const [bookingTriggerRef, setBookingTriggerRef] =
    useState<React.RefObject<HTMLButtonElement | null> | null>(null);

  const { data: backendTutors = [], isLoading: tutorsLoading } =
    useSearchTutors(activeSearch);
  const { data: sessions = [], isLoading: sessionsLoading } =
    useCallerSessions();

  const enrichedBackend: DummyTutor[] = backendTutors.map((t) => ({
    ...t,
    displayName: t.user.toString().slice(0, 8),
  }));

  const filteredDummy = activeSearch
    ? DUMMY_TUTORS.filter((t) =>
        t.masteredSubjects.some((s) =>
          s.toLowerCase().includes(activeSearch.toLowerCase()),
        ),
      )
    : DUMMY_TUTORS;

  const allTutors = [...filteredDummy, ...enrichedBackend];

  const pendingSessions = sessions.filter(
    (s) => s.status === BookingStatus.pending,
  );
  const confirmedSessions = sessions.filter(
    (s) => s.status === BookingStatus.confirmed,
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearch(searchQuery);
  };

  const openBooking = (
    tutor: DummyTutor,
    isDummy: boolean,
    ref: React.RefObject<HTMLButtonElement | null>,
  ) => {
    setBookingTutor(tutor);
    setBookingIsDummy(isDummy);
    setBookingTriggerRef(ref);
  };

  const tutorsResultId = "tutors-result-count";

  return (
    <main id="main-content" className="min-h-screen bg-background">
      <div className="max-w-[1200px] mx-auto px-6 py-10">
        {/* Search bar */}
        <search>
          <form
            onSubmit={handleSearch}
            className="mb-10"
            aria-label="Search tutors by subject"
          >
            <div className="relative max-w-2xl mx-auto">
              <label htmlFor="tutor-search" className="sr-only">
                Search tutors by subject code
              </label>
              <Search
                className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                id="tutor-search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Subject Code (e.g., EST102 C Programming, BE110 Engineering Graphics, CYT100 Chemistry)..."
                className="w-full bg-white border border-border rounded-full pl-12 pr-6 py-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary shadow-sm transition-all"
                data-ocid="dashboard.search.input"
                aria-controls={tutorsResultId}
              />
            </div>
          </form>
        </search>

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main: Tutor cards */}
          <section aria-labelledby="tutors-heading" className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-5">
              <h2
                id="tutors-heading"
                className="text-xl font-bold text-foreground tracking-tight"
              >
                {activeSearch
                  ? `Tutors for "${activeSearch}"`
                  : "Top Verified Tutors"}
              </h2>
              <Badge
                id={tutorsResultId}
                variant="secondary"
                className="rounded-full"
                aria-live="polite"
                aria-atomic="true"
              >
                {allTutors.length} found
              </Badge>
            </div>

            {tutorsLoading ? (
              <div
                className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4"
                data-ocid="tutors.loading_state"
                aria-label="Loading tutors"
                aria-busy="true"
              >
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl p-6 space-y-3 shadow-sm"
                  >
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-8 w-full rounded-full" />
                  </div>
                ))}
              </div>
            ) : allTutors.length === 0 ? (
              <output
                className="bg-white rounded-2xl p-12 text-center shadow-sm block"
                data-ocid="tutors.empty_state"
              >
                <Search
                  className="w-12 h-12 text-muted-foreground mx-auto mb-3"
                  aria-hidden="true"
                />
                <p className="text-foreground font-semibold">No tutors found</p>
                <p className="text-muted-foreground text-sm mt-1">
                  Try a different subject code
                </p>
              </output>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {allTutors.map((tutor, i) => {
                  const isDummy = String(tutor.user).startsWith("dummy-");
                  return (
                    <TutorCard
                      key={String(tutor.user)}
                      tutor={tutor}
                      color={TUTOR_COLORS[String(tutor.user)]}
                      onBook={(ref) => openBooking(tutor, isDummy, ref)}
                      index={i + 1}
                    />
                  );
                })}
              </div>
            )}
          </section>

          {/* Sidebar */}
          <aside
            className="lg:w-80 space-y-5"
            aria-label="Crash packs and sessions"
          >
            {/* Series Exam Crash Packs */}
            <section
              aria-labelledby="crash-packs-heading"
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-5">
                <Flame className="w-5 h-5 text-orange-500" aria-hidden="true" />
                <h3
                  id="crash-packs-heading"
                  className="font-bold text-foreground tracking-tight"
                >
                  Series Exam Crash Packs
                </h3>
              </div>
              <ul className="space-y-4" aria-label="Available crash packs">
                {CRASH_PACKS.map((pack, i) => (
                  <li
                    key={pack.subject}
                    className="p-4 bg-background rounded-2xl"
                    data-ocid={`crashpacks.item.${i + 1}`}
                  >
                    <div className="font-semibold text-sm text-foreground mb-1">
                      {pack.subject}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-orange-600 font-medium mb-1">
                      <Clock className="w-3 h-3" aria-hidden="true" />
                      <span>
                        <span className="sr-only">Exam in: </span>
                        {pack.examIn}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mb-3">
                      Seats Left:{" "}
                      <span className="font-semibold text-foreground">
                        {pack.seatsLeft}/{pack.totalSeats}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      className="w-full bg-primary text-white hover:bg-primary/90 rounded-full text-xs font-semibold"
                      data-ocid={`crashpacks.join.button.${i + 1}`}
                      aria-label={`Join ${pack.subject} crash pack cohort`}
                    >
                      Join Cohort
                    </Button>
                  </li>
                ))}
              </ul>
            </section>

            {/* Upcoming Sessions */}
            <Card className="rounded-2xl shadow-sm border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 font-bold">
                  <Calendar
                    className="w-4 h-4 text-primary"
                    aria-hidden="true"
                  />
                  Upcoming Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {sessionsLoading ? (
                  <div
                    className="space-y-3"
                    data-ocid="sessions.loading_state"
                    aria-label="Loading sessions"
                    aria-busy="true"
                  >
                    <Skeleton className="h-16 w-full rounded-xl" />
                    <Skeleton className="h-16 w-full rounded-xl" />
                  </div>
                ) : pendingSessions.length + confirmedSessions.length === 0 ? (
                  <output
                    className="text-center py-6 block"
                    data-ocid="sessions.empty_state"
                  >
                    <Calendar
                      className="w-8 h-8 text-muted-foreground mx-auto mb-2"
                      aria-hidden="true"
                    />
                    <p className="text-sm text-muted-foreground">
                      No upcoming sessions
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Book a session with a tutor!
                    </p>
                  </output>
                ) : (
                  <ul className="space-y-3" aria-label="Upcoming sessions list">
                    {[...confirmedSessions, ...pendingSessions]
                      .slice(0, 5)
                      .map((s, i) => (
                        <li
                          key={String(s.id)}
                          className="p-3 bg-background rounded-xl"
                          data-ocid={`sessions.item.${i + 1}`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-foreground">
                              {s.subjectCode}
                            </span>
                            <Badge
                              variant={
                                s.status === BookingStatus.confirmed
                                  ? "default"
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              {s.status}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {new Date(
                              Number(s.dateTime) / 1_000_000,
                            ).toLocaleDateString()}
                          </div>
                        </li>
                      ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            {/* Stats */}
            <Card className="rounded-2xl shadow-sm border-border">
              <CardContent className="pt-5">
                <dl className="space-y-3">
                  <div className="flex justify-between items-center">
                    <dt className="text-sm text-muted-foreground">
                      Total Sessions
                    </dt>
                    <dd className="font-semibold text-foreground">
                      {sessions.length}
                    </dd>
                  </div>
                  <div className="flex justify-between items-center">
                    <dt className="text-sm text-muted-foreground">Pending</dt>
                    <dd>
                      <Badge variant="secondary">
                        {pendingSessions.length}
                      </Badge>
                    </dd>
                  </div>
                  <div className="flex justify-between items-center">
                    <dt className="text-sm text-muted-foreground">Confirmed</dt>
                    <dd>
                      <Badge className="bg-primary text-white">
                        {confirmedSessions.length}
                      </Badge>
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>

      {bookingTutor && bookingTriggerRef && (
        <BookingModal
          tutor={bookingTutor}
          isDummy={bookingIsDummy}
          onClose={() => setBookingTutor(null)}
          triggerRef={bookingTriggerRef}
        />
      )}
    </main>
  );
}
