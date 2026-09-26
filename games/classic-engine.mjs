// Pure rules for three familiar classics. UI, animation and storage live separately.
export function move2048(board, direction) {
  if (!['left','right','up','down'].includes(direction)) return {board:[...board],score:0,changed:false};
  const result=[...board];let score=0;const merged=[];
  for(let line=0;line<4;line++) {
    const indices=Array.from({length:4},(_,i)=>direction==='left'?line*4+i:direction==='right'?line*4+3-i:direction==='up'?i*4+line:(3-i)*4+line);
    const values=indices.map(i=>board[i]).filter(Boolean),out=[];
    for(let i=0;i<values.length;i++) {
      if(values[i]===values[i+1]){const value=values[i]*2;score+=value;merged.push(indices[out.length]);out.push(value);i++;}
      else out.push(values[i]);
    }
    indices.forEach((index,i)=>result[index]=out[i]||0);
  }
  return {board:result,score,merged,changed:result.some((n,i)=>n!==board[i])};
}
export function spawn2048(board, random=Math.random) {
  const empty=board.flatMap((n,i)=>n===0?[i]:[]);if(!empty.length)return [...board];
  const result=[...board];result[empty[Math.min(empty.length-1,Math.floor(random()*empty.length))]]=random()<.9?2:4;return result;
}
export function has2048Moves(board){return board.includes(0)||['left','up'].some(dir=>move2048(board,dir).changed);}

export function snakeFood(body,size,random=Math.random){
  const occupied=new Set(body.map(p=>p.y*size+p.x));const empty=[];
  for(let i=0;i<size*size;i++)if(!occupied.has(i))empty.push(i);
  if(!empty.length)return null;const index=empty[Math.min(empty.length-1,Math.floor(random()*empty.length))];return {x:index%size,y:Math.floor(index/size)};
}
export function stepSnake(body,direction,food,size){
  const head={x:body[0].x+direction.x,y:body[0].y+direction.y},ate=Boolean(food&&head.x===food.x&&head.y===food.y);
  // The tail vacates its square unless this move eats a fruit.
  const collision=head.x<0||head.y<0||head.x>=size||head.y>=size||body.slice(0,ate?body.length:-1).some(p=>p.x===head.x&&p.y===head.y);
  if(collision)return {body,ate:false,dead:true};
  return {body:[head,...body.slice(0,ate?body.length:body.length-1)],ate,dead:false};
}

export function neighbors(index,cols,rows){
  const x=index%cols,y=Math.floor(index/cols),result=[];
  for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if((dx||dy)&&x+dx>=0&&x+dx<cols&&y+dy>=0&&y+dy<rows)result.push((y+dy)*cols+x+dx);
  return result;
}
export function createMinefield(cols,rows,count,safe,random=Math.random){
  const excluded=new Set([safe,...neighbors(safe,cols,rows)]);
  const candidates=Array.from({length:cols*rows},(_,i)=>i).filter(i=>!excluded.has(i));
  for(let i=candidates.length-1;i>0;i--){const j=Math.min(i,Math.floor(random()*(i+1)));[candidates[i],candidates[j]]=[candidates[j],candidates[i]];}
  const mines=new Set(candidates.slice(0,Math.min(count,candidates.length)));
  return Array.from({length:cols*rows},(_,i)=>mines.has(i)?-1:neighbors(i,cols,rows).filter(n=>mines.has(n)).length);
}
export function revealMinefield(field,revealed,flags,index,cols,rows){
  const result=[...revealed];if(flags[index]||result[index])return {revealed:result,hit:false};
  if(field[index]===-1){result[index]=true;return {revealed:result,hit:true};}
  const queue=[index];result[index]=true;
  while(queue.length){const current=queue.pop();if(field[current]!==0)continue;for(const next of neighbors(current,cols,rows))if(!result[next]&&!flags[next]&&field[next]!==-1){result[next]=true;queue.push(next);}}
  return {revealed:result,hit:false};
}
export function chordMinefield(field,revealed,flags,index,cols,rows){
  if(!revealed[index]||field[index]<=0)return {revealed:[...revealed],hit:false};
  const nearby=neighbors(index,cols,rows);if(nearby.filter(n=>flags[n]).length!==field[index])return {revealed:[...revealed],hit:false};
  let result=[...revealed],hit=false;
  for(const n of nearby){const move=revealMinefield(field,result,flags,n,cols,rows);result=move.revealed;hit ||= move.hit;}
  return {revealed:result,hit};
}
export function minefieldWon(field,revealed){return field.every((n,i)=>n===-1||revealed[i]);}
