
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface JobSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (jobData: JobData) => void;
}

export interface JobData {
  title: string;
  location: string;
  remote: boolean;
  skills: string[];
  summary: string;
}

const commonSkills = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'SQL', 
  'MongoDB', 'PostgreSQL', 'AWS', 'Docker', 'Kubernetes', 'Git', 'HTML/CSS',
  'Redux', 'Express.js', 'Spring Boot', 'Django', 'Flask', 'Vue.js', 'Angular'
];

const JobSetupModal = ({ isOpen, onClose, onSubmit }: JobSetupModalProps) => {
  const [formData, setFormData] = useState<JobData>({
    title: '',
    location: '',
    remote: false,
    skills: [],
    summary: ''
  });

  const handleSkillAdd = (skill: string) => {
    if (!formData.skills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
  };

  const handleSkillRemove = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.location && formData.skills.length > 0) {
      onSubmit(formData);
      onClose();
      // Reset form
      setFormData({
        title: '',
        location: '',
        remote: false,
        skills: [],
        summary: ''
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#002b5c]">Setup Job Requirements</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title">Job Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Backend Developer"
              required
            />
          </div>

          <div>
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="e.g., Pune"
              required
            />
          </div>

          <div>
            <Label>Remote Option</Label>
            <Select 
              value={formData.remote ? 'yes' : 'no'} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, remote: value === 'yes' }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes - Remote Work Allowed</SelectItem>
                <SelectItem value="no">No - On-site Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Required Skills *</Label>
            <Select onValueChange={handleSkillAdd}>
              <SelectTrigger>
                <SelectValue placeholder="Select skills..." />
              </SelectTrigger>
              <SelectContent>
                {commonSkills.map(skill => (
                  <SelectItem key={skill} value={skill}>
                    {skill}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {formData.skills.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.skills.map(skill => (
                  <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                    {skill}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => handleSkillRemove(skill)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="summary">Brief Job Summary</Label>
            <Textarea
              id="summary"
              value={formData.summary}
              onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
              placeholder="Brief description of the role and responsibilities..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-[#002b5c] hover:bg-[#001a3d]"
              disabled={!formData.title || !formData.location || formData.skills.length === 0}
            >
              Start Recruitment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default JobSetupModal;
