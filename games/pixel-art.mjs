import { seededRandom, oceanCurrent } from './engine.mjs';

// All artwork is rasterized on a genuinely low-resolution surface, then enlarged
// without interpolation. The sea, islands, wakes and boat share one pixel grid.
export function createPixelRenderer(canvas) {
  const screen=canvas.getContext('2d'),buffer=document.createElement('canvas'),ctx=buffer.getContext('2d');
  const islands=new Map();let width=800,height=420,ratio=1;
  const unit=3;
  const boatSprite=document.createElement('canvas');boatSprite.width=13;boatSprite.height=21;
  const boatCtx=boatSprite.getContext('2d');
  const sprite=[
    '......n......','.....nwn.....','....nwwwn....','....nwwwn....','...nwwwwwn...',
    '...nwwrwwn...','...nwwrwwn...','...nwwrwwn...','...nwwwwwn...',
    '...nwwwwwn...','..onwwwwwno..','..onnnnnnno..','...nwwwwwn...',
    '...nwwwwwn...','....nwwwn....','....nwwwn....','.....nwn.....','......n......'
  ];
  const palette={n:'#30536c',w:'#fff7de',r:'#ee8860',o:'#bd8350'};
  sprite.forEach((row,y)=>[...row].forEach((pixel,x)=>{if(palette[pixel]){boatCtx.fillStyle=palette[pixel];boatCtx.fillRect(x,y,1,1);}}));
  function islandSprite(island){
    const key=island.x+','+island.y;if(islands.has(key))return islands.get(key);
    const r=island.r/unit,pad=10,size=Math.ceil((r+pad)*2),art=document.createElement('canvas');art.width=art.height=size;
    const a=art.getContext('2d'),c=size/2,random=seededRandom(Math.floor((island.x+1500)*719+(island.y+1500)*313));
    for(let y=0;y<size;y++)for(let x=0;x<size;x++){
      const dx=x-c,dy=y-c,angle=Math.atan2(dy,dx),d=Math.hypot(dx,dy),edge=r*(1+.055*Math.sin(angle*3+island.shape)+.03*Math.cos(angle*5-island.shape));
      let color='';
      if(d<edge+7)color='#77c9ca';
      if(d<edge+4)color='#a7e3d8';
      if(d<edge+1.2)color='#eedcac';
      if(d<edge-2)color='#6aab79';
      if(d<edge-4)color=random()>.87?'#a1c681':'#83b984';
      if(d<edge-7&&y<c)color=random()>.92?'#b8d59c':'#98c58e';
      if(color){a.fillStyle=color;a.fillRect(x,y,1,1);}
    }
    // Little palm trees, rocks and flowers give each island an identity.
    const trees=1+Math.floor(r/10);
    for(let i=0;i<trees;i++){
      const tx=Math.floor(c+(random()-.5)*r),ty=Math.floor(c+(random()-.5)*r);
      a.fillStyle='#63835c';a.fillRect(tx-3,ty+5,10,2);
      a.fillStyle='#aa7750';a.fillRect(tx,ty,2,7);a.fillStyle='#4b8b64';a.fillRect(tx-5,ty-1,12,3);a.fillRect(tx-2,ty-4,5,8);
      a.fillStyle='#67a66e';a.fillRect(tx-4,ty-3,10,2);a.fillRect(tx-1,ty-6,3,4);
      a.fillStyle='#c9dab1';a.fillRect(tx-3,ty-3,4,1);
    }
    for(let i=0;i<3;i++){const x=Math.floor(c+(random()-.5)*r*1.2),y=Math.floor(c+(random()-.5)*r*1.2);a.fillStyle='#f5e5ab';a.fillRect(x,y,2,2);a.fillStyle='#d9a45c';a.fillRect(x+1,y,1,1);}
    const result={art,c};islands.set(key,result);return result;
  }
  function resize(w,h,dpr=1){width=w;height=h;ratio=dpr;buffer.width=Math.ceil(width/unit);buffer.height=Math.ceil(height/unit);canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);screen.imageSmoothingEnabled=false;ctx.imageSmoothingEnabled=false;}
  function draw({world,boat,camera,time,heading,trail,reducedMotion}){
    const w=buffer.width,h=buffer.height,toX=x=>Math.round((x-camera.x)/unit+w/2),toY=y=>Math.round((y-camera.y)/unit+h/2);
    ctx.fillStyle='#88d4dc';ctx.fillRect(0,0,w,h);
    const left=camera.x-width/2,top=camera.y-height/2,phase=reducedMotion?0:Math.floor(time*1.5)%4;
    for(let gy=Math.floor(top/75)*75;gy<top+height+100;gy+=75)for(let gx=Math.floor(left/95)*95;gx<left+width+100;gx+=95){
      const x=toX(gx)+Math.round(Math.sin(gy/90)*9),y=toY(gy),shift=(Math.floor(gx/95)+Math.floor(gy/75)+phase)%4;
      ctx.fillStyle='#b5e7e6';ctx.fillRect(x+shift,y,7,1);ctx.fillRect(x+shift+8,y+1,4,1);
      ctx.fillStyle='#70becf';ctx.fillRect(x+17,y+13,3,1);ctx.fillRect(x+20,y+12,5,1);
      if((Math.floor(gx/95)+Math.floor(gy/75))%3===0){ctx.fillStyle='#c9efeb';ctx.fillRect(x-5,y+20,2,1);}
    }
    // Sparse current arrows are helpful landmarks rather than a visual overlay.
    for(let gy=Math.floor(top/270)*270;gy<top+height+270;gy+=270)for(let gx=Math.floor(left/270)*270;gx<left+width+270;gx+=270){
      const current=oceanCurrent(gx,gy,time),x=toX(gx),y=toY(gy),a=Math.atan2(current.y,current.x);ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.fillStyle='#64b6c5';ctx.fillRect(-3,0,7,1);ctx.fillRect(2,-1,1,3);ctx.fillRect(1,-2,1,5);ctx.restore();
    }
    for(const island of world.islands){if(Math.abs(island.x-camera.x)>width/2+island.r+40||Math.abs(island.y-camera.y)>height/2+island.r+40)continue;const {art,c}=islandSprite(island);ctx.drawImage(art,toX(island.x)-Math.round(c),toY(island.y)-Math.round(c));}
    for(const light of world.lights){if(light.collected)continue;const x=toX(light.x),y=toY(light.y);if(x<-15||y<-15||x>w+15||y>h+15)continue;
      const blink=reducedMotion?0:Math.floor(time*3+light.phase)%3;ctx.fillStyle='#ecdf9f';ctx.fillRect(x-5,y-2,11,5);ctx.fillRect(x-2,y-5,5,11);ctx.fillStyle='#c88742';ctx.fillRect(x-1,y-4,3,9);ctx.fillRect(x-4,y-1,9,3);ctx.fillStyle='#fff2b3';ctx.fillRect(x-1,y-3,2,7);ctx.fillRect(x-3,y-1,7,2);ctx.fillStyle='#fffbe1';ctx.fillRect(x,y,1,1);
      if(blink===0){ctx.fillStyle='#f3fbda';ctx.fillRect(x-7,y-6,1,1);ctx.fillRect(x+6,y+5,1,1);}
    }
    if(!reducedMotion){ctx.fillStyle='#d4f1e8';trail.forEach((p,i)=>{if(i%3===0)ctx.fillRect(toX(p.x),toY(p.y),i>trail.length-15?2:1,1);});}
    const bx=toX(boat.x),by=toY(boat.y);ctx.save();ctx.translate(bx,by);ctx.rotate(Math.round((heading+Math.PI/2)/(Math.PI/8))*Math.PI/8);ctx.fillStyle='#4a9dbb';ctx.fillRect(-5,-6,12,17);ctx.drawImage(boatSprite,-6,-11);ctx.restore();
    // Visible buoys mark the navigable edge of the archipelago.
    ctx.fillStyle='#fff5c7';for(let p=-1450;p<=1450;p+=95){for(const [x,y]of [[p,-1450],[p,1450],[-1450,p],[1450,p]]){const sx=toX(x),sy=toY(y);if(sx>=0&&sx<w&&sy>=0&&sy<h)ctx.fillRect(sx,sy,2,2);}}
    screen.setTransform(1,0,0,1,0,0);screen.imageSmoothingEnabled=false;screen.drawImage(buffer,0,0,canvas.width,canvas.height);
  }
  return {resize,draw};
}
