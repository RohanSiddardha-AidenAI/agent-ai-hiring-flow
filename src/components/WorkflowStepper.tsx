
import { useState, useEffect } from 'react';
import { CheckCircle, Clock, ArrowRight } from 'lucide-react';

interface WorkflowStepperProps {
  isRunning: boolean;
  currentStep: number;
}

const workflowSteps = [
  { id: 1, name: 'Talent Insight', description: 'Market Analysis' },
  { id: 2, name: 'Recruiter Assist', description: 'JD Generation' },
  { id: 3, name: 'Data Management', description: 'Pool Organization' },
  { id: 4, name: 'Resume Screening', description: 'AI Filtering' },
  { id: 5, name: 'Matching & Ranking', description: 'Smart Algorithms' },
  { id: 6, name: 'Workflow Automation', description: 'Process Optimization' },
  { id: 7, name: 'Communication', description: 'Candidate Outreach' },
  { id: 8, name: 'Interview', description: 'Assessment & Feedback' }
];

const WorkflowStepper = ({ isRunning, currentStep }: WorkflowStepperProps) => {
  const [animatedStep, setAnimatedStep] = useState(0);

  useEffect(() => {
    if (isRunning && currentStep > animatedStep) {
      const timer = setTimeout(() => {
        setAnimatedStep(currentStep);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isRunning, currentStep, animatedStep]);

  const getStepStatus = (stepId: number) => {
    if (stepId < animatedStep) return 'completed';
    if (stepId === animatedStep && isRunning) return 'current';
    return 'pending';
  };

  const getStepIcon = (stepId: number) => {
    const status = getStepStatus(stepId);
    
    if (status === 'completed') {
      return <CheckCircle className="w-6 h-6 text-green-500" />;
    } else if (status === 'current') {
      return <Clock className="w-6 h-6 text-blue-500 animate-pulse" />;
    } else {
      return <div className="w-6 h-6 rounded-full border-2 border-gray-300 bg-white" />;
    }
  };

  const getStepClasses = (stepId: number) => {
    const status = getStepStatus(stepId);
    const baseClasses = "flex flex-col items-center p-4 rounded-lg transition-all duration-500";
    
    if (status === 'completed') {
      return `${baseClasses} bg-green-50 border-2 border-green-200 transform scale-105`;
    } else if (status === 'current') {
      return `${baseClasses} bg-blue-50 border-2 border-blue-200 transform scale-110 shadow-lg`;
    } else {
      return `${baseClasses} bg-gray-50 border-2 border-gray-200`;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <h3 className="text-lg font-semibold text-[#002b5c] mb-4">Hiring Workflow Progress</h3>
      
      <div className="flex items-center justify-between overflow-x-auto pb-4">
        {workflowSteps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={getStepClasses(step.id)}>
              {getStepIcon(step.id)}
              <h4 className="text-sm font-medium text-[#002b5c] mt-2 text-center">{step.name}</h4>
              <p className="text-xs text-[#4d4d4d] text-center">{step.description}</p>
            </div>
            
            {index < workflowSteps.length - 1 && (
              <ArrowRight className={`w-5 h-5 mx-2 transition-colors duration-300 ${
                getStepStatus(step.id) === 'completed' ? 'text-green-500' : 'text-gray-300'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkflowStepper;
