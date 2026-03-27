import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
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
      <div
        className="w-7 h-7 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0"
        aria-hidden="true"
      >
        <FileText className="w-3.5 h-3.5 text-red-400" />
      </div>
    );
  }
  if (type === "link") {
    return (
      <div
        className="w-7 h-7 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0"
        aria-hidden="true"
      >
        <Link2 className="w-3.5 h-3.5 text-blue-400" />
      </div>
    );
  }
  return (
    <div
      className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0"
      aria-hidden="true"
    >
      <BookOpen className="w-3.5 h-3.5 text-amber-400" />
    </div>
  );
}

function DarkSubjectCard({
  card,
  index,
}: { card: SubjectCard; index: number }) {
  return (
    <article
      className="bg-[#1C1C1E] rounded-2xl p-5 text-white"
      data-ocid={`resources.item.${index}`}
      aria-label={card.title}
    >
      <h3 className="font-bold text-white mb-3 text-sm tracking-wide">
        {card.title}
      </h3>
      <ul className="space-y-0" aria-label={`Materials for ${card.title}`}>
        {card.materials.map((mat, i) => (
          <li
            key={mat.name}
            className={`flex items-center gap-3 py-2.5 ${
              i < card.materials.length - 1 ? "border-b border-white/10" : ""
            }`}
          >
            <MaterialIcon type={mat.type} />
            <span className="flex-1 text-gray-300 text-sm">{mat.name}</span>
            <button
              type="button"
              className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center hover:bg-green-500/40 transition-colors flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-green-400"
              data-ocid={`resources.download.button.${index}`}
              onClick={() => toast.success(`Downloading ${mat.name}...`)}
              aria-label={`Download ${mat.name} for ${card.title}`}
            >
              <Download className="w-4 h-4 text-green-400" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
    </article>
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
    <div className="flex items-center gap-2.5">
      <Checkbox
        id={id}
        className="border-gray-500 data-[state=checked]:bg-[#0071E3] data-[state=checked]:border-[#0071E3]"
        data-ocid="resources.checkbox"
      />
      <Label htmlFor={id} className="text-gray-300 text-sm cursor-pointer">
        {label}
      </Label>
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
    <main id="main-content" className="min-h-screen bg-[#F5F5F7]">
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Page Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-[#1D1D1F] tracking-tight mb-1">
            KTU Resources Hub
          </h1>
          <p className="text-[#6e6e73] text-base">
            Downloadable study materials for KTU engineering students
          </p>
        </header>

        {/* 3-Column Layout */}
        <div className="flex gap-6 items-start">
          {/* Left Sidebar — Filters */}
          <aside
            className="w-[20%] flex-shrink-0"
            aria-label="Filter resources"
          >
            <div className="bg-[#1D1D1F] rounded-2xl p-5 text-white">
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-7 h-7 rounded-full bg-[#0071E3]/20 flex items-center justify-center"
                  aria-hidden="true"
                >
                  <Search className="w-3.5 h-3.5 text-[#0071E3]" />
                </div>
                <span
                  className="font-semibold text-sm text-white"
                  id="filters-heading"
                >
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
                    <fieldset>
                      <legend className="sr-only">Browse by Semester</legend>
                      <div className="space-y-2.5 pb-2">
                        {FILTER_SEMESTERS.map((s) => (
                          <FilterCheckbox key={s} label={s} id={`sem-${s}`} />
                        ))}
                      </div>
                    </fieldset>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="branch" className="border-white/10">
                  <AccordionTrigger className="text-white text-sm font-semibold py-3 hover:no-underline hover:text-gray-300">
                    Browse by Branch
                  </AccordionTrigger>
                  <AccordionContent>
                    <fieldset>
                      <legend className="sr-only">Browse by Branch</legend>
                      <div className="space-y-2.5 pb-2">
                        {FILTER_BRANCHES.map((b) => (
                          <FilterCheckbox
                            key={b}
                            label={b}
                            id={`branch-${b}`}
                          />
                        ))}
                      </div>
                    </fieldset>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="type" className="border-b-0">
                  <AccordionTrigger className="text-white text-sm font-semibold py-3 hover:no-underline hover:text-gray-300">
                    Resource Types
                  </AccordionTrigger>
                  <AccordionContent>
                    <fieldset>
                      <legend className="sr-only">Resource Types</legend>
                      <div className="space-y-2.5 pb-2">
                        {FILTER_TYPES.map((t) => (
                          <FilterCheckbox
                            key={t}
                            label={t}
                            id={`type-${t.replace(/\s+/g, "-").toLowerCase()}`}
                          />
                        ))}
                      </div>
                    </fieldset>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </aside>

          {/* Center — Search + Cards Grid */}
          <section
            className="w-[55%] flex-shrink-0"
            aria-labelledby="resources-section-heading"
          >
            <h2 id="resources-section-heading" className="sr-only">
              Study Materials
            </h2>

            {/* Search Bar */}
            <div className="relative mb-6">
              <label htmlFor="resources-search" className="sr-only">
                Search KTU resources by subject
              </label>
              <Search
                className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#86868B]"
                aria-hidden="true"
              />
              <input
                id="resources-search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search specifically in KTU Resources..."
                className="w-full rounded-full bg-white border border-gray-200 shadow-sm px-6 py-4 pl-14 text-base text-[#1D1D1F] placeholder:text-[#6e6e73] focus:outline-none focus:ring-2 focus:ring-[#0071E3] focus:border-transparent transition-all"
                data-ocid="resources.search_input"
                aria-label="Search KTU resources"
                aria-controls="resources-grid"
              />
            </div>

            {/* Subject Cards Grid */}
            {filtered.length === 0 ? (
              <output
                className="bg-white rounded-2xl p-12 text-center shadow-sm block"
                data-ocid="resources.empty_state"
              >
                <BookOpen
                  className="w-12 h-12 text-[#86868B] mx-auto mb-3"
                  aria-hidden="true"
                />
                <p className="text-[#1D1D1F] font-semibold">
                  No resources found
                </p>
                <p className="text-[#6e6e73] text-sm mt-1">
                  Try a different search term
                </p>
              </output>
            ) : (
              <div
                id="resources-grid"
                className="grid grid-cols-2 gap-4"
                aria-live="polite"
                aria-label={`${filtered.length} subject resource${filtered.length !== 1 ? "s" : ""} found`}
              >
                {filtered.map((card, i) => (
                  <DarkSubjectCard key={card.title} card={card} index={i + 1} />
                ))}
              </div>
            )}
          </section>

          {/* Right Sidebar — Widgets */}
          <aside
            className="flex-1"
            aria-label="Exam alerts and resource requests"
          >
            {/* KTU Exam Alerts */}
            <section
              aria-labelledby="exam-alerts-heading"
              className="bg-white rounded-2xl p-5 shadow-sm"
              data-ocid="resources.panel"
            >
              <div className="flex items-center gap-2 mb-4">
                <Bell className="w-4 h-4 text-[#1D1D1F]" aria-hidden="true" />
                <h3
                  id="exam-alerts-heading"
                  className="font-bold text-[#1D1D1F] text-sm"
                >
                  KTU Exam Alerts
                </h3>
              </div>
              <ul className="space-y-3" aria-label="Upcoming exam countdowns">
                <li className="flex flex-col gap-1.5 p-3 bg-red-50 rounded-xl">
                  <p className="font-medium text-[#1D1D1F] text-sm">
                    EST100 - Engineering Mechanics
                  </p>
                  <span className="inline-flex items-center self-start px-2.5 py-1 rounded-full bg-red-100 text-red-600 text-xs font-semibold">
                    <span className="sr-only">Exam in: </span>48 hrs : 12 mins
                  </span>
                </li>
                <li className="flex flex-col gap-1.5 p-3 bg-orange-50 rounded-xl">
                  <p className="font-medium text-[#1D1D1F] text-sm">
                    MAT101 - Calculus
                  </p>
                  <span className="inline-flex items-center self-start px-2.5 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-semibold">
                    <span className="sr-only">Exam in: </span>3 Days : 05 hrs
                  </span>
                </li>
              </ul>
            </section>

            {/* Resource Request Form */}
            <section
              aria-labelledby="request-form-heading"
              className="bg-white rounded-2xl p-5 shadow-sm mt-4"
              data-ocid="resources.card"
            >
              <h3
                id="request-form-heading"
                className="font-bold text-[#1D1D1F] text-sm mb-4"
              >
                Request a Resource
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmitRequest();
                }}
                className="space-y-3"
                aria-label="Resource request form"
              >
                <div className="space-y-1">
                  <Label
                    htmlFor="request-name"
                    className="text-xs font-medium text-[#1D1D1F]"
                  >
                    Your Name
                  </Label>
                  <input
                    id="request-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 w-full text-sm text-[#1D1D1F] placeholder:text-[#6e6e73] focus:ring-2 focus:ring-[#0071E3] focus:outline-none focus:border-transparent transition-all"
                    data-ocid="resources.input"
                    required
                    aria-required="true"
                  />
                </div>
                <div className="space-y-1">
                  <Label
                    htmlFor="request-comment"
                    className="text-xs font-medium text-[#1D1D1F]"
                  >
                    What resource do you need?
                  </Label>
                  <Textarea
                    id="request-comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Describe the resource you need..."
                    rows={3}
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 w-full text-sm text-[#1D1D1F] placeholder:text-[#6e6e73] focus:ring-2 focus:ring-[#0071E3] focus:outline-none focus:border-transparent transition-all resize-none"
                    data-ocid="resources.textarea"
                    required
                    aria-required="true"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-full bg-[#0071E3] text-white py-2.5 text-sm font-medium hover:bg-[#0071E3]/90 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0071E3] focus:ring-offset-2"
                  data-ocid="resources.submit_button"
                >
                  Submit Request
                </button>
              </form>
            </section>
          </aside>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 mt-12">
        <div className="max-w-[1400px] mx-auto px-6">
          <p className="text-sm text-[#6e6e73] text-center">
            &copy; {new Date().getFullYear()}. Built with{" "}
            <span aria-hidden="true">❤️</span>
            <span className="sr-only">love</span> using{" "}
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
