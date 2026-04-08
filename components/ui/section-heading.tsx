interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
}

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="space-y-4">
      {eyebrow ? (
        <div className="badge bg-white/5 text-cyan-200">{eyebrow}</div>
      ) : null}
      <div className="space-y-3">
        <h2 className="max-w-3xl text-3xl font-semibold tracking-tight text-white md:text-5xl">
          {title}
        </h2>
        {description ? (
          <p className="max-w-2xl text-base leading-7 text-white/65 md:text-lg">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}
