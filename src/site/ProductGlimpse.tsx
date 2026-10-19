import { ArrowUpRight } from "lucide-react";
import { product } from "@/lib/content";
import { FoHead, FoSection } from "./parts";

export function ProductCard() {
  return (
    <div className="fo-feature fo-product">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-3">
          <span className="fo-badge">Product</span>
          <span className="fo-meta">
            {product.role} · {product.year}
          </span>
        </div>
        <h3 className="fo-h2 fo-card-title mt-5">{product.name}</h3>
        <p className="fo-small fo-muted mt-1">{product.tagline}</p>
        <p className="fo-body mt-4 max-w-[52ch]">{product.summary}</p>
        <ul className="fo-checks mt-5">
          {product.points.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <ul className="fo-tags mt-6">
          {product.stack.map((t) => (
            <li key={t} className="fo-tag">{t}</li>
          ))}
        </ul>
        <a href={product.href} target="_blank" rel="noreferrer" className="fo-link mt-6 inline-flex items-center gap-1.5">
          Open TexBlocks <ArrowUpRight size={16} strokeWidth={1.8} aria-hidden />
        </a>
      </div>
      <a href={product.href} target="_blank" rel="noreferrer" className="fo-product-shot" aria-label="Open TexBlocks">
        <img src={product.image} alt="The TexBlocks editor with a resume and its live PDF preview" width={1600} height={915} loading="lazy" decoding="async" />
      </a>
    </div>
  );
}

export default function ProductGlimpse({ alt }: { alt?: boolean }) {
  return (
    <FoSection id="product" alt={alt}>
      <FoHead eyebrow="Product" title="Something I built on my own" lede="A tool I wanted as a researcher and an engineer, now open to everyone." />
      <ProductCard />
    </FoSection>
  );
}
