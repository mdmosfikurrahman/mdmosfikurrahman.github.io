import type { ComponentType } from "react";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { useCopy } from "./copy";

type IconProps = { size?: number | string; strokeWidth?: number | string; className?: string };

type Props = {
  href: string;
  label: string;
  Icon: ComponentType<IconProps>;
  copyText: string;
  copyWhat: string;
  note?: string;
  variant?: "primary" | "default";
  size?: "md" | "sm";
  block?: boolean;
};

// A contact channel as a split button: the left side opens it, the right side
// copies it. The address or URL itself is never printed on the page.
export default function Channel({
  href,
  label,
  Icon,
  copyText,
  copyWhat,
  note,
  variant = "default",
  size = "md",
  block,
}: Props) {
  const { copied, copy } = useCopy(copyText, copyWhat);
  const external = href.startsWith("http");
  const tiled = size === "md" && variant === "default";
  const cls = [
    "fo-split",
    variant === "primary" ? "fo-split--primary" : "",
    size === "sm" ? "fo-split--sm" : "",
    block ? "fo-split--block" : "",
  ].join(" ");

  return (
    <div className={cls}>
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        className="fo-split-main"
      >
        {tiled ? (
          <span className="fo-split-icon" aria-hidden>
            <Icon size={16} strokeWidth={1.8} />
          </span>
        ) : (
          <span className="shrink-0 inline-flex" aria-hidden>
            <Icon size={size === "sm" ? 15 : 17} strokeWidth={1.9} />
          </span>
        )}
        <span className="fo-split-text">
          <span className="fo-split-label">{label}</span>
          {note && <span className="fo-split-note">{note}</span>}
        </span>
        {external && <ArrowUpRight size={15} strokeWidth={1.8} className="fo-split-arrow" aria-hidden />}
      </a>
      <button
        type="button"
        onClick={copy}
        className="fo-split-copy"
        data-copied={copied ? "true" : "false"}
        aria-label={`Copy ${copyWhat.toLowerCase()}`}
        title={`Copy ${copyWhat.toLowerCase()}`}
      >
        {copied ? <Check size={16} strokeWidth={2.2} /> : <Copy size={15} strokeWidth={1.8} />}
      </button>
    </div>
  );
}
