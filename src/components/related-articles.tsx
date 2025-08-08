import Link from "next/link"

type RelatedArticle = {
  title: string
  href: string
}

interface RelatedArticlesProps {
  title?: string
  articles: RelatedArticle[]
}

export function RelatedArticles(props: RelatedArticlesProps) {
  const { title = "Related reading", articles } = props

  if (!articles || articles.length === 0) return null

  return (
    <section aria-labelledby="related-reading-heading" className="mt-16">
      <div className="bg-white/80 backdrop-blur rounded-2xl border border-[#C1D8EE] shadow-sm p-6 md:p-8">
        <h2 id="related-reading-heading" className="text-2xl md:text-3xl font-semibold text-[#34465b] mb-4">
          {title}
        </h2>
        <p className="text-[#34465b]/80 mb-6">
          Explore more guidance on what dogs can and can&apos;t eat:
        </p>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <li key={a.href} className="group">
              <Link
                href={a.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 rounded-xl border border-[#C1D8EE] bg-white hover:bg-[#EEF7FD] transition-colors p-4"
              >
                <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#56EBFF]/20 text-[#34465b]">
                  {/* arrow */}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 17L17 7" stroke="#34465b" strokeWidth="2" strokeLinecap="round" />
                    <path d="M9 7H17V15" stroke="#34465b" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
                <span className="text-sm md:text-base font-medium text-[#1b2430] group-hover:text-[#0f1720]">
                  {a.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

