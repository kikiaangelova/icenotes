import React, { useState } from 'react';
import { useJournal } from '@/context/JournalContext';
import { generateTrainingSummaryPDF } from '@/utils/pdfExport';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { FileDown, Download, FileText, Target, Feather, CalendarCheck } from 'lucide-react';
import { toast } from 'sonner';

export const ExportButton: React.FC = () => {
  const { profile, entries, trainingSessions, jumpAttempts, weeklyGoals } = useJournal();
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [includeGoals, setIncludeGoals] = useState(true);
  const [includeTraining, setIncludeTraining] = useState(true);
  const [includeJumps, setIncludeJumps] = useState(true);
  const [includeJournal, setIncludeJournal] = useState(true);

  const handleExport = async () => {
    if (!profile) {
      toast.error('No profile found');
      return;
    }

    setIsExporting(true);

    try {
      // Filter data based on selections
      const exportData = {
        profile,
        entries: includeJournal ? entries : [],
        trainingSessions: includeTraining ? trainingSessions : [],
        jumpAttempts: includeJumps ? jumpAttempts : [],
        weeklyGoals: includeGoals ? weeklyGoals : [],
      };

      generateTrainingSummaryPDF(exportData);
      toast.success('PDF exported successfully!');
      setIsOpen(false);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export PDF');
    } finally {
      setIsExporting(false);
    }
  };

  const hasData = entries.length > 0 || trainingSessions.length > 0 || jumpAttempts.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <FileDown className="w-4 h-4" />
          Export PDF
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Export Training Summary
          </DialogTitle>
          <DialogDescription>
            Generate a PDF report of your training data to save or share with your coach.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            Select what to include in your report:
          </p>

          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors">
              <Checkbox
                checked={includeGoals}
                onCheckedChange={(checked) => setIncludeGoals(checked as boolean)}
              />
              <CalendarCheck className="w-4 h-4 text-primary" />
              <div className="flex-1">
                <span className="font-medium">Weekly Goals</span>
                <p className="text-xs text-muted-foreground">Current week targets and progress</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors">
              <Checkbox
                checked={includeTraining}
                onCheckedChange={(checked) => setIncludeTraining(checked as boolean)}
              />
              <FileText className="w-4 h-4 text-on-ice" />
              <div className="flex-1">
                <span className="font-medium">Training Sessions</span>
                <p className="text-xs text-muted-foreground">{trainingSessions.length} sessions logged</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors">
              <Checkbox
                checked={includeJumps}
                onCheckedChange={(checked) => setIncludeJumps(checked as boolean)}
              />
              <Target className="w-4 h-4 text-off-ice" />
              <div className="flex-1">
                <span className="font-medium">Jump Progress</span>
                <p className="text-xs text-muted-foreground">{jumpAttempts.length} attempts tracked</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors">
              <Checkbox
                checked={includeJournal}
                onCheckedChange={(checked) => setIncludeJournal(checked as boolean)}
              />
              <Feather className="w-4 h-4 text-mental" />
              <div className="flex-1">
                <span className="font-medium">Journal Reflections</span>
                <p className="text-xs text-muted-foreground">{entries.length} entries written</p>
              </div>
            </label>
          </div>

          {!hasData && (
            <Card className="bg-muted/30 border-dashed">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Start logging your training to generate a report!
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
            Cancel
          </Button>
          <Button 
            onClick={handleExport} 
            disabled={isExporting || (!includeGoals && !includeTraining && !includeJumps && !includeJournal)}
            className="flex-1 gap-2"
          >
            {isExporting ? (
              <>Generating...</>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Download PDF
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};