
import { useState } from 'react';
import { Bot, Activity, CheckCircle, Clock, Users, Target, TrendingUp, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AgentFlowModal from './AgentFlowModal';
import { agents } from '@/data/agents';
import { mockCandidates } from '@/data/candidates';

const Dashboard = () => {
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [simulationMode, setSimulationMode] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Activity className="w-4 h-4 text-blue-500 animate-pulse" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStartSimulation = () => {
    setIsRunning(true);
    // Simulate agent progression
    setTimeout(() => {
      agents.forEach((agent, index) => {
        setTimeout(() => {
          agent.status = 'running';
        }, index * 1000);
        setTimeout(() => {
          agent.status = 'completed';
        }, (index + 1) * 2000);
      });
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#002b5c] rounded-lg flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-[#002b5c]">TASC AI Hiring Dashboard</h1>
                  <p className="text-sm text-[#4d4d4d]">Intelligent Talent Acquisition</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Select value={simulationMode} onValueChange={setSimulationMode}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select Hiring Campaign" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual - Frontend Developer</SelectItem>
                  <SelectItem value="automated">Automated - Multi-Role Campaign</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                onClick={handleStartSimulation}
                disabled={!simulationMode || isRunning}
                className="bg-[#002b5c] hover:bg-[#001a3d]"
              >
                {isRunning ? 'Running...' : 'Start Simulation'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* KPI Dashboard */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#4d4d4d] mb-1">Time-to-Fill</p>
                  <p className="text-2xl font-bold text-[#002b5c]">7 Days</p>
                </div>
                <TrendingUp className="w-8 h-8 text-[#4da6ff]" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#4d4d4d] mb-1">Candidates Processed</p>
                  <p className="text-2xl font-bold text-[#002b5c]">5,000</p>
                </div>
                <Users className="w-8 h-8 text-[#4da6ff]" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#4d4d4d] mb-1">Offers Made</p>
                  <p className="text-2xl font-bold text-[#002b5c]">85</p>
                </div>
                <Target className="w-8 h-8 text-[#4da6ff]" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#4d4d4d] mb-1">Success Rate</p>
                  <p className="text-2xl font-bold text-[#002b5c]">88%</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Agents Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {agents.map((agent) => (
            <Card key={agent.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 bg-[#4da6ff] rounded-lg flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <Badge className={getStatusColor(agent.status)}>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(agent.status)}
                      <span className="capitalize">{agent.status}</span>
                    </div>
                  </Badge>
                </div>
                <CardTitle className="text-lg text-[#002b5c]">{agent.name}</CardTitle>
                <CardDescription className="text-sm">{agent.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#4d4d4d]">Processed:</span>
                    <span className="font-medium">{agent.stats.processed}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#4d4d4d]">Success Rate:</span>
                    <span className="font-medium">{agent.stats.successRate}</span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setSelectedAgent(agent)}
                >
                  View Flow
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-[#002b5c]">Recent Activity</CardTitle>
            <CardDescription>Latest hiring pipeline updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockCandidates.slice(0, 5).map((candidate, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-[#4da6ff] rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">
                        {candidate.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-[#002b5c]">{candidate.name}</p>
                      <p className="text-sm text-[#4d4d4d]">{candidate.role_applied} • Score: {candidate.screening_score}</p>
                    </div>
                  </div>
                  <Badge className={candidate.screening_score >= 85 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                    {candidate.screening_score >= 85 ? 'Shortlisted' : 'Under Review'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agent Flow Modal */}
      {selectedAgent && (
        <AgentFlowModal 
          agent={selectedAgent} 
          onClose={() => setSelectedAgent(null)}
          simulationMode={simulationMode}
        />
      )}
    </div>
  );
};

export default Dashboard;
