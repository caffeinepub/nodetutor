import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, CheckCircle2, Star, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const features = [
  {
    icon: <Zap className="w-6 h-6 text-primary" />,
    title: "Micro-Tutoring",
    desc: "Short, focused sessions designed to resolve specific doubts quickly. No long commitments, just fast help when you need it.",
  },
  {
    icon: <BookOpen className="w-6 h-6 text-primary" />,
    title: "Doubt Crunching",
    desc: "Ask your exact question. Get a direct answer from someone who aced the same exam last semester.",
  },
  {
    icon: <CheckCircle2 className="w-6 h-6 text-primary" />,
    title: "Grade-Card Verified Tutors",
    desc: "Every senior tutor is verified through their academic records. Only students who truly mastered a subject can teach it.",
  },
];

const sampleTutors = [
  {
    name: "Sarah Chen",
    initials: "SC",
    rating: 4.9,
    subjects: ["Circuits", "EE101"],
    color: "#6366f1",
  },
  {
    name: "David Lee",
    initials: "DL",
    rating: 4.7,
    subjects: ["Thermodynamics", "PHY201"],
    color: "#0ea5e9",
  },
  {
    name: "Priya Nair",
    initials: "PN",
    rating: 4.8,
    subjects: ["MAT101", "Calculus"],
    color: "#ec4899",
  },
  {
    name: "Arjun Menon",
    initials: "AM",
    rating: 4.6,
    subjects: ["EST100", "Python"],
    color: "#f59e0b",
  },
];

export default function LandingPage() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-card border-b border-border sticky top-0 z-50 shadow-xs">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                N
              </span>
            </div>
            <span className="font-bold text-lg text-foreground">NodeTutor</span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={login}
              disabled={isLoggingIn}
              variant="outline"
              size="sm"
              data-ocid="landing.login.button"
            >
              Log In
            </Button>
            <Button
              onClick={login}
              disabled={isLoggingIn}
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              data-ocid="landing.signup.button"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 bg-accent px-3 py-1.5 rounded-full mb-6">
              <Star className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-semibold text-primary">
                Peer-to-Peer Academic Micro-Tutoring
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight mb-6">
              NodeTutor: Learn From
              <br />
              <span className="text-primary">Your Engineering Peers</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl">
              Connect with grade-card verified senior students who have mastered
              the subjects you need help with. Book micro-sessions for just
              ₹250.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={login}
                disabled={isLoggingIn}
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 text-base font-semibold px-8"
                data-ocid="landing.signup_junior.button"
              >
                Sign Up as a Junior <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                onClick={login}
                disabled={isLoggingIn}
                size="lg"
                variant="outline"
                className="text-base font-semibold px-8 border-border"
                data-ocid="landing.signup_senior.button"
              >
                Become a Senior Tutor
              </Button>
            </div>
            <div className="flex items-center gap-6 mt-8">
              {[
                "Grade-Card Verified",
                "₹250 per session",
                "KTU curriculum",
              ].map((item) => (
                <div key={item} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
        <div className="relative">
          <img
            src="/assets/generated/hero-nodetutor.dim_1200x500.jpg"
            alt="Engineering students collaborating"
            className="w-full object-cover max-h-72 object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Why NodeTutor?
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Built for engineering students who understand each other's
              struggles — because they've been there.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-card border border-border rounded-xl p-6 shadow-card hover:shadow-card-hover transition-shadow"
              >
                <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-foreground text-lg mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-secondary/30">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-2xl font-bold text-foreground mb-2 text-center">
            Meet Our Top Tutors
          </h2>
          <p className="text-muted-foreground text-center mb-10">
            Verified seniors ready to help you succeed
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {sampleTutors.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-card border border-border rounded-xl p-5 shadow-card text-center"
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3"
                  style={{ background: t.color }}
                >
                  {t.initials}
                </div>
                <div className="font-semibold text-foreground text-sm">
                  {t.name}
                </div>
                <div className="flex items-center justify-center gap-1 my-1">
                  <Star
                    className="w-3 h-3"
                    style={{ fill: "#F4C542", color: "#F4C542" }}
                  />
                  <span className="text-xs text-muted-foreground font-medium">
                    {t.rating}/5
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {t.subjects.join(" • ")}
                </div>
                <div className="inline-flex items-center gap-1 mt-2 bg-blue-50 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" /> Verified
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
            Ready to ace your engineering exams?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto">
            Join thousands of engineering students already learning smarter with
            NodeTutor.
          </p>
          <Button
            onClick={login}
            disabled={isLoggingIn}
            size="lg"
            className="bg-white text-primary hover:bg-white/90 font-semibold px-10"
            data-ocid="landing.cta.button"
          >
            Start Learning Today <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </section>

      <footer className="bg-card border-t border-border py-8">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">
                N
              </span>
            </div>
            <span className="font-semibold text-foreground">NodeTutor</span>
          </div>
          <p className="text-sm text-muted-foreground">
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
    </div>
  );
}
