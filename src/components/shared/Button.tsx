import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  href?: string;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-primary text-white hover:bg-primary/90 active:bg-primary/85",
  secondary:
    "bg-transparent text-primary border-[1.5px] border-primary hover:bg-primary/5 active:bg-primary/10",
  outline:
    "bg-transparent text-foreground border-[1.5px] border-border hover:bg-muted active:bg-muted/80",
  ghost: "bg-transparent text-secondary hover:bg-muted active:bg-muted/80",
};

const sizeStyles: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "py-2 px-4 text-sm rounded-sm",
  default: "py-3 px-6 text-base rounded-md",
  lg: "py-4 px-8 text-base rounded-md",
};

export default function Button({
  variant = "primary",
  size = "default",
  href,
  children,
  className,
  ...rest
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center font-body font-medium",
    "transition-all duration-150 ease-in-out",
    "hover:scale-[1.02] active:scale-[0.98]",
    "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
    "disabled:opacity-50 disabled:pointer-events-none",
    variantStyles[variant],
    sizeStyles[size],
    className,
  );

  if (href) {
    // When rendering as an anchor, strip button-specific attributes and
    // cast remaining shared HTML attributes to anchor-compatible types.
    const {
      type: _type,
      disabled: _disabled,
      form: _form,
      formAction: _formAction,
      formEncType: _formEncType,
      formMethod: _formMethod,
      formNoValidate: _formNoValidate,
      formTarget: _formTarget,
      ...anchorSafeProps
    } = rest as Record<string, unknown>;

    return (
      <a
        href={href}
        className={classes}
        {...(anchorSafeProps as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
