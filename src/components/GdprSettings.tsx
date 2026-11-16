import React, { useId, useState } from 'react';
import { Download, FileJson, Loader2, ShieldCheck, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { deliverFile, personalDataBlob } from '@/lib/gdprDownload';

const COPY = {
  bg: {
    title: 'Твоите данни',
    intro: 'Можеш да изтеглиш копие на личните си данни или да изтриеш профила си. AI разговорите не се пазят в базата на профила.',
    export: 'Изтегли моите данни',
    preparing: 'Подготвяме данните',
    ready: 'Данните са готови. Изтегли JSON файла на устройството си.',
    download: 'Изтегли JSON файла',
    exportError: 'Данните не можаха да се подготвят. Опитай отново.',
    delete: 'Изтрий моя профил',
    dialogTitle: 'Изтриването е необратимо',
    dialogBody: 'Профилът, тренировките, целите, бележките, публикациите, коментарите и всички други свързани лични данни ще бъдат изтрити трайно. Родителските връзки също ще бъдат прекъснати. Това действие не може да бъде отменено.',
    confirmationLabel: 'Въведи имейла на профила за потвърждение',
    cancel: 'Отказ',
    confirm: 'Изтрий трайно',
    deleting: 'Изтриваме профила',
    deleteError: 'Профилът не беше изтрит. Опитай отново.',
  },
  en: {
    title: 'Your data',
    intro: 'You can download a copy of your personal data or delete your account. AI conversations are not stored in the account database.',
    export: 'Download my data',
    preparing: 'Preparing your data',
    ready: 'Your data is ready. Download the JSON file to your device.',
    download: 'Download JSON file',
    exportError: 'Your data could not be prepared. Please try again.',
    delete: 'Delete my account',
    dialogTitle: 'Deletion is irreversible',
    dialogBody: 'Your profile, training records, goals, notes, posts, comments and all other linked personal data will be permanently deleted. Parent links will also be removed. This action cannot be undone.',
    confirmationLabel: 'Enter your account email to confirm',
    cancel: 'Cancel',
    confirm: 'Delete permanently',
    deleting: 'Deleting your account',
    deleteError: 'Your account was not deleted. Please try again.',
  },
} as const;

type ExportResponse = { fileName?: string; data?: unknown };

export const GdprSettings: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const { toast } = useToast();
  const copy = COPY[language];
  const inputId = useId();
  const [exporting, setExporting] = useState(false);
  const [prepared, setPrepared] = useState<{ blob: Blob; fileName: string } | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [confirmation, setConfirmation] = useState('');
  const [deleting, setDeleting] = useState(false);
  const accountEmail = user?.email?.trim().toLowerCase() ?? '';
  const confirmed = Boolean(accountEmail) && confirmation.trim().toLowerCase() === accountEmail;

  const prepareExport = async () => {
    if (exporting) return;
    setExporting(true);
    setPrepared(null);
    try {
      const { data, error } = await supabase.functions.invoke('account-privacy', {
        body: { action: 'export', locale: language },
      });
      const result = data as ExportResponse | null;
      if (error || !result?.data || !result.fileName) throw new Error('export_failed');
      setPrepared({ blob: personalDataBlob(result.data), fileName: result.fileName });
    } catch {
      toast({ title: copy.exportError, variant: 'destructive' });
    } finally {
      setExporting(false);
    }
  };

  const deleteAccount = async () => {
    if (!confirmed || deleting) return;
    setDeleting(true);
    try {
      const { data, error } = await supabase.functions.invoke('account-privacy', {
        body: { action: 'delete', confirmation },
      });
      if (error || (data as { status?: string } | null)?.status !== 'deleted') throw new Error('delete_failed');
      await supabase.auth.signOut({ scope: 'local' });
      localStorage.clear();
      sessionStorage.clear();
      window.location.replace('/');
    } catch {
      setDeleting(false);
      toast({ title: copy.deleteError, variant: 'destructive' });
    }
  };

  return (
    <section className="space-y-4 rounded-[16px] bg-card p-4 text-left shadow-sm" aria-labelledby={`${inputId}-title`}>
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-secondary">
          <ShieldCheck className="h-5 w-5 text-primary" />
        </div>
        <div className="space-y-1">
          <h3 id={`${inputId}-title`} className="text-[15px] font-semibold text-foreground">{copy.title}</h3>
          <p className="text-[13px] leading-relaxed text-muted-foreground">{copy.intro}</p>
        </div>
      </div>

      <Button type="button" variant="outline" className="h-12 w-full gap-2" onClick={prepareExport} disabled={exporting || deleting}>
        {exporting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />}
        {exporting ? copy.preparing : copy.export}
      </Button>

      {prepared && (
        <div className="space-y-3 rounded-[16px] bg-secondary p-4">
          <p className="flex items-start gap-2 text-[13px] leading-relaxed text-foreground">
            <FileJson className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            {copy.ready}
          </p>
          <Button type="button" className="h-12 w-full gap-2" onClick={() => deliverFile(prepared.blob, prepared.fileName)}>
            <Download className="h-5 w-5" />
            {copy.download}
          </Button>
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        className="h-12 w-full gap-2 border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
        onClick={() => setDeleteOpen(true)}
        disabled={deleting}
      >
        <Trash2 className="h-5 w-5" />
        {copy.delete}
      </Button>

      <Dialog open={deleteOpen} onOpenChange={(open) => { if (!deleting) { setDeleteOpen(open); if (!open) setConfirmation(''); } }}>
        <DialogContent className="max-w-[calc(100vw-2rem)] rounded-[16px] sm:max-w-md">
          <DialogHeader className="space-y-3 text-left">
            <DialogTitle className="text-xl">{copy.dialogTitle}</DialogTitle>
            <DialogDescription className="text-[15px] leading-relaxed">{copy.dialogBody}</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor={inputId}>{copy.confirmationLabel}</Label>
            <Input
              id={inputId}
              type="email"
              value={confirmation}
              onChange={event => setConfirmation(event.target.value)}
              placeholder={user?.email ?? ''}
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              className="h-12"
              disabled={deleting}
            />
          </div>
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button type="button" variant="outline" className="h-12 w-full sm:w-auto" onClick={() => setDeleteOpen(false)} disabled={deleting}>
              {copy.cancel}
            </Button>
            <Button type="button" variant="destructive" className="h-12 w-full gap-2 sm:w-auto" onClick={deleteAccount} disabled={!confirmed || deleting}>
              {deleting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Trash2 className="h-5 w-5" />}
              {deleting ? copy.deleting : copy.confirm}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};
