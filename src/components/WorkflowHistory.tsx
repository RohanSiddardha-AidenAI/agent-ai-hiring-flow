import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Users, CheckCircle, Calendar, FileText, ChevronRight, Eye, Terminal } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LogEntry {
  timestamp: string;
  agent: string;
  action: string;
  id: string;
}

interface WorkflowExecution {
  id: string;
  timestamp: Date;
  jobTitle: string;
  location: string;
  mode: 'manual' | 'automated';
  status: 'running' | 'completed';
  kpis: {
    profilesFetched: number;
    screened: number;
    shortlisted: number;
    interviewsScheduled: number;
    offersGenerated: number;
  };
  logs?: LogEntry[];
  detailedMetrics?: {
    talentInsight: { processed: number; insights: string[] };
    recruiterAssist: { processed: number; jdGenerated: boolean };
    dataManagement: { processed: number; sources: string[] };
    resumeScreening: { processed: number; passed: number; avgScore: number };
    matchingRanking: { processed: number; topScore: number; avgScore: number };
    workflowAutomation: { processed: number; templatesGenerated: number };
    communication: { processed: number; responseRate: number };
    interview: { processed: number; avgRating: number; topCandidate: string };
  };
}

interface WorkflowHistoryProps {
  currentExecution?: WorkflowExecution;
  onAddExecution: (execution: WorkflowExecution) => void;
  onExecutionSelect?: (execution: WorkflowExecution | null) => void;
  executionLogs?: LogEntry[];
}

const WorkflowHistory = ({ currentExecution, onAddExecution, onExecutionSelect, executionLogs = [] }: WorkflowHistoryProps) => {
  const [executions, setExecutions] = useState<WorkflowExecution[]>([]);
  const [selectedExecution, setSelectedExecution] = useState<WorkflowExecution | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showLogsModal, setShowLogsModal] = useState(false);

  useEffect(() => {
    // Load from localStorage on component mount
    const stored = localStorage.getItem('workflow-executions');
    if (stored) {
      const parsed = JSON.parse(stored).map((exec: any) => ({
        ...exec,
        timestamp: new Date(exec.timestamp)
      }));
      setExecutions(parsed);
    }
  }, []);

  useEffect(() => {
    // Save to localStorage whenever executions change
    localStorage.setItem('workflow-executions', JSON.stringify(executions));
  }, [executions]);

  useEffect(() => {
    // Add current execution when it's completed
    if (currentExecution && currentExecution.status === 'completed') {
      setExecutions(prev => {
        const exists = prev.find(exec => exec.id === currentExecution.id);
        if (!exists) {
          // Attach logs to the execution before storing
          const executionWithLogs = {
            ...currentExecution,
            logs: executionLogs
          };
          const newExecutions = [executionWithLogs, ...prev].slice(0, 10); // Keep only last 10
          return newExecutions;
        }
        return prev;
      });
    }
  }, [currentExecution, executionLogs]);

  const formatDateTime = (date: Date) => {
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const handleExecutionClick = (execution: WorkflowExecution) => {
    setSelectedExecution(execution);
    setShowDetailsModal(true);
    onExecutionSelect?.(execution);
  };

  const handleViewLogs = (execution: WorkflowExecution, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedExecution(execution);
    setShowLogsModal(true);
  };

  const getStatusIcon = (status: string) => {
    return status === 'completed' ? 
      <CheckCircle className="w-4 h-4 text-green-500" /> : 
      <Clock className="w-4 h-4 text-blue-500 animate-pulse" />;
  };

  const generateDetailedMetrics = (execution: WorkflowExecution) => {
    return {
      talentInsight: { 
        processed: 1, 
        insights: ['Market demand: High', 'Salary range: ₹8-15L', 'Competition: Medium'] 
      },
      recruiterAssist: { 
        processed: 1, 
        jdGenerated: true 
      },
      dataManagement: { 
        processed: execution.kpis.profilesFetched, 
        sources: ['LinkedIn', 'Naukri', 'Indeed', 'Internal DB'] 
      },
      resumeScreening: { 
        processed: execution.kpis.screened, 
        passed: execution.kpis.shortlisted, 
        avgScore: 78.5 
      },
      matchingRanking: { 
        processed: execution.kpis.shortlisted, 
        topScore: 92, 
        avgScore: 85.3 
      },
      workflowAutomation: { 
        processed: execution.kpis.offersGenerated, 
        templatesGenerated: 3 
      },
      communication: { 
        processed: execution.kpis.interviewsScheduled, 
        responseRate: 73.2 
      },
      interview: { 
        processed: execution.kpis.interviewsScheduled, 
        avgRating: 82.4, 
        topCandidate: 'Priya Verma' 
      }
    };
  };

  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-[#002b5c] flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Workflow History</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentExecution && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-[#002b5c]">Current Execution</h4>
                <div className="flex items-center space-x-2">
                  <Badge className={currentExecution.status === 'running' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(currentExecution.status)}
                      <span className="capitalize">{currentExecution.status}</span>
                    </div>
                  </Badge>
                  {currentExecution.status === 'completed' && executionLogs.length > 0 && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => handleViewLogs(currentExecution, e)}
                      className="flex items-center space-x-1"
                    >
                      <Terminal className="w-3 h-3" />
                      <span>View Logs</span>
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-[#4d4d4d]">Role:</span>
                  <span className="font-medium">{currentExecution.jobTitle}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-[#4d4d4d]" />
                  <span className="text-sm">{currentExecution.location}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-xs text-[#4d4d4d] mb-3">
                <Calendar className="w-3 h-3" />
                <span>{formatDateTime(currentExecution.timestamp).date}</span>
                <span>{formatDateTime(currentExecution.timestamp).time}</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
                <div className="text-center">
                  <p className="font-bold text-[#4da6ff]">{currentExecution.kpis.profilesFetched}</p>
                  <p className="text-xs text-[#4d4d4d]">Profiles</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-[#4da6ff]">{currentExecution.kpis.screened}</p>
                  <p className="text-xs text-[#4d4d4d]">Screened</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-[#4da6ff]">{currentExecution.kpis.shortlisted}</p>
                  <p className="text-xs text-[#4d4d4d]">Shortlisted</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-[#4da6ff]">{currentExecution.kpis.interviewsScheduled}</p>
                  <p className="text-xs text-[#4d4d4d]">Interviews</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-[#4da6ff]">{currentExecution.kpis.offersGenerated}</p>
                  <p className="text-xs text-[#4d4d4d]">Offers</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3 max-h-64 overflow-y-auto">
            {executions.length === 0 ? (
              <p className="text-[#4d4d4d] text-center py-4">No workflow executions yet</p>
            ) : (
              executions.map((execution) => {
                const dateTime = formatDateTime(execution.timestamp);
                return (
                  <div 
                    key={execution.id} 
                    className="p-3 border border-gray-200 rounded-lg hover:border-[#4da6ff] hover:shadow-md transition-all cursor-pointer group"
                    onClick={() => handleExecutionClick(execution)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-[#002b5c]">{execution.jobTitle}</span>
                        <Badge variant="outline" className="text-xs">
                          {execution.mode}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1 text-sm text-[#4d4d4d]">
                          <Clock className="w-3 h-3" />
                          <span>{dateTime.date}</span>
                          <span className="font-mono">{dateTime.time}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#4da6ff] transition-colors" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-[#4d4d4d]" />
                          <span>{execution.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-3 h-3 text-[#4d4d4d]" />
                          <span>{execution.kpis.profilesFetched} profiles</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <span>{execution.kpis.shortlisted} shortlisted</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {execution.logs && execution.logs.length > 0 && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={(e) => handleViewLogs(execution, e)}
                            className="flex items-center space-x-1"
                          >
                            <Terminal className="w-3 h-3" />
                            <span>Logs</span>
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                          <Eye className="w-3 h-3" />
                          <span>Details</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Execution Logs Modal */}
      <Dialog open={showLogsModal} onOpenChange={setShowLogsModal}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-[#002b5c] flex items-center space-x-2">
              <Terminal className="w-5 h-5" />
              <span>Execution Log Console - {selectedExecution?.jobTitle}</span>
            </DialogTitle>
          </DialogHeader>
          
          {selectedExecution && (
            <div className="space-y-4">
              <div className="text-sm text-[#4d4d4d]">
                Executed on {formatDateTime(selectedExecution.timestamp).date} at {formatDateTime(selectedExecution.timestamp).time}
              </div>
              
              <ScrollArea className="h-96 w-full">
                <div className="font-mono text-xs bg-gray-900 text-green-400 p-4 rounded">
                  {selectedExecution.logs && selectedExecution.logs.length > 0 ? (
                    selectedExecution.logs.map((log) => (
                      <div key={log.id} className="flex space-x-2 mb-1">
                        <span className="text-gray-400">[{log.timestamp}]</span>
                        <span className="text-blue-400">{log.agent}:</span>
                        <span className="text-green-400">{log.action}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500">No logs available for this execution</div>
                  )}
                </div>
              </ScrollArea>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Detailed Metrics Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#002b5c]">
              Execution Details - {selectedExecution?.jobTitle}
            </DialogTitle>
          </DialogHeader>
          
          {selectedExecution && (
            <div className="space-y-6">
              {/* Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-[#4d4d4d]">Job Title</p>
                  <p className="font-semibold">{selectedExecution.jobTitle}</p>
                </div>
                <div>
                  <p className="text-sm text-[#4d4d4d]">Location</p>
                  <p className="font-semibold">{selectedExecution.location}</p>
                </div>
                <div>
                  <p className="text-sm text-[#4d4d4d]">Mode</p>
                  <Badge className="capitalize">{selectedExecution.mode}</Badge>
                </div>
                <div>
                  <p className="text-sm text-[#4d4d4d]">Executed</p>
                  <p className="font-semibold text-sm">
                    {formatDateTime(selectedExecution.timestamp).date} at {formatDateTime(selectedExecution.timestamp).time}
                  </p>
                </div>
              </div>

              {/* Agent Breakdown */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#002b5c]">Agent Processing Breakdown</h3>
                
                {Object.entries(generateDetailedMetrics(selectedExecution)).map(([agentKey, metrics]) => {
                  const agentNames = {
                    talentInsight: 'Talent Insight Agent',
                    recruiterAssist: 'Recruiter Assist Agent',
                    dataManagement: 'Data Management Agent',
                    resumeScreening: 'Resume Screening Agent',
                    matchingRanking: 'Matching & Ranking Agent',
                    workflowAutomation: 'Workflow Automation Agent',
                    communication: 'Communication Agent',
                    interview: 'Interview Agent'
                  };

                  return (
                    <Card key={agentKey} className="p-4">
                      <h4 className="font-semibold text-[#002b5c] mb-2">
                        {agentNames[agentKey as keyof typeof agentNames]}
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        {Object.entries(metrics).map(([key, value]) => (
                          <div key={key}>
                            <p className="text-[#4d4d4d] capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}:</p>
                            <p className="font-medium">
                              {Array.isArray(value) ? value.join(', ') : 
                               typeof value === 'boolean' ? (value ? 'Yes' : 'No') :
                               typeof value === 'number' ? value : value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WorkflowHistory;
