/**
 * The world's navigation data: a smooth global plan through a field of
 * obstacles, shared by the 3D scene (three.js) and the minimap (SVG).
 * Deliberately dependency-free so the minimap doesn't pull three.js into
 * the eager bundle.
 */

export type Pose = { x: number; z: number; heading: number };

// control polygon for the global plan (XZ ground plane), padded for catmull-rom
const CONTROL: [number, number][] = [
  [-2, 0], [0, 0], [5, 0.6], [10, -2.6], [16, 1.6], [22, -1.2],
  [28, 3.6], [34, -2.2], [40, 1.2], [45, 0], [47, 0],
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
  { id: "about", label: "01 · MISSION" },
  { id: "journey", label: "02 · JOURNEY" },
  { id: "research", label: "03 · RESEARCH" },
  { id: "projects", label: "04 · PROJECTS" },
  { id: "expertise", label: "05 · STACK" },
  { id: "contact", label: "06 · GOAL" },
].map((w, i, arr) => ({ ...w, t: i / (arr.length - 1) }));

// obstacles the plan visibly swerves around, plus far scenery blocks
export const OBSTACLES = [
  { x: 10, z: 0.8, w: 2.2, d: 1.6, h: 1.6 },
  { x: 15.5, z: -1.4, w: 1.6, d: 1.6, h: 2.4 },
  { x: 21.5, z: 1.8, w: 2.6, d: 1.8, h: 1.2 },
  { x: 27, z: 0.4, w: 1.4, d: 2.4, h: 2.0 },
  { x: 33.5, z: 0.8, w: 2.0, d: 1.4, h: 1.8 },
  { x: 38.5, z: -2.6, w: 1.6, d: 1.6, h: 1.4 },
  { x: 5, z: 7, w: 3, d: 2, h: 2.6 },
  { x: 19, z: -8, w: 2.4, d: 3, h: 3.2 },
  { x: 31, z: 8, w: 3.4, d: 2.2, h: 2.2 },
  { x: 43, z: 6, w: 2, d: 2, h: 2.8 },
];

export const BOUNDS = { minX: -4, maxX: 48, minZ: -13, maxZ: 13 };

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
