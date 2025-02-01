import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

export function useClipboard() {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        description: 'Code copied to clipboard!',
        duration: 2000,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (_err) {
      toast({
        variant: 'destructive',
        description: 'Failed to copy code to clipboard',
      });
    }
  };

  return {
    copied,
    copyToClipboard,
  };
}
