import { useState } from 'react';
import { useClerk } from '@clerk/react-router';
import { Lock, Shield, Trash2, ExternalLink } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '~/components/ui/alert-dialog';

interface AccountTabProps {
  user: {
    firstName?: string | null;
    lastName?: string | null;
    imageUrl?: string;
    emailAddresses: Array<{ emailAddress: string }>;
  } | null | undefined;
  isLoaded: boolean;
}

function Row({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4 py-5 first:pt-0 last:pb-0 border-b border-foreground/10 last:border-0">
      <div className="shrink-0 h-10 w-10 border-2 border-foreground bg-[color:var(--cream-100)] flex items-center justify-center">
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-display italic font-medium text-foreground text-[17px] leading-tight mb-0.5">
          {title}
        </div>
        <div className="text-sm text-muted-foreground leading-relaxed">{description}</div>
      </div>
      <div className="shrink-0">{action}</div>
    </div>
  );
}

export function AccountTab({ user, isLoaded }: AccountTabProps) {
  const { openUserProfile, signOut } = useClerk();
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!isLoaded || !user) {
    return <div className="text-sm text-muted-foreground italic">Loading account…</div>;
  }

  const email = user.emailAddresses[0]?.emailAddress ?? '';
  const fullName =
    [user.firstName, user.lastName].filter(Boolean).join(' ') || email;
  const initials = (
    (user.firstName?.[0] ?? '') + (user.lastName?.[0] ?? '')
  ).toUpperCase() || '?';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5">

      {/* Identity card + rows */}
      <div
        className="bg-card border-[2.5px] border-foreground p-6 sm:p-8"
        style={{ boxShadow: '4px 4px 0 0 var(--cocoa-900)' }}
      >
        <div className="flex items-center gap-5 pb-6 mb-2 border-b-2 border-foreground/10">
          <div
            className="h-20 w-20 rounded-full border-[3px] border-foreground bg-cover bg-center flex items-center justify-center font-display italic font-bold text-2xl text-foreground"
            style={{
              background: user.imageUrl
                ? `url(${user.imageUrl}) center/cover`
                : 'linear-gradient(135deg, var(--butter-500), var(--terracotta-500))',
            }}
          >
            {!user.imageUrl && initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-display italic font-medium text-foreground text-2xl leading-tight">
              {fullName}
            </div>
            <div className="text-sm text-muted-foreground mt-0.5 break-all">{email}</div>
          </div>
          <button
            type="button"
            onClick={() => openUserProfile()}
            className="shrink-0 inline-flex items-center gap-2 px-3.5 py-2 bg-card text-foreground border-2 border-foreground text-[13px] font-semibold cursor-pointer"
            style={{ boxShadow: '2px 2px 0 0 var(--cocoa-900)' }}
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Edit profile
          </button>
        </div>

        <Row
          icon={Lock}
          title="Password"
          description="Change your password or set up passkeys via the account profile."
          action={
            <button
              type="button"
              onClick={() => openUserProfile()}
              className="px-3.5 py-2 bg-card text-foreground border-2 border-foreground text-[13px] font-semibold cursor-pointer"
              style={{ boxShadow: '2px 2px 0 0 var(--cocoa-900)' }}
            >
              Manage
            </button>
          }
        />

        <Row
          icon={Shield}
          title="Two-factor authentication"
          description="Add an authenticator app or SMS as a second sign-in factor."
          action={
            <button
              type="button"
              onClick={() => openUserProfile()}
              className="px-3.5 py-2 bg-card text-foreground border-2 border-foreground text-[13px] font-semibold cursor-pointer"
              style={{ boxShadow: '2px 2px 0 0 var(--cocoa-900)' }}
            >
              Manage
            </button>
          }
        />
      </div>

      {/* Danger card on the right */}
      <div className="space-y-5">
        <div
          className="bg-[color:var(--cream-100)] border-[2.5px] border-foreground p-6"
          style={{ boxShadow: '4px 4px 0 0 var(--cocoa-900)' }}
        >
          <h3 className="font-display italic font-medium text-[22px] leading-none text-foreground mb-2">
            Sign out
          </h3>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            Sign out of oneclick·art on this device. You can sign back in any time.
          </p>
          <button
            type="button"
            onClick={() => signOut({ redirectUrl: '/' })}
            className="w-full px-4 py-2.5 bg-card text-foreground border-2 border-foreground text-[13px] font-semibold cursor-pointer"
            style={{ boxShadow: '2px 2px 0 0 var(--cocoa-900)' }}
          >
            Sign out
          </button>
        </div>

        <div
          className="bg-card border-[2.5px] border-foreground p-6"
          style={{ boxShadow: '4px 4px 0 0 var(--tomato-500)' }}
        >
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] font-bold text-[color:var(--tomato-500)] mb-2.5">
            <Trash2 className="h-3.5 w-3.5" />
            Danger zone
          </div>
          <h3 className="font-display italic font-medium text-[20px] leading-tight text-foreground mb-2">
            Delete account
          </h3>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            Permanently removes your account, all creations, and any leftover credits.
            This action can't be undone.
          </p>
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="w-full px-4 py-2.5 bg-card text-[color:var(--tomato-500)] border-2 border-foreground text-[13px] font-bold cursor-pointer hover:bg-[color:var(--tomato-500)] hover:text-white"
            style={{ boxShadow: '2px 2px 0 0 var(--cocoa-900)' }}
          >
            Delete my account
          </button>
        </div>
      </div>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete your account?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes your oneclick·art account, all creations, and any
              leftover credits. There's no undo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep my account</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                // Account deletion is handled by Clerk's user.delete() — open the
                // user profile so the user can confirm there. Wire this to a
                // server action when self-serve deletion is supported.
                setConfirmDelete(false);
                openUserProfile();
              }}
              className="bg-[color:var(--tomato-500)] text-white hover:bg-[color:var(--tomato-500)]/90"
            >
              Continue to delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
