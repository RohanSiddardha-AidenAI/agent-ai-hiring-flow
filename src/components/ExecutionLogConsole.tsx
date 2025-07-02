
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Terminal, ChevronUp, ChevronDown, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LogEntry {
  timestamp: string;
  agent: string;
  action: string;
  id: string;
}

interface ExecutionLogConsoleProps {
  isVisible: boolean;
  isRunning: boolean;
  currentStep: number;
  onClose: () => void;
  logs?: LogEntry[];
  onLogAdd?: (log: LogEntry) => void;
}

const ExecutionLogConsole = ({ 
  isVisible, 
  isRunning, 
  currentStep, 
  onClose, 
  logs = [], 
  onLogAdd 
}: ExecutionLogConsoleProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const agentNames = [
    'Talent Insight Agent',
    'Recruiter Assist Agent', 
    'Data Management Agent',
    'Resume Screening Agent',
    'Matching & Ranking Agent',
    'Workflow Automation Agent',
    'Communication Agent',
    'Interview Agent'
  ];

  const generateLogMessage = (agentIndex: number, step: number): string => {
    const messages = {
      1: [
        'Initializing job requirement analysis...',
        'Processing market data for role positioning...',
        'Completed talent market insights'
      ],
      2: [
        'Generating optimized job description...',
        'Analyzing role requirements and skills...',
        'Job description template created successfully'
      ],
      3: [
        'Connecting to talent databases...',
        'Fetched 500 candidate profiles',
        'Organized candidate pool by relevance'
      ],
      4: [
        'Starting AI-powered resume screening...',
        'Processed 500 resumes with ML algorithms',
        'Shortlisted 20 candidates based on criteria'
      ],
      5: [
        'Running smart matching algorithms...',
        'Calculating compatibility scores for 20 candidates',
        'Ranked candidates by fit score (85-92%)'
      ],
      6: [
        'Automating workflow processes...',
        'Generated 5 personalized offer templates',
        'Configured interview scheduling workflows'
      ],
      7: [
        'Preparing candidate outreach campaigns...',
        'Sent interview invites to 15 candidates',
        'Automated follow-up sequences activated'
      ],
      8: [
        'Processing interview feedback...',
        'Rated Priya Verma 85/100',
        'Completed assessment for all candidates'
      ]
    };
    
    return messages[agentIndex + 1]?.[step] || 'Processing...';
  };

  useEffect(() => {
    if (!isRunning || !onLogAdd) {
      return;
    }

    const interval = setInterval(() => {
      if (currentStep > 0 && currentStep <= agentNames.length) {
        const agentIndex = currentStep - 1;
        const now = new Date();
        const timestamp = now.toTimeString().substring(0, 8);
        
        // Add multiple log entries per agent with delays
        const logSteps = [0, 1, 2];
        
        logSteps.forEach((step, index) => {
          setTimeout(() => {
            const newLog: LogEntry = {
              id: `${Date.now()}-${agentIndex}-${step}-${Math.random()}`,
              timestamp,
              agent: agentNames[agentIndex],
              action: generateLogMessage(agentIndex, step)
            };
            
            onLogAdd(newLog);
          }, index * 800);
        });
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [isRunning, currentStep, onLogAdd]);

  useEffect(() => {
    // Auto-scroll to bottom when new logs are added
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollArea) {
        scrollArea.scrollTop = scrollArea.scrollHeight;
      }
    }
  }, [logs]);

  if (!isVisible) return null;

  return (
    <Card className="fixed bottom-4 right-4 w-96 z-50 shadow-xl border-[#4da6ff]">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-[#002b5c] flex items-center space-x-2 text-sm">
            <Terminal className="w-4 h-4" />
            <span>Live Agent Console</span>
          </CardTitle>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-6 w-6 p-0"
            >
              {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-0">
          <ScrollArea ref={scrollAreaRef} className="h-64 w-full">
            <div className="space-y-1 font-mono text-xs bg-gray-900 text-green-400 p-3 rounded">
              {logs.length === 0 ? (
                <div className="text-gray-500">Waiting for simulation to start...</div>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="flex space-x-2">
                    <span className="text-gray-400">[{log.timestamp}]</span>
                    <span className="text-blue-400">{log.agent}:</span>
                    <span className="text-green-400">{log.action}</span>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      )}
    </Card>
  );
};

export default ExecutionLogConsole;
