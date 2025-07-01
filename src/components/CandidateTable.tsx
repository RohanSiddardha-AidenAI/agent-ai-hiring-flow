
import { useState, useMemo } from 'react';
import { Search, Filter, Download, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockCandidates } from '@/data/candidates';

const CandidateTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [scoreFilter, setScoreFilter] = useState('all');
  const [sortBy, setSortBy] = useState('score');

  const filteredAndSortedCandidates = useMemo(() => {
    let filtered = mockCandidates.filter(candidate => {
      const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           candidate.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'all' || candidate.role_applied === roleFilter;
      const matchesScore = scoreFilter === 'all' || 
                          (scoreFilter === 'high' && candidate.screening_score >= 85) ||
                          (scoreFilter === 'medium' && candidate.screening_score >= 70 && candidate.screening_score < 85) ||
                          (scoreFilter === 'low' && candidate.screening_score < 70);
      
      return matchesSearch && matchesRole && matchesScore;
    });

    // Sort candidates
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return b.screening_score - a.screening_score;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'experience':
          return parseInt(b.experience) - parseInt(a.experience);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, roleFilter, scoreFilter, sortBy]);

  const uniqueRoles = [...new Set(mockCandidates.map(c => c.role_applied))];

  const getScoreBadge = (score: number) => {
    if (score >= 85) return <Badge className="bg-green-100 text-green-800">High</Badge>;
    if (score >= 70) return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
    return <Badge className="bg-red-100 text-red-800">Low</Badge>;
  };

  const getStatusBadge = (score: number) => {
    if (score >= 85) return <Badge className="bg-blue-100 text-blue-800">Shortlisted</Badge>;
    if (score >= 70) return <Badge className="bg-orange-100 text-orange-800">Under Review</Badge>;
    return <Badge className="bg-gray-100 text-gray-800">Rejected</Badge>;
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Users className="w-6 h-6 text-[#4da6ff]" />
            <div>
              <CardTitle className="text-[#002b5c]">Candidate Pipeline</CardTitle>
              <p className="text-sm text-[#4d4d4d]">
                Showing {filteredAndSortedCandidates.length} of {mockCandidates.length} candidates
              </p>
            </div>
          </div>
          
          <Button variant="outline" className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search candidates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4da6ff]"
              />
            </div>
          </div>
          
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {uniqueRoles.map(role => (
                <SelectItem key={role} value={role}>{role}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={scoreFilter} onValueChange={setScoreFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by Score" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Scores</SelectItem>
              <SelectItem value="high">High (85+)</SelectItem>
              <SelectItem value="medium">Medium (70-84)</SelectItem>
              <SelectItem value="low">Low (<70)</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="score">Score (High to Low)</SelectItem>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="experience">Experience</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-[#002b5c]">Candidate</TableHead>
                <TableHead className="font-semibold text-[#002b5c]">Role</TableHead>
                <TableHead className="font-semibold text-[#002b5c]">Skills</TableHead>
                <TableHead className="font-semibold text-[#002b5c]">Experience</TableHead>
                <TableHead className="font-semibold text-[#002b5c]">Score</TableHead>
                <TableHead className="font-semibold text-[#002b5c]">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedCandidates.slice(0, 20).map((candidate, index) => (
                <TableRow key={index} className="hover:bg-gray-50">
                  <TableCell>
                    <div>
                      <p className="font-medium text-[#002b5c]">{candidate.name}</p>
                      <p className="text-sm text-[#4d4d4d]">{candidate.email}</p>
                      <p className="text-xs text-[#4d4d4d]">{candidate.location}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium">{candidate.role_applied}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {candidate.skills.slice(0, 3).map((skill, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {candidate.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{candidate.skills.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{candidate.experience}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-[#002b5c]">{candidate.screening_score}</span>
                      {getScoreBadge(candidate.screening_score)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(candidate.screening_score)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {filteredAndSortedCandidates.length === 0 && (
          <div className="text-center py-8 text-[#4d4d4d]">
            <Filter className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No candidates match your current filters.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CandidateTable;
