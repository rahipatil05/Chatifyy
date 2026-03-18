import NavigationHeader from "@/components/NavigationHeader";
import { Shield } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100">
      <NavigationHeader />
      
      <main className="max-w-3xl mx-auto px-6 py-20">
        <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-blue-500/10 rounded-xl">
                <Shield className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-4xl font-bold text-white">Privacy Policy</h1>
        </div>

        <div className="prose prose-invert prose-blue max-w-none space-y-8 text-gray-400">
          <section>
            <p className="text-lg leading-relaxed">
              At **Codify**, your privacy is our priority. This policy outlines how we handle your data when you use our interactive code editor and sharing platform.
            </p>
            <p className="text-sm italic">Last Updated: March 18, 2026</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">1. Information We Collect</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>**Code Snippets**: We store the code you explicitly save to our database to enable sharing and persistence.</li>
              <li>**Execution Logs**: Temporary logs are generated during code execution to show you the output. These are deleted shortly after.</li>
              <li>**AI Input**: Code sent for analysis is processed via our secure API partners (e.g., Groq, Gemini).</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">2. How We Use Data</h2>
            <p>
              We use your information exclusively to provide the core services of Codify. We do not sell your personal information or your code to third parties.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">3. Security</h2>
            <p>
              We implement industry-standard security measures, including SSL encryption and sandboxed execution environments, to protect your data from unauthorized access.
            </p>
          </section>

          <section className="bg-white/5 p-6 rounded-2xl border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-2">Contact Us</h3>
            <p className="text-sm">
              If you have any questions about this Privacy Policy, please contact us at [privacy@codify.dev](mailto:privacy@codify.dev).
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
