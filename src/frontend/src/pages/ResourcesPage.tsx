import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Download, FileText, Filter, Link2 } from "lucide-react";
import { useState } from "react";
import { FileType } from "../backend.d";
import type { Resource } from "../backend.d";
import { useFilteredResources } from "../hooks/useQueries";

const SAMPLE_RESOURCES: Resource[] = [
  {
    id: BigInt(1),
    title: "Engineering Mathematics - Calculus Notes",
    subjectCode: "MAT101",
    semester: BigInt(2),
    fileType: FileType.pdf,
    url: "#",
    uploader: "sample" as any,
  },
  {
    id: BigInt(2),
    title: "Engineering Physics Module 3",
    subjectCode: "PHY201",
    semester: BigInt(2),
    fileType: FileType.pdf,
    url: "#",
    uploader: "sample" as any,
  },
  {
    id: BigInt(3),
    title: "Programming in C - KTU Syllabus",
    subjectCode: "EST102",
    semester: BigInt(1),
    fileType: FileType.link,
    url: "#",
    uploader: "sample" as any,
  },
  {
    id: BigInt(4),
    title: "Digital Electronics - Full Notes",
    subjectCode: "ECE201",
    semester: BigInt(3),
    fileType: FileType.pdf,
    url: "#",
    uploader: "sample" as any,
  },
  {
    id: BigInt(5),
    title: "Thermodynamics and Heat Transfer",
    subjectCode: "ME301",
    semester: BigInt(4),
    fileType: FileType.pdf,
    url: "#",
    uploader: "sample" as any,
  },
  {
    id: BigInt(6),
    title: "Data Structures - Video Lecture Series",
    subjectCode: "CS201",
    semester: BigInt(3),
    fileType: FileType.link,
    url: "#",
    uploader: "sample" as any,
  },
];

function ResourceCard({
  resource,
  index,
}: { resource: Resource; index: number }) {
  const isPdf = resource.fileType === FileType.pdf;
  return (
    <div
      className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4"
      data-ocid={`resources.item.${index}`}
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
          isPdf ? "bg-red-50" : "bg-blue-50"
        }`}
      >
        {isPdf ? (
          <FileText className="w-5 h-5 text-red-500" />
        ) : (
          <Link2 className="w-5 h-5 text-blue-500" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm text-foreground leading-tight mb-2">
          {resource.title}
        </div>
        <div className="flex items-center flex-wrap gap-2">
          <Badge variant="secondary" className="text-xs rounded-full">
            {resource.subjectCode}
          </Badge>
          <Badge variant="outline" className="text-xs rounded-full">
            Sem {String(resource.semester)}
          </Badge>
          <Badge
            className={`text-xs rounded-full ${
              isPdf
                ? "bg-red-50 text-red-600 border-red-100"
                : "bg-blue-50 text-blue-600 border-blue-100"
            }`}
            variant="outline"
          >
            {isPdf ? "PDF" : "Link"}
          </Badge>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="flex-shrink-0 rounded-xl hover:bg-background"
        asChild
        data-ocid={`resources.download.button.${index}`}
      >
        <a href={resource.url} target="_blank" rel="noopener noreferrer">
          {isPdf ? (
            <Download className="w-4 h-4" />
          ) : (
            <Link2 className="w-4 h-4" />
          )}
        </a>
      </Button>
    </div>
  );
}

export default function ResourcesPage() {
  const [semester, setSemester] = useState<string>("");
  const [subjectCode, setSubjectCode] = useState("");
  const [appliedSemester, setAppliedSemester] = useState<bigint | null>(null);
  const [appliedSubject, setAppliedSubject] = useState("");

  const { data: backendResources = [], isLoading } = useFilteredResources(
    appliedSemester,
    appliedSubject,
  );

  const filteredSamples = SAMPLE_RESOURCES.filter((r) => {
    if (appliedSemester && r.semester !== appliedSemester) return false;
    if (
      appliedSubject &&
      !r.subjectCode.toLowerCase().includes(appliedSubject.toLowerCase())
    )
      return false;
    return true;
  });

  const allResources = [...filteredSamples, ...backendResources];

  const handleFilter = () => {
    setAppliedSemester(semester ? BigInt(semester) : null);
    setAppliedSubject(subjectCode);
  };

  const handleReset = () => {
    setSemester("");
    setSubjectCode("");
    setAppliedSemester(null);
    setAppliedSubject("");
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-[1200px] mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              KTU Resources Hub
            </h1>
          </div>
          <p className="text-muted-foreground">
            Downloadable study materials, notes, and video lectures for KTU
            engineering students
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex items-center gap-2 text-sm text-muted-foreground flex-shrink-0">
              <Filter className="w-4 h-4" />
              <span>Filter:</span>
            </div>
            <div className="flex-1">
              <Select value={semester} onValueChange={setSemester}>
                <SelectTrigger
                  className="bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary"
                  data-ocid="resources.semester.select"
                >
                  <SelectValue placeholder="All Semesters" />
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
            <div className="flex-1">
              <input
                value={subjectCode}
                onChange={(e) => setSubjectCode(e.target.value)}
                placeholder="Subject code (e.g. MAT101)"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                data-ocid="resources.subject.input"
              />
            </div>
            <Button
              onClick={handleFilter}
              className="bg-primary text-white hover:bg-primary/90 rounded-full px-6"
              data-ocid="resources.filter.button"
            >
              Apply
            </Button>
            {(appliedSemester || appliedSubject) && (
              <Button
                variant="outline"
                onClick={handleReset}
                className="rounded-full"
                data-ocid="resources.reset.button"
              >
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Resources grid */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-foreground text-lg tracking-tight">
            {allResources.length} Resource{allResources.length !== 1 ? "s" : ""}{" "}
            Found
          </h2>
        </div>

        {isLoading ? (
          <div
            className="grid sm:grid-cols-2 gap-4"
            data-ocid="resources.loading_state"
          >
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20 rounded-2xl" />
            ))}
          </div>
        ) : allResources.length === 0 ? (
          <div
            className="bg-white rounded-2xl p-12 text-center shadow-sm"
            data-ocid="resources.empty_state"
          >
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-foreground font-semibold">No resources found</p>
            <p className="text-muted-foreground text-sm mt-1">
              Try changing the filters
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {allResources.map((r, i) => (
              <ResourceCard key={String(r.id)} resource={r} index={i + 1} />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-8">
        <div className="max-w-[1200px] mx-auto px-6">
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}
