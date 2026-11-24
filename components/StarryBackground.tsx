import Moon from "@/components/Moon";

const plottedStars = [
  [119,284,1.5],[148,427,1],[173,217,1.2],[190,349,1.6],[211,482,1.1],
  [233,163,1.1],[248,404,1.4],[262,272,1],[286,533,1.3],[302,199,1.8],
  [319,436,1],[336,299,1.2],[356,146,1.1],[369,504,1.5],[397,233,1],
  [412,397,1.6],[437,151,1.2],[449,471,1],[472,342,1.3],[498,539,1.1],
  [522,411,1.6],[549,307,1],[570,464,1.1],[590,367,1.6],[603,274,1],
  [315,580,1],[434,587,1.2],[171,536,1],[580,195,1.1],[222,559,1],
];
const constellations = [
  { path: "187,300 220,269 258,286 278,251 314,261", stars: [[187,300],[220,269],[258,286],[278,251],[314,261]] },
  { path: "236,440 269,412 303,428 324,389 358,369", stars: [[236,440],[269,412],[303,428],[324,389],[358,369]] },
  { path: "410,311 441,287 460,320 494,335", stars: [[410,311],[441,287],[460,320],[494,335]] },
  { path: "420,476 451,444 480,460 509,426 545,444", stars: [[420,476],[451,444],[480,460],[509,426],[545,444]] },
];
const ambientStars = [[7,13,2],[19,38,1],[29,9,1],[39,71,1],[48,24,1],[58,88,2],[65,17,1],[76,57,1],[85,31,2],[93,78,1],[12,89,1],[34,52,1]];

export function CelestialBackground() {
  return (
    <div className="ambient-sky" aria-hidden="true">
      {ambientStars.map(([left,top,size], index) => <span key={index} className="sky-star" style={{ left: `${left}%`, top: `${top}%`, width: size, height: size }} />)}
    </div>
  );
}

// A bespoke celestial plate, drawn as vectors rather than a stock background.
// The constellation arrangements are decorative, not an astronomical sky map.
export default function StarryBackground() {
  return (
    <div className="celestial-atlas" aria-hidden="true">
      <svg className="atlas-svg" viewBox="0 0 760 760" fill="none" style={{ color: "#c9af7c" }}>

        <g stroke="currentColor">
          <circle cx="380" cy="380" r="327" strokeOpacity=".34" strokeWidth=".8" />
          <circle cx="380" cy="380" r="320" strokeOpacity=".7" strokeWidth=".7" />
          <circle cx="380" cy="380" r="301" strokeOpacity=".38" strokeWidth=".6" />
          <circle cx="380" cy="380" r="294" strokeOpacity=".65" strokeWidth=".7" />
          <circle cx="380" cy="380" r="268" strokeOpacity=".3" strokeWidth=".6" />
          {Array.from({ length: 120 }, (_, index) => {
            const angle = index * Math.PI / 60 - Math.PI / 2;
            const major = index % 10 === 0;
            const start = major ? 302 : index % 5 === 0 ? 308 : 313;
            const coordinate = (trig: number, radius: number) => Number((380 + trig * radius).toFixed(3));
            return <line key={index} x1={coordinate(Math.cos(angle), start)} y1={coordinate(Math.sin(angle), start)} x2={coordinate(Math.cos(angle),319)} y2={coordinate(Math.sin(angle),319)} strokeWidth={major ? ".9" : ".55"} strokeOpacity={major ? ".8" : ".4"} />;
          })}
        </g>
        <g fill="currentColor" fillOpacity=".66" fontFamily="Georgia, serif" fontSize="11" letterSpacing="1.5" textAnchor="middle" dominantBaseline="middle">
          {Array.from({ length: 12 }, (_, index) => {
            const angle = index * Math.PI / 6 - Math.PI / 2;
            const x = Number((380 + Math.cos(angle) * 282).toFixed(3));
            const y = Number((380 + Math.sin(angle) * 282).toFixed(3));
            return <text key={index} x={x} y={y} transform={`rotate(${index * 30}, ${x}, ${y})`}>{String(index * 30).padStart(3,"0")}</text>;
          })}
        </g>
        <g stroke="currentColor" strokeWidth=".65" strokeOpacity=".22">
          <path d="M112 380h536M380 112v536" strokeDasharray="2 7" />
          <circle cx="380" cy="380" r="181" strokeDasharray="2 8" />
          <circle cx="380" cy="380" r="93" strokeDasharray="1 8" />
          <ellipse cx="380" cy="380" rx="268" ry="107" transform="rotate(-34 380 380)" />
          <ellipse cx="380" cy="380" rx="268" ry="191" transform="rotate(37 380 380)" />
        </g>
        <g stroke="currentColor" strokeWidth=".7" strokeOpacity=".6">
          <path d="M370 54h20M380 44v20M370 706h20M380 696v20M44 380h20M54 370v20M696 380h20M706 370v20" />
          <circle cx="380" cy="380" r="4" /><path d="M367 380h7M386 380h7M380 367v7M380 386v7" />
        </g>
        <g fill="currentColor">{plottedStars.map(([cx,cy,r],index) => <circle key={index} cx={cx} cy={cy} r={r} fillOpacity={index % 3 === 0 ? ".8" : ".45"} />)}</g>
        <g stroke="currentColor" strokeWidth=".8">{constellations.map((constellation,index) => (
          <g key={index}><polyline points={constellation.path} strokeOpacity=".4" />{constellation.stars.map(([cx,cy],starIndex) => <g key={starIndex}><circle cx={cx} cy={cy} r={starIndex === 1 ? "2.5" : "1.8"} fill="currentColor" fillOpacity=".9" stroke="none" />{starIndex === 1 && <circle cx={cx} cy={cy} r="6" strokeOpacity=".3" />}</g>)}</g>
        ))}</g>
        <g stroke="currentColor" strokeWidth=".8" strokeOpacity=".8"><path d="M342 193h14M349 186v14M346 190l6 6M352 190l-6 6M564 376h18M573 367v18M569 372l8 8M577 372l-8 8M184 392h10M189 387v10M347 541h12M353 535v12" /></g>
        <g className="atlas-moon-target">
          <circle cx="510" cy="235" r="51" stroke="currentColor" strokeOpacity=".2" strokeWidth=".6" />
          <circle cx="510" cy="235" r="47" stroke="currentColor" strokeOpacity=".45" strokeWidth=".6" />
        </g>
        <g fill="currentColor" fillOpacity=".55" fontFamily="Georgia, serif" fontStyle="italic" fontSize="13"><text x="159" y="249" transform="rotate(-13 159 249)">the wandering stars</text><text x="450" y="505" transform="rotate(-9 450 505)">a celestial study</text></g>
        <g fill="currentColor" fillOpacity=".5" fontFamily="Georgia, serif" fontSize="10" letterSpacing="3" textAnchor="middle"><text x="380" y="30">A STUDY OF THE CELESTIAL SPHERE</text><text x="380" y="741">AS ABOVE · SO BELOW</text></g>
      </svg>
      <Moon />
    </div>
  );
}
