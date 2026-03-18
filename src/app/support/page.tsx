import NavigationHeader from "@/components/NavigationHeader";
import { Mail, MessageSquare, LifeBuoy, Globe } from "lucide-react";

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100">
      <NavigationHeader />
      
      <main className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-4">
            <LifeBuoy className="w-3 h-3" />
            Help Center
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            How can we help?
          </h1>
          <p className="text-gray-400 max-w-lg mx-auto">
            Have questions about Codify? We're here to help you get the most out of our AI-powered development environment.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-20">
          <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-blue-500/30 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Mail className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Email Support</h3>
            <p className="text-gray-400 text-sm mb-6">
              Our team usually responds within 24 hours to technical inquiries.
            </p>
            <a href="mailto:support@codify.dev" className="text-blue-400 font-medium hover:underline inline-flex items-center gap-2">
              support@codify.dev
            </a>
          </div>

          <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-purple-500/30 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Community Discord</h3>
            <p className="text-gray-400 text-sm mb-6">
              Join our developer community to share tips and get quick help.
            </p>
            <button className="text-purple-400 font-medium hover:underline inline-flex items-center gap-2">
              Join Discord Server
            </button>
          </div>
        </div>

        <div className="space-y-8">
          <h2 className="text-2xl font-bold border-b border-white/[0.05] pb-4">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h4 className="text-white font-medium mb-2 text-lg">Is it free to use?</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Yes, Codify offers a generous free tier for running and sharing snippets. Advanced AI features like high-frequency linting and deep optimizations are coming soon for power users.
              </p>
            </div>
            <div>
              <h4 className="text-white font-medium mb-2 text-lg">Which languages are supported?</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                We support over 100 languages, including JavaScript, Python, C++, Rust, and Go. Most popular runtimes are pre-installed in our sandboxed environment.
              </p>
            </div>
            <div>
              <h4 className="text-white font-medium mb-2 text-lg">How secure is my code?</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                All code execution happens in isolated, temporary Docker containers. Your source code is encrypted at rest and never used for global model training without your permission.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
