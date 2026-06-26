import { useRef } from 'react';

export default function FooterWordmark() {
  const svgRef = useRef<SVGSVGElement>(null);
  const spotlightRef = useRef<SVGRadialGradientElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const svg = svgRef.current;
    const gradient = spotlightRef.current;
    if (!svg || !gradient) return;
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 3200;
    const y = ((e.clientY - rect.top) / rect.height) * 396;
    const r = (100 / rect.width) * 3200;
    gradient.setAttribute('cx', String(x));
    gradient.setAttribute('cy', String(y));
    gradient.setAttribute('r', String(r));
  }

  return (
    <div className="relative overflow-hidden bg-black opacity-70 w-full footer-wordmark" onMouseMove={handleMouseMove}>
      <svg
        ref={svgRef}
        className="footer-wordmark-svg"
        width="3200"
        height="396"
        viewBox="0 0 3200 396"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ color: '#111111' }}
      >
        <defs>
          <clipPath id="wordmark-clip">
            <text
              x="1600"
              y="395"
              textAnchor="middle"
              fontFamily="Inter, ui-sans-serif, system-ui, -apple-system, sans-serif"
              fontWeight="900"
              fontSize="420"
              letterSpacing="-17"
            >
              ClauseKit
            </text>
          </clipPath>
          <radialGradient ref={spotlightRef} id="wordmark-spotlight" cx="1600" cy="198" r="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#ffffff" stopOpacity=".75" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <text
          x="1600"
          y="395"
          textAnchor="middle"
          fontFamily="Inter, ui-sans-serif, system-ui, -apple-system, sans-serif"
          fontWeight="900"
          fontSize="420"
          letterSpacing="-17"
          fill="currentColor"
        >
          ClauseKit
        </text>
        <rect
          className="footer-wordmark-spotlight"
          x="0"
          y="0"
          width="3200"
          height="396"
          fill="url(#wordmark-spotlight)"
          clipPath="url(#wordmark-clip)"
          style={{ mixBlendMode: 'soft-light' }}
        />
      </svg>
      <div className="footer-wordmark-shelf" />
    </div>
  );
}
