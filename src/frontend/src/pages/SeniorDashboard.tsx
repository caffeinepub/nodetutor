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
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useCallerSessions,
  useTutorProfile,
  useUpdateAvailability,
  useUpdateSubjects,
} from "../hooks/useQueries";

export default function SeniorDashboard() {
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal();

  const { data: sessions = [], isLoading: sessionsLoading } =
    useCallerSessions();
  const { data: tutorProfile } = useTutorProfile(principal);
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
          ? "You are now unavailable for new sessions"
          : "You are now available for new sessions!",
      );
    } catch {
      toast.error("Failed to update availability");
    }
  };

  const handleUpdateSubjects = async () => {
    const subjects = subjectsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    try {
      await updateSubjects(subjects);
      toast.success("Subjects updated successfully!");
      setSubjectsModal(false);
    } catch {
      toast.error("Failed to update subjects");
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Senior Dashboard
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your tutoring sessions and availability
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSubjectsInput(
                  tutorProfile?.masteredSubjects.join(", ") ?? "",
                );
                setSubjectsModal(true);
              }}
              data-ocid="senior.update_subjects.button"
            >
              <Settings className="w-4 h-4 mr-2" />
              Update Subjects
            </Button>
            <div className="flex items-center gap-2">
              <Label
                htmlFor="availability-toggle"
                className="text-sm text-muted-foreground"
              >
                {tutorProfile?.isAvailable ? "Available" : "Unavailable"}
              </Label>
              <Switch
                id="availability-toggle"
                checked={tutorProfile?.isAvailable ?? false}
                onCheckedChange={handleToggleAvailability}
                disabled={availPending}
                data-ocid="senior.availability.switch"
              />
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            {
              label: "Total Sessions",
              value: sessions.length,
              icon: <Calendar className="w-4 h-4 text-primary" />,
            },
            {
              label: "Pending",
              value: pendingSessions.length,
              icon: <Clock className="w-4 h-4 text-yellow-500" />,
            },
            {
              label: "Confirmed",
              value: confirmedSessions.length,
              icon: <CheckCircle2 className="w-4 h-4 text-primary" />,
            },
            {
              label: "Completed",
              value: completedSessions.length,
              icon: <BookOpen className="w-4 h-4 text-green-500" />,
            },
          ].map((stat) => (
            <Card key={stat.label} className="shadow-card border-border">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-2 mb-1">
                  {stat.icon}
                  <span className="text-xs text-muted-foreground">
                    {stat.label}
                  </span>
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mastered Subjects */}
        {tutorProfile && (
          <Card className="shadow-card border-border mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Mastered Subjects</CardTitle>
            </CardHeader>
            <CardContent>
              {tutorProfile.masteredSubjects.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No subjects added yet. Click "Update Subjects" to add.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {tutorProfile.masteredSubjects.map((subject) => (
                    <Badge
                      key={subject}
                      className="bg-accent text-accent-foreground"
                    >
                      {subject}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Sessions tabs */}
        <Card className="shadow-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">My Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending">
              <TabsList className="mb-4">
                <TabsTrigger value="pending" data-ocid="senior.pending.tab">
                  Pending{" "}
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {pendingSessions.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="confirmed" data-ocid="senior.confirmed.tab">
                  Confirmed{" "}
                  <Badge className="ml-2 text-xs bg-primary text-primary-foreground">
                    {confirmedSessions.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="completed" data-ocid="senior.completed.tab">
                  Completed
                </TabsTrigger>
              </TabsList>

              {(["pending", "confirmed", "completed"] as const).map((tab) => (
                <TabsContent key={tab} value={tab}>
                  {sessionsLoading ? (
                    <div
                      className="space-y-3"
                      data-ocid={`senior.${tab}.loading_state`}
                    >
                      <Skeleton className="h-16 w-full rounded-lg" />
                      <Skeleton className="h-16 w-full rounded-lg" />
                    </div>
                  ) : (
                    (() => {
                      const list = {
                        pending: pendingSessions,
                        confirmed: confirmedSessions,
                        completed: completedSessions,
                      }[tab];
                      return list.length === 0 ? (
                        <div
                          className="text-center py-10"
                          data-ocid={`senior.${tab}.empty_state`}
                        >
                          <Calendar className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">
                            No {tab} sessions
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {list.map((session, i) => (
                            <div
                              key={String(session.id)}
                              className="flex items-center justify-between p-4 bg-secondary rounded-xl"
                              data-ocid={`senior.sessions.item.${i + 1}`}
                            >
                              <div className="space-y-1">
                                <div className="font-medium text-sm text-foreground">
                                  {session.subjectCode}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {new Date(
                                    Number(session.dateTime) / 1_000_000,
                                  ).toLocaleString()}
                                </div>
                                <div className="text-xs font-medium">
                                  ₹{String(session.price)}
                                </div>
                              </div>
                              <Badge
                                variant={
                                  tab === "confirmed"
                                    ? "default"
                                    : tab === "completed"
                                      ? "secondary"
                                      : "outline"
                                }
                                className={
                                  tab === "confirmed"
                                    ? "bg-primary text-primary-foreground"
                                    : ""
                                }
                              >
                                {session.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      );
                    })()
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Update Subjects Modal */}
      <Dialog open={subjectsModal} onOpenChange={setSubjectsModal}>
        <DialogContent data-ocid="subjects.dialog">
          <DialogHeader>
            <DialogTitle>Update Mastered Subjects</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <p className="text-sm text-muted-foreground">
              Enter subject codes you can teach, separated by commas.
            </p>
            <Input
              value={subjectsInput}
              onChange={(e) => setSubjectsInput(e.target.value)}
              placeholder="EST100, MAT101, PHY201"
              data-ocid="subjects.input"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSubjectsModal(false)}
              data-ocid="subjects.cancel.button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateSubjects}
              disabled={subjectsPending}
              className="bg-primary text-primary-foreground"
              data-ocid="subjects.save.button"
            >
              {subjectsPending ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Saving...
                </>
              ) : (
                "Save Subjects"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
