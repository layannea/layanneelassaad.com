const colors = [
  ["bg", "--bg"],
  ["bg-elevated", "--bg-elevated"],
  ["surface", "--surface"],
  ["border", "--border"],
  ["border-strong", "--border-strong"],
  ["text", "--text"],
  ["text-secondary", "--text-secondary"],
  ["text-tertiary", "--text-tertiary"],
];

export default function Styleguide() {
  return (
    <main className="container" style={{ paddingBlock: 64 }}>
      <p className="label">Styleguide</p>
      <h1 style={{ marginTop: 12 }}>Foundations</h1>
      <p className="lead" style={{ marginTop: 16, maxWidth: 560 }}>
        Everything below is built only from tokens in globals.css. Delete this
        page before launch.
      </p>

      {/* Color */}
      <section className="section">
        <p className="label">Color</p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
            gap: 16,
            marginTop: 16,
          }}
        >
          {colors.map(([name, v]) => (
            <div key={name}>
              <div
                style={{
                  height: 72,
                  borderRadius: 8,
                  border: "1px solid var(--border)",
                  background: `var(${v})`,
                }}
              />
              <p className="label" style={{ marginTop: 8, textTransform: "none" }}>
                {name}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Type */}
      <section className="section">
        <p className="label">Type</p>
        <div style={{ display: "grid", gap: 24, marginTop: 16 }}>
          <h1>Heading one, 56px tight</h1>
          <h2>Heading two, 32px</h2>
          <h3>Heading three, 24px</h3>
          <p className="lead">
            Lead paragraph. Used once under the name and once at the top of
            each case study. Sits in the secondary gray.
          </p>
          <p style={{ maxWidth: 640 }}>
            Body text at 17px with 1.6 line height. Profiled ESMFold on an H100
            across CASP14 proteins and found long-sequence bottlenecks in
            triangular attention. torch.compile and microbatching cut
            kernel-launch overhead and peak VRAM.
          </p>
          <p className="label">Mono label: PyTorch, CUDA, H100, 2025</p>
        </div>
      </section>

      {/* Links and buttons */}
      <section className="section">
        <p className="label">Links and buttons</p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 24,
            alignItems: "center",
            marginTop: 16,
          }}
        >
          <a href="#" className="link">Inline link</a>
          <a href="#" className="link-arrow">All projects</a>
          <a href="#" className="btn btn-primary">Download resume</a>
          <a href="#" className="btn btn-secondary">GitHub</a>
          <a href="#" className="btn btn-secondary btn-sm">Small</a>
        </div>
      </section>

      {/* Card */}
      <section className="section">
        <p className="label">Project card</p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 24,
            marginTop: 16,
          }}
        >
          <a href="#" className="card" style={{ padding: 24 }}>
            <div className="figure" style={{ aspectRatio: "16 / 10" }} />
            <p className="label" style={{ marginTop: 20 }}>
              2025 · PyTorch · CUDA
            </p>
            <h3 style={{ marginTop: 8 }}>ESMFold on H100</h3>
            <p className="muted" style={{ marginTop: 8, fontSize: 15 }}>
              6% faster forward pass with torch.compile and microbatching,
              with pLDDT and TM-score preserved.
            </p>
          </a>
          <a href="#" className="card" style={{ padding: 24 }}>
            <div className="figure" style={{ aspectRatio: "16 / 10" }} />
            <p className="label" style={{ marginTop: 20 }}>
              2025 · Swift · Neo4j
            </p>
            <h3 style={{ marginTop: 8 }}>Scout</h3>
            <p className="muted" style={{ marginTop: 8, fontSize: 15 }}>
              macOS app for running sandboxed agents over a local knowledge
              graph. 1,000+ on the waitlist.
            </p>
          </a>
        </div>
      </section>
    </main>
  );
}