import Link from "next/link";
import { cn } from "@/lib/cn";

const styles = {
  primary:
    "bg-yellow text-aubergine-deep hover:bg-yellow-deep focus-visible:outline-yellow",
  secondary:
    "bg-aubergine text-cream hover:bg-aubergine-soft",
  ghost:
    "bg-transparent text-aubergine border border-line hover:bg-cream-dark",
  mint: "bg-mint text-paper hover:brightness-95",
};

type Props = {
  href?: string;
  children: React.ReactNode;
  variant?: keyof typeof styles;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
};

export function Button({
  href,
  children,
  variant = "primary",
  className,
  onClick,
  type = "button",
  disabled,
}: Props) {
  const cls = cn(
    "inline-flex min-h-11 items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold tracking-tight transition",
    styles[variant],
    disabled && "pointer-events-none opacity-50",
    className,
  );
  if (href) {
    return (
      <Link href={href} className={cls} onClick={onClick}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} className={cls} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
