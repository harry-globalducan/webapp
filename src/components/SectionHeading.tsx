interface SectionHeadingProps {
  eyebrow: string
  title: string
  accent?: string
}

/** Orange dash + eyebrow + big display heading, optionally with an accent word. */
export default function SectionHeading({ eyebrow, title, accent }: SectionHeadingProps) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="h-0.5 w-10 bg-tangerine-500" />
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-tangerine-600">
          {eyebrow}
        </span>
      </div>
      <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
        {title}
        {accent && (
          <>
            {' '}
            <span className="text-tangerine-500">{accent}</span>
          </>
        )}
      </h2>
    </div>
  )
}
