import React, { useState } from 'react';
import { useAuth } from '@/api/queries/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { KeyRound, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

interface ChangePinModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Forced change (still on the default PIN): no way to dismiss until a new PIN is saved
  required?: boolean;
}

export const ChangePinModal: React.FC<ChangePinModalProps> = ({ isOpen, onClose, required = false }) => {
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPins, setShowPins] = useState(false);

  const { changePin } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNewPin = newPin.trim();

    if (!cleanNewPin || cleanNewPin.length < 4 || cleanNewPin.length > 6) {
      toast.error('New PIN must be 4 to 6 numeric digits.');
      return;
    }

    if (cleanNewPin !== confirmPin.trim()) {
      toast.error('New PIN and Confirm PIN do not match.');
      return;
    }

    changePin.mutate(
      {
        currentPin: currentPin.trim() || undefined,
        newPin: cleanNewPin,
      },
      {
        onSuccess: () => {
          setCurrentPin('');
          setNewPin('');
          setConfirmPin('');
          onClose();
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-sm w-full p-6 space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-lime-100 dark:bg-lime-950/50 text-[#84cc16]">
              <KeyRound className="w-5 h-5 text-emerald-600 dark:text-[#84cc16]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Change Login PIN
              </h2>
              <p className="text-[11px] text-slate-500">
                {required
                  ? 'You are using the default PIN. Please set your own PIN to continue.'
                  : 'Set a new 4 to 6-digit numeric login PIN'}
              </p>
            </div>
          </div>
          {!required && (
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 text-lg"
            >
              &times;
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
              Current PIN (Optional if resetting)
            </label>
            <div className="relative">
              <Input
                type={showPins ? 'text' : 'password'}
                maxLength={6}
                value={currentPin}
                onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="e.g. 123456"
                className="h-9 font-mono tracking-widest text-center"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
              New 6-Digit PIN *
            </label>
            <div className="relative">
              <Input
                type={showPins ? 'text' : 'password'}
                maxLength={6}
                required
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="e.g. 654321"
                className="h-9 font-mono tracking-widest text-center font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
              Confirm New PIN *
            </label>
            <div className="relative">
              <Input
                type={showPins ? 'text' : 'password'}
                maxLength={6}
                required
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Re-enter new PIN"
                className="h-9 font-mono tracking-widest text-center font-bold"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => setShowPins(!showPins)}
              className="text-[11px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
            >
              {showPins ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              {showPins ? 'Hide numbers' : 'Show numbers'}
            </button>
            <span className="text-[10px] text-slate-400">Numeric 4-6 digits</span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t">
            {!required && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                disabled={changePin.isPending}
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              size="sm"
              disabled={changePin.isPending || !newPin || !confirmPin}
              className="bg-[#183638] hover:bg-[#183638]/90 text-[#84cc16] font-bold"
            >
              {changePin.isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                  Updating...
                </>
              ) : (
                'Save New PIN'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePinModal;

