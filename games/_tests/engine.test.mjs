import test from 'node:test';
import assert from 'node:assert/strict';
import { LIGHT_LEVELS, traceLight, createMirrors, placeCoral, connectedCoral, seededRandom, createOcean, stepBoat } from '../engine.mjs';

test('all nine authored light puzzles are solvable, and begin unsolved', () => {
  for (const [index,level] of LIGHT_LEVELS.entries()) {
    const solution=[...level.mirrors,...(level.decoys||[])].map(([x,y,rotation])=>({x,y,rotation}));
    assert.equal(traceLight(level,solution).solved,true,'chapter '+(index+1));
    assert.equal(traceLight(level,createMirrors(index)).solved,false,'scramble '+(index+1));
    const positions=solution.map(m=>m.x+','+m.y);
    assert.equal(new Set(positions).size,positions.length,'unique mirror locations');
    for(const beacon of level.beacons)assert.ok(!positions.includes(beacon.join(',')),'beacons remain visible');
  }
});
test('light stops at stone and cyclic paths are bounded', () => {
  const blocked={source:0,rocks:[[1,0]],beacons:[[2,0]]};
  assert.equal(traceLight(blocked,[]).lit.size,0);
  const result=traceLight({source:1,rocks:[],beacons:[[6,6]]},[{x:1,y:1,rotation:1},{x:1,y:3,rotation:1},{x:3,y:3,rotation:0},{x:3,y:1,rotation:0}]);
  assert.ok(result.points.length<=221);
});
test('coral matching does not wrap across row boundaries or connect diagonally', () => {
  const board=Array(25).fill(0);board[4]=board[5]=board[10]=1;
  assert.deepEqual(connectedCoral(board,4),[4]);
  assert.equal(placeCoral(board,9,1).merges.length,0);
});
test('three matching corals merge at the planted position without mutating input', () => {
  const board=Array(25).fill(0);board[0]=board[1]=1;
  const result=placeCoral(board,2,1);
  assert.equal(board[2],0);assert.equal(result.board[2],2);
  assert.equal(result.board[0],0);assert.equal(result.board[1],0);
  assert.equal(result.merges.length,1);assert.equal(result.score,95);
  assert.equal(placeCoral(board,0,1),null);assert.equal(placeCoral(board,-1,1),null);
});
test('coral chains, groups larger than three, and maximum-tier saturation behave correctly', () => {
  const chain=Array(25).fill(0);chain[0]=chain[1]=1;chain[7]=chain[12]=2;
  const result=placeCoral(chain,2,1);
  assert.equal(result.merges.length,2);assert.equal(result.board[2],3);
  const large=Array(25).fill(0);[6,8,2,12].forEach(i=>large[i]=1);
  assert.equal(placeCoral(large,7,1).merges[0].group.length,5);
  const crown=Array(25).fill(6);crown[0]=0;
  assert.equal(placeCoral(crown,0,6).merges.length,0);
  assert.equal(placeCoral(crown,0,6).full,true);
});
test('ocean generation is repeatable and collectibles are reachable outside rocks', () => {
  const a=createOcean(),b=createOcean();assert.deepEqual(a,b);
  for(const light of a.lights)assert.ok(a.islands.every(island=>Math.hypot(light.x-island.x,light.y-island.y)>island.r+25));
  const r1=seededRandom(10),r2=seededRandom(10);assert.equal(r1(),r2());
});
test('sailing collision resolves zero distance and collection occurs only once', () => {
  const boat={x:0,y:0,vx:0,vy:0},world={islands:[{x:0,y:0,r:50}],lights:[]};
  stepBoat(boat,{x:0,y:0},0,0,world);
  assert.ok(Number.isFinite(boat.x)&&Math.hypot(boat.x,boat.y)>=61);
  const collector={x:0,y:0,vx:0,vy:0},lights={islands:[],lights:[{x:0,y:0,collected:false}]};
  assert.equal(stepBoat(collector,{x:0,y:0},0,0,lights).length,1);
  assert.equal(stepBoat(collector,{x:0,y:0},0,0,lights).length,0);
});
test('frame delays stay bounded and diagonal steering has no speed advantage', () => {
  const world={islands:[],lights:[]};const straight={x:0,y:0,vx:0,vy:0},diagonal={...straight};
  stepBoat(straight,{x:1,y:0},100,0,world);stepBoat(diagonal,{x:1,y:1},100,0,world);
  assert.ok(Math.hypot(straight.vx,straight.vy)<15);assert.ok(Math.hypot(diagonal.vx,diagonal.vy)<15);
  assert.ok(Math.abs(Math.hypot(straight.vx,straight.vy)-Math.hypot(diagonal.vx,diagonal.vy))<1);
});
