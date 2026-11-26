/**
 * The world's navigation data: one road through the places of Ishan's
 * journey, shared by the 3D scene (three.js) and the minimap (SVG).
 * Deliberately dependency-free so the minimap doesn't pull three.js into
 * the eager bundle.
 */

export type Pose = { x: number; z: number; heading: number };

// control polygon for the global plan (XZ ground plane), padded for catmull-rom
const CONTROL: [number, number][] = [
  [-6, 0], [0, 0], [10, 2], [20, -1], [30, -6], [40, -7], [50, -3], [60, 3],
  [70, 6], [80, 4], [90, -3], [100, -5], [110, -6], [120, -2], [128, 0], [134, 0],
];

const SAMPLE_N = 800;
const pts: { x: number; z: number; d: number }[] = [];

const cr = (p0: number, p1: number, p2: number, p3: number, u: number) => {
  const u2 = u * u;
  const u3 = u2 * u;
  return 0.5 * (2 * p1 + (-p0 + p2) * u + (2 * p0 - 5 * p1 + 4 * p2 - p3) * u2 + (-p0 + 3 * p1 - 3 * p2 + p3) * u3);
};

(() => {
  const segs = CONTROL.length - 3;
  let d = 0;
  let px = 0;
  let pz = 0;
  for (let i = 0; i <= SAMPLE_N; i++) {
    const g = (i / SAMPLE_N) * segs;
    const s = Math.min(segs - 1, Math.floor(g));
    const u = g - s;
    const [p0, p1, p2, p3] = [CONTROL[s], CONTROL[s + 1], CONTROL[s + 2], CONTROL[s + 3]];
    const x = cr(p0[0], p1[0], p2[0], p3[0], u);
    const z = cr(p0[1], p1[1], p2[1], p3[1], u);
    if (i > 0) d += Math.hypot(x - px, z - pz);
    pts.push({ x, z, d });
    px = x;
    pz = z;
  }
})();

export const PATH_LENGTH = pts[pts.length - 1].d;

/** Pose at normalized arc length t ∈ [0,1] along the plan. */
export const getPose = (t: number): Pose => {
  const target = Math.min(Math.max(t, 0), 1) * PATH_LENGTH;
  let lo = 0;
  let hi = pts.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (pts[mid].d < target) lo = mid + 1;
    else hi = mid;
  }
  const i = Math.max(1, lo);
  const a = pts[i - 1];
  const b = pts[i];
  const f = b.d === a.d ? 0 : (target - a.d) / (b.d - a.d);
  const x = a.x + (b.x - a.x) * f;
  const z = a.z + (b.z - a.z) * f;
  const j = Math.min(pts.length - 1, i + 4);
  const heading = Math.atan2(pts[j].x - a.x, pts[j].z - a.z);
  return { x, z, heading };
};

export const samplePath = (n: number): Pose[] =>
  Array.from({ length: n + 1 }, (_, i) => getPose(i / n));

/** Executed trajectory = plan + small lateral "localization" wobble. */
export const tracePose = (i: number, n: number) => {
  const p = getPose(i / n);
  const wob = Math.sin(i * 0.31) * 0.09 + Math.sin(i * 0.071) * 0.07;
  return { x: p.x + Math.cos(p.heading) * wob, z: p.z - Math.sin(p.heading) * wob };
};

export const WAYPOINTS = [
  { id: "home", label: "00 · BOOT" },
  { id: "about", label: "01 · AMRITSAR" },
  { id: "journey", label: "02 · IIT BOMBAY" },
  { id: "pune", label: "03 · PUNE" },
  { id: "projects", label: "04 · WORKSHOP" },
  { id: "research", label: "05 · THE VACUUM" },
  { id: "roscon", label: "06 · ROSCON" },
  { id: "contact", label: "07 · NEXT" },
].map((w, i, arr) => ({ ...w, t: i / (arr.length - 1) }));

const STOPS = WAYPOINTS.length - 1;
const HOLD = 0.17; // share of each scroll segment spent parked at either end

/** Scroll fraction → route progress, with a parked plateau at every stop. */
export const routeT = (frac: number) => {
  const g = Math.min(Math.max(frac, 0), 1) * STOPS;
  const i = Math.min(STOPS - 1, Math.floor(g));
  const u = Math.min(1, Math.max(0, (g - i - HOLD) / (1 - 2 * HOLD)));
  return (i + u * u * (3 - 2 * u)) / STOPS;
};

/**
 * Page scroll → route progress, timed off where each stop's section actually
 * starts (the hero is taller than one screen). Falls back to the plain scroll
 * fraction on the plain page, which doesn't carry every stop.
 */
export const scrollToRoute = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const y = window.scrollY;
  const anchors = WAYPOINTS.map((w, k) => (k === 0 ? 0 : document.getElementById(w.id)?.offsetTop));
  if (anchors.some((a) => a === undefined)) return routeT(max > 0 ? y / max : 0);
  const a = anchors.map((v, k) => (k === STOPS ? Math.min(v!, max) : v!));
  let i = 0;
  while (i < STOPS - 1 && y >= a[i + 1]) i++;
  const span = a[i + 1] - a[i];
  const u = span > 0 ? Math.min(1, Math.max(0, (y - a[i]) / span)) : 0;
  return routeT((i + u) / STOPS);
};

/** Screen-right of the road at progress t (where each place is built). */
export const rightOf = (t: number, d: number, along = 0) => {
  const p = getPose(t);
  return {
    x: p.x - Math.cos(p.heading) * d + Math.sin(p.heading) * along,
    z: p.z + Math.sin(p.heading) * d + Math.cos(p.heading) * along,
  };
};

// each place's footprint, for teleop bumpers and the minimap
export const OBSTACLES = WAYPOINTS.slice(1).map((w) => {
  const c = rightOf(w.t, 7, 7.5); // places sit 5.5 m up the road from the stop
  return { x: c.x, z: c.z, w: 7, d: 7, h: 3 };
});

export const BOUNDS = { minX: -8, maxX: 136, minZ: -32, maxZ: 32 };

/** Live state shared between the scene, the minimap and pokes. */
export const worldState = {
  t: 0, // smoothed progress, written by the 3D rig (or minimap fallback)
  spinTarget: 0,
  mode: "route" as "route" | "teleop",
  /** free-drive pose, valid in teleop mode */
  free: { x: 0, z: 0, heading: 0 },
  /** teleop command targets: linear m/s, angular rad/s (+ = left) */
  cmd: { v: 0, w: 0 },
};

/** AABB collision against obstacles + map bounds, inflated by robot radius. */
export const collides = (x: number, z: number) => {
  if (
    x < BOUNDS.minX + 1 ||
    x > BOUNDS.maxX - 1 ||
    z < BOUNDS.minZ + 1 ||
    z > BOUNDS.maxZ - 1
  )
    return true;
  const r = 0.85;
  return OBSTACLES.some(
    (o) => Math.abs(x - o.x) < o.w / 2 + r && Math.abs(z - o.z) < o.d / 2 + r
  );
};
