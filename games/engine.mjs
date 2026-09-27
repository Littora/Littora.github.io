// Game rules have no dependency on the page, drawing, or browser storage.
export function seededRandom(seed) {
  let state = seed >>> 0;
  return () => { state += 0x6D2B79F5; let t = state; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
export const DIRECTIONS = [[1, 0], [0, 1], [-1, 0], [0, -1]];
export const LIGHT_LEVELS = [
  { source: 3, mirrors: [[2,3,0],[2,1,0]], beacons: [[5,1]], rocks: [[4,3],[1,5]] },
  { source: 4, mirrors: [[1,4,0],[1,1,0],[5,1,1]], beacons: [[3,1],[5,5]], rocks: [[3,4],[4,5]] },
  { source: 3, mirrors: [[2,3,0],[2,1,0],[5,1,1],[5,5,0]], beacons: [[4,1],[5,3],[1,5]], rocks: [[4,3],[1,2]], decoys: [[0,6,0],[6,6,1]] },
  { source: 5, mirrors: [[1,5,0],[1,2,0],[4,2,1],[4,6,0],[0,6,1]], beacons: [[3,2],[4,4],[0,3]], rocks: [[3,5],[5,4]], decoys: [[6,1,0]] },
  { source: 1, mirrors: [[5,1,1],[5,5,0],[2,5,1],[2,3,0],[6,3,0]], beacons: [[3,1],[5,4],[4,3],[6,0]], rocks: [[1,4],[3,6]], decoys: [[0,6,1],[4,0,0]] },
  { source: 6, mirrors: [[3,6,0],[3,1,1],[0,1,0],[0,4,1],[6,4,0],[6,0,1]], beacons: [[3,3],[0,2],[4,4],[2,0]], rocks: [[4,6],[2,2]], decoys: [[5,2,1]] },
  { source: 2, mirrors: [[1,2,1],[1,5,1],[5,5,0],[5,0,1],[3,0,0],[3,3,1],[6,3,0]], beacons: [[1,4],[3,5],[5,2],[3,2],[6,1]], rocks: [[4,2],[0,0]], decoys: [[0,6,0],[6,6,1]] },
  { source: 0, mirrors: [[6,0,1],[6,6,0],[0,6,1],[0,3,0],[4,3,0],[4,1,1],[2,1,0],[2,4,1],[5,4,0]], beacons: [[3,0],[6,3],[2,6],[1,3],[4,2],[2,2],[5,2]], rocks: [[1,1],[3,5]] },
  { source: 3, mirrors: [[2,3,0],[2,0,0],[6,0,1],[6,6,0],[0,6,1],[0,1,0],[4,1,1],[4,4,0],[1,4,1],[1,2,0],[5,2,1],[5,5,0],[3,5,1]], beacons: [[2,1],[4,0],[6,4],[2,6],[0,3],[3,1],[4,3],[2,4],[1,3],[3,2],[5,4],[3,3]], rocks: [] }
];
export function traceLight(level, mirrors) {
  let x = -1, y = level.source, direction = 0;
  const points = [[x, y]], lit = new Set(), seen = new Set();
  const lookup = new Map(mirrors.map(m => [m.x + ',' + m.y, m]));
  const rocks = new Set(level.rocks.map(p => p.join(',')));
  const beacons = new Set(level.beacons.map(p => p.join(',')));
  for (let i = 0; i < 220; i++) {
    x += DIRECTIONS[direction][0]; y += DIRECTIONS[direction][1]; points.push([x, y]);
    if (x < 0 || x > 6 || y < 0 || y > 6) break;
    const key = x + ',' + y, visit = key + ',' + direction;
    if (seen.has(visit) || rocks.has(key)) break;
    seen.add(visit);
    if (beacons.has(key)) lit.add(key);
    const mirror = lookup.get(key);
    if (mirror) direction = (mirror.rotation === 0 ? [3,2,1,0] : [1,0,3,2])[direction];
  }
  return { points, lit, solved: lit.size === level.beacons.length };
}
export function createMirrors(index) {
  const level = LIGHT_LEVELS[index], random = seededRandom(971 + index * 17);
  const mirrors = [...level.mirrors, ...(level.decoys || [])].map(([x,y,solution]) => ({ x,y,solution,rotation:random() > .5 ? 1 : 0 }));
  if (traceLight(level, mirrors).solved) mirrors[0].rotation ^= 1;
  return mirrors;
}
export function connectedCoral(board, index) {
  const value = board[index], group = [], visited = new Set(), stack = [index];
  if (!value) return group;
  while (stack.length) {
    const i = stack.pop();
    if (visited.has(i) || board[i] !== value) continue;
    visited.add(i); group.push(i);
    const x = i % 5, y = Math.floor(i / 5);
    if (x) stack.push(i - 1); if (x < 4) stack.push(i + 1); if (y) stack.push(i - 5); if (y < 4) stack.push(i + 5);
  }
  return group;
}
export function placeCoral(board, index, value) {
  if (!Number.isInteger(index) || index < 0 || index >= 25 || board[index]) return null;
  const next = board.slice(), merges = []; let score = 0;
  next[index] = value;
  while (next[index] < 6) {
    const group = connectedCoral(next, index);
    if (group.length < 3) break;
    const tier = next[index]; group.forEach(i => { next[i] = 0; }); next[index] = tier + 1;
    score += group.length * Math.pow(3, tier) * 10;
    merges.push({ group, tier: tier + 1 });
  }
  return { board: next, score: score + value * 5, merges, full: next.every(Boolean) };
}
export function nextSeed(random = Math.random) { const n = random(); return n < .76 ? 1 : n < .96 ? 2 : 3; }
export function oceanCurrent(x, y, time) {
  return { x: Math.sin(y / 220 + time * .12) * 13 + Math.cos(x / 340) * 7, y: Math.cos(x / 260 - time * .09) * 11 };
}
export function createOcean(seed = 2026) {
  const random = seededRandom(seed), islands = [], lights = [];
  for (let gy = -4; gy <= 4; gy++) for (let gx = -4; gx <= 4; gx++) {
    const x = gx * 340 + (random() - .5) * 150, y = gy * 340 + (random() - .5) * 150;
    if (Math.hypot(x, y) > 230) islands.push({ x, y, r: 38 + random() * 35, shape: random() * 6 });
  }
  for (let i = 0; i < 75; i++) {
    let x, y, attempts = 0;
    do { x = (random() - .5) * 2650; y = (random() - .5) * 2650; attempts++; } while (attempts < 100 && (Math.hypot(x,y) < 120 || islands.some(island => Math.hypot(x-island.x,y-island.y) < island.r + 44)));
    lights.push({ x, y, collected: false, phase: random() * Math.PI * 2 });
  }
  // An inviting trail within reach of the starting cove.
  lights.push(...[[0,-115],[100,-180],[190,-140],[-120,-70]].map(([x,y]) => ({x,y,collected:false,phase:random()*6})));
  return { islands, lights };
}
export function stepBoat(boat, input, dt, time, world) {
  dt = Math.max(0, Math.min(dt, .04));
  const magnitude = Math.hypot(input.x, input.y), current = oceanCurrent(boat.x,boat.y,time);
  const ax = magnitude > 1 ? input.x / magnitude : input.x, ay = magnitude > 1 ? input.y / magnitude : input.y;
  const damping = Math.exp(-2.1 * dt);
  boat.vx = (boat.vx + (ax * 230 + current.x * 2.1) * dt) * damping;
  boat.vy = (boat.vy + (ay * 230 + current.y * 2.1) * dt) * damping;
  boat.x += boat.vx * dt; boat.y += boat.vy * dt;
  boat.x = Math.max(-1450,Math.min(1450,boat.x)); boat.y = Math.max(-1450,Math.min(1450,boat.y));
  for (const island of world.islands) {
    const dx = boat.x - island.x, dy = boat.y - island.y, distance = Math.hypot(dx,dy), radius = island.r + 11;
    if (distance < radius) {
      const nx = distance ? dx / distance : 1, ny = distance ? dy / distance : 0;
      boat.x = island.x + nx * radius; boat.y = island.y + ny * radius;
      const inward = boat.vx * nx + boat.vy * ny;
      if (inward < 0) { boat.vx -= inward * nx; boat.vy -= inward * ny; }
    }
  }
  const found = [];
  for (const light of world.lights) if (!light.collected && Math.hypot(boat.x-light.x,boat.y-light.y) < 25) { light.collected = true; found.push(light); }
  return found;
}
