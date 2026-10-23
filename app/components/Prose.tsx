function Inline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\$[^$]+\$)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i}>{part.slice(2, -2)}</strong>
        ) : part.startsWith("$") && part.endsWith("$") ? (
          <var key={i} className="math">{part.slice(1, -1)}</var>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

export function Body({ text }: { text: string }) {
  if (text.startsWith("- ")) {
    const items = text.split("\n").map((l) => l.replace(/^- /, ""));
    return (
      <ul className="project-list">
        {items.map((item, i) => (
          <li key={i}>
            <Inline text={item} />
          </li>
        ))}
      </ul>
    );
  }
  return (
    <p>
      <Inline text={text} />
    </p>
  );
}
