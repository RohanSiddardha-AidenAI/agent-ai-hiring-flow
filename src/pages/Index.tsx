
import { useState } from 'react';
import { ArrowRight, Bot, Users, Target, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Dashboard from '@/components/Dashboard';

const Index = () => {
  const [showDashboard, setShowDashboard] = useState(false);

  if (showDashboard) {
    return <Dashboard />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#002b5c] to-[#4da6ff]">
      {/* Header */}
      <header className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <Bot className="w-6 h-6 text-[#002b5c]" />
            </div>
            <div>
              <h1 className="text-white font-bold text-xl">TASC Outsourcing</h1>
              <p className="text-blue-200 text-sm">AI Hiring Platform</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="border-white text-white hover:bg-white hover:text-[#002b5c]"
            onClick={() => setShowDashboard(true)}
          >
            Login
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Your AI Hiring Co-Pilot is Here.
            </h1>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Let 8 intelligent agents drive your talent acquisition journey—from insights to onboarding.
            </p>
            <Button 
              size="lg" 
              className="bg-white text-[#002b5c] hover:bg-blue-50 text-lg px-8 py-4"
              onClick={() => setShowDashboard(true)}
            >
              Try AI Recruiter
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>

          {/* Stats Section */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">5,000+</h3>
              <p className="text-blue-200">Candidates Processed Daily</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">88%</h3>
              <p className="text-blue-200">Match Accuracy Rate</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">7 Days</h3>
              <p className="text-blue-200">Average Time-to-Fill</p>
            </div>
          </div>
        </div>
      </main>

      {/* Features Preview */}
      <section className="px-6 py-16 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Powered by 8 Intelligent Agents
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Talent Insight", desc: "Market analysis & trends" },
              { name: "Recruiter Assistant", desc: "JD generation & optimization" },
              { name: "Data Management", desc: "Candidate pool organization" },
              { name: "Resume Screening", desc: "AI-powered filtering" },
              { name: "Candidate Matching", desc: "Smart ranking algorithms" },
              { name: "Workflow Automation", desc: "Process optimization" },
              { name: "Communication", desc: "Automated outreach" },
              { name: "Interview", desc: "Assessment & feedback" }
            ].map((agent, index) => (
              <div key={index} className="bg-white/10 backdrop-blur rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-[#4da6ff] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">{agent.name}</h3>
                <p className="text-blue-200 text-sm">{agent.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
