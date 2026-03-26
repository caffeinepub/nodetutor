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
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Loader2,
  Settings,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { BookingStatus } from "../backend.d";
import {
  useCallerSessions,
  useTutorProfile,
  useUpdateAvailability,
  useUpdateSubjects,
} from "../hooks/useQueries";

export default function SeniorDashboard() {
  const { data: sessions = [], isLoading: sessionsLoading } =
    useCallerSessions();
  const { data: tutorProfile } = useTutorProfile(undefined);
  const { mutateAsync: updateAvailability, isPending: availPending } =
    useUpdateAvailability();
  const { mutateAsync: updateSubjects, isPending: subjectsPending } =
    useUpdateSubjects();

  const [subjectsModal, setSubjectsModal] = useState(false);
  const [subjectsInput, setSubjectsInput] = useState("");

  const pendingSessions = sessions.filter(
    (s) => s.status === BookingStatus.pending,
  );
  const confirmedSessions = sessions.filter(
    (s) => s.status === BookingStatus.confirmed,
  );
  const completedSessions = sessions.filter(
    (s) => s.status === BookingStatus.completed,
  );

  const handleToggleAvailability = async () => {
    try {
      await updateAvailability(!tutorProfile?.isAvailable);
      toast.success(
        tutorProfile?.isAvailable
          ? "You are now unavailable"
          : "You are now available for bookings!",
      );
    } catch {
      toast.error("Failed to update availability");
    }
  };

  const handleUpdateSubjects = async () => {
    try {
      const list = subjectsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      await updateSubjects(list);
      toast.success("Subjects updated!");
      setSubjectsModal(false);
    } catch {
      toast.error("Failed to update subjects");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1200px] mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight mb-1">
              Senior Dashboard
            </h1>
            <p className="text-muted-foreground text-sm">
              Manage your tutoring sessions and availability
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSubjectsInput(
                tutorProfile?.masteredSubjects?.join(", ") ?? "",
              );
              setSubjectsModal(true);
            }}
            className="rounded-full gap-2"
            data-ocid="senior.settings.button"
          >
            <Settings className="w-4 h-4" />
            Manage Subjects
          </Button>
        </div>

        {/* Stats + Availability */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="rounded-3xl border-border shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-muted-foreground">
                  Availability
                </span>
                <Switch
                  checked={tutorProfile?.isAvailable ?? false}
                  onCheckedChange={handleToggleAvailability}
                  disabled={availPending}
                  data-ocid="senior.availability.switch"
                />
              </div>
              <p className="text-lg font-bold text-foreground">
                {tutorProfile?.isAvailable ? "Available" : "Unavailable"}
              </p>
            </CardContent>
          </Card>
          <Card className="rounded-3xl border-border shadow-sm">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Pending</p>
              <p className="text-3xl font-bold text-foreground">
                {pendingSessions.length}
              </p>
            </CardContent>
          </Card>
          <Card className="rounded-3xl border-border shadow-sm">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Confirmed</p>
              <p className="text-3xl font-bold text-foreground">
                {confirmedSessions.length}
              </p>
            </CardContent>
          </Card>
          <Card className="rounded-3xl border-border shadow-sm">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Completed</p>
              <p className="text-3xl font-bold text-foreground">
                {completedSessions.length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sessions */}
        <Card className="rounded-3xl border-border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold text-foreground">
              Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending">
              <TabsList
                className="bg-secondary rounded-full mb-6"
                data-ocid="senior.sessions.tab"
              >
                <TabsTrigger value="pending" className="rounded-full text-sm">
                  Pending ({pendingSessions.length})
                </TabsTrigger>
                <TabsTrigger value="confirmed" className="rounded-full text-sm">
                  Confirmed ({confirmedSessions.length})
                </TabsTrigger>
                <TabsTrigger value="completed" className="rounded-full text-sm">
                  Completed ({completedSessions.length})
                </TabsTrigger>
              </TabsList>

              {["pending", "confirmed", "completed"].map((tab) => {
                const list =
                  tab === "pending"
                    ? pendingSessions
                    : tab === "confirmed"
                      ? confirmedSessions
                      : completedSessions;
                return (
                  <TabsContent key={tab} value={tab}>
                    {sessionsLoading ? (
                      <div
                        className="space-y-3"
                        data-ocid="senior.sessions.loading_state"
                      >
                        {[1, 2, 3].map((i) => (
                          <Skeleton key={i} className="h-16 rounded-2xl" />
                        ))}
                      </div>
                    ) : list.length === 0 ? (
                      <div
                        className="text-center py-16 text-muted-foreground"
                        data-ocid="senior.sessions.empty_state"
                      >
                        <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
                        <p className="text-sm">No {tab} sessions yet.</p>
                        {tab === "pending" && (
                          <p className="text-xs mt-1">
                            Turn on availability to start receiving bookings.
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {list.map((s, i) => (
                          <div
                            key={`${s.subjectCode}-${String(s.dateTime)}-${i}`}
                            className="flex items-center justify-between p-4 bg-background rounded-2xl border border-border"
                            data-ocid={`senior.sessions.item.${i + 1}`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
                                <BookOpen className="w-4 h-4 text-primary" />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-foreground">
                                  {s.subjectCode}
                                </p>
                                <div className="flex items-center gap-1 mt-0.5">
                                  <Clock className="w-3 h-3 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(
                                      Number(s.dateTime) / 1_000_000,
                                    ).toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-foreground">
                                ₹{Number(s.price)}
                              </span>
                              <Badge
                                variant={
                                  tab === "confirmed" ? "default" : "secondary"
                                }
                                className="rounded-full text-xs"
                              >
                                {tab === "completed" && (
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                )}
                                {tab}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                );
              })}
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Subjects Modal */}
      <Dialog open={subjectsModal} onOpenChange={setSubjectsModal}>
        <DialogContent
          className="rounded-3xl max-w-md"
          data-ocid="senior.subjects.dialog"
        >
          <DialogHeader>
            <DialogTitle>Update Subjects</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Label className="text-sm font-medium text-foreground">
              Subjects I can teach (comma-separated)
            </Label>
            <input
              value={subjectsInput}
              onChange={(e) => setSubjectsInput(e.target.value)}
              placeholder="EST102 C Programming, MAT101 Calculus"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              data-ocid="senior.subjects.input"
            />
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setSubjectsModal(false)}
              className="rounded-full"
              data-ocid="senior.subjects.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateSubjects}
              disabled={subjectsPending}
              className="bg-primary text-white hover:bg-primary/90 rounded-full"
              data-ocid="senior.subjects.save_button"
            >
              {subjectsPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
