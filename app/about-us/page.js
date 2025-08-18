"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ExternalLink, Users, TrendingUp, Target, DollarSign, Play } from "lucide-react";

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-background">
        <header className="sticky top-0 border-b border-black/50 bg-black/5 backdrop-blur-sm">
            <div className="max-w-6xl mx-auto flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-4">
                <Link 
                href="https://deforge.io"
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                <ChevronLeft className="h-4 w-4 text-black/80" />
                <span className="text-sm text-black/80">Back</span>
                </Link>
                
                <div className="flex items-center gap-2">
                <Image
                    src="/logo/logo-black.svg"
                    alt="Logo"
                    width={22}
                    height={22}
                />
                <span className="font-bold text-2xl text-black">
                    Deforge
                </span>
                </div>
            </div>
            </div>
        </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-black mb-6">
            About Deforge
          </h1>
          <p className="text-2xl text-black/80 max-w-4xl mx-auto">
            Build AI Agents Visually, No Code Required
          </p>
        </div>

        {/* What We Do Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-black mb-8 text-center">
            What We're Building
          </h2>
          <div className="bg-transparent border border-black/80 rounded-2xl p-8 shadow-none">
            <p className="text-lg text-black/80 leading-relaxed mb-6">
              We are building Deforge, a no-code node-based visual AI Agent Builder. Imagine n8n or langflow, but 10 times more user-friendly. Most users don't want to integrate complex databases and hunt for API keys just to create a Knowledge Base. Our product does that with just one node.
            </p>
            <p className="text-lg text-black/80 leading-relaxed mb-6">
              We believe current workflow builders are broken, even though they provide granular nodes to control the minute details efficiently. However, normal users don't need those. Imagine watching a one-hour-long video just to copy a workflow and then spending another hour finding where to place the API key.
            </p>
            <p className="text-lg text-black/80 leading-relaxed">
              So, here's where Deforge comes in. We've also built an intuitive form builder that can be wrapped over your workflow, making it as easy as filling out a form to deploy AI Agents.
            </p>
          </div>
        </section>

        {/* Videos Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-black mb-8 text-center">
            See Deforge in Action
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-transparent border border-black/80 rounded-2xl p-6 shadow-none">
              <div className="flex items-center gap-2 mb-4">
                <Play className="h-5 w-5 text-red-600" />
                <h3 className="text-xl font-semibold text-black">Founders Video</h3>
              </div>
              <div className="aspect-video rounded-lg overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/sY0tg8BwTFQ"
                  title="Deforge Founders Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>

            <div className="bg-transparent border border-black/80 rounded-2xl p-6 shadow-none">
              <div className="flex items-center gap-2 mb-4">
                <Play className="h-5 w-5 text-red-600" />
                <h3 className="text-xl font-semibold text-black">YC Demo</h3>
              </div>
              <div className="aspect-video rounded-lg overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/9lHxi9nXXn8"
                  title="Deforge YC Demo Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>

            <div className="bg-transparent border border-black/80 rounded-2xl p-6 shadow-none">
              <div className="flex items-center gap-2 mb-4">
                <Play className="h-5 w-5 text-red-600" />
                <h3 className="text-xl font-semibold text-black">Product Reveal</h3>
              </div>
              <div className="aspect-video rounded-lg overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/lDc1p_yoWmQ"
                  title="Deforge Product Reveal Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
          </div>
        </section>

        {/* Founders Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-black mb-8 text-center">
            Meet Our Founders
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-transparent border border-black/80 rounded-2xl p-6 shadow-none text-center">
              <div className="w-20 h-20 bg-black/5 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="h-10 w-10 text-black/60" />
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">Anoy Roy Chowdhury</h3>
              <p className="text-black/60 mb-4">CEO</p>
              <Link 
                href="https://www.linkedin.com/in/anoyroyc3545/"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn <ExternalLink className="h-4 w-4" />
              </Link>
            </div>

            <div className="bg-transparent border border-black/80 rounded-2xl p-6 shadow-none text-center">
              <div className="w-20 h-20 bg-black/5 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="h-10 w-10 text-black/60" />
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">Shamba Chowdhury</h3>
              <p className="text-black/60 mb-4">CTO</p>
              <Link 
                href="https://www.linkedin.com/in/shambac/"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn <ExternalLink className="h-4 w-4" />
              </Link>
            </div>

            <div className="bg-transparent border border-black/80 rounded-2xl p-6 shadow-none text-center">
              <div className="w-20 h-20 bg-black/5 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="h-10 w-10 text-black/60" />
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">Gautam Raj</h3>
              <p className="text-black/60 mb-4">CMO</p>
              <Link 
                href="https://www.linkedin.com/in/-gautam-raj/"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-black mb-8 text-center">
            Our Impact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-transparent border border-black/80 rounded-2xl p-8 shadow-none text-center">
              <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-black mb-2">50,000+</h3>
              <p className="text-black/60">Impressions across social media platforms</p>
            </div>

            <div className="bg-transparent border border-black/80 rounded-2xl p-8 shadow-none text-center">
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-black mb-2">170+</h3>
              <p className="text-black/60">Waitlist enrollments</p>
            </div>
          </div>
        </section>

        {/* Why We Started Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-black mb-8 text-center">
            Our Story & Vision
          </h2>
          <div className="bg-transparent border border-black/80 rounded-2xl p-8 shadow-none">
            <div className="flex items-center gap-2 mb-6">
              <Target className="h-6 w-6 text-purple-600" />
              <h3 className="text-xl font-semibold text-black">Why We Started Deforge</h3>
            </div>
            <div className="space-y-4 text-lg text-black/80 leading-relaxed">
              <p>
                The idea originated from our own challenges. Nowadays, there are tutorials available for automating reels and AI-generated videos on social platforms. We thought, why not capitalize on this trend? These videos were typically 1-2 hours long on platforms like n8n and langflow. We were convinced that no-code platforms weren't as intuitive as they claimed to be.
              </p>
              <p>
                While detailed nodes did offer granular choices and integration options, the primitive nodes required complex database integration and API key hunting. We came up with an idea where one node could perform a specific task with a user-friendly design, similar to that of Unreal Engine and Blender. For instance, the knowledge base that simply converts your data into vectors and stores it as RAG takes 10 nodes in Langflow or n8n, whereas in our case, only one node is sufficient for that task.
              </p>
              <p>
                We empower anyone to visually create, connect, and deploy powerful AI agents without writing a single line of code, solving the problems of steep learning curves, time-consuming development cycles, integration challenges, and lack of accessibility for business users.
              </p>
            </div>
          </div>
        </section>

        {/* Competitive Advantage Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-black mb-8 text-center">
            What Makes Us Different
          </h2>
          <div className="bg-transparent border border-black/80 rounded-2xl p-8 shadow-none">
            <p className="text-lg text-black/80 leading-relaxed mb-6">
              Our main competitors are N8N and Langflow. Compared to them, we would say our product is more user-friendly and can be used by anyone rather than catering to technical professionals only.
            </p>
            <p className="text-lg text-black/80 leading-relaxed">
              We make everything easier - people will no longer need to get their own API keys or connect to their own databases. We take care of those details, so that people can focus on what matters the most for them: building their own AI Agent.
            </p>
          </div>
        </section>

        {/* Monetization Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-black mb-8 text-center">
            Our Pricing Strategy
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-transparent border border-black/80 rounded-2xl p-8 shadow-none">
              <div className="flex items-center gap-2 mb-6">
                <DollarSign className="h-6 w-6 text-green-600" />
                <h3 className="text-xl font-semibold text-black">Subscription Plans</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-black/20">
                  <span className="font-medium text-black/80">Free Plan</span>
                  <span className="text-green-600 font-semibold">$0/month</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-black/20">
                  <span className="font-medium text-black/80">Pro Plan</span>
                  <span className="text-blue-600 font-semibold">$29/month</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium text-black/80">Enterprise Plan</span>
                  <span className="text-purple-600 font-semibold">Custom</span>
                </div>
              </div>
            </div>

            <div className="bg-transparent border border-black/80 rounded-2xl p-8 shadow-none">
              <div className="flex items-center gap-2 mb-6">
                <Target className="h-6 w-6 text-orange-600" />
                <h3 className="text-xl font-semibold text-black">Credit System</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-black/20">
                  <span className="font-medium text-black/80">500 Credits</span>
                  <span className="text-green-600 font-semibold">$3</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-black/20">
                  <span className="font-medium text-black/80">1,000 Credits</span>
                  <span className="text-blue-600 font-semibold">$5</span>
                </div>
                <div className="flex justify-between items-center py-2 mb-4">
                  <span className="font-medium text-black/80">2,000 Credits</span>
                  <span className="text-purple-600 font-semibold">$8</span>
                </div>
                <div className="text-sm text-black/60">
                  <p>• Free plan includes 500 credits</p>
                  <p>• Pro plan includes 10,000 credits</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <div className="rounded-2xl p-12">
            <h2 className="text-3xl font-bold text-black mb-4">
              Ready to Build Your AI Agent?
            </h2>
            <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
              Join thousands of creators who are building powerful AI agents without writing a single line of code.
            </p>
            <Link 
              href="https://deforge.io"
              className="inline-block bg-black text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              Get Started Today
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
