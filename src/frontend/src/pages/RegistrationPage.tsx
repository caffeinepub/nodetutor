import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "@tanstack/react-router";
import { BookOpen, GraduationCap, Loader2, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { setDemoProfile } from "../hooks/useDemoAuth";

const inputClass =
  "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all";

export default function RegistrationPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [urn, setUrn] = useState("");
  const [role, setRole] = useState<"junior" | "senior">("junior");
  const [university, setUniversity] = useState("");
  const [semester, setSemester] = useState("");
  const [branch, setBranch] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !university || !semester || !branch || !urn) {
      toast.error("Please fill in all required fields");
      return;
    }
    setIsPending(true);
    await new Promise((r) => setTimeout(r, 100));
    setDemoProfile({ name, email, role, university, semester, branch, urn });
    toast.success("Profile created! Welcome to NodeTutor.");
    navigate({ to: role === "senior" ? "/senior" : "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
            <span className="text-white font-bold">N</span>
          </div>
          <span className="font-bold text-2xl text-foreground tracking-tight">
            NodeTutor
          </span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-md p-8">
          <h1 className="text-2xl font-bold text-foreground tracking-tight mb-1">
            Complete Your Profile
          </h1>
          <p className="text-muted-foreground text-sm mb-6">
            Set up your account to get started
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role selector */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                I am a...
              </Label>
              <RadioGroup
                value={role}
                onValueChange={(v) => setRole(v as "junior" | "senior")}
                className="grid grid-cols-2 gap-3"
                data-ocid="register.role.radio"
              >
                <Label
                  htmlFor="junior"
                  className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-colors ${
                    role === "junior"
                      ? "border-primary bg-blue-50"
                      : "border-border hover:border-primary/40"
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
                  className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-colors ${
                    role === "senior"
                      ? "border-primary bg-blue-50"
                      : "border-border hover:border-primary/40"
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

            {/* Name + Email */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-foreground"
                >
                  Full Name *
                </Label>
                <input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Kumar"
                  required
                  className={inputClass}
                  data-ocid="register.name.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-foreground"
                >
                  Email *
                </Label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@college.edu"
                  required
                  className={inputClass}
                  data-ocid="register.email.input"
                />
              </div>
            </div>

            {/* URN */}
            <div className="space-y-1.5">
              <Label
                htmlFor="urn"
                className="text-sm font-medium text-foreground"
              >
                University Registration Number (URN) *
              </Label>
              <input
                id="urn"
                value={urn}
                onChange={(e) => setUrn(e.target.value)}
                placeholder="e.g. KTU/2022/1234"
                required
                className={inputClass}
                data-ocid="register.urn.input"
              />
            </div>

            {/* University */}
            <div className="space-y-1.5">
              <Label
                htmlFor="university"
                className="text-sm font-medium text-foreground"
              >
                University / College *
              </Label>
              <input
                id="university"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                placeholder="APJ Abdul Kalam Technological University"
                required
                className={inputClass}
                data-ocid="register.university.input"
              />
            </div>

            {/* Semester + Branch */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-foreground">
                  Semester *
                </Label>
                <Select value={semester} onValueChange={setSemester}>
                  <SelectTrigger
                    className="bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary"
                    data-ocid="register.semester.select"
                  >
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <SelectItem key={s} value={String(s)}>
                        Semester {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="branch"
                  className="text-sm font-medium text-foreground"
                >
                  Branch *
                </Label>
                <input
                  id="branch"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  placeholder="Computer Science"
                  required
                  className={inputClass}
                  data-ocid="register.branch.input"
                />
              </div>
            </div>

            {/* Senior-only: KYC Upload */}
            {role === "senior" && (
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-foreground">
                  KYC Grade Card Upload
                </Label>
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                  }}
                  className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center gap-2 transition-colors cursor-pointer ${
                    dragOver
                      ? "border-primary bg-blue-50"
                      : "border-border hover:border-primary/40"
                  }`}
                  data-ocid="register.dropzone"
                >
                  <Upload className="w-6 h-6 text-muted-foreground" />
                  <p className="text-sm font-medium text-foreground">
                    Drag & drop your grade card here
                  </p>
                  <p className="text-xs text-muted-foreground text-center">
                    Official KTU Grade Card (KYC) — Required: Must score B+ or
                    above to verify proficiency.
                  </p>
                  <button
                    type="button"
                    className="text-xs text-primary font-medium mt-1 hover:underline"
                    data-ocid="register.upload_button"
                  >
                    Browse files
                  </button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-3 pt-2">
              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-primary hover:bg-primary/90 text-white rounded-full font-semibold py-2.5"
                data-ocid="register.submit_button"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Profile...
                  </>
                ) : (
                  "Create Profile & Continue"
                )}
              </Button>
              <button
                type="button"
                onClick={() => navigate({ to: "/" })}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors text-center"
                data-ocid="register.cancel_button"
              >
                ← Back to home
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
