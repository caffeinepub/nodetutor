import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Star,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

const features = [
  {
    icon: <Zap className="w-6 h-6 text-primary" aria-hidden="true" />,
    title: "Micro-Tutoring",
    desc: "30-60 min 1-on-1 concept clearing.",
  },
  {
    icon: <Users className="w-6 h-6 text-primary" aria-hidden="true" />,
    title: "Doubt Crunching",
    desc: "Pay-per-doubt live walkthroughs.",
  },
  {
    icon: <Clock className="w-6 h-6 text-primary" aria-hidden="true" />,
    title: "Series Exam Crash Packs",
    desc: "Small group cohorts before exams.",
  },
];

const sampleTutors = [
  {
    name: "Arjun M.",
    initials: "AM",
    branch: "S7, CSE",
    rating: 4.9,
    subjects: ["EST100 Mechanics", "MAT101 Calculus"],
    color: "#34C759",
  },
  {
    name: "Lakshmi S.",
    initials: "LS",
    branch: "S5, ECE",
    rating: 4.8,
    subjects: ["EST102 C Programming", "Python"],
    color: "#007AFF",
  },
  {
    name: "Rahul Krishnan",
    initials: "RK",
    branch: "S7, ME",
    rating: 5.0,
    subjects: ["BE110 Engineering Graphics"],
    color: "#FF9500",
  },
  {
    name: "Siddharth V.",
    initials: "SV",
    branch: "S6, CSE",
    rating: 4.7,
    subjects: ["CS301 Algorithms", "Python"],
    color: "#AF52DE",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const goToRegister = () => navigate({ to: "/register" });

  return (
    <div className="min-h-screen bg-background">
      {/* Skip to main content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-full focus:font-semibold focus:shadow-lg"
      >
        Skip to main content
      </a>

      {/* Navbar */}
      <nav
        aria-label="Main navigation"
        className="bg-white/80 backdrop-blur-md border-b border-border sticky top-0 z-50"
      >
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <div
            className="flex items-center gap-2.5"
            aria-label="NodeTutor home"
          >
            <div
              className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center"
              aria-hidden="true"
            >
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="font-bold text-lg text-foreground tracking-tight">
              NodeTutor
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={goToRegister}
              variant="ghost"
              size="sm"
              className="text-foreground font-medium"
              data-ocid="landing.login.button"
            >
              Log In
            </Button>
            <Button
              onClick={goToRegister}
              size="sm"
              className="bg-primary text-white hover:bg-primary/90 rounded-full font-semibold px-5"
              data-ocid="landing.signup.button"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main id="main-content">
        <section
          aria-labelledby="hero-heading"
          className="max-w-[1200px] mx-auto px-6 py-24 md:py-32"
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-blue-50 text-primary text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
              <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
              KTU Verified Peer Tutors
            </div>
            <h1
              id="hero-heading"
              className="text-5xl md:text-6xl font-bold text-foreground tracking-tight leading-[1.1] mb-6"
            >
              Learn from your
              <span className="text-primary"> seniors.</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-10 max-w-xl mx-auto">
              NodeTutor connects KTU engineering students with verified senior
              peers for micro-tutoring, doubt clearing, and exam prep.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Button
                onClick={goToRegister}
                size="lg"
                className="bg-primary text-white hover:bg-primary/90 rounded-full font-semibold px-8 h-12"
                data-ocid="landing.cta.primary_button"
              >
                Sign Up as a Junior{" "}
                <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
              </Button>
              <Button
                onClick={goToRegister}
                variant="outline"
                size="lg"
                className="rounded-full font-semibold px-8 h-12 border-border"
                data-ocid="landing.senior.secondary_button"
              >
                Become a Senior Tutor
              </Button>
            </div>
          </motion.div>
        </section>

        {/* Features */}
        <section
          aria-labelledby="features-heading"
          className="max-w-[1200px] mx-auto px-6 pb-20"
        >
          <h2 id="features-heading" className="sr-only">
            Our Services
          </h2>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid md:grid-cols-3 gap-5"
          >
            {features.map((f) => (
              <article
                key={f.title}
                className="bg-white rounded-3xl p-8 shadow-sm border border-border"
              >
                <div
                  className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4"
                  aria-hidden="true"
                >
                  {f.icon}
                </div>
                <h3 className="font-bold text-foreground mb-1.5">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </article>
            ))}
          </motion.div>
        </section>

        {/* Tutors */}
        <section
          aria-labelledby="tutors-heading"
          className="bg-white border-t border-border"
        >
          <div className="max-w-[1200px] mx-auto px-6 py-20">
            <div className="text-center mb-12">
              <h2
                id="tutors-heading"
                className="text-3xl font-bold text-foreground tracking-tight mb-3"
              >
                Top Verified Tutors
              </h2>
              <p className="text-muted-foreground">
                Grade-card verified seniors ready to help
              </p>
            </div>
            <ul
              className="grid md:grid-cols-4 gap-5"
              aria-label="Featured tutors"
            >
              {sampleTutors.map((t) => (
                <li
                  key={t.name}
                  className="bg-background rounded-3xl p-6 border border-border list-none"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-sm"
                      style={{ backgroundColor: t.color }}
                      aria-hidden="true"
                    >
                      {t.initials}
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-foreground">
                        {t.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {t.branch}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mb-3">
                    <Star
                      className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400"
                      aria-hidden="true"
                    />
                    <span className="text-xs font-semibold text-foreground">
                      <span className="sr-only">Rating: </span>
                      {t.rating}
                    </span>
                    <span className="inline-flex items-center ml-2 bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                      ✓ Verified
                    </span>
                  </div>
                  <ul
                    className="flex flex-wrap gap-1 mb-4"
                    aria-label={`${t.name}'s subjects`}
                  >
                    {t.subjects.map((s) => (
                      <li
                        key={s}
                        className="text-xs bg-blue-50 text-primary px-2 py-0.5 rounded-full"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={goToRegister}
                    size="sm"
                    className="w-full bg-primary text-white hover:bg-primary/90 rounded-full text-xs font-semibold"
                    data-ocid="landing.book.primary_button"
                    aria-label={`Book a session with ${t.name}`}
                  >
                    Book a Micro-Session
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background">
        <div className="max-w-[1200px] mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center"
              aria-hidden="true"
            >
              <span className="text-white font-bold text-xs">N</span>
            </div>
            <span className="font-semibold text-sm text-foreground">
              NodeTutor
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()}. Built with{" "}
            <span aria-hidden="true">❤️</span>
            <span className="sr-only">love</span> using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
