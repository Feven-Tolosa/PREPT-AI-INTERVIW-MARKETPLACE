import { FileText, Scale, AlertTriangle, CreditCard, UserX, Gavel } from "lucide-react";

export const metadata = {
  title: "Terms of Service | PREPT",
  description: "Terms and conditions for using the PREPT AI-powered mock interview platform.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#08080a] text-stone-300">
      <div className="max-w-4xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-medium mb-6">
            <FileText className="w-3.5 h-3.5" />
            Legal Document
          </div>
          <h1 className="font-serif text-4xl md:text-5xl text-stone-100 tracking-tight mb-4">
            Terms of Service
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
                <Scale className="w-4 h-4 text-amber-400" />
              </div>
              <h2 className="font-serif text-xl text-stone-100">1. Acceptance of Terms</h2>
            </div>
            <p className="text-stone-400">
              By accessing or using PREPT (&quot;the Platform&quot;), you agree to be bound by these Terms of Service. If you do not agree to all terms, you may not use the Platform. PREPT reserves the right to modify these terms at any time, with changes effective upon posting.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center">
                <FileText className="w-4 h-4 text-amber-400" />
              </div>
              <h2 className="font-serif text-xl text-stone-100">2. Platform Description</h2>
            </div>
            <p className="text-stone-400">
              PREPT is an AI-powered 1:1 mock interview marketplace that connects interviewees with experienced technical interviewers. The Platform provides:
            </p>
            <ul className="list-none space-y-3 pl-4">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                <span>Live video mock interviews via Stream&apos;s encrypted infrastructure.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                <span>AI-powered interview evaluation and feedback via Google Gemini.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                <span>Interviewer profile browsing, scheduling, and appointment management.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                <span>Credit-based payment system with interviewer payout capabilities.</span>
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-amber-400" />
              </div>
              <h2 className="font-serif text-xl text-stone-100">3. User Accounts & Roles</h2>
            </div>
            <p className="text-stone-400">Users may register as one of two roles:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <div className="rounded-lg bg-white/[0.03] border border-white/10 px-5 py-4">
                <p className="text-stone-200 font-semibold text-sm mb-1">👤 Candidate</p>
                <p className="text-stone-500 text-xs">Browse interviewers, book mock interviews, receive AI-powered feedback, and manage interview credits.</p>
              </div>
              <div className="rounded-lg bg-white/[0.03] border border-white/10 px-5 py-4">
                <p className="text-stone-200 font-semibold text-sm mb-1">🎯 Interviewer</p>
                <p className="text-stone-500 text-xs">Set availability, conduct interviews, set pricing, receive payouts, and build a professional profile.</p>
              </div>
            </div>
            <p className="text-stone-400 mt-4">
              You are responsible for maintaining the confidentiality of your account credentials. You must provide accurate and complete information during registration.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-amber-400" />
              </div>
              <h2 className="font-serif text-xl text-stone-100">4. Payments & Payouts</h2>
            </div>
            <ul className="list-none space-y-3 pl-4">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                <span><strong className="text-stone-200">Credits:</strong> Candidates purchase credits to book interview sessions. Credit prices and interview costs are displayed on the Platform.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                <span><strong className="text-stone-200">Interviewer Payouts:</strong> Interviewers earn credits for completed sessions. Payout requests are subject to admin review and approval.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                <span><strong className="text-stone-200">Refunds:</strong> Refund requests are handled on a case-by-case basis. Unused credits may be refundable within 30 days of purchase.</span>
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              </div>
              <h2 className="font-serif text-xl text-stone-100">5. Prohibited Conduct</h2>
            </div>
            <p className="text-stone-400">You agree NOT to:</p>
            <ul className="list-none space-y-3 pl-4">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0" />
                <span>Share, record, or redistribute interview sessions without consent of all participants.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0" />
                <span>Impersonate another person or provide false credentials as an interviewer.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0" />
                <span>Attempt to manipulate the credit system, exploit bugs, or circumvent security measures.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0" />
                <span>Use the Platform for any unlawful, harassing, or discriminatory purpose.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0" />
                <span>Reverse-engineer, scrape, or extract data from the Platform.</span>
              </li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center">
                <UserX className="w-4 h-4 text-amber-400" />
              </div>
              <h2 className="font-serif text-xl text-stone-100">6. Termination</h2>
            </div>
            <p className="text-stone-400">
              PREPT reserves the right to suspend or terminate your account at our discretion if you violate these Terms. You may delete your account at any time through your profile settings.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center">
                <Gavel className="w-4 h-4 text-amber-400" />
              </div>
              <h2 className="font-serif text-xl text-stone-100">7. Limitation of Liability</h2>
            </div>
            <p className="text-stone-400">
              PREPT is provided &quot;as is&quot; without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the Platform. Our total liability shall not exceed the amount you paid to PREPT in the 12 months preceding the claim.
            </p>
            <div className="mt-6 rounded-xl bg-amber-400/5 border border-amber-400/20 p-5">
              <p className="text-stone-300 text-sm">
                For questions about these Terms, contact us at{" "}
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
