import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookOpen, GraduationCap, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { UserRole } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useRegisterProfile } from "../hooks/useQueries";

export default function RegistrationPage() {
  const { clear } = useInternetIdentity();
  const { mutateAsync: registerProfile, isPending } = useRegisterProfile();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"junior" | "senior">("junior");
  const [university, setUniversity] = useState("");
  const [semester, setSemester] = useState("");
  const [branch, setBranch] = useState("");
  const [subjects, setSubjects] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !university || !semester || !branch) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      const subjectList =
        role === "senior" && subjects.trim()
          ? subjects
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : undefined;
      await registerProfile({
        profile: {
          name,
          email,
          role: role === "junior" ? UserRole.junior : UserRole.senior,
          university,
          semester: BigInt(semester),
          branch,
        },
        subjects: subjectList,
      });
      toast.success("Profile created! Welcome to NodeTutor.");
    } catch (_e) {
      toast.error("Failed to create profile. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold">N</span>
          </div>
          <span className="font-bold text-2xl text-foreground">NodeTutor</span>
        </div>

        <Card className="shadow-card border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Complete Your Profile</CardTitle>
            <CardDescription>
              Set up your account to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label>I am a...</Label>
                <RadioGroup
                  value={role}
                  onValueChange={(v) => setRole(v as "junior" | "senior")}
                  className="grid grid-cols-2 gap-3"
                  data-ocid="register.role.radio"
                >
                  <Label
                    htmlFor="junior"
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                      role === "junior"
                        ? "border-primary bg-accent"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <RadioGroupItem
                      value="junior"
                      id="junior"
                      className="sr-only"
                    />
                    <BookOpen className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-semibold text-sm text-foreground">
                        Junior Student
                      </div>
                      <div className="text-xs text-muted-foreground">
                        I need help
                      </div>
                    </div>
                  </Label>
                  <Label
                    htmlFor="senior"
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                      role === "senior"
                        ? "border-primary bg-accent"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <RadioGroupItem
                      value="senior"
                      id="senior"
                      className="sr-only"
                    />
                    <GraduationCap className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-semibold text-sm text-foreground">
                        Senior Tutor
                      </div>
                      <div className="text-xs text-muted-foreground">
                        I can teach
                      </div>
                    </div>
                  </Label>
                </RadioGroup>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Kumar"
                    required
                    data-ocid="register.name.input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@college.edu"
                    required
                    data-ocid="register.email.input"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="university">University / College *</Label>
                <Input
                  id="university"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  placeholder="APJ Abdul Kalam Technological University"
                  required
                  data-ocid="register.university.input"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Semester *</Label>
                  <Select value={semester} onValueChange={setSemester}>
                    <SelectTrigger data-ocid="register.semester.select">
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                        <SelectItem key={s} value={String(s)}>
                          Semester {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="branch">Branch *</Label>
                  <Input
                    id="branch"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    placeholder="Computer Science"
                    required
                    data-ocid="register.branch.input"
                  />
                </div>
              </div>

              {role === "senior" && (
                <div className="space-y-1.5">
                  <Label htmlFor="subjects">
                    Mastered Subjects (comma-separated)
                  </Label>
                  <Input
                    id="subjects"
                    value={subjects}
                    onChange={(e) => setSubjects(e.target.value)}
                    placeholder="EST100, MAT101, PHY201"
                    data-ocid="register.subjects.input"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter subject codes you can teach, e.g. EST100, MAT101
                  </p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                disabled={isPending}
                data-ocid="register.submit.button"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Creating
                    Profile...
                  </>
                ) : (
                  "Create Profile & Continue"
                )}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full text-muted-foreground"
                onClick={clear}
                data-ocid="register.cancel.button"
              >
                Cancel & Log Out
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
