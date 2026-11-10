import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { FoPage, FoSection } from "@/site/parts";
import { photos, photoSrc } from "@/lib/photography";

export default function Photography() {
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (d: number) => setOpen((i) => (i === null ? i : (i + d + photos.length) % photos.length)),
    [],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close, step]);

  const current = open === null ? null : photos[open];

  return (
    <FoPage
      eyebrow="Photography"
      title={<>Away from the <em>keyboard</em></>}
      lede="Shot in Bangladesh on a Samsung Galaxy A7 (2016): streets, food, light and the small things that caught my eye."
    >
      <FoSection tight>
        <ul className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {photos.map((p, i) => (
            <li key={p.slug} className="mb-4 break-inside-avoid">
              <figure>
                <button
                  type="button"
                  onClick={() => setOpen(i)}
                  className="block w-full rounded-[10px] border-0 bg-[#f6f4ef] p-[10px] shadow-[0_6px_22px_-8px_rgba(0,0,0,0.45)] ring-1 ring-black/10 transition-shadow hover:shadow-[0_10px_30px_-8px_rgba(0,0,0,0.55)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent))]"
                  aria-label={`Open ${p.title}`}
                >
                  <img
                    src={photoSrc(p, true)}
                    alt={p.title}
                    width={p.w}
                    height={p.h}
                    loading="lazy"
                    decoding="async"
                    className="block h-auto w-full rounded-[3px]"
                  />
                </button>
                <figcaption className="fo-small fo-muted mt-2 flex items-baseline justify-between gap-3">
                  <span className="fo-ink">{p.title}</span>
                  {p.year && <span className="tabular-nums">{p.year}</span>}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </FoSection>

      {current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={current.title}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={close}
        >
          <figure className="relative flex max-h-full max-w-6xl flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={photoSrc(current)}
              alt={current.title}
              className="max-h-[80vh] w-auto max-w-full rounded-[3px] border-[10px] border-[#f6f4ef] object-contain shadow-2xl"
            />
            <figcaption className="mt-3 text-sm text-white/80">
              {current.title}
              {current.year ? ` · ${current.year}` : ""}
            </figcaption>
          </figure>
          <button type="button" onClick={close} aria-label="Close" className="absolute right-4 top-4 rounded-full p-2 text-white/80 hover:text-white">
            <X size={26} />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); step(-1); }}
            aria-label="Previous photo"
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-white/70 hover:text-white sm:left-4"
          >
            <ChevronLeft size={32} />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); step(1); }}
            aria-label="Next photo"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-white/70 hover:text-white sm:right-4"
          >
            <ChevronRight size={32} />
          </button>
        </div>
      )}
    </FoPage>
  );
}
