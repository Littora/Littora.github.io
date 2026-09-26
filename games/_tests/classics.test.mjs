import test from 'node:test';
import assert from 'node:assert/strict';
import {move2048,spawn2048,has2048Moves,snakeFood,stepSnake,neighbors,createMinefield,revealMinefield,chordMinefield,minefieldWon} from '../classic-engine.mjs';

test('2048 merges each tile once, adds the resulting values, and preserves input',()=>{
  const board=[2,2,2,2,4,4,8,0,0,0,0,0,0,0,0,0],original=[...board];
  const result=move2048(board,'left');assert.deepEqual(result.board.slice(0,8),[4,4,0,0,8,8,0,0]);assert.equal(result.score,16);assert.deepEqual(board,original);
});
test('2048 directions preserve order and vertical merges work',()=>{
  const board=[2,0,0,0,2,0,0,0,4,0,0,0,4,0,0,0];
  assert.deepEqual(move2048(board,'up').board,[4,0,0,0,8,0,0,0,0,0,0,0,0,0,0,0]);
  assert.deepEqual(move2048(board,'down').board,[0,0,0,0,0,0,0,0,4,0,0,0,8,0,0,0]);
  assert.deepEqual(move2048([2,2,4,0,...Array(12).fill(0)],'right').board.slice(0,4),[0,0,4,4]);
});
test('2048 detects a blocked board and never overwrites an occupied tile when spawning',()=>{
  const full=[2,4,2,4,4,2,4,2,2,4,2,4,4,2,4,2];assert.equal(has2048Moves(full),false);assert.deepEqual(spawn2048(full),full);
  const open=[...full];open[0]=0;assert.equal(has2048Moves(open),true);const spawned=spawn2048(open,()=>0);assert.equal(spawned[0],2);assert.deepEqual(spawned.slice(1),full.slice(1));
});
test('snake grows on food, rejects walls and its body, but permits a vacating tail square',()=>{
  const body=[{x:1,y:1},{x:1,y:2},{x:0,y:2},{x:0,y:1}];
  const tail=stepSnake(body,{x:-1,y:0},{x:3,y:3},4);assert.equal(tail.dead,false);assert.equal(tail.body.length,4);
  assert.equal(stepSnake(body,{x:0,y:1},null,4).dead,true);
  const ate=stepSnake(body,{x:1,y:0},{x:2,y:1},4);assert.equal(ate.ate,true);assert.equal(ate.body.length,5);
  assert.equal(stepSnake([{x:0,y:0}],{x:-1,y:0},null,4).dead,true);
});
test('snake food never occupies the body, and a full lawn has no food',()=>{
  const body=[{x:0,y:0},{x:1,y:0},{x:0,y:1}];assert.deepEqual(snakeFood(body,2,()=>0),{x:1,y:1});assert.equal(snakeFood([...body,{x:1,y:1}],2),null);
});
test('Minesweeper has the requested mine count and protects all first-step neighbours',()=>{
  for(const [cols,count] of [[9,10],[12,22]])for(const first of [0,cols+1,cols*cols-1]){
    const field=createMinefield(cols,cols,count,first,()=>.37);assert.equal(field.filter(n=>n===-1).length,count);assert.equal(field[first],0);
    assert.ok(neighbors(first,cols,cols).every(n=>field[n]!==-1));
    field.forEach((n,i)=>{if(n!==-1)assert.equal(n,neighbors(i,cols,cols).filter(j=>field[j]===-1).length);});
  }
  assert.deepEqual(neighbors(0,3,3),[1,3,4]);
});
test('Minesweeper flood fill respects flags, reveals numbers, and never opens mines',()=>{
  const field=[0,1,-1,0,1,1,0,0,0],flags=Array(9).fill(false);flags[6]=true;
  const result=revealMinefield(field,Array(9).fill(false),flags,0,3,3);assert.equal(result.hit,false);assert.equal(result.revealed[2],false);assert.equal(result.revealed[6],false);assert.equal(result.revealed[1],true);assert.equal(result.revealed[8],true);
  assert.equal(minefieldWon(field,result.revealed),false);
  flags[6]=false;const completed=revealMinefield(field,result.revealed,flags,6,3,3);assert.equal(minefieldWon(field,completed.revealed),true);
});
test('Minesweeper chording needs matching flag count and incorrect flags can lose',()=>{
  const field=[-1,1,0,1,1,0,0,0,0],revealed=Array(9).fill(false),flags=Array(9).fill(false);revealed[4]=true;
  assert.deepEqual(chordMinefield(field,revealed,flags,4,3,3).revealed,revealed);
  flags[0]=true;const good=chordMinefield(field,revealed,flags,4,3,3);assert.equal(good.hit,false);assert.equal(minefieldWon(field,good.revealed),true);
  flags[0]=false;flags[8]=true;assert.equal(chordMinefield(field,revealed,flags,4,3,3).hit,true);
});
