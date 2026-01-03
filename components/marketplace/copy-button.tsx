"use client";

import { useState } from "react";
import { Copy, Check, Terminal, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { copyToClipboard } from "@/lib/utils";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type CopyMode = "code" | "cli";

interface CopyButtonProps {
  /** The code/command to copy */
  code: string;
  /** The CLI command (for CLI mode) */
  cliCommand?: string;
  /** Copy mode: "code" for source code, "cli" for CLI command */
  mode?: CopyMode;
  /** Whether the button is disabled (e.g., for Pro-only features) */
  disabled?: boolean;
  /** Whether this is a Pro-only feature */
  isProOnly?: boolean;
  /** User's subscription tier */
  userTier?: "free" | "pro";
  /** Callback when copy succeeds */
  onCopy?: () => void;
  /** Optional className */
  className?: string;
}

/**
 * CopyButton Component
 *
 * A button that copies code or CLI commands to clipboard
 * with visual feedback and toast notifications.
 */
export function CopyButton({
  code,
  cliCommand,
  mode = "code",
  disabled = false,
  isProOnly = false,
  userTier = "free",
  onCopy,
  className,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  // Check if user can use this feature
  const isLocked = isProOnly && userTier === "free";
  const isDisabled = disabled || isLocked;

  const handleCopy = async () => {
    if (isDisabled) {
      if (isLocked) {
        toast.error("Upgrade to Pro to use CLI commands", {
          description: "Pro members get access to the LaufBlocks CLI.",
          action: {
            label: "Upgrade",
            onClick: () => {
              // Navigate to pricing
              window.location.href = "/pricing";
            },
          },
        });
      }
      return;
    }

    const textToCopy = mode === "cli" && cliCommand ? cliCommand : code;

    const success = await copyToClipboard(textToCopy);

    if (success) {
      setCopied(true);
      toast.success(
        mode === "cli" ? "CLI command copied!" : "Code copied to clipboard!"
      );
      onCopy?.();

      // Reset after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error("Failed to copy", {
        description: "Please try again or copy manually.",
      });
    }
  };

  const Icon = copied
    ? Check
    : isLocked
    ? Lock
    : mode === "cli"
    ? Terminal
    : Copy;

  const label = copied
    ? "Copied!"
    : isLocked
    ? "Pro Only"
    : mode === "cli"
    ? "Copy CLI"
    : "Copy Code";

  return (
    <Button
      variant={copied ? "default" : "outline"}
      size="sm"
      onClick={handleCopy}
      disabled={isDisabled && !isLocked}
      className={cn(
        "gap-2 transition-all",
        copied && "bg-green-600 hover:bg-green-700 text-white border-green-600",
        isLocked && "opacity-70",
        className
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </Button>
  );
}

/**
 * Inline Copy Button - smaller, icon-only version
 */
interface InlineCopyButtonProps {
  code: string;
  className?: string;
}

export function InlineCopyButton({ code, className }: InlineCopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(code);

    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "inline-flex items-center justify-center rounded-md p-1.5",
        "text-muted-foreground hover:text-foreground hover:bg-muted/50",
        "transition-colors focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-ring focus-visible:ring-offset-2",
        copied && "text-green-600",
        className
      )}
      title={copied ? "Copied!" : "Copy to clipboard"}
    >
      {copied ? (
        <Check className="h-4 w-4" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </button>
  );
}

/**
 * Copy Buttons Group - shows both code and CLI copy options
 */
interface CopyButtonsGroupProps {
  code: string;
  cliCommand: string;
  userTier?: "free" | "pro";
  onCopyCode?: () => void;
  onCopyCli?: () => void;
  className?: string;
}

export function CopyButtonsGroup({
  code,
  cliCommand,
  userTier = "free",
  onCopyCode,
  onCopyCli,
  className,
}: CopyButtonsGroupProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <CopyButton
        code={code}
        mode="code"
        onCopy={onCopyCode}
      />
      <CopyButton
        code={code}
        cliCommand={cliCommand}
        mode="cli"
        isProOnly
        userTier={userTier}
        onCopy={onCopyCli}
      />
    </div>
  );
}
