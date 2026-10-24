export function BackgroundScene() {
  return (
    <div className="background-scene" aria-hidden="true">
      {/* Ambient lighting */}
      <div className="aurora aurora-left" />
      <div className="aurora aurora-right" />

      {/* Perspective floor */}
      <div className="perspective-grid" />

      {/* Left 3D orb */}
      <div className="orb">
        <span className="orb-ring" />
        <span className="orb-core" />
      </div>

      {/* Right 3D resume/document */}
      <div className="document-stack">
        <span className="document-shadow" />
        <span className="document-sheet document-sheet-back" />

        <span className="document-sheet document-sheet-front">
          <i className="document-avatar" />
          <i className="document-line line-one" />
          <i className="document-line line-two" />
          <i className="document-line line-three" />
        </span>
      </div>

      {/* Floating decorative objects */}
      <span className="floating-gem gem-one" />
      <span className="floating-gem gem-two" />
      <span className="floating-gem gem-three" />
    </div>
  );
}
