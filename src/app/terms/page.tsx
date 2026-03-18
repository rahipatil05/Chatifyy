import NavigationHeader from "@/components/NavigationHeader";
import { Scale } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100">
      <NavigationHeader />
      
      <main className="max-w-3xl mx-auto px-6 py-20">
        <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-purple-500/10 rounded-xl">
                <Scale className="w-8 h-8 text-purple-400" />
            </div>
            <h1 className="text-4xl font-bold text-white">Terms of Service</h1>
        </div>

        <div className="prose prose-invert prose-purple max-w-none space-y-8 text-gray-400">
          <section>
            <p className="text-lg leading-relaxed">
              By using **Codify**, you agree to abide by the following terms. Please read them carefully before using our platform.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">1. Acceptable Use</h2>
            <p>
              You may not use Codify to execute malicious software, perform network attacks, or engage in any illegal activities. We reserve the right to terminate access for any user violating these terms.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">2. Intellectual Property</h2>
            <p>
              You retain full ownership of the code snippets you create and store on Codify. By making a snippet public, you grant other users a non-exclusive license to view and fork your code.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">3. Disclaimer of Warranty</h2>
            <p>
              Codify is provided "as is" without any warranties. We are not responsible for any data loss or damages resulting from the use of our platform or code execution environment.
            </p>
          </section>

          <section className="pt-8 border-t border-white/10 text-sm">
            &copy; 2026 Codify Project. All rights reserved.
          </section>
        </div>
      </main>
    </div>
  );
}
