export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
}) {
  return (
    <div className={`mb-10 ${align === 'center' ? 'text-center mx-auto max-w-2xl' : ''}`}>
      {eyebrow && (
        <p className="text-xs uppercase tracking-[0.2em] text-brand-accent mb-2 font-medium">
          {eyebrow}
        </p>
      )}
      <h2 className="font-serif text-2xl md:text-3xl text-brand-text">{title}</h2>
      {description && (
        <p className="text-brand-muted mt-3 leading-relaxed">{description}</p>
      )}
    </div>
  );
}
