
import { useState, useEffect } from 'react';
import { Bot, Activity, CheckCircle, Clock, Users, Target, TrendingUp, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AgentFlowModal from './AgentFlowModal';
import WorkflowStepper from './WorkflowStepper';
import BusinessRulesPanel from './BusinessRulesPanel';
import CandidateTable from './CandidateTable';
import { agents } from '@/data/agents';

const Dashboard = () => {
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [simulationMode, setSimulationMode] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showBusinessRules, setShowBusinessRules] = useState(false);
  const [agentStatuses, setAgentStatuses] = useState(agents.map(agent => ({ ...agent })));

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
        return 'bg-blue-100 text-blue-800 animate-pulse';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStartSimulation = () => {
    setIsRunning(true);
    setCurrentStep(0);
    
    // Reset all agents to idle
    setAgentStatuses(agents.map(agent => ({ ...agent, status: 'idle' })));
    
    // Determine starting point based on mode
    const startIndex = simulationMode === 'manual' ? 1 : 0; // Manual starts from Recruiter Assist (index 1)
    
    // Animate through agents with realistic timing
    const animateAgents = async () => {
      for (let i = startIndex; i < agents.length; i++) {
        // Set current agent to running
        setAgentStatuses(prev => prev.map((agent, index) => 
          index === i ? { ...agent, status: 'running' } : agent
        ));
        setCurrentStep(i + 1);
        
        // Wait for agent processing time (2-4 seconds)
        await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));
        
        // Set current agent to completed
        setAgentStatuses(prev => prev.map((agent, index) => 
          index === i ? { ...agent, status: 'completed' } : agent
        ));
      }
      
      // Simulation complete
      setTimeout(() => {
        setIsRunning(false);
        setCurrentStep(8);
      }, 1000);
    };
    
    animateAgents();
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
              <Button
                variant="outline"
                onClick={() => setShowBusinessRules(true)}
                className="flex items-center space-x-2"
              >
                <Settings className="w-4 h-4" />
                <span>Business Rules</span>
              </Button>
              
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
        {/* Workflow Stepper */}
        <WorkflowStepper isRunning={isRunning} currentStep={currentStep} />

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
          {agentStatuses.map((agent, index) => (
            <Card key={agent.id} className={`hover:shadow-lg transition-all duration-300 cursor-pointer ${
              agent.status === 'running' ? 'ring-2 ring-blue-400 shadow-lg transform scale-105' : 
              agent.status === 'completed' ? 'ring-2 ring-green-400' : ''
            }`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    agent.status === 'running' ? 'bg-blue-500 animate-pulse' :
                    agent.status === 'completed' ? 'bg-green-500' : 'bg-[#4da6ff]'
                  }`}>
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

        {/* Enhanced Candidate Table */}
        <CandidateTable />
      </div>

      {/* Agent Flow Modal */}
      {selectedAgent && (
        <AgentFlowModal 
          agent={selectedAgent} 
          onClose={() => setSelectedAgent(null)}
          simulationMode={simulationMode}
        />
      )}

      {/* Business Rules Panel */}
      <BusinessRulesPanel 
        isOpen={showBusinessRules}
        onClose={() => setShowBusinessRules(false)}
      />
    </div>
  );
};

export default Dashboard;
