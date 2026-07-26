import { ShieldCheck, Lock, Eye, Server, Users, Mail } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | PREPT",
  description: "Learn how PREPT collects, uses, and protects your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#08080a] text-stone-300">
      <div className="max-w-4xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-medium mb-6">
            <ShieldCheck className="w-3.5 h-3.5" />
            Legal Document
          </div>
          <h1 className="font-serif text-4xl md:text-5xl text-stone-100 tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-sm text-stone-500">
            Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>

        {/* Content */}
        <div className="space-y-12 text-sm leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center">
                <Eye className="w-4 h-4 text-amber-400" />
              </div>
              <h2 className="font-serif text-xl text-stone-100">1. Information We Collect</h2>
            </div>
            <p className="text-stone-400">
              When you use PREPT, we collect information to provide and improve our services. This includes:
            </p>
            <ul className="list-none space-y-3 pl-4">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                <span><strong className="text-stone-200">Account Information:</strong> Name, email address, profile picture, and professional details provided during registration via Clerk authentication.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                <span><strong className="text-stone-200">Interview Data:</strong> Video recordings, chat transcripts, AI-generated feedback, and session metadata collected during mock interviews via Stream.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                <span><strong className="text-stone-200">Payment Information:</strong> Transaction records and payout details processed through our platform. We do not store raw credit card numbers.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                <span><strong className="text-stone-200">Usage Data:</strong> Pages visited, features used, session duration, device type, browser, and IP address.</span>
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center">
                <Server className="w-4 h-4 text-amber-400" />
              </div>
              <h2 className="font-serif text-xl text-stone-100">2. How We Use Your Information</h2>
            </div>
            <p className="text-stone-400">We use the collected information for the following purposes:</p>
            <ul className="list-none space-y-3 pl-4">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                <span>To provide, maintain, and improve the PREPT interview platform.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                <span>To match interviewees with qualified interviewers based on expertise and availability.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                <span>To generate AI-powered interview evaluations and feedback using Google Gemini.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                <span>To process interviewer payouts and manage financial transactions.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                <span>To send transactional emails (appointment confirmations, payout notifications) via Resend.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                <span>To enforce rate limiting and protect against abuse using Arcjet.</span>
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center">
                <Lock className="w-4 h-4 text-amber-400" />
              </div>
              <h2 className="font-serif text-xl text-stone-100">3. Data Security</h2>
            </div>
            <p className="text-stone-400">
              We implement industry-standard security measures to protect your data:
            </p>
            <ul className="list-none space-y-3 pl-4">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                <span>All data is encrypted in transit (TLS/SSL) and at rest via Supabase&apos;s infrastructure.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                <span>Authentication is managed by Clerk with multi-factor authentication support.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                <span>Video sessions are end-to-end secured through Stream&apos;s encrypted infrastructure.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                <span>Automated threat detection and rate limiting via Arcjet protects against malicious activity.</span>
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center">
                <Users className="w-4 h-4 text-amber-400" />
              </div>
              <h2 className="font-serif text-xl text-stone-100">4. Third-Party Services</h2>
            </div>
            <p className="text-stone-400">PREPT integrates with the following trusted third-party services:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {[
                { name: "Clerk", purpose: "Authentication & user management" },
                { name: "Supabase", purpose: "Database & file storage" },
                { name: "Stream", purpose: "Video calling & real-time chat" },
                { name: "Google Gemini", purpose: "AI interview evaluation" },
                { name: "Arcjet", purpose: "Security & rate limiting" },
                { name: "Resend", purpose: "Transactional emails" },
              ].map((service) => (
                <div key={service.name} className="rounded-lg bg-white/[0.03] border border-white/10 px-4 py-3">
                  <p className="text-stone-200 font-medium text-xs">{service.name}</p>
                  <p className="text-stone-500 text-xs mt-0.5">{service.purpose}</p>
                </div>
              ))}
            </div>
            <p className="text-stone-400 mt-4">
              Each service operates under its own privacy policy. We encourage you to review their respective policies.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center">
                <Mail className="w-4 h-4 text-amber-400" />
              </div>
              <h2 className="font-serif text-xl text-stone-100">5. Your Rights & Contact</h2>
            </div>
            <p className="text-stone-400">You have the right to:</p>
            <ul className="list-none space-y-3 pl-4">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                <span>Access, correct, or delete your personal data at any time.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                <span>Request a copy of all data we hold about you.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                <span>Opt out of non-essential data collection.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                <span>Delete your account and all associated data.</span>
              </li>
            </ul>
            <div className="mt-6 rounded-xl bg-amber-400/5 border border-amber-400/20 p-5">
              <p className="text-stone-300 text-sm">
                For privacy-related inquiries, contact us at{" "}
                <a href="mailto:dawitberiso406@gmail.com" className="text-amber-400 hover:text-amber-300 underline underline-offset-2">
                  dawitberiso406@gmail.com
                </a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
