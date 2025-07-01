
import { useState } from 'react';
import { Settings, Save, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface BusinessRule {
  id: string;
  name: string;
  value: number;
  min: number;
  max: number;
  description: string;
}

interface BusinessRulesPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const defaultRules: BusinessRule[] = [
  {
    id: 'shortlistCount',
    name: 'Shortlist Top N Candidates',
    value: 15,
    min: 5,
    max: 50,
    description: 'Maximum number of candidates to shortlist per role'
  },
  {
    id: 'minRankingScore',
    name: 'Minimum Ranking Score',
    value: 80,
    min: 50,
    max: 100,
    description: 'Minimum score required to proceed to next stage'
  },
  {
    id: 'maxCandidatesPerRole',
    name: 'Max Candidates Per Role',
    value: 200,
    min: 50,
    max: 1000,
    description: 'Maximum candidates to process per job role'
  },
  {
    id: 'autoInterviewThreshold',
    name: 'Auto Interview Threshold',
    value: 85,
    min: 70,
    max: 95,
    description: 'Score threshold for automatic interview scheduling'
  }
];

const BusinessRulesPanel = ({ isOpen, onClose }: BusinessRulesPanelProps) => {
  const [rules, setRules] = useState<BusinessRule[]>(defaultRules);
  const [hasChanges, setHasChanges] = useState(false);

  const handleRuleChange = (ruleId: string, newValue: number) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, value: newValue } : rule
    ));
    setHasChanges(true);
  };

  const handleSave = () => {
    console.log('Saving business rules:', rules);
    setHasChanges(false);
  };

  const handleReset = () => {
    setRules(defaultRules);
    setHasChanges(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto m-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Settings className="w-6 h-6 text-[#4da6ff]" />
              <div>
                <CardTitle className="text-[#002b5c]">Business Rules Configuration</CardTitle>
                <CardDescription>Customize AI agent behavior and thresholds</CardDescription>
              </div>
            </div>
            <Button variant="outline" onClick={onClose}>✕</Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {rules.map((rule) => (
            <div key={rule.id} className="p-4 border rounded-lg bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium text-[#002b5c]">{rule.name}</Label>
                <span className="text-2xl font-bold text-[#4da6ff]">{rule.value}</span>
              </div>
              
              <p className="text-sm text-[#4d4d4d] mb-3">{rule.description}</p>
              
              <div className="flex items-center space-x-4">
                <span className="text-xs text-[#4d4d4d]">{rule.min}</span>
                <input
                  type="range"
                  min={rule.min}
                  max={rule.max}
                  value={rule.value}
                  onChange={(e) => handleRuleChange(rule.id, parseInt(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <span className="text-xs text-[#4d4d4d]">{rule.max}</span>
              </div>
            </div>
          ))}
          
          <div className="flex justify-between pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={handleReset}
              className="flex items-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset to Defaults</span>
            </Button>
            
            <Button 
              onClick={handleSave}
              disabled={!hasChanges}
              className="bg-[#002b5c] hover:bg-[#001a3d] flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Rules</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessRulesPanel;
