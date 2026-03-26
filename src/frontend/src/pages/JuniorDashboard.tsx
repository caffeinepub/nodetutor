import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import type { Principal } from "@icp-sdk/core/principal";
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Loader2,
  Search,
  Star,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { BookingStatus } from "../backend.d";
import type { TutorProfile } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useBookSession,
  useCallerSessions,
  useSearchTutors,
} from "../hooks/useQueries";

const SAMPLE_TUTORS: (TutorProfile & { displayName: string })[] = [
  {
    user: "sample-sarah" as unknown as Principal,
    displayName: "Sarah Chen",
    isAvailable: true,
    isVerified: true,
    avatarUrl: "",
    rating: 4.9,
    masteredSubjects: ["Circuits", "EE101", "MAT101"],
  },
  {
    user: "sample-david" as unknown as Principal,
    displayName: "David Lee",
    isAvailable: true,
    isVerified: true,
    avatarUrl: "",
    rating: 4.7,
    masteredSubjects: ["Thermodynamics", "PHY201", "MAT201"],
  },
  {
    user: "sample-priya" as unknown as Principal,
    displayName: "Priya Nair",
    isAvailable: true,
    isVerified: true,
    avatarUrl: "",
    rating: 4.8,
    masteredSubjects: ["MAT101", "Calculus", "EST100"],
  },
  {
    user: "sample-arjun" as unknown as Principal,
    displayName: "Arjun Menon",
    isAvailable: false,
    isVerified: true,
    avatarUrl: "",
    rating: 4.6,
    masteredSubjects: ["EST100", "Python", "CS101"],
  },
];

const TUTOR_COLORS: Record<string, string> = {
  "sample-sarah": "#6366f1",
  "sample-david": "#0ea5e9",
  "sample-priya": "#ec4899",
  "sample-arjun": "#f59e0b",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className="w-3.5 h-3.5"
          style={{
            fill: i <= Math.round(rating) ? "#F4C542" : "transparent",
            color: "#F4C542",
          }}
        />
      ))}
      <span className="text-xs font-medium text-muted-foreground ml-0.5">
        {rating}/5
      </span>
    </div>
  );
}

interface BookingModalProps {
  tutor: (TutorProfile & { displayName: string }) | null;
  subjectCode: string;
  onClose: () => void;
}

function BookingModal({ tutor, subjectCode, onClose }: BookingModalProps) {
  const { identity } = useInternetIdentity();
  const [subject, setSubject] = useState(subjectCode);
  const [dateTime, setDateTime] = useState("");
  const { mutateAsync: bookSession, isPending } = useBookSession();

  const handleConfirm = async () => {
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
      onClose();
    } catch {
      toast.error("Failed to book session. Please try again.");
    }
  };

  return (
    <Dialog open={!!tutor} onOpenChange={onClose}>
      <DialogContent className="max-w-md" data-ocid="booking.dialog">
        <DialogHeader>
          <DialogTitle>Book a Micro-Session</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-xl">
            <Avatar className="w-10 h-10">
              <AvatarImage src={tutor?.avatarUrl} />
              <AvatarFallback
                className="font-semibold text-white text-sm"
                style={{
                  background: tutor
                    ? (TUTOR_COLORS[String(tutor.user)] ?? "#6366f1")
                    : "#6366f1",
                }}
              >
                {tutor ? getInitials(tutor.displayName) : "?"}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold text-foreground text-sm">
                {tutor?.displayName}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <CheckCircle2 className="w-3 h-3 text-blue-600" />
                Grade Card Verified Tutor
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="booking-subject">Subject Code</Label>
            <Input
              id="booking-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. MAT101"
              data-ocid="booking.subject.input"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="booking-datetime">Date &amp; Time</Label>
            <Input
              id="booking-datetime"
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              data-ocid="booking.datetime.input"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-secondary rounded-xl">
            <span className="text-sm text-muted-foreground">Session Price</span>
            <span className="text-lg font-bold text-foreground">₹250</span>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            data-ocid="booking.cancel.button"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isPending}
            className="bg-primary text-primary-foreground"
            data-ocid="booking.confirm.button"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Booking...
              </>
            ) : (
              "Confirm Booking"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface TutorCardProps {
  tutor: TutorProfile & { displayName: string };
  color?: string;
  onBook: () => void;
  index: number;
}

function TutorCard({
  tutor,
  color = "#6366f1",
  onBook,
  index,
}: TutorCardProps) {
  return (
    <div
      className="bg-card border border-border rounded-xl p-5 shadow-card hover:shadow-card-hover transition-all flex flex-col gap-3"
      data-ocid={`tutors.item.${index}`}
    >
      <div className="flex items-start justify-between">
        <Avatar className="w-12 h-12">
          <AvatarImage src={tutor.avatarUrl} />
          <AvatarFallback
            className="font-bold text-white"
            style={{ background: color }}
          >
            {getInitials(tutor.displayName)}
          </AvatarFallback>
        </Avatar>
        <StarRating rating={tutor.rating ?? 0} />
      </div>

      <div>
        <div className="font-semibold text-foreground">{tutor.displayName}</div>
        {tutor.isVerified && (
          <div className="flex items-center gap-1 mt-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-xs font-medium text-blue-600">
              Grade Card Verified
            </span>
          </div>
        )}
      </div>

      <div className="space-y-1.5 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5" />
          <span>{tutor.masteredSubjects.slice(0, 3).join(", ")}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          <span
            className={
              tutor.isAvailable
                ? "text-green-600 font-medium"
                : "text-muted-foreground"
            }
          >
            {tutor.isAvailable ? "Available Now" : "Currently Unavailable"}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-foreground">₹250</span>
          <span>/ session</span>
        </div>
      </div>

      <div className="flex gap-2 mt-auto pt-1">
        <Button
          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold"
          size="sm"
          onClick={onBook}
          data-ocid={`tutors.book.button.${index}`}
        >
          Book Session
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-xs"
          data-ocid={`tutors.view.button.${index}`}
        >
          View Profile
        </Button>
      </div>
    </div>
  );
}

const FILTER_CHIPS = [
  "All Subjects",
  "Verified Only",
  "Available Now",
  "Rating 4.5+",
];

export default function JuniorDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [bookingTutor, setBookingTutor] = useState<
    (TutorProfile & { displayName: string }) | null
  >(null);

  const { data: backendTutors = [], isLoading: tutorsLoading } =
    useSearchTutors(activeSearch);
  const { data: sessions = [], isLoading: sessionsLoading } =
    useCallerSessions();

  const enrichedBackend: (TutorProfile & { displayName: string })[] =
    backendTutors.map((t) => ({
      ...t,
      displayName: t.user.toString().slice(0, 8),
    }));

  const filteredSamples = activeSearch
    ? SAMPLE_TUTORS.filter((t) =>
        t.masteredSubjects.some((s) =>
          s.toLowerCase().includes(activeSearch.toLowerCase()),
        ),
      )
    : SAMPLE_TUTORS;

  const allTutors = [...filteredSamples, ...enrichedBackend];

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

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-6">
            <Card className="shadow-card border-border">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">
                  Find Your Engineering Peer Tutor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by subject code (e.g. MAT101, EST100)..."
                      className="pl-9"
                      data-ocid="dashboard.search.input"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="bg-primary text-primary-foreground"
                    data-ocid="dashboard.search.button"
                  >
                    Search
                  </Button>
                </form>
                <div className="flex flex-wrap gap-2 mt-3">
                  {FILTER_CHIPS.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      className="text-xs px-3 py-1 rounded-full border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                      data-ocid="dashboard.filter.tab"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">
                  {activeSearch
                    ? `Tutors for "${activeSearch}"`
                    : "Top Peer Tutors"}
                </h2>
                <Badge variant="secondary" className="text-xs">
                  {allTutors.length} tutors found
                </Badge>
              </div>

              {tutorsLoading ? (
                <div
                  className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4"
                  data-ocid="tutors.loading_state"
                >
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="bg-card border border-border rounded-xl p-5 space-y-3"
                    >
                      <Skeleton className="w-12 h-12 rounded-full" />
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-8 w-full" />
                    </div>
                  ))}
                </div>
              ) : allTutors.length === 0 ? (
                <div
                  className="bg-card border border-border rounded-xl p-12 text-center"
                  data-ocid="tutors.empty_state"
                >
                  <Search className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-foreground font-medium">No tutors found</p>
                  <p className="text-muted-foreground text-sm mt-1">
                    Try a different subject code
                  </p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {allTutors.map((tutor, i) => (
                    <TutorCard
                      key={String(tutor.user)}
                      tutor={tutor}
                      color={TUTOR_COLORS[String(tutor.user)]}
                      onBook={() => setBookingTutor(tutor)}
                      index={i + 1}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <aside className="lg:w-80 space-y-4">
            <Card className="shadow-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Upcoming Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {sessionsLoading ? (
                  <div className="space-y-3" data-ocid="sessions.loading_state">
                    <Skeleton className="h-16 w-full rounded-lg" />
                    <Skeleton className="h-16 w-full rounded-lg" />
                  </div>
                ) : pendingSessions.length + confirmedSessions.length === 0 ? (
                  <div
                    className="text-center py-6"
                    data-ocid="sessions.empty_state"
                  >
                    <Calendar className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No upcoming sessions
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Book a session with a tutor!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {[...confirmedSessions, ...pendingSessions]
                      .slice(0, 5)
                      .map((s, i) => (
                        <div
                          key={String(s.id)}
                          className="p-3 bg-secondary rounded-lg"
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
                          <div className="text-xs font-medium text-foreground mt-0.5">
                            ₹{String(s.price)}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-card border-border">
              <CardContent className="pt-5">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Total Sessions
                    </span>
                    <span className="font-semibold text-foreground">
                      {sessions.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Pending
                    </span>
                    <Badge variant="secondary">{pendingSessions.length}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Confirmed
                    </span>
                    <Badge className="bg-primary text-primary-foreground">
                      {confirmedSessions.length}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>

      <BookingModal
        tutor={bookingTutor}
        subjectCode={activeSearch}
        onClose={() => setBookingTutor(null)}
      />
    </main>
  );
}
