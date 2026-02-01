'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ExitIntentModalProps {
  open: boolean;
  onClose: () => void;
  currentStep: string;
  onSaveProgress: (email: string) => void;
  onContinue: () => void;
}

const EARLY_STEPS = ['basics', 'inventory'];
const MID_STEPS = ['special-items', 'services', 'summary'];
const LATE_STEPS = ['contact', 'quotes'];

export function ExitIntentModal({
  open,
  onClose,
  currentStep,
  onSaveProgress,
  onContinue,
}: ExitIntentModalProps) {
  const [email, setEmail] = useState('');

  if (currentStep === 'basics') return null;

  // Early steps: save progress with email
  if (EARLY_STEPS.includes(currentStep)) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">
              Your move plan isn&apos;t saved yet
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500 mb-4">
            Enter your email to save your move plan and continue later. You&apos;ll keep your inventory and estimates.
          </p>
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={() => {
                if (email) onSaveProgress(email);
              }}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Save Progress
            </Button>
          </div>
          <button
            onClick={onClose}
            className="text-sm text-gray-400 hover:text-gray-600 mt-2 block mx-auto"
          >
            No thanks, I&apos;ll start over
          </button>
        </DialogContent>
      </Dialog>
    );
  }

  // Mid funnel: encouragement
  if (MID_STEPS.includes(currentStep)) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">You&apos;re almost done!</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500 mb-4">
            Your move plan is nearly complete. Just a few more details and you&apos;ll have movers competing for your business.
          </p>
          <Button
            onClick={onContinue}
            className="w-full bg-primary hover:bg-primary/90 text-white"
          >
            Continue Planning
          </Button>
          <button
            onClick={() => {
              onClose();
            }}
            className="text-sm text-gray-400 hover:text-gray-600 mt-1 block mx-auto"
          >
            Save and exit
          </button>
        </DialogContent>
      </Dialog>
    );
  }

  // Late funnel: quotes ready
  if (LATE_STEPS.includes(currentStep)) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">
              4 movers are ready to compete for your move
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500 mb-4">
            Just add your contact info to see their quotes. Your move plan is yours to keep regardless.
          </p>
          <Button
            onClick={onContinue}
            className="w-full bg-primary hover:bg-primary/90 text-white"
          >
            See My Quotes
          </Button>
          <button
            onClick={onClose}
            className="text-sm text-gray-400 hover:text-gray-600 mt-1 block mx-auto"
          >
            No thanks, I&apos;ll explore on my own
          </button>
        </DialogContent>
      </Dialog>
    );
  }

  return null;
}
