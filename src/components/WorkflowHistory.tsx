
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Users, CheckCircle, Calendar, FileText } from 'lucide-react';
import { JobData } from './JobSetupModal';

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
}

interface WorkflowHistoryProps {
  currentExecution?: WorkflowExecution;
  onAddExecution: (execution: WorkflowExecution) => void;
}

const WorkflowHistory = ({ currentExecution, onAddExecution }: WorkflowHistoryProps) => {
  const [executions, setExecutions] = useState<WorkflowExecution[]>([]);

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
          const newExecutions = [currentExecution, ...prev].slice(0, 10); // Keep only last 10
          return newExecutions;
        }
        return prev;
      });
    }
  }, [currentExecution]);

  const getStatusIcon = (status: string) => {
    return status === 'completed' ? 
      <CheckCircle className="w-4 h-4 text-green-500" /> : 
      <Clock className="w-4 h-4 text-blue-500 animate-pulse" />;
  };

  return (
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
              <Badge className={currentExecution.status === 'running' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}>
                <div className="flex items-center space-x-1">
                  {getStatusIcon(currentExecution.status)}
                  <span className="capitalize">{currentExecution.status}</span>
                </div>
              </Badge>
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
            executions.map((execution) => (
              <div key={execution.id} className="p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-[#002b5c]">{execution.jobTitle}</span>
                    <Badge variant="outline" className="text-xs">
                      {execution.mode}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-[#4d4d4d]">
                    <Clock className="w-3 h-3" />
                    <span>{execution.timestamp.toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm">
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
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkflowHistory;
