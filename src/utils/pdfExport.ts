import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { 
  JournalEntry, 
  TrainingSession, 
  JumpAttempt, 
  WeeklyGoal, 
  SkaterProfile,
  JUMP_TYPES,
  JUMP_LEVELS,
  FEELING_OPTIONS
} from '@/types/journal';

interface ExportData {
  profile: SkaterProfile;
  entries: JournalEntry[];
  trainingSessions: TrainingSession[];
  jumpAttempts: JumpAttempt[];
  weeklyGoals: WeeklyGoal[];
}

const parseDate = (date: Date | string): Date => {
  if (date instanceof Date) return date;
  return new Date(date);
};

export const generateTrainingSummaryPDF = (data: ExportData): void => {
  const { profile, entries, trainingSessions, jumpAttempts, weeklyGoals } = data;
  
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPos = 20;

  // Helper function to add new page if needed
  const checkNewPage = (requiredSpace: number = 30) => {
    if (yPos + requiredSpace > doc.internal.pageSize.getHeight() - 20) {
      doc.addPage();
      yPos = 20;
    }
  };

  // Title
  doc.setFontSize(24);
  doc.setTextColor(59, 130, 246); // Blue color
  doc.text('Ice Journal', pageWidth / 2, yPos, { align: 'center' });
  yPos += 10;

  doc.setFontSize(14);
  doc.setTextColor(100, 100, 100);
  doc.text('Training Summary Report', pageWidth / 2, yPos, { align: 'center' });
  yPos += 15;

  // Profile Section
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Skater Profile', 14, yPos);
  yPos += 8;

  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  doc.text(`Name: ${profile.name}`, 14, yPos);
  yPos += 6;
  doc.text(`Level: ${profile.selfLevel.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}`, 14, yPos);
  yPos += 6;
  doc.text(`Current Focus: ${profile.mainFocus}`, 14, yPos);
  yPos += 6;
  doc.text(`Report Generated: ${format(new Date(), 'MMMM d, yyyy')}`, 14, yPos);
  yPos += 15;

  // Current Week Goals
  const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const currentGoal = weeklyGoals.find(g => {
    const goalWeekStart = parseDate(g.weekStart);
    return format(goalWeekStart, 'yyyy-MM-dd') === format(currentWeekStart, 'yyyy-MM-dd');
  });

  if (currentGoal) {
    checkNewPage(40);
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('This Week\'s Goals', 14, yPos);
    yPos += 8;

    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    doc.text(`On-Ice Hours Target: ${currentGoal.onIceHoursTarget}h`, 14, yPos);
    yPos += 6;
    doc.text(`Off-Ice Sessions Target: ${currentGoal.offIceSessionsTarget}`, 14, yPos);
    yPos += 6;

    if (currentGoal.jumpTargets.length > 0) {
      doc.text('Jump Targets:', 14, yPos);
      yPos += 6;
      currentGoal.jumpTargets.forEach(jt => {
        const jumpName = JUMP_TYPES.find(j => j.type === jt.jumpType)?.name || jt.jumpType;
        const levelName = JUMP_LEVELS.find(l => l.level === jt.level)?.name || jt.level;
        doc.text(`  • ${levelName} ${jumpName}: ${jt.targetAttempts} attempts, ${jt.targetLanded} landed`, 18, yPos);
        yPos += 5;
      });
    }
    yPos += 10;
  }

  // Training Sessions Summary
  checkNewPage(50);
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Training Sessions', 14, yPos);
  yPos += 10;

  if (trainingSessions.length > 0) {
    // Group by type
    const onIceSessions = trainingSessions.filter(s => s.type === 'on-ice');
    const offIceSessions = trainingSessions.filter(s => s.type === 'off-ice');
    
    const totalOnIceMinutes = onIceSessions.reduce((sum, s) => sum + s.totalDuration, 0);
    const totalOffIceMinutes = offIceSessions.reduce((sum, s) => sum + s.totalDuration, 0);

    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    doc.text(`Total On-Ice Sessions: ${onIceSessions.length} (${(totalOnIceMinutes / 60).toFixed(1)} hours)`, 14, yPos);
    yPos += 6;
    doc.text(`Total Off-Ice Sessions: ${offIceSessions.length} (${(totalOffIceMinutes / 60).toFixed(1)} hours)`, 14, yPos);
    yPos += 10;

    // Recent sessions table
    const recentSessions = [...trainingSessions]
      .sort((a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime())
      .slice(0, 10);

    if (recentSessions.length > 0) {
      checkNewPage(60);
      doc.setFontSize(12);
      doc.text('Recent Sessions:', 14, yPos);
      yPos += 5;

      autoTable(doc, {
        startY: yPos,
        head: [['Date', 'Type', 'Duration', 'Activities', 'Feeling']],
        body: recentSessions.map(s => [
          format(parseDate(s.date), 'MMM d, yyyy'),
          s.type === 'on-ice' ? 'On-Ice' : 'Off-Ice',
          `${s.totalDuration} min`,
          s.activities.filter(a => a.completed).map(a => a.name).join(', ').substring(0, 30) + (s.activities.filter(a => a.completed).map(a => a.name).join(', ').length > 30 ? '...' : ''),
          s.feeling || '-'
        ]),
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246] },
        styles: { fontSize: 9 },
        margin: { left: 14, right: 14 },
      });
      
      yPos = (doc as any).lastAutoTable.finalY + 15;
    }
  } else {
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text('No training sessions logged yet.', 14, yPos);
    yPos += 15;
  }

  // Jump Attempts Summary
  checkNewPage(60);
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Jump Progress', 14, yPos);
  yPos += 10;

  if (jumpAttempts.length > 0) {
    // Group jumps by type and level
    const jumpStats: Record<string, { attempted: number; landed: number; avgQuality: number }> = {};
    
    jumpAttempts.forEach(j => {
      const key = `${j.level}-${j.jumpType}`;
      if (!jumpStats[key]) {
        jumpStats[key] = { attempted: 0, landed: 0, avgQuality: 0 };
      }
      jumpStats[key].attempted++;
      if (j.landed) jumpStats[key].landed++;
      jumpStats[key].avgQuality = ((jumpStats[key].avgQuality * (jumpStats[key].attempted - 1)) + j.quality) / jumpStats[key].attempted;
    });

    const jumpTableData = Object.entries(jumpStats).map(([key, stats]) => {
      const [level, ...typeParts] = key.split('-');
      const type = typeParts.join('-');
      const jumpName = JUMP_TYPES.find(j => j.type === type)?.name || type;
      const levelName = JUMP_LEVELS.find(l => l.level === level)?.name || level;
      const landingRate = stats.attempted > 0 ? ((stats.landed / stats.attempted) * 100).toFixed(0) : '0';
      
      return [
        `${levelName} ${jumpName}`,
        stats.attempted.toString(),
        stats.landed.toString(),
        `${landingRate}%`,
        stats.avgQuality.toFixed(1)
      ];
    });

    autoTable(doc, {
      startY: yPos,
      head: [['Jump', 'Attempts', 'Landed', 'Success Rate', 'Avg Quality']],
      body: jumpTableData,
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246] },
      styles: { fontSize: 10 },
      margin: { left: 14, right: 14 },
    });
    
    yPos = (doc as any).lastAutoTable.finalY + 15;
  } else {
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text('No jump attempts logged yet.', 14, yPos);
    yPos += 15;
  }

  // Journal Reflections
  checkNewPage(60);
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Recent Reflections', 14, yPos);
  yPos += 10;

  if (entries.length > 0) {
    const recentEntries = [...entries]
      .sort((a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime())
      .slice(0, 5);

    recentEntries.forEach(entry => {
      checkNewPage(40);
      
      const feelingLabel = FEELING_OPTIONS.find(f => f.value === entry.feeling)?.label || entry.feeling;
      
      doc.setFontSize(11);
      doc.setTextColor(59, 130, 246);
      doc.text(format(parseDate(entry.date), 'EEEE, MMMM d, yyyy'), 14, yPos);
      yPos += 6;
      
      doc.setTextColor(60, 60, 60);
      doc.setFontSize(10);
      doc.text(`Feeling: ${feelingLabel}`, 14, yPos);
      yPos += 5;
      
      // Worked on
      const workedOnLines = doc.splitTextToSize(`Worked on: ${entry.workedOn}`, pageWidth - 28);
      doc.text(workedOnLines, 14, yPos);
      yPos += workedOnLines.length * 4 + 2;
      
      // Small win
      if (entry.smallWin) {
        const winLines = doc.splitTextToSize(`Small win: ${entry.smallWin}`, pageWidth - 28);
        doc.text(winLines, 14, yPos);
        yPos += winLines.length * 4 + 2;
      }
      
      yPos += 8;
    });
  } else {
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text('No journal entries yet.', 14, yPos);
  }

  // Footer
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} of ${totalPages} • Generated by Ice Journal`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  // Save the PDF
  const fileName = `ice-journal-${profile.name.toLowerCase().replace(/\s+/g, '-')}-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
  doc.save(fileName);
};
