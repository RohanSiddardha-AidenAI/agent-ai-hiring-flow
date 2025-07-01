
import { X, ArrowRight, Code, FileText, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockCandidates } from '@/data/candidates';

interface Agent {
  id: string;
  name: string;
  description: string;
  status: string;
  stats: {
    processed: string;
    successRate: string;
  };
}

interface AgentFlowModalProps {
  agent: Agent;
  onClose: () => void;
  simulationMode: string;
}

const AgentFlowModal = ({ agent, onClose, simulationMode }: AgentFlowModalProps) => {
  const getAgentData = (agentId: string, mode: string) => {
    const baseData = {
      input: {},
      output: {},
      flowConnections: []
    };

    switch (agentId) {
      case 'talent-insight':
        return {
          input: mode === 'automated' ? {} : { trigger: 'Market analysis requested' },
          output: {
            marketTrends: {
              "Frontend Developer": "+32% demand YoY in Chennai",
              "QA Engineer": "High need for Selenium + Cypress",
              "HR Manager": "Spike in hiring for large workforce firms"
            },
            candidatePreferences: {
              Remote: "68% prefer remote roles",
              Hybrid: "22%",
              Onsite: "10%"
            }
          },
          flowConnections: ['recruiter-assistance', 'data-management']
        };
      
      case 'recruiter-assistance':
        return {
          input: {
            role: "Frontend Developer",
            skills: ["React", "HTML", "CSS", "JavaScript"],
            location: "Chennai",
            experience: "2–4 years"
          },
          output: {
            title: "Frontend Developer – Chennai – Hybrid",
            jd: "Join our growing UI/UX team to build pixel-perfect React interfaces. We value clean code, accessibility, and collaborative development.",
            requirements: ["2-4 years React experience", "Strong HTML/CSS skills", "JavaScript proficiency"]
          },
          flowConnections: ['data-management']
        };
      
      case 'data-management':
        return {
          input: {
            role: "Frontend Developer",
            candidatePool: mockCandidates.length
          },
          output: {
            candidatePool: mockCandidates.length,
            filteredProfiles: mockCandidates.filter(c => c.role_applied === "Frontend Developer").length,
            schema: ["name", "email", "skills", "location", "experience", "resume_url"]
          },
          flowConnections: ['resume-screening']
        };
      
      case 'resume-screening':
        const frontendCandidates = mockCandidates.filter(c => c.role_applied === "Frontend Developer");
        return {
          input: {
            candidates: frontendCandidates.length,
            requiredSkills: ["React", "HTML", "CSS", "JavaScript"]
          },
          output: {
            shortlisted: frontendCandidates
              .filter(c => c.screening_score >= 80)
              .slice(0, 10)
              .map(c => ({ name: c.name, score: c.screening_score }))
          },
          flowConnections: ['candidate-matching']
        };
      
      case 'candidate-matching':
        const topCandidates = mockCandidates
          .filter(c => c.role_applied === "Frontend Developer")
          .sort((a, b) => b.screening_score - a.screening_score)
          .slice(0, 5);
        return {
          input: {
            shortlistedCandidates: 10,
            role: "Frontend Developer"
          },
          output: {
            rankedCandidates: topCandidates.map(c => ({
              name: c.name,
              score: c.screening_score,
              skills: c.skills
            }))
          },
          flowConnections: ['workflow-automation']
        };
      
      case 'workflow-automation':
        return {
          input: {
            rankedCandidates: 5,
            minScore: 80
          },
          output: {
            nextSteps: {
              candidatesToContact: ["Duane Watts", "Alexandra Patrick"],
              action: "Schedule Interview",
              automatedEmails: 2
            }
          },
          flowConnections: ['communication']
        };
      
      case 'communication':
        return {
          input: {
            candidatesToContact: ["Duane Watts", "Alexandra Patrick"],
            action: "Schedule Interview"
          },
          output: {
            emailsSent: 2,
            responses: 2,
            interviewsScheduled: 2,
            sampleMessage: "Congratulations! You've been shortlisted for an interview. Would you be available tomorrow at 11 AM?"
          },
          flowConnections: ['interview']
        };
      
      case 'interview':
        return {
          input: {
            scheduledInterviews: 2,
            candidates: ["Duane Watts", "Alexandra Patrick"]
          },
          output: {
            completed: 2,
            results: [
              { candidate: "Duane Watts", score: 92, feedback: "Excellent React skills and problem-solving ability" },
              { candidate: "Alexandra Patrick", score: 87, feedback: "Strong frontend knowledge with good communication" }
            ]
          },
          flowConnections: []
        };
      
      default:
        return baseData;
    }
  };

  const agentData = getAgentData(agent.id, simulationMode);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-[#4da6ff] rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#002b5c]">{agent.name}</h2>
                <p className="text-[#4d4d4d]">{agent.description}</p>
              </div>
            </div>
            <Button variant="ghost" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Flow Diagram */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ArrowRight className="w-5 h-5" />
                <span>Agent Flow</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 overflow-x-auto pb-4">
                <div className="bg-blue-50 border-2 border-[#4da6ff] rounded-lg p-4 min-w-[200px]">
                  <h4 className="font-semibold text-[#002b5c] mb-2">Input</h4>
                  <div className="text-sm text-[#4d4d4d]">
                    {Object.keys(agentData.input).length > 0 ? (
                      <pre className="whitespace-pre-wrap text-xs">
                        {JSON.stringify(agentData.input, null, 2)}
                      </pre>
                    ) : (
                      <span className="italic">Auto-triggered</span>
                    )}
                  </div>
                </div>
                
                <ArrowRight className="w-6 h-6 text-[#4da6ff] flex-shrink-0" />
                
                <div className="bg-[#002b5c] text-white rounded-lg p-4 min-w-[150px]">
                  <h4 className="font-semibold mb-2">{agent.name}</h4>
                  <Badge className="bg-green-500">
                    Processing
                  </Badge>
                </div>
                
                <ArrowRight className="w-6 h-6 text-[#4da6ff] flex-shrink-0" />
                
                <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 min-w-[200px]">
                  <h4 className="font-semibold text-green-800 mb-2">Output</h4>
                  <div className="text-sm text-green-700">
                    <pre className="whitespace-pre-wrap text-xs">
                      {JSON.stringify(agentData.output, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
              
              {agentData.flowConnections.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-semibold text-[#002b5c] mb-2">Connected To:</h4>
                  <div className="flex flex-wrap gap-2">
                    {agentData.flowConnections.map((connection, index) => (
                      <Badge key={index} variant="outline">
                        {connection.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sample JSON Payload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Code className="w-5 h-5" />
                <span>Sample JSON Payload</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <pre>{JSON.stringify({
                  agent: agent.name,
                  timestamp: new Date().toISOString(),
                  input: agentData.input,
                  output: agentData.output,
                  status: agent.status,
                  processing_time: "1.2s"
                }, null, 2)}</pre>
              </div>
            </CardContent>
          </Card>

          {/* Performance Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Performance Metrics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#002b5c]">{agent.stats.processed}</p>
                  <p className="text-sm text-[#4d4d4d]">Items Processed</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#002b5c]">{agent.stats.successRate}</p>
                  <p className="text-sm text-[#4d4d4d]">Success Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#002b5c]">1.2s</p>
                  <p className="text-sm text-[#4d4d4d]">Avg Processing Time</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AgentFlowModal;
