// Generates the flat SVG illustrations in public/illo/. Run after editing:
//
//   npm run illo
//
// The family's illustration style (PestToClear's scripts/illustrations.mjs, after OurKampung): a soft blob
// backdrop, a ground shadow, flat shapes, no outlines on figures. SpaceToReno's palette: plum, mint, warm
// timber and pale tile. The output files are committed; this script is only needed to change them.
//
// Rule for every diagram: no durations, percentages or prices unless a guide cites a source for them. Every
// image needs alt text where it is used (scripts/audit.mjs checks).

import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');
const out = join(root, 'illo');
mkdirSync(out, { recursive: true });

const C = {
  blob: '#EDE6F3',
  shadow: '#DCD2E6',
  cream: '#FFFDF8',
  paper: '#FFFFFF',
  line: '#E6DCCB',
  ink: '#2A2233',
  inkSoft: '#4E4558',
  plum: '#3B2752',
  plumMid: '#6B4F8A',
  plumPale: '#CDBFDD',
  mint: '#8FD3B6',
  mintDark: '#5FB592',
  mintPale: '#D7F0E4',
  sand: '#F1E2C4',
  sandDark: '#E0CFA9',
  wood: '#D9A86C',
  woodDark: '#C4935A',
  woodDeep: '#9E6E3E',
  tile: '#DCEBF0',
  tileLine: '#BBD3DC',
  coral: '#F0A07E',
  coralDark: '#D9805C',
  butter: '#F5D98B',
  butterDark: '#E3BE5E',
  sky: '#B9D3E0',
  skyPale: '#DCE9F0',
  steel: '#59606E',
  stone: '#A59FAB',
  stoneDark: '#7F7887',
  wall: '#F6F0E8',
  skin1: '#B97B52',
  skin2: '#F3CDB3',
  skin3: '#8A5A3C',
};
const FONT = 'font-family="Inter, Segoe UI, Arial, sans-serif"';

const svg = (w, h, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">\n${body.trim()}\n</svg>\n`;
const write = (name, content) => writeFileSync(join(out, `${name}.svg`), content.replace(/\n\s*\n/g, '\n'));

/** The soft backdrop and ground shadow every 320 × 220 card sits on. */
const stage = () => `
  <path d="M46 126C36 70 94 30 164 30c72 0 124 34 120 96-4 58-64 78-128 78-58 0-100-24-110-78z" fill="${C.blob}"/>
  <ellipse cx="164" cy="184" rx="122" ry="7" fill="${C.shadow}"/>`;

/**
 * A standing figure, feet on `y`, about 120 units tall. Options: shirt, pants, skin, hair (colour or
 * 'none'), hat ('hard' for a hard hat), and arms: 'down' (default), or an SVG string drawn instead.
 */
function person(x, y, o = {}) {
  const shirt = o.shirt ?? C.plumMid;
  const pants = o.pants ?? C.inkSoft;
  const skin = o.skin ?? C.skin2;
  const hair = o.hair ?? C.ink;
  const arms =
    o.arms ??
    `<rect x="${x - 27}" y="${y - 84}" width="10" height="34" rx="5" fill="${shirt}"/>
     <rect x="${x + 17}" y="${y - 84}" width="10" height="34" rx="5" fill="${shirt}"/>
     <circle cx="${x - 22}" cy="${y - 48}" r="5" fill="${skin}"/><circle cx="${x + 22}" cy="${y - 48}" r="5" fill="${skin}"/>`;
  const head =
    o.hat === 'hard'
      ? `<path d="M${x - 16} ${y - 109}a16 16 0 0 1 32 0z" fill="${C.butter}"/><rect x="${x - 19}" y="${y - 111}" width="38" height="5" rx="2.5" fill="${C.butterDark}"/>`
      : hair === 'none'
        ? ''
        : `<path d="M${x - 14} ${y - 106}a14 14 0 0 1 28 0c-6-6-22-7-28 0z" fill="${hair}"/>`;
  return `
  <ellipse cx="${x}" cy="${y + 2}" rx="30" ry="4.5" fill="${C.shadow}"/>
  <rect x="${x - 12}" y="${y - 46}" width="10" height="44" rx="4" fill="${pants}"/>
  <rect x="${x + 2}" y="${y - 46}" width="10" height="44" rx="4" fill="${pants}"/>
  <rect x="${x - 16}" y="${y - 6}" width="16" height="7" rx="3" fill="${C.ink}"/>
  <rect x="${x + 1}" y="${y - 6}" width="16" height="7" rx="3" fill="${C.ink}"/>
  <rect x="${x - 18}" y="${y - 92}" width="36" height="52" rx="13" fill="${shirt}"/>
  ${arms}
  <circle cx="${x}" cy="${y - 106}" r="14" fill="${skin}"/>
  ${head}`;
}

const tree = (x, y, r) => `
  <rect x="${x - 4}" y="${y}" width="8" height="${r * 2.2}" rx="3" fill="${C.woodDeep}"/>
  <circle cx="${x}" cy="${y - r * 0.2}" r="${r}" fill="${C.mint}"/>
  <circle cx="${x - r * 0.6}" cy="${y + r * 0.35}" r="${r * 0.7}" fill="${C.mintDark}"/>
  <circle cx="${x + r * 0.62}" cy="${y + r * 0.3}" r="${r * 0.72}" fill="${C.mint}"/>`;

const windows = (x0, y0, cols, rows, dx, dy, w, h, fill) => {
  let s = '';
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    s += `<rect x="${x0 + c * dx}" y="${y0 + r * dy}" width="${w}" height="${h}" rx="1.5" fill="${fill}"/>`;
  }
  return s;
};

/** A tiled wall panel: rows × cols of w × h tiles from (x, y). */
const tiles = (x, y, cols, rows, w, h, fill = C.tile, grout = C.tileLine) => {
  let s = `<rect x="${x}" y="${y}" width="${cols * w}" height="${rows * h}" fill="${fill}"/>`;
  for (let c = 1; c < cols; c++) s += `<path d="M${x + c * w} ${y}v${rows * h}" stroke="${grout}" stroke-width="1.5"/>`;
  for (let r = 1; r < rows; r++) s += `<path d="M${x} ${y + r * h}h${cols * w}" stroke="${grout}" stroke-width="1.5"/>`;
  return s;
};

const paintTin = (x, y, lid = C.mint) => `
  <rect x="${x}" y="${y}" width="26" height="28" rx="3" fill="${C.stone}"/>
  <rect x="${x}" y="${y + 8}" width="26" height="12" fill="${lid}"/>
  <rect x="${x - 2}" y="${y - 4}" width="30" height="6" rx="2" fill="${C.stoneDark}"/>`;

const ladder = (x, y, h) => `
  <path d="M${x} ${y}l${h * 0.28} ${-h}M${x + 34} ${y}l${-h * 0.05} ${-h}" stroke="${C.woodDark}" stroke-width="6" stroke-linecap="round"/>
  ${[0.2, 0.42, 0.64, 0.86].map((f) => `<path d="M${x + h * 0.28 * f} ${y - h * f}h${34 - h * 0.33 * f}" stroke="${C.wood}" stroke-width="5" stroke-linecap="round"/>`).join('')}`;

const plant = (x, y) => `
  <path d="M${x - 12} ${y - 22}h24l-4 22h-16z" fill="${C.coral}"/>
  <path d="M${x} ${y - 22}c-4-16-14-24-24-26 2 12 12 22 24 26zM${x} ${y - 22}c3-18 14-28 26-30-2 14-12 26-26 30zM${x} ${y - 22}c0-14-1-26-3-34 7 8 8 22 3 34z" fill="${C.mintDark}"/>`;

// =================================================================================================
// HERO: a cut-away flat mid-renovation. Bathroom being tiled, homeowner with a plan in the living room,
// a ladder and paint tins in the bedroom.
// =================================================================================================
write(
  'hero',
  svg(640, 480, `
  <path d="M30 330C10 170 150 50 330 46c190-4 300 96 290 250-8 120-120 160-300 160C150 456 44 420 30 330z" fill="${C.blob}"/>
  <circle cx="560" cy="70" r="24" fill="${C.butter}"/>
  <g fill="#FFFFFF"><ellipse cx="110" cy="70" rx="36" ry="11"/><ellipse cx="136" cy="63" rx="22" ry="10"/></g>

  <!-- the flat: roof slab, two floors of rooms -->
  <rect x="70" y="96" width="500" height="14" rx="3" fill="${C.plum}"/>
  <rect x="78" y="110" width="484" height="300" fill="${C.wall}"/>
  <rect x="78" y="250" width="484" height="10" fill="${C.sandDark}"/>
  <rect x="300" y="110" width="10" height="140" fill="${C.sandDark}"/>
  <rect x="380" y="260" width="10" height="150" fill="${C.sandDark}"/>
  <rect x="70" y="404" width="500" height="12" rx="3" fill="${C.plum}"/>

  <!-- upstairs left: bathroom being tiled -->
  ${tiles(86, 118, 9, 5, 24, 26)}
  <rect x="86" y="118" width="96" height="78" fill="${C.wall}"/>
  <path d="M86 196h96" stroke="${C.tileLine}" stroke-width="2"/>
  <rect x="210" y="196" width="64" height="40" rx="8" fill="${C.paper}"/>
  <rect x="206" y="190" width="72" height="10" rx="4" fill="#ECEFF1"/>
  <rect x="236" y="166" width="6" height="26" rx="3" fill="${C.steel}"/>
  <path d="M239 166c0-10 14-10 16-2" stroke="${C.steel}" stroke-width="5" fill="none" stroke-linecap="round"/>
  <g transform="translate(-4 0)">${person(150, 248, {
    shirt: C.mintDark,
    pants: C.steel,
    skin: C.skin1,
    hat: 'hard',
    arms: `<rect x="123" y="164" width="10" height="34" rx="5" fill="${C.mintDark}"/>
           <path d="M168 168l22-18" stroke="${C.mintDark}" stroke-width="10" stroke-linecap="round"/>
           <circle cx="192" cy="148" r="5" fill="${C.skin1}"/>
           <path d="M188 146l14-10 6 6-14 10z" fill="${C.stoneDark}"/>`,
  })}</g>

  <!-- upstairs right: bedroom with ladder and paint -->
  <rect x="318" y="118" width="236" height="132" fill="${C.mintPale}"/>
  <rect x="318" y="118" width="120" height="132" fill="${C.wall}"/>
  <path d="M438 118v132" stroke="${C.mint}" stroke-width="3" stroke-dasharray="6 5"/>
  <rect x="470" y="140" width="56" height="44" rx="3" fill="${C.skyPale}"/>
  <path d="M498 140v44M470 162h56" stroke="${C.paper}" stroke-width="4"/>
  ${ladder(360, 248, 112)}
  ${paintTin(412, 220)}${paintTin(444, 220, C.plumPale)}
  <path d="M498 238l26-8 6 14-26 8z" fill="${C.wood}"/><rect x="520" y="224" width="22" height="12" rx="3" fill="${C.mint}"/>

  <!-- downstairs left: living room, homeowner with a floor plan -->
  <rect x="86" y="268" width="294" height="136" fill="${C.wall}"/>
  <rect x="96" y="376" width="276" height="28" fill="${C.wood}"/>
  ${Array.from({ length: 6 }, (_, i) => `<path d="M${96 + i * 46} 376v28" stroke="${C.woodDark}" stroke-width="2"/>`).join('')}
  <rect x="210" y="330" width="120" height="10" rx="3" fill="${C.woodDeep}"/>
  <rect x="220" y="340" width="8" height="36" fill="${C.woodDeep}"/><rect x="312" y="340" width="8" height="36" fill="${C.woodDeep}"/>
  <path d="M222 330l14-16h86l-10 16z" fill="${C.paper}"/>
  <path d="M244 318h30v8h-30zM280 318h30v8h-30z" fill="none" stroke="${C.plumMid}" stroke-width="2"/>
  <path d="M252 314l-4 14M296 314v14" stroke="${C.plumMid}" stroke-width="1.5"/>
  ${plant(116, 376)}
  ${person(176, 398, {
    shirt: C.coral,
    pants: C.plum,
    skin: C.skin2,
    hair: C.ink,
    arms: `<rect x="149" y="314" width="10" height="34" rx="5" fill="${C.coral}"/>
           <path d="M194 320l26 10" stroke="${C.coral}" stroke-width="10" stroke-linecap="round"/>
           <circle cx="222" cy="331" r="5" fill="${C.skin2}"/>
           <circle cx="154" cy="350" r="5" fill="${C.skin2}"/>`,
  })}

  <!-- downstairs right: kitchen cabinets going in -->
  <rect x="398" y="268" width="156" height="136" fill="${C.wall}"/>
  ${tiles(398, 300, 6, 2, 26, 18, C.paper, C.line)}
  <rect x="398" y="336" width="156" height="68" fill="${C.plumMid}"/>
  <rect x="394" y="330" width="164" height="8" rx="2" fill="${C.sandDark}"/>
  <path d="M450 336v68M502 336v68" stroke="${C.plum}" stroke-width="2"/>
  <rect x="440" y="360" width="6" height="16" rx="3" fill="${C.butter}"/><rect x="492" y="360" width="6" height="16" rx="3" fill="${C.butter}"/>
  <rect x="406" y="272" width="60" height="24" fill="${C.plumMid}" opacity=".35"/>
  <rect x="476" y="272" width="70" height="24" rx="2" fill="none" stroke="${C.plumMid}" stroke-width="2" stroke-dasharray="5 4"/>

  <ellipse cx="320" cy="430" rx="280" ry="10" fill="${C.shadow}"/>
`),
);

// =================================================================================================
// TIMELINE: six stages, in order. No durations.
// =================================================================================================
const stages = [
  { n: 1, a: 'Plan', b: 'and budget', icon: 'plan' },
  { n: 2, a: 'Hire a designer', b: 'or contractor', icon: 'hire' },
  { n: 3, a: 'Get the', b: 'approvals', icon: 'permit' },
  { n: 4, a: 'Hacking and', b: 'wet works', icon: 'hack' },
  { n: 5, a: 'Carpentry, fittings', b: 'and painting', icon: 'carpentry' },
  { n: 6, a: 'Handover', b: 'and defects', icon: 'keys' },
];
const stageIcon = (kind, cx, cy) => {
  switch (kind) {
    case 'plan':
      return `<rect x="${cx - 26}" y="${cy - 20}" width="52" height="40" rx="3" fill="${C.paper}"/>
        <path d="M${cx - 18} ${cy - 12}h18v14h-18zM${cx} ${cy - 12}h18v24h-18z" fill="none" stroke="${C.plumMid}" stroke-width="2.5"/>
        <path d="M${cx + 14} ${cy + 22}l16-30 5 3-16 30z" fill="${C.butterDark}"/>`;
    case 'hire':
      return `<circle cx="${cx - 12}" cy="${cy - 8}" r="9" fill="${C.skin2}"/><rect x="${cx - 24}" y="${cy + 2}" width="24" height="20" rx="8" fill="${C.coral}"/>
        <circle cx="${cx + 13}" cy="${cy - 8}" r="9" fill="${C.skin1}"/><rect x="${cx + 1}" y="${cy + 2}" width="24" height="20" rx="8" fill="${C.mintDark}"/>
        <path d="M${cx - 4} ${cy + 10}h8" stroke="${C.ink}" stroke-width="4" stroke-linecap="round"/>`;
    case 'permit':
      return `<rect x="${cx - 20}" y="${cy - 24}" width="40" height="48" rx="3" fill="${C.paper}"/>
        <path d="M${cx - 12} ${cy - 14}h24M${cx - 12} ${cy - 6}h24M${cx - 12} ${cy + 2}h14" stroke="${C.stone}" stroke-width="2.5"/>
        <circle cx="${cx + 14}" cy="${cy + 16}" r="11" fill="${C.mintDark}"/><path d="M${cx + 9} ${cy + 16}l4 4 6-8" stroke="${C.paper}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
    case 'hack':
      return `${tiles(cx - 26, cy - 14, 4, 2, 13, 14, C.tile, C.tileLine)}
        <path d="M${cx - 6} ${cy - 14}l6 10-8 6 6 12" stroke="${C.ink}" stroke-width="2" fill="none"/>
        <path d="M${cx + 4} ${cy - 28}l18 22" stroke="${C.woodDeep}" stroke-width="5" stroke-linecap="round"/><rect x="${cx + 12}" y="${cy - 36}" width="22" height="11" rx="3" fill="${C.steel}" transform="rotate(40 ${cx + 23} ${cy - 30})"/>`;
    case 'carpentry':
      return `<rect x="${cx - 24}" y="${cy - 22}" width="48" height="44" rx="3" fill="${C.wood}"/>
        <path d="M${cx} ${cy - 22}v44M${cx - 24} ${cy}h48" stroke="${C.woodDark}" stroke-width="2.5"/>
        <rect x="${cx - 6}" y="${cy - 14}" width="3" height="10" rx="1.5" fill="${C.plum}"/><rect x="${cx + 3}" y="${cy - 14}" width="3" height="10" rx="1.5" fill="${C.plum}"/>
        <path d="M${cx + 16} ${cy + 26}l14-20 6 4-14 20z" fill="${C.mint}"/>`;
    case 'keys':
      return `<circle cx="${cx - 8}" cy="${cy - 4}" r="12" fill="none" stroke="${C.butterDark}" stroke-width="6"/>
        <path d="M${cx + 2} ${cy + 4}l20 18M${cx + 14} ${cy + 15}l6-6M${cx + 19} ${cy + 20}l5-5" stroke="${C.butterDark}" stroke-width="6" stroke-linecap="round"/>`;
    default:
      return '';
  }
};
write(
  'timeline',
  svg(1100, 300, `
  <rect x="0" y="0" width="1100" height="300" rx="18" fill="${C.cream}"/>
  <path d="M90 130H1010" stroke="${C.plumPale}" stroke-width="6" stroke-linecap="round"/>
  <path d="M90 130H1010" stroke="${C.plum}" stroke-width="6" stroke-linecap="round" stroke-dasharray="2 16"/>
  ${stages
    .map((s, i) => {
      const cx = 92 + i * 183;
      const permit = s.icon === 'permit';
      return `
  <circle cx="${cx}" cy="130" r="58" fill="${permit ? C.mintPale : C.blob}" ${permit ? `stroke="${C.mintDark}" stroke-width="3"` : ''}/>
  ${stageIcon(s.icon, cx, 130)}
  <circle cx="${cx - 42}" cy="88" r="16" fill="${C.plum}"/>
  <text x="${cx - 42}" y="94" ${FONT} font-size="17" font-weight="700" fill="${C.paper}" text-anchor="middle">${s.n}</text>
  <text x="${cx}" y="222" ${FONT} font-size="19" font-weight="600" fill="${C.ink}" text-anchor="middle">${s.a}</text>
  <text x="${cx}" y="246" ${FONT} font-size="19" font-weight="600" fill="${C.ink}" text-anchor="middle">${s.b}</text>`;
    })
    .join('')}
`),
);

// =================================================================================================
// INTERIOR DESIGNER vs CONTRACTOR
// =================================================================================================
const tradeChip = (x, y, label, fill) => `
  <rect x="${x - 58}" y="${y - 17}" width="116" height="34" rx="17" fill="${fill}"/>
  <text x="${x}" y="${y + 5}" ${FONT} font-size="15" font-weight="600" fill="${C.ink}" text-anchor="middle">${label}</text>`;
write(
  'id-vs-contractor',
  svg(960, 420, `
  <rect x="0" y="0" width="960" height="420" rx="18" fill="${C.cream}"/>
  <path d="M480 30v360" stroke="${C.line}" stroke-width="3" stroke-dasharray="6 8"/>

  <!-- left: interior designer -->
  <text x="240" y="48" ${FONT} font-size="22" font-weight="700" fill="${C.plum}" text-anchor="middle">Interior designer</text>
  <text x="240" y="72" ${FONT} font-size="16" fill="${C.inkSoft}" text-anchor="middle">Designs the space, then manages the trades</text>
  <path d="M60 210C50 150 110 110 200 110c70 0 100 40 96 96-4 50-50 70-110 70-64 0-116-12-126-66z" fill="${C.blob}"/>
  <rect x="78" y="128" width="96" height="70" rx="4" fill="${C.paper}"/>
  <rect x="88" y="138" width="34" height="24" fill="${C.mint}"/><rect x="128" y="138" width="36" height="24" fill="${C.coral}"/>
  <rect x="88" y="168" width="20" height="20" fill="${C.wood}"/><rect x="114" y="168" width="50" height="20" fill="${C.plumPale}"/>
  ${person(222, 300, {
    shirt: C.plumMid,
    pants: C.ink,
    skin: C.skin2,
    hair: C.woodDeep,
    arms: `<rect x="195" y="216" width="10" height="34" rx="5" fill="${C.plumMid}"/>
           <path d="M240 220l20 18" stroke="${C.plumMid}" stroke-width="10" stroke-linecap="round"/>
           <rect x="252" y="226" width="30" height="38" rx="3" fill="${C.paper}" stroke="${C.plumPale}" stroke-width="2"/>
           <path d="M258 236h18M258 244h18M258 252h10" stroke="${C.stone}" stroke-width="2"/>
           <circle cx="200" cy="252" r="5" fill="${C.skin2}"/>`,
  })}
  <path d="M300 170c30-6 48-2 60 6M300 222h58M300 268c26 6 44 6 58 0" stroke="${C.plumMid}" stroke-width="2.5" fill="none" stroke-dasharray="4 5"/>
  ${tradeChip(410, 176, 'Carpenter', C.sand)}
  ${tradeChip(410, 222, 'Electrician', C.butter)}
  ${tradeChip(410, 268, 'Tiler, plumber', C.tile)}
  <text x="240" y="352" ${FONT} font-size="16" fill="${C.ink}" text-anchor="middle">You deal with one firm for design and build.</text>
  <text x="240" y="374" ${FONT} font-size="16" fill="${C.ink}" text-anchor="middle">Its quote covers the design work too.</text>

  <!-- right: contractor -->
  <text x="720" y="48" ${FONT} font-size="22" font-weight="700" fill="${C.plum}" text-anchor="middle">Renovation contractor</text>
  <text x="720" y="72" ${FONT} font-size="16" fill="${C.inkSoft}" text-anchor="middle">Builds what you’ve already decided</text>
  <path d="M540 210C530 150 590 110 680 110c70 0 100 40 96 96-4 50-50 70-110 70-64 0-116-12-126-66z" fill="${C.mintPale}"/>
  ${person(612, 300, {
    shirt: C.coral,
    pants: C.plum,
    skin: C.skin2,
    hair: C.ink,
    arms: `<rect x="585" y="216" width="10" height="34" rx="5" fill="${C.coral}"/>
           <path d="M630 222l24 6" stroke="${C.coral}" stroke-width="10" stroke-linecap="round"/>
           <rect x="652" y="206" width="40" height="30" rx="3" fill="${C.paper}" stroke="${C.plumPale}" stroke-width="2"/>
           <path d="M660 214h12v14h-12zM672 214h12v8h-12z" fill="none" stroke="${C.plumMid}" stroke-width="1.6"/>
           <circle cx="590" cy="252" r="5" fill="${C.skin2}"/>`,
  })}
  ${person(752, 300, {
    shirt: C.mintDark,
    pants: C.steel,
    skin: C.skin1,
    hat: 'hard',
    arms: `<rect x="725" y="216" width="10" height="34" rx="5" fill="${C.mintDark}"/>
           <rect x="769" y="216" width="10" height="34" rx="5" fill="${C.mintDark}"/>
           <rect x="736" y="248" width="34" height="8" rx="3" fill="${C.woodDeep}"/>
           <rect x="740" y="252" width="6" height="12" fill="${C.steel}"/><rect x="756" y="252" width="5" height="14" fill="${C.butterDark}"/>
           <circle cx="774" cy="252" r="5" fill="${C.skin1}"/><circle cx="730" cy="252" r="5" fill="${C.skin1}"/>`,
  })}
  <path d="M676 248h40" stroke="${C.plum}" stroke-width="3" marker-end="url(#arrow)"/>
  <defs><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0l10 5-10 5z" fill="${C.plum}"/></marker></defs>
  <text x="720" y="352" ${FONT} font-size="16" fill="${C.ink}" text-anchor="middle">You bring the design, or keep it simple.</text>
  <text x="720" y="374" ${FONT} font-size="16" fill="${C.ink}" text-anchor="middle">You make more of the decisions yourself.</text>
`),
);

// =================================================================================================
// PAYMENT STAGES: pay as work is done, never far ahead of it. No percentages.
// =================================================================================================
const milestones = [
  { x: 110, a: 'Deposit', b: 'when you sign' },
  { x: 340, a: 'Hacking and', b: 'wet works done' },
  { x: 570, a: 'Carpentry and', b: 'fittings in' },
  { x: 800, a: 'Final payment', b: 'after defects fixed' },
];
const coins = (x, y, n) =>
  Array.from({ length: n }, (_, i) => `<ellipse cx="${x}" cy="${y - i * 7}" rx="18" ry="6" fill="${i === n - 1 ? C.butter : C.butterDark}"/>`).join('');
write(
  'payment-stages',
  svg(960, 320, `
  <rect x="0" y="0" width="960" height="320" rx="18" fill="${C.cream}"/>
  <text x="40" y="44" ${FONT} font-size="15" font-weight="600" fill="${C.inkSoft}">Work done</text>
  <rect x="40" y="58" width="880" height="22" rx="11" fill="${C.blob}"/>
  <rect x="40" y="58" width="880" height="22" rx="11" fill="url(#prog)"/>
  <defs><linearGradient id="prog" x1="0" x2="1"><stop offset="0" stop-color="${C.mint}"/><stop offset="1" stop-color="${C.mintDark}"/></linearGradient></defs>
  ${milestones
    .map(
      (m, i) => `
  <path d="M${m.x} 82v54" stroke="${C.plum}" stroke-width="2.5" stroke-dasharray="4 4"/>
  <circle cx="${m.x}" cy="69" r="9" fill="${C.paper}" stroke="${C.plum}" stroke-width="3"/>
  ${coins(m.x, 186, i === 3 ? 2 : 3)}
  <rect x="${m.x - 26}" y="186" width="52" height="34" rx="6" fill="${C.plumMid}"/>
  <rect x="${m.x - 10}" y="192" width="20" height="5" rx="2.5" fill="${C.plum}"/>
  <text x="${m.x}" y="252" ${FONT} font-size="18" font-weight="600" fill="${C.ink}" text-anchor="middle">${m.a}</text>
  <text x="${m.x}" y="274" ${FONT} font-size="18" font-weight="600" fill="${C.ink}" text-anchor="middle">${m.b}</text>`,
    )
    .join('')}
  <text x="480" y="308" ${FONT} font-size="15" fill="${C.inkSoft}" text-anchor="middle">Each payment follows work you can see. Your contract sets the amounts.</text>
`),
);

// =================================================================================================
// APPROVAL MATRIX: which works need approval, by home type. Each cell is sourced in
// src/content/guides/what-needs-approval.md; change that guide first, then this.
// =================================================================================================
const OK = 'ok';
const NEED = 'need';
const NO = 'no';
const CHECK = 'check';
const matrixRows = [
  { work: ['Take down a', 'non-structural wall'], cells: [[NEED, 'HDB permit'], [CHECK, 'Check by-laws'], [OK, 'No approval']] },
  { work: ['Replace floor', 'or wall tiles'], cells: [[NEED, 'HDB permit'], [CHECK, 'Check by-laws'], [OK, 'No approval']] },
  { work: ['Replace', 'windows'], cells: [[NEED, 'HDB permit'], [NEED, 'MCST approval'], [OK, 'None, if same place']] },
  { work: ['Alter a structural', 'wall, column or beam'], cells: [[NO, 'Not allowed'], [NEED, 'Engineer + BCA'], [NEED, 'Engineer + BCA']] },
  { work: ['Enclose an', 'open balcony'], cells: [[NO, 'Not allowed'], [NO, 'Not allowed (URA)'], [NEED, 'URA permission']] },
];
const cellStyle = {
  [OK]: { fill: C.mintPale, stroke: C.mintDark, ink: '#1F5A43' },
  [NEED]: { fill: C.blob, stroke: C.plumMid, ink: C.plum },
  [NO]: { fill: '#FBE3D8', stroke: C.coralDark, ink: '#8A3A1C' },
  [CHECK]: { fill: '#FCF3D9', stroke: C.butterDark, ink: '#6B4E0A' },
};
const cellIcon = (kind, x, y, col) => {
  if (kind === OK) return `<circle cx="${x}" cy="${y}" r="11" fill="${col}"/><path d="M${x - 5} ${y}l3.5 3.5 6.5-7" stroke="#FFFFFF" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
  if (kind === NEED) return `<rect x="${x - 9}" y="${y - 11}" width="18" height="22" rx="2" fill="${col}"/><path d="M${x - 5} ${y - 5}h10M${x - 5} ${y}h10M${x - 5} ${y + 5}h6" stroke="#FFFFFF" stroke-width="2"/>`;
  if (kind === CHECK) return `<circle cx="${x}" cy="${y}" r="11" fill="${col}"/><text x="${x}" y="${y + 5}" ${FONT} font-size="15" font-weight="700" fill="#FFFFFF" text-anchor="middle">?</text>`;
  return `<circle cx="${x}" cy="${y}" r="11" fill="${col}"/><path d="M${x - 6} ${y}h12" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>`;
};
const matrixCols = [
  { x: 330, label: 'HDB flat' },
  { x: 560, label: 'Condo' },
  { x: 790, label: 'Landed house' },
];
write(
  'approval-matrix',
  svg(920, 560, `
  <rect x="0" y="0" width="920" height="560" rx="18" fill="${C.cream}"/>
  ${matrixCols.map((c) => `<text x="${c.x}" y="52" ${FONT} font-size="19" font-weight="700" fill="${C.plum}" text-anchor="middle">${c.label}</text>`).join('')}
  ${matrixRows
    .map((r, i) => {
      const y = 76 + i * 86;
      return `
  <text x="30" y="${y + 36}" ${FONT} font-size="18" font-weight="600" fill="${C.ink}">${r.work[0]}</text>
  <text x="30" y="${y + 58}" ${FONT} font-size="18" font-weight="600" fill="${C.ink}">${r.work[1]}</text>
  ${r.cells
    .map(([kind, text], j) => {
      const s = cellStyle[kind];
      const cx = matrixCols[j].x;
      return `<rect x="${cx - 108}" y="${y + 10}" width="216" height="66" rx="12" fill="${s.fill}" stroke="${s.stroke}" stroke-width="1.5"/>
  ${cellIcon(kind, cx - 80, y + 43, s.stroke)}
  <text x="${cx - 60}" y="${y + 49}" ${FONT} font-size="16.5" font-weight="600" fill="${s.ink}">${text}</text>`;
    })
    .join('')}`;
    })
    .join('')}
  <g transform="translate(30 524)">
    ${cellIcon(OK, 10, 0, C.mintDark)}<text x="30" y="5" ${FONT} font-size="14" fill="${C.inkSoft}">No approval needed</text>
    ${cellIcon(NEED, 220, 0, C.plumMid)}<text x="240" y="5" ${FONT} font-size="14" fill="${C.inkSoft}">Approval needed first</text>
    ${cellIcon(CHECK, 430, 0, C.butterDark)}<text x="450" y="5" ${FONT} font-size="14" fill="${C.inkSoft}">Depends on your by-laws</text>
    ${cellIcon(NO, 660, 0, C.coralDark)}<text x="680" y="5" ${FONT} font-size="14" fill="${C.inkSoft}">Not allowed</text>
  </g>
`),
);

// =================================================================================================
// CARD ILLUSTRATIONS (320 × 220)
// =================================================================================================

// hub-planning: floor plan, pencil, tape measure, swatches
write(
  'hub-planning',
  svg(320, 220, `
  ${stage()}
  <g transform="rotate(-6 150 120)">
    <rect x="70" y="58" width="150" height="112" rx="4" fill="${C.paper}"/>
    <path d="M86 74h56v44H86zM142 74h62v80h-62zM86 118h56v36H86z" fill="none" stroke="${C.plumMid}" stroke-width="3"/>
    <path d="M118 118v-10M142 100h-8M168 154v-8" stroke="${C.paper}" stroke-width="5"/>
    <rect x="152" y="84" width="22" height="14" rx="2" fill="${C.mintPale}"/><rect x="94" y="126" width="18" height="18" rx="2" fill="${C.tile}"/>
  </g>
  <path d="M206 168l50-62 8 6-50 62z" fill="${C.butter}"/><path d="M206 168l-4 10 12-4z" fill="${C.ink}"/>
  <circle cx="92" cy="170" r="20" fill="${C.butterDark}"/><circle cx="92" cy="170" r="8" fill="${C.ink}"/>
  <path d="M100 186h44" stroke="${C.butter}" stroke-width="10"/>
  ${[0, 1, 2].map((i) => `<rect x="${236 + i * 14}" y="${136 + i * 4}" width="20" height="40" rx="3" fill="${[C.mint, C.coral, C.plumPale][i]}" transform="rotate(${12 + i * 8} ${246 + i * 14} 176)"/>`).join('')}
`),
);

// hub-rules: permit with stamp, hard hat
write(
  'hub-rules',
  svg(320, 220, `
  ${stage()}
  <rect x="96" y="44" width="116" height="140" rx="5" fill="${C.paper}"/>
  <rect x="96" y="44" width="116" height="24" rx="5" fill="${C.plum}"/>
  <path d="M112 86h84M112 100h84M112 114h60M112 128h70" stroke="${C.stone}" stroke-width="4" stroke-linecap="round"/>
  <circle cx="182" cy="156" r="22" fill="none" stroke="${C.mintDark}" stroke-width="5"/>
  <path d="M172 156l7 7 13-14" stroke="${C.mintDark}" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M208 182a36 34 0 0 1 72 0z" fill="${C.butter}"/><rect x="200" y="178" width="88" height="10" rx="5" fill="${C.butterDark}"/>
  <path d="M244 148v34" stroke="${C.butterDark}" stroke-width="5"/>
  <rect x="58" y="150" width="30" height="34" rx="3" fill="${C.wood}"/><rect x="62" y="140" width="22" height="12" rx="3" fill="${C.woodDark}"/>
`),
);

// hub-hiring: two quotes and a magnifier
write(
  'hub-hiring',
  svg(320, 220, `
  ${stage()}
  <rect x="62" y="54" width="98" height="126" rx="5" fill="${C.paper}" transform="rotate(-5 110 117)"/>
  <rect x="150" y="48" width="98" height="126" rx="5" fill="${C.paper}" transform="rotate(4 200 111)"/>
  <g transform="rotate(-5 110 117)"><path d="M76 74h50M76 92h70M76 106h70M76 120h70M76 134h70M76 156h40" stroke="${C.stone}" stroke-width="4" stroke-linecap="round"/><path d="M76 74h50" stroke="${C.plum}" stroke-width="6" stroke-linecap="round"/></g>
  <g transform="rotate(4 200 111)"><path d="M164 68h50M164 86h70M164 100h70M164 114h70M164 128h70M164 150h40" stroke="${C.stone}" stroke-width="4" stroke-linecap="round"/><path d="M164 68h50" stroke="${C.mintDark}" stroke-width="6" stroke-linecap="round"/></g>
  <circle cx="208" cy="124" r="30" fill="${C.mintPale}" fill-opacity=".7" stroke="${C.ink}" stroke-width="6"/>
  <path d="M190 120h36" stroke="${C.coralDark}" stroke-width="5" stroke-linecap="round"/>
  <path d="M230 146l26 26" stroke="${C.ink}" stroke-width="10" stroke-linecap="round"/>
`),
);

// hub-during: doorway with floor protection, toolbox, tile stack
write(
  'hub-during',
  svg(320, 220, `
  ${stage()}
  <rect x="104" y="40" width="88" height="140" fill="${C.wood}"/>
  <rect x="112" y="48" width="72" height="132" fill="${C.wall}"/>
  <path d="M112 180l-30 10h132l-30-10z" fill="${C.sandDark}"/>
  <path d="M90 186h116" stroke="${C.sand}" stroke-width="3" stroke-dasharray="10 6"/>
  <rect x="120" y="120" width="56" height="44" rx="4" fill="${C.coral}"/>
  <path d="M136 120v-8h24v8" stroke="${C.coralDark}" stroke-width="5" fill="none"/>
  <rect x="120" y="136" width="56" height="5" fill="${C.coralDark}"/>
  ${[0, 1, 2, 3].map((i) => `<rect x="${220 - i}" y="${170 - i * 9}" width="54" height="8" rx="1.5" fill="${i % 2 ? C.tile : C.paper}" stroke="${C.tileLine}" stroke-width="1.5"/>`).join('')}
  <path d="M58 182l14-46h18l14 46z" fill="${C.coral}"/><path d="M66 158h30" stroke="${C.paper}" stroke-width="5"/>
`),
);

// hub-rooms: a cut-away flat with three rooms
write(
  'hub-rooms',
  svg(320, 220, `
  ${stage()}
  <rect x="58" y="42" width="210" height="140" fill="${C.wall}"/>
  <rect x="52" y="34" width="222" height="10" rx="3" fill="${C.plum}"/>
  <rect x="52" y="180" width="222" height="8" rx="3" fill="${C.plum}"/>
  <rect x="58" y="110" width="210" height="6" fill="${C.sandDark}"/><rect x="160" y="42" width="6" height="68" fill="${C.sandDark}"/>
  ${tiles(64, 48, 4, 3, 24, 20)}
  <rect x="80" y="86" width="44" height="18" rx="6" fill="${C.paper}"/>
  <rect x="172" y="76" width="88" height="28" rx="4" fill="${C.plumPale}"/><rect x="172" y="70" width="26" height="12" rx="4" fill="${C.paper}"/>
  <rect x="64" y="146" width="96" height="34" fill="${C.plumMid}"/><rect x="62" y="142" width="100" height="6" fill="${C.sandDark}"/>
  ${tiles(64, 120, 4, 1, 24, 20, C.paper, C.line)}
  <rect x="190" y="146" width="62" height="24" rx="8" fill="${C.mintDark}"/><rect x="186" y="140" width="70" height="10" rx="5" fill="${C.mint}"/>
  ${plant(244, 178)}
`),
);

// renovation-stages card: a checklist with numbered steps
write(
  'stages',
  svg(320, 220, `
  ${stage()}
  <rect x="96" y="40" width="128" height="146" rx="6" fill="${C.paper}"/>
  <rect x="134" y="32" width="52" height="16" rx="4" fill="${C.plumMid}"/>
  ${[0, 1, 2, 3, 4].map((i) => `<circle cx="116" cy="${70 + i * 24}" r="8" fill="${i < 2 ? C.mintDark : C.blob}"/><path d="M132 ${70 + i * 24}h${70 - (i % 2) * 18}" stroke="${C.stone}" stroke-width="5" stroke-linecap="round"/>`).join('')}
  <path d="M112 70l3 3 5-6M112 94l3 3 5-6" stroke="${C.paper}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  <path d="M226 170l30-50 8 5-30 50z" fill="${C.butter}"/><path d="M226 170l-3 10 10-5z" fill="${C.ink}"/>
`),
);

// budget card: a jar of coins with a separate "contingency" jar
write(
  'budget',
  svg(320, 220, `
  ${stage()}
  <rect x="78" y="70" width="90" height="112" rx="16" fill="${C.skyPale}" fill-opacity=".8"/>
  <rect x="86" y="58" width="74" height="16" rx="5" fill="${C.plumMid}"/>
  ${coins(123, 172, 6)}
  <rect x="190" y="110" width="62" height="72" rx="12" fill="${C.skyPale}" fill-opacity=".8"/>
  <rect x="196" y="100" width="50" height="13" rx="4" fill="${C.mintDark}"/>
  ${coins(221, 172, 2)}
  <path d="M172 120h14" stroke="${C.plum}" stroke-width="3" stroke-dasharray="3 3"/>
  <rect x="200" y="132" width="42" height="14" rx="3" fill="${C.paper}"/><path d="M206 139h30" stroke="${C.mintDark}" stroke-width="3"/>
`),
);

// approvals card: three homes with tick, tick, tick
write(
  'approvals',
  svg(320, 220, `
  ${stage()}
  <rect x="58" y="70" width="60" height="112" fill="${C.sand}"/><rect x="54" y="62" width="68" height="10" rx="3" fill="${C.coralDark}"/>
  ${windows(64, 80, 3, 5, 18, 18, 11, 9, C.sky)}
  <rect x="132" y="50" width="54" height="132" fill="${C.skyPale}"/><rect x="128" y="42" width="62" height="10" rx="3" fill="${C.steel}"/>
  ${Array.from({ length: 7 }, (_, r) => `<rect x="138" y="${60 + r * 17}" width="42" height="8" rx="2" fill="${C.sky}"/>`).join('')}
  <rect x="204" y="116" width="66" height="66" fill="${C.cream}"/><path d="M196 120l41-26 41 26z" fill="${C.woodDeep}"/>
  <rect x="228" y="148" width="18" height="34" fill="${C.plumMid}"/>
  ${[88, 159, 237].map((x) => `<circle cx="${x}" cy="40" r="15" fill="${C.mintDark}"/><path d="M${x - 7} 40l5 5 9-10" stroke="${C.paper}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`).join('')}
`),
);

// hdb card: an HDB block with a permit
write(
  'hdb',
  svg(320, 220, `
  ${stage()}
  <rect x="70" y="52" width="130" height="130" fill="${C.sand}"/>
  <rect x="64" y="44" width="142" height="12" rx="3" fill="${C.coralDark}"/>
  ${Array.from({ length: 6 }, (_, r) => `<rect x="70" y="${70 + r * 19}" width="130" height="2.5" fill="${C.sandDark}"/>`).join('')}
  ${windows(78, 60, 5, 6, 24, 19, 14, 9, C.sky)}
  <rect x="70" y="164" width="130" height="18" fill="${C.sandDark}"/>
  <rect x="200" y="96" width="70" height="88" rx="4" fill="${C.paper}" transform="rotate(6 235 140)"/>
  <g transform="rotate(6 235 140)"><rect x="200" y="96" width="70" height="16" rx="4" fill="${C.plum}"/><path d="M210 124h50M210 136h50M210 148h34" stroke="${C.stone}" stroke-width="3.5" stroke-linecap="round"/>
  <circle cx="252" cy="168" r="11" fill="${C.mintDark}"/><path d="M247 168l4 4 6-7" stroke="${C.paper}" stroke-width="2.5" fill="none" stroke-linecap="round"/></g>
`),
);

// condo card: a condo tower and a by-laws booklet
write(
  'condo',
  svg(320, 220, `
  ${stage()}
  <rect x="84" y="40" width="88" height="142" fill="${C.skyPale}"/>
  <rect x="78" y="32" width="100" height="10" rx="3" fill="${C.steel}"/>
  ${Array.from({ length: 8 }, (_, r) => `<rect x="90" y="${50 + r * 16}" width="76" height="9" rx="2" fill="${C.sky}"/><rect x="86" y="${60 + r * 16}" width="84" height="2.5" fill="${C.cream}"/>`).join('')}
  ${tree(62, 160, 16)}
  <rect x="196" y="98" width="72" height="88" rx="4" fill="${C.plumMid}"/>
  <rect x="204" y="98" width="64" height="88" rx="4" fill="${C.plum}"/>
  <rect x="214" y="112" width="44" height="20" rx="2" fill="${C.paper}"/>
  <path d="M220 120h32M220 126h22" stroke="${C.stone}" stroke-width="2.5"/>
  <path d="M214 148h44M214 158h44M214 168h30" stroke="${C.plumPale}" stroke-width="3" stroke-linecap="round"/>
`),
);

// landed card: a terrace house with an extension outlined
write(
  'landed',
  svg(320, 220, `
  ${stage()}
  <rect x="78" y="104" width="120" height="78" fill="${C.cream}"/>
  <path d="M68 108l70-46 70 46z" fill="${C.woodDeep}"/>
  ${windows(92, 120, 2, 1, 52, 0, 34, 24, C.skyPale)}
  <rect x="124" y="148" width="28" height="34" fill="${C.plumMid}"/>
  <rect x="198" y="118" width="64" height="64" fill="none" stroke="${C.plumMid}" stroke-width="3" stroke-dasharray="7 5"/>
  <path d="M198 118l32-20 32 20" fill="none" stroke="${C.plumMid}" stroke-width="3" stroke-dasharray="7 5"/>
  <path d="M212 176l28-40 6 4-28 40z" fill="${C.butter}"/>
  <rect x="60" y="178" width="214" height="4" fill="${C.stoneDark}"/>
`),
);

// trades card: licence card with a plug, a pipe and a flame
write(
  'trades',
  svg(320, 220, `
  ${stage()}
  <rect x="84" y="62" width="152" height="96" rx="10" fill="${C.paper}"/>
  <rect x="84" y="62" width="152" height="24" rx="10" fill="${C.plum}"/><rect x="84" y="76" width="152" height="10" fill="${C.plum}"/>
  <circle cx="118" cy="118" r="18" fill="${C.skin2}"/><path d="M100 140a18 14 0 0 1 36 0z" fill="${C.plumMid}"/>
  <path d="M148 108h68M148 122h54M148 136h62" stroke="${C.stone}" stroke-width="4" stroke-linecap="round"/>
  <rect x="64" y="170" width="38" height="16" rx="4" fill="${C.steel}"/><path d="M102 178h18" stroke="${C.steel}" stroke-width="4"/><path d="M74 170v-8M90 170v-8" stroke="${C.stoneDark}" stroke-width="4"/>
  <path d="M146 186v-16h24v16" stroke="${C.stoneDark}" stroke-width="8" fill="none"/>
  <path d="M232 186c-14 0-20-12-14-24 4 6 8 6 8 0 0-8 6-14 14-18-2 10 10 14 10 26 0 10-8 16-18 16z" fill="${C.coral}"/>
  <path d="M234 186c-6 0-9-6-6-11 2 3 5 3 5-1 4 2 8 5 8 8 0 3-3 4-7 4z" fill="${C.butter}"/>
`),
);

// designer-contractor card
write(
  'id-contractor',
  svg(320, 220, `
  ${stage()}
  <g transform="translate(-48 0) scale(1)">${person(160, 182, {
    shirt: C.plumMid,
    pants: C.ink,
    skin: C.skin2,
    hair: C.woodDeep,
    arms: `<rect x="133" y="98" width="10" height="34" rx="5" fill="${C.plumMid}"/>
           <path d="M178 102l18 14" stroke="${C.plumMid}" stroke-width="10" stroke-linecap="round"/>
           <rect x="190" y="104" width="26" height="32" rx="3" fill="${C.paper}"/>
           <rect x="194" y="110" width="9" height="9" fill="${C.mint}"/><rect x="205" y="110" width="8" height="9" fill="${C.coral}"/><rect x="194" y="122" width="19" height="8" fill="${C.wood}"/>
           <circle cx="138" cy="134" r="5" fill="${C.skin2}"/>`,
  })}</g>
  ${person(222, 182, {
    shirt: C.mintDark,
    pants: C.steel,
    skin: C.skin1,
    hat: 'hard',
    arms: `<rect x="195" y="98" width="10" height="34" rx="5" fill="${C.mintDark}"/>
           <path d="M240 104l14 18" stroke="${C.mintDark}" stroke-width="10" stroke-linecap="round"/>
           <path d="M252 122l10-18" stroke="${C.woodDeep}" stroke-width="5" stroke-linecap="round"/><rect x="254" y="94" width="20" height="10" rx="3" fill="${C.steel}"/>
           <circle cx="200" cy="134" r="5" fill="${C.skin1}"/>`,
  })}
`),
);

// quotes card
write(
  'quotes',
  svg(320, 220, `
  ${stage()}
  ${[0, 1, 2].map((i) => `<rect x="${70 + i * 62}" y="${50 + (i % 2) * 10}" width="88" height="120" rx="5" fill="${C.paper}" stroke="${C.line}" stroke-width="2"/>
  <path d="M${82 + i * 62} ${70 + (i % 2) * 10}h44" stroke="${[C.plum, C.mintDark, C.coralDark][i]}" stroke-width="6" stroke-linecap="round"/>
  ${[0, 1, 2, 3].map((r) => `<path d="M${82 + i * 62} ${88 + r * 16 + (i % 2) * 10}h${44 + ((r + i) % 3) * 8}" stroke="${C.stone}" stroke-width="3.5" stroke-linecap="round"/>`).join('')}`).join('')}
  <path d="M68 116h204" stroke="${C.butterDark}" stroke-width="16" stroke-opacity=".45" stroke-linecap="round"/>
`),
);

// contract card
write(
  'contract',
  svg(320, 220, `
  ${stage()}
  <rect x="92" y="34" width="128" height="156" rx="5" fill="${C.paper}"/>
  <path d="M108 56h70" stroke="${C.plum}" stroke-width="7" stroke-linecap="round"/>
  ${[0, 1, 2, 3, 4].map((r) => `<circle cx="112" cy="${82 + r * 18}" r="4" fill="${C.mintDark}"/><path d="M124 ${82 + r * 18}h${76 - (r % 2) * 16}" stroke="${C.stone}" stroke-width="4" stroke-linecap="round"/>`).join('')}
  <path d="M110 176c10-12 16 4 26-6s14 6 24-2" stroke="${C.plumMid}" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M206 186l40-58 8 6-40 58z" fill="${C.plumMid}"/><path d="M206 186l-3 10 10-6z" fill="${C.ink}"/>
`),
);

// payments card
write(
  'payments',
  svg(320, 220, `
  ${stage()}
  <rect x="56" y="60" width="208" height="16" rx="8" fill="${C.paper}"/>
  <rect x="56" y="60" width="130" height="16" rx="8" fill="${C.mintDark}"/>
  ${[80, 140, 200, 250].map((x, i) => `<circle cx="${x}" cy="68" r="7" fill="${i < 2 ? C.paper : C.blob}" stroke="${C.plum}" stroke-width="3"/>${coins(x, 168, i < 2 ? 3 : 1)}`).join('')}
  <path d="M80 82v60M140 82v60" stroke="${C.plum}" stroke-width="2" stroke-dasharray="3 4"/>
`),
);

// checks card: magnifier over a business registration card
write(
  'checks',
  svg(320, 220, `
  ${stage()}
  <rect x="70" y="58" width="160" height="108" rx="10" fill="${C.paper}"/>
  <rect x="84" y="74" width="40" height="40" rx="5" fill="${C.plumPale}"/>
  <path d="M136 80h78M136 94h60M136 108h70M84 132h130M84 146h100" stroke="${C.stone}" stroke-width="4" stroke-linecap="round"/>
  <circle cx="214" cy="128" r="30" fill="${C.mintPale}" fill-opacity=".7" stroke="${C.ink}" stroke-width="6"/>
  <path d="M203 128l8 8 14-16" stroke="${C.mintDark}" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M236 150l24 24" stroke="${C.ink}" stroke-width="10" stroke-linecap="round"/>
`),
);

// noise card: a clock and a drill
write(
  'hours',
  svg(320, 220, `
  ${stage()}
  <circle cx="120" cy="108" r="54" fill="${C.paper}" stroke="${C.plum}" stroke-width="8"/>
  ${Array.from({ length: 12 }, (_, i) => { const a = (i * Math.PI) / 6; return `<circle cx="${120 + 42 * Math.sin(a)}" cy="${108 - 42 * Math.cos(a)}" r="${i % 3 ? 2 : 3.5}" fill="${C.inkSoft}"/>`; }).join('')}
  <path d="M120 108V74M120 108l24 12" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/>
  <path d="M120 108L120 62A46 46 0 0 1 160 131z" fill="${C.mint}" fill-opacity=".45"/>
  <rect x="190" y="118" width="62" height="28" rx="8" fill="${C.coral}"/>
  <rect x="200" y="140" width="20" height="40" rx="5" fill="${C.coralDark}"/>
  <path d="M252 132h26" stroke="${C.steel}" stroke-width="6" stroke-linecap="round"/>
  <path d="M286 118c6 8 6 20 0 28M296 112c9 12 9 32 0 44" stroke="${C.plumMid}" stroke-width="3" fill="none" stroke-linecap="round"/>
`),
);

// debris card: hacked tiles in bags
write(
  'debris',
  svg(320, 220, `
  ${stage()}
  <path d="M70 182c-6-34 4-62 26-74l10-10h30l8 10c22 12 30 40 24 74z" fill="${C.steel}"/>
  <path d="M106 98c4-8 26-8 30 0" stroke="${C.stoneDark}" stroke-width="5" fill="none"/>
  <path d="M168 182c-4-26 2-48 20-58l8-8h24l6 8c18 10 24 32 20 58z" fill="${C.stoneDark}"/>
  ${[[250, 170, 20], [262, 178, -15], [238, 180, 8], [276, 168, 30]].map(([x, y, a]) => `<rect x="${x - 12}" y="${y - 6}" width="24" height="12" rx="1.5" fill="${C.tile}" stroke="${C.tileLine}" stroke-width="1.5" transform="rotate(${a} ${x} ${y})"/>`).join('')}
  <g fill="${C.sandDark}"><circle cx="56" cy="180" r="4"/><circle cx="48" cy="184" r="3"/><circle cx="160" cy="184" r="3.5"/></g>
`),
);

// living elsewhere card: boxes and a suitcase
write(
  'moving-out',
  svg(320, 220, `
  ${stage()}
  <rect x="64" y="122" width="72" height="60" rx="3" fill="${C.wood}"/><path d="M64 140h72" stroke="${C.woodDark}" stroke-width="3"/><rect x="92" y="122" width="16" height="20" fill="${C.sand}"/>
  <rect x="76" y="76" width="56" height="46" rx="3" fill="${C.woodDark}"/><path d="M76 90h56" stroke="${C.woodDeep}" stroke-width="3"/>
  <rect x="152" y="108" width="62" height="74" rx="10" fill="${C.plumMid}"/>
  <path d="M170 108v-12h26v12" stroke="${C.plum}" stroke-width="6" fill="none" stroke-linecap="round"/>
  <path d="M164 124v46M202 124v46" stroke="${C.plum}" stroke-width="4"/>
  <circle cx="164" cy="184" r="5" fill="${C.ink}"/><circle cx="202" cy="184" r="5" fill="${C.ink}"/>
  ${plant(246, 182)}
`),
);

// disputes card: two speech bubbles and a balance
write(
  'disputes',
  svg(320, 220, `
  ${stage()}
  <path d="M60 60h90a12 12 0 0 1 12 12v40a12 12 0 0 1-12 12h-58l-20 16v-16a12 12 0 0 1-12-12V72a12 12 0 0 1 12-12z" fill="${C.coral}"/>
  <path d="M170 82h90a12 12 0 0 1 12 12v40a12 12 0 0 1-12 12h-12v16l-20-16h-58a12 12 0 0 1-12-12V94a12 12 0 0 1 12-12z" fill="${C.mint}"/>
  <path d="M72 82h64M72 98h44M182 104h64M182 120h44" stroke="${C.paper}" stroke-width="5" stroke-linecap="round"/>
  <path d="M160 150v34M128 160h64" stroke="${C.plum}" stroke-width="5" stroke-linecap="round"/>
  <path d="M120 160l-10 16h20zM200 160l-10 16h20z" fill="${C.plumMid}"/>
  <rect x="146" y="182" width="28" height="6" rx="3" fill="${C.plum}"/>
`),
);

// kitchen card
write(
  'kitchen',
  svg(320, 220, `
  ${stage()}
  ${tiles(60, 72, 8, 2, 25, 18, C.paper, C.line)}
  <rect x="60" y="42" width="200" height="30" fill="${C.plumMid}"/><path d="M110 42v30M160 42v30M210 42v30" stroke="${C.plum}" stroke-width="2"/>
  <rect x="56" y="108" width="208" height="8" rx="2" fill="${C.sandDark}"/>
  <rect x="60" y="116" width="200" height="66" fill="${C.plumMid}"/>
  <path d="M110 116v66M160 116v66M210 116v66" stroke="${C.plum}" stroke-width="2"/>
  ${[100, 150, 200, 250].map((x) => `<rect x="${x - 6}" y="128" width="4" height="14" rx="2" fill="${C.butter}"/>`).join('')}
  <rect x="164" y="100" width="56" height="8" rx="2" fill="${C.ink}"/><circle cx="178" cy="104" r="5" fill="${C.steel}"/><circle cx="206" cy="104" r="5" fill="${C.steel}"/>
  <rect x="80" y="100" width="44" height="8" rx="3" fill="${C.skyPale}"/><path d="M102 100v-14c0-6 10-6 10 0" stroke="${C.steel}" stroke-width="3.5" fill="none"/>
`),
);

// bathroom card
write(
  'bathroom',
  svg(320, 220, `
  ${stage()}
  ${tiles(70, 40, 8, 6, 23, 23)}
  <rect x="70" y="160" width="184" height="22" fill="${C.tileLine}"/>
  <rect x="96" y="112" width="58" height="10" rx="4" fill="${C.paper}"/>
  <path d="M100 122h50l-6 22h-38z" fill="${C.paper}"/>
  <rect x="190" y="118" width="40" height="44" rx="10" fill="${C.paper}"/><rect x="186" y="96" width="48" height="26" rx="6" fill="${C.paper}"/>
  <rect x="112" y="60" width="26" height="40" rx="4" fill="${C.skyPale}" stroke="${C.paper}" stroke-width="3"/>
  <path d="M70 182h184" stroke="${C.mintDark}" stroke-width="5"/>
  <path d="M74 170c30 8 70 8 100 0s60-8 76 0" stroke="${C.mint}" stroke-width="3" fill="none" stroke-dasharray="6 5"/>
`),
);

// bedroom and living card
write(
  'living',
  svg(320, 220, `
  ${stage()}
  <rect x="64" y="56" width="74" height="60" rx="3" fill="${C.skyPale}"/><path d="M101 56v60M64 86h74" stroke="${C.paper}" stroke-width="4"/>
  <rect x="166" y="66" width="70" height="50" rx="3" fill="${C.mintPale}"/><path d="M178 104l18-22 14 14 10-8 12 16z" fill="${C.mintDark}"/>
  <rect x="70" y="138" width="150" height="34" rx="12" fill="${C.plumMid}"/>
  <rect x="62" y="126" width="22" height="50" rx="10" fill="${C.plum}"/><rect x="206" y="126" width="22" height="50" rx="10" fill="${C.plum}"/>
  <rect x="88" y="128" width="54" height="18" rx="8" fill="${C.plumPale}"/><rect x="146" y="128" width="54" height="18" rx="8" fill="${C.plumPale}"/>
  <rect x="80" y="172" width="8" height="10" fill="${C.ink}"/><rect x="202" y="172" width="8" height="10" fill="${C.ink}"/>
  <path d="M254 70v104M240 70h28l-6-20h-16z" stroke="${C.ink}" stroke-width="4" fill="${C.butter}"/>
`),
);

// windows card
write(
  'windows',
  svg(320, 220, `
  ${stage()}
  <rect x="88" y="44" width="144" height="128" rx="4" fill="${C.steel}"/>
  <rect x="98" y="54" width="60" height="108" fill="${C.sky}"/>
  <rect x="162" y="54" width="60" height="108" fill="${C.skyPale}"/>
  <path d="M104 70l22-12M104 92l40-22" stroke="${C.paper}" stroke-width="4" stroke-linecap="round" stroke-opacity=".8"/>
  <circle cx="168" cy="108" r="3" fill="${C.ink}"/>
  ${[64, 152].map((y) => `<circle cx="226" cy="${y}" r="4" fill="${C.butterDark}"/>`).join('')}
  <rect x="80" y="172" width="160" height="10" rx="2" fill="${C.sandDark}"/>
  <circle cx="254" cy="74" r="18" fill="${C.mintDark}"/><path d="M245 74l6 6 11-12" stroke="${C.paper}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
`),
);

// household shelter card: a thick door with a no-drill sign
write(
  'shelter',
  svg(320, 220, `
  ${stage()}
  <rect x="96" y="36" width="110" height="148" fill="${C.stone}"/>
  <rect x="108" y="48" width="86" height="136" fill="${C.steel}"/>
  <rect x="116" y="56" width="70" height="128" fill="${C.stoneDark}"/>
  <path d="M176 110h-14" stroke="${C.butter}" stroke-width="7" stroke-linecap="round"/>
  <rect x="124" y="66" width="54" height="16" rx="3" fill="${C.butter}"/>
  <circle cx="244" cy="96" r="30" fill="${C.paper}" stroke="${C.coralDark}" stroke-width="6"/>
  <path d="M230 96h26M256 92v8" stroke="${C.steel}" stroke-width="7" stroke-linecap="round"/>
  <path d="M223 75l42 42" stroke="${C.coralDark}" stroke-width="6" stroke-linecap="round"/>
`),
);

// =================================================================================================
// Site furniture: skyline strip above the footer, and the favicon.
// =================================================================================================
write(
  'skyline',
  svg(480, 64, `
  <g fill="${C.plumPale}">
    <rect x="0" y="22" width="54" height="42"/><rect x="60" y="8" width="40" height="56"/>
    <rect x="108" y="30" width="70" height="34"/><path d="M186 64V38l30-16 30 16v26z"/>
    <rect x="254" y="14" width="46" height="50"/><rect x="306" y="34" width="62" height="30"/>
    <rect x="374" y="4" width="36" height="60"/><rect x="416" y="26" width="64" height="38"/>
  </g>
  <g fill="${C.mint}"><circle cx="104" cy="50" r="10"/><circle cx="250" cy="52" r="9"/><circle cx="412" cy="50" r="10"/></g>
`),
);

writeFileSync(
  join(root, 'favicon.svg'),
  svg(64, 64, `
  <rect width="64" height="64" rx="14" fill="${C.plum}"/>
  <path d="M14 34L32 18l18 16v16H14z" fill="${C.cream}"/>
  <rect x="27" y="38" width="10" height="12" fill="${C.plum}"/>
  <path d="M40 14l10 10-14 14-10-10z" fill="${C.mint}"/>
  <path d="M26 28l-4 10 10-4z" fill="${C.mintDark}"/>
`).replace('width="64" height="64"', 'width="64" height="64"'),
);

console.log(`illustrations written to ${out}`);
