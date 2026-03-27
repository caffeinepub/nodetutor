import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Bell,
  BookOpen,
  Download,
  FileText,
  Link2,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type MaterialType = "pdf" | "link" | "notes";

interface Material {
  name: string;
  type: MaterialType;
}

interface SubjectCard {
  title: string;
  materials: Material[];
}

const SUBJECT_CARDS: SubjectCard[] = [
  {
    title: "MAT101 - Calculus",
    materials: [
      { name: "Syllabus PDF", type: "pdf" },
      { name: "Stewart's Calculus", type: "pdf" },
      { name: "PYQs 2024", type: "pdf" },
      { name: "PYQs 2025", type: "pdf" },
    ],
  },
  {
    title: "EST102 - C Programming",
    materials: [
      { name: "Syllabus PDF", type: "pdf" },
      { name: "Lab Records & Manuals", type: "pdf" },
      { name: "Tutor-curated Notes", type: "notes" },
    ],
  },
  {
    title: "BE110 - Engineering Graphics",
    materials: [
      { name: "Syllabus PDF", type: "pdf" },
      { name: "Graphics Workbook PDF", type: "pdf" },
      { name: "Recommended Video Lecture Links", type: "link" },
    ],
  },
  {
    title: "Chemistry & Fuel Cells",
    materials: [
      { name: "Syllabus PDF", type: "pdf" },
      { name: "Li-ion & Electrochemical Series Notes", type: "notes" },
      { name: "PYQs 2024", type: "pdf" },
    ],
  },
  {
    title: "Discrete Mathematics",
    materials: [
      { name: "Syllabus PDF", type: "pdf" },
      { name: "Logic & Proofs Notes", type: "notes" },
      { name: "Hasse Diagram Worksheets", type: "pdf" },
    ],
  },
  {
    title: "Computer Hardware",
    materials: [
      { name: "Syllabus PDF", type: "pdf" },
      { name: "Registers & Boot Process Notes", type: "notes" },
    ],
  },
];

function MaterialIcon({ type }: { type: MaterialType }) {
  if (type === "pdf") {
    return (
      <div className="w-7 h-7 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
        <FileText className="w-3.5 h-3.5 text-red-400" />
      </div>
    );
  }
  if (type === "link") {
    return (
      <div className="w-7 h-7 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
        <Link2 className="w-3.5 h-3.5 text-blue-400" />
      </div>
    );
  }
  return (
    <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
      <BookOpen className="w-3.5 h-3.5 text-amber-400" />
    </div>
  );
}

function DarkSubjectCard({
  card,
  index,
}: { card: SubjectCard; index: number }) {
  return (
    <div
      className="bg-[#1C1C1E] rounded-2xl p-5 text-white"
      data-ocid={`resources.item.${index}`}
    >
      <h3 className="font-bold text-white mb-3 text-sm tracking-wide">
        {card.title}
      </h3>
      <div className="space-y-0">
        {card.materials.map((mat, i) => (
          <div
            key={mat.name}
            className={`flex items-center gap-3 py-2.5 ${
              i < card.materials.length - 1 ? "border-b border-white/10" : ""
            }`}
          >
            <MaterialIcon type={mat.type} />
            <span className="flex-1 text-gray-300 text-sm">{mat.name}</span>
            <button
              type="button"
              className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center hover:bg-green-500/40 transition-colors flex-shrink-0"
              data-ocid={`resources.download.button.${index}`}
              onClick={() => toast.success(`Downloading ${mat.name}...`)}
            >
              <Download className="w-4 h-4 text-green-400" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const FILTER_SEMESTERS = ["S1", "S2", "S3", "S4"];
const FILTER_BRANCHES = ["CSE", "Mechanical", "Civil", "ECE", "EEE"];
const FILTER_TYPES = [
  "Syllabuses",
  "PYQs",
  "Lab Manuals",
  "Tutor-curated Notes",
];

function FilterCheckbox({ label, id }: { label: string; id: string }) {
  return (
    <div className="flex items-center gap-2.5 cursor-pointer">
      <Checkbox
        id={id}
        className="border-gray-500 data-[state=checked]:bg-[#0071E3] data-[state=checked]:border-[#0071E3]"
        data-ocid="resources.checkbox"
      />
      <label htmlFor={id} className="text-gray-300 text-sm cursor-pointer">
        {label}
      </label>
    </div>
  );
}

export default function ResourcesPage() {
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return SUBJECT_CARDS;
    return SUBJECT_CARDS.filter((c) =>
      c.title.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search]);

  const handleSubmitRequest = () => {
    if (!name.trim() || !comment.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }
    toast.success("Resource request submitted!");
    setName("");
    setComment("");
  };

  return (
    <main className="min-h-screen bg-[#F5F5F7]">
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1D1D1F] tracking-tight mb-1">
            KTU Resources Hub
          </h1>
          <p className="text-[#86868B] text-base">
            Downloadable study materials for KTU engineering students
          </p>
        </div>

        {/* 3-Column Layout */}
        <div className="flex gap-6 items-start">
          {/* Left Sidebar — Filters */}
          <aside className="w-[20%] flex-shrink-0">
            <div className="bg-[#1D1D1F] rounded-2xl p-5 text-white">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-full bg-[#0071E3]/20 flex items-center justify-center">
                  <Search className="w-3.5 h-3.5 text-[#0071E3]" />
                </div>
                <span className="font-semibold text-sm text-white">
                  Filters
                </span>
              </div>
              <Accordion
                type="multiple"
                defaultValue={["semester", "branch", "type"]}
                className="space-y-1"
              >
                <AccordionItem value="semester" className="border-white/10">
                  <AccordionTrigger className="text-white text-sm font-semibold py-3 hover:no-underline hover:text-gray-300">
                    Browse by Semester
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2.5 pb-2">
                      {FILTER_SEMESTERS.map((s) => (
                        <FilterCheckbox key={s} label={s} id={`sem-${s}`} />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="branch" className="border-white/10">
                  <AccordionTrigger className="text-white text-sm font-semibold py-3 hover:no-underline hover:text-gray-300">
                    Browse by Branch
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2.5 pb-2">
                      {FILTER_BRANCHES.map((b) => (
                        <FilterCheckbox key={b} label={b} id={`branch-${b}`} />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="type" className="border-b-0">
                  <AccordionTrigger className="text-white text-sm font-semibold py-3 hover:no-underline hover:text-gray-300">
                    Resource Types
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2.5 pb-2">
                      {FILTER_TYPES.map((t) => (
                        <FilterCheckbox
                          key={t}
                          label={t}
                          id={`type-${t.replace(/\s+/g, "-").toLowerCase()}`}
                        />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </aside>

          {/* Center — Search + Cards Grid */}
          <section className="w-[55%] flex-shrink-0">
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#86868B]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search specifically in KTU Resources..."
                className="w-full rounded-full bg-white border border-gray-200 shadow-sm px-6 py-4 pl-14 text-base text-[#1D1D1F] placeholder:text-[#86868B] focus:outline-none focus:ring-2 focus:ring-[#0071E3] focus:border-transparent transition-all"
                data-ocid="resources.search_input"
              />
            </div>

            {/* Subject Cards Grid */}
            {filtered.length === 0 ? (
              <div
                className="bg-white rounded-2xl p-12 text-center shadow-sm"
                data-ocid="resources.empty_state"
              >
                <BookOpen className="w-12 h-12 text-[#86868B] mx-auto mb-3" />
                <p className="text-[#1D1D1F] font-semibold">
                  No resources found
                </p>
                <p className="text-[#86868B] text-sm mt-1">
                  Try a different search term
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {filtered.map((card, i) => (
                  <DarkSubjectCard key={card.title} card={card} index={i + 1} />
                ))}
              </div>
            )}
          </section>

          {/* Right Sidebar — Widgets */}
          <aside className="flex-1">
            {/* KTU Exam Alerts */}
            <div
              className="bg-white rounded-2xl p-5 shadow-sm"
              data-ocid="resources.panel"
            >
              <div className="flex items-center gap-2 mb-4">
                <Bell className="w-4 h-4 text-[#1D1D1F]" />
                <h3 className="font-bold text-[#1D1D1F] text-sm">
                  KTU Exam Alerts
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex flex-col gap-1.5 p-3 bg-red-50 rounded-xl">
                  <p className="font-medium text-[#1D1D1F] text-sm">
                    EST100 - Engineering Mechanics
                  </p>
                  <span className="inline-flex items-center self-start px-2.5 py-1 rounded-full bg-red-100 text-red-600 text-xs font-semibold">
                    Exam in: 48 hrs : 12 mins
                  </span>
                </div>
                <div className="flex flex-col gap-1.5 p-3 bg-orange-50 rounded-xl">
                  <p className="font-medium text-[#1D1D1F] text-sm">
                    MAT101 - Calculus
                  </p>
                  <span className="inline-flex items-center self-start px-2.5 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-semibold">
                    Exam in: 3 Days : 05 hrs
                  </span>
                </div>
              </div>
            </div>

            {/* Resource Request Form */}
            <div
              className="bg-white rounded-2xl p-5 shadow-sm mt-4"
              data-ocid="resources.card"
            >
              <h3 className="font-bold text-[#1D1D1F] text-sm mb-4">
                Request a Resource
              </h3>
              <div className="space-y-3">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 w-full text-sm text-[#1D1D1F] placeholder:text-[#86868B] focus:ring-2 focus:ring-[#0071E3] focus:outline-none focus:border-transparent transition-all"
                  data-ocid="resources.input"
                />
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="What resource do you need?"
                  rows={3}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 w-full text-sm text-[#1D1D1F] placeholder:text-[#86868B] focus:ring-2 focus:ring-[#0071E3] focus:outline-none focus:border-transparent transition-all resize-none"
                  data-ocid="resources.textarea"
                />
                <button
                  type="button"
                  onClick={handleSubmitRequest}
                  className="w-full rounded-full bg-[#0071E3] text-white py-2.5 text-sm font-medium hover:bg-[#0071E3]/90 transition-colors"
                  data-ocid="resources.submit_button"
                >
                  Submit Request
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 mt-12">
        <div className="max-w-[1400px] mx-auto px-6">
          <p className="text-sm text-[#86868B] text-center">
            © {new Date().getFullYear()}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0071E3] hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}
