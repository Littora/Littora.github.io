// Original generative artwork. No requests, visitor fingerprinting or stored identity.
export const PALETTES = [
  {id:'sea-glass',name:'Sea glass',paper:'#fffaf0',sky:'#e1eadc',skyLight:'#fff0d6',water:'#76a9a2',seaLight:'#c7ded0',ink:'#416359',sun:'#edbb76',rule:'#c6cebb',land:'#b8c9a4',cliff:'#d6b396',foliage:'#728c67',accent:'#c98269',roof:'#627b6d'},
  {id:'apricot',name:'Apricot light',paper:'#fff8ed',sky:'#f0e0d3',skyLight:'#fff0d8',water:'#91b5b1',seaLight:'#d6dfc8',ink:'#786351',sun:'#edac77',rule:'#d8c7ae',land:'#c2baa0',cliff:'#d5ad8e',foliage:'#8b9870',accent:'#cc826e',roof:'#8c9290'},
  {id:'blue-mist',name:'Blue mist',paper:'#fffbf5',sky:'#e2e7f0',skyLight:'#fff0dd',water:'#88a9bc',seaLight:'#d0dfe2',ink:'#4b6575',sun:'#e6b68e',rule:'#c6cdd0',land:'#b6c4bd',cliff:'#d5bcb0',foliage:'#849782',accent:'#bf8b7e',roof:'#7c8d9b'}
];
export const WIDTH=2400,HEIGHT=3200;
const titles=['Quiet Reach','The Open Shore','A Softer Horizon','Where Light Settles','The Still Inlet','A Gentle Distance','Between the Tides','A Place to Pause'];
export function xml(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));}
function nameInput(value){return String(value||'').replace(/[\u2018\u2019]/g,"'").replace(/[\u2010\u2011]/g,'-').replace(/\s+/g,' ').trim();}
export function isEnglishName(value){return /^[A-Za-z .'-]*$/.test(nameInput(value));}
export function cleanName(value){
  return nameInput(value).replace(/[^A-Za-z .'-]/g,'').slice(0,48).trim();
}
export function seededRandom(seed){
  // Keep all four words of the 128-bit edition seed in the generator state.
  if(!/^[a-f0-9]{32}$/i.test(seed))throw new Error('A 128-bit edition seed is required.');
  let [a,b,c,d]=Array.from({length:4},(_,i)=>parseInt(seed.slice(i*8,i*8+8),16)>>>0);
  return()=>{a>>>=0;b>>>=0;c>>>=0;d>>>=0;let t=(a+b)|0;a=b^(b>>>9);b=(c+(c<<3))|0;c=(c<<21)|(c>>>11);d=(d+1)|0;t=(t+d)|0;c=(c+t)|0;return (t>>>0)/4294967296;};
}
export function createVisit(now=new Date(),cryptoProvider=globalThis.crypto){
  const bytes=new Uint8Array(16);cryptoProvider.getRandomValues(bytes);
  const seed=Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('');
  const date=new Date(now);if(!Number.isFinite(date.getTime()))throw new Error('A valid visit time is required.');
  const offset=-date.getTimezoneOffset(),sign=offset>=0?'+':'-',pad=n=>String(n).padStart(2,'0');
  const timezone=Intl.DateTimeFormat().resolvedOptions().timeZone||'Local time';
  const localDate=`${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}`;
  const dateLabel=new Intl.DateTimeFormat('en-GB',{day:'2-digit',month:'long',year:'numeric'}).format(date);
  const timeLabel=`${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())} UTC${sign}${pad(Math.floor(Math.abs(offset)/60))}:${pad(Math.abs(offset)%60)}`;
  const random=seededRandom(seed),title=titles[Math.floor(random()*titles.length)],palette=PALETTES[Math.floor(random()*PALETTES.length)].id;
  return {seed,id:seed.toUpperCase(),edition:seed.slice(0,12).toUpperCase().match(/.{4}/g).join(' · '),arrivedAt:date.toISOString(),localDate,dateLabel,timeLabel,timezone,title,palette};
}
function dedicationSVG(name,ink){
  if(!name)return `<text x="1200" y="2665" font-size="55" font-style="italic" text-anchor="middle" fill="${ink}">A moment, kept.</text>`;
  const glyphs=Array.from(name);
  const weight=c=>/^[MWmw]$/.test(c)?.98:/^[A-Z]$/.test(c)?.75:/^[iljtI]$/.test(c)?.34:c===' '?.3:.62;
  const total=glyphs.reduce((sum,c)=>sum+weight(c),0);let lines=[name];
  if(total>21){
    let used=0,split=0;while(split<glyphs.length&&used<total/2)used+=weight(glyphs[split++]);
    const spaces=glyphs.map((c,i)=>c===' '?i:-1).filter(i=>i>glyphs.length*.3&&i<glyphs.length*.7);
    if(spaces.length)split=spaces.reduce((best,i)=>Math.abs(i-split)<Math.abs(best-split)?i:best,spaces[0]);
    lines=[glyphs.slice(0,split).join('').trim(),glyphs.slice(split).join('').trim()];
  }
  const widest=Math.max(...lines.map(line=>Array.from(line).reduce((sum,c)=>sum+weight(c),0)));
  const size=Math.min(lines.length===1?83:70,1480/Math.max(1,widest));
  return `<text x="1200" y="${lines.length===1?2665:2615}" font-size="${size.toFixed(1)}" text-anchor="middle" fill="${ink}">${lines.map((line,i)=>`<tspan x="1200" dy="${i?76:0}">${xml(line)}</tspan>`).join('')}</text>`;
}
// Local vector primitives keep the downloaded scene independent of fonts and images.
function node(tag,attributes={},children=''){
  const attrs=Object.entries(attributes).map(([key,value])=>key+'="'+xml(value)+'"').join(' ');
  return '<'+tag+(attrs?' '+attrs:'')+'>'+children+'</'+tag+'>';
}
const path=(d,fill,attributes={})=>node('path',{d,fill,...attributes});
const circle=(cx,cy,r,fill,attributes={})=>node('circle',{cx,cy,r,fill,...attributes});
const group=(attributes,children)=>node('g',attributes,children);
const fixed=n=>Number(n.toFixed(2));

function flower(x,y,size,turn,p,kind){
  const petals=Array.from({length:kind?8:5},(_,i)=>node('ellipse',{cx:0,cy:-13,rx:kind?7:9,ry:17,fill:kind?p.paper:p.accent,transform:'rotate('+i*(kind?45:72)+')'})).join('');
  return group({transform:'translate('+fixed(x)+' '+fixed(y)+') rotate('+fixed(turn)+') scale('+fixed(size)+')'},
    path('M0 0Q-16 55-3 130','none',{stroke:p.foliage,'stroke-width':3,'stroke-linecap':'round'})+
    path('M-6 85Q-51 81-37 57Q-6 54-6 85M-7 57Q31 53 25 33Q-3 33-7 57',p.foliage,{opacity:.88})+
    petals+circle(0,0,7,p.sun)+circle(-2,-2,2,p.ink,{opacity:.35}));
}

function lighthouse(x,y,scale,p){
  const windows=[280,395,510].map(v=>node('rect',{x:-18,y:v,width:36,height:54,rx:17,fill:p.ink,opacity:.77})).join('');
  return group({transform:'translate('+fixed(x)+' '+fixed(y)+') scale('+fixed(scale)+')'},
    path('M-123 680L-80 194H80L123 680Z',p.paper,{stroke:p.rule,'stroke-width':3})+
    path('M38 194H80L123 680H48Z',p.cliff,{opacity:.24})+
    path('M-91 320H91L96 376H-96Z',p.accent,{opacity:.88})+
    path('M-109 535H109L114 592H-114Z',p.accent,{opacity:.88})+
    node('rect',{x:-92,y:89,width:184,height:107,rx:8,fill:p.roof})+
    node('rect',{x:-71,y:104,width:142,height:69,rx:4,fill:p.sun,opacity:.8})+
    path('M-25 104V173M25 104V173','none',{stroke:p.roof,'stroke-width':8})+
    path('M-107 89L0 23L107 89Z',p.accent,{stroke:p.ink,'stroke-width':2})+
    path('M0 23V-9M-120 196H120M-120 180V211M120 180V211','none',{stroke:p.ink,'stroke-width':5,'stroke-linecap':'round'})+
    path('M-134 680H134V699H-134Z',p.cliff)+windows+
    path('M-24 680V631Q0 604 24 631V680Z',p.roof)+
    path('M-140 218H140M-137 206H137M-126 203V227M-90 203V227M90 203V227M126 203V227','none',{stroke:p.roof,'stroke-width':4})+
    circle(0,-12,8,p.sun));
}

function cottage(x,y,p){
  return group({transform:'translate('+x+' '+y+')'},
    path('M-109 0H109V127H-109Z',p.paper,{stroke:p.rule,'stroke-width':2})+
    path('M-130 0L0-92L130 0Z',p.accent,{stroke:p.ink,'stroke-width':2})+
    path('M57-62V-108H81V-45Z',p.cliff)+
    node('rect',{x:-27,y:57,width:45,height:70,rx:4,fill:p.roof})+
    [-71,58].map(cx=>node('rect',{x:cx,y:35,width:29,height:36,rx:3,fill:p.water})+path('M'+(cx+14)+' 35V71M'+cx+' 53H'+(cx+29),'none',{stroke:p.paper,'stroke-width':3})).join('')+
    path('M-143 129H143','none',{stroke:p.cliff,'stroke-width':12,'stroke-linecap':'round'}));
}

function sailboat(x,y,size,p){
  return group({transform:'translate('+fixed(x)+' '+fixed(y)+') scale('+fixed(size)+')'},
    path('M-94 13Q0 33 112 11L77 53H-53Z',p.accent,{stroke:p.ink,'stroke-width':2})+
    path('M0-235V16','none',{stroke:p.ink,'stroke-width':5})+
    path('M-8-224L-106 0H-8Z',p.paper,{stroke:p.rule,'stroke-width':2})+
    path('M10-195L101 0H10Z',p.skyLight,{stroke:p.rule,'stroke-width':2})+
    path('M-68-79H-8M49-107H10','none',{stroke:p.cliff,'stroke-width':7,opacity:.55})+
    path('M-128 78Q-24 64 123 76M-101 95Q1 82 86 90','none',{stroke:p.paper,'stroke-width':4,opacity:.8,'stroke-linecap':'round'}));
}

function shorelineScene(random,p){
  const sunX=fixed(1390+random()*260),sunY=fixed(705+random()*125),sunRadius=fixed(143+random()*39);
  const lighthouseX=fixed(615+random()*90),lighthouseY=fixed(850+random()*115);
  const boatX=fixed(1470+random()*180),boatY=fixed(1710+random()*100);
  const horizon=fixed(1250+random()*55),sea=[],birds=[],flowers=[],grain=[],clouds=[],cliffMarks=[];
  for(let i=0;i<39;i++){
    const y=horizon+35+i*26,phase=random()*6.28,amplitude=4+random()*13;
    let d='M190 '+fixed(y);
    for(let x=190;x<=2230;x+=68)d+='L'+x+' '+fixed(y+Math.sin(x/230+phase)*amplitude);
    sea.push(path(d,'none',{stroke:p.paper,'stroke-width':i%6===0?5:2,opacity:fixed(.28+random()*.26)}));
  }
  for(let i=0;i<32;i++){
    const x=1220+random()*950,y=1420+random()*725,w=18+random()*62;
    sea.push(path('M'+fixed(x)+' '+fixed(y)+'q'+fixed(w/2)+' -5 '+fixed(w)+' 0','none',{stroke:p.seaLight,'stroke-width':3,opacity:.7,'stroke-linecap':'round'}));
  }
  for(let i=0;i<8;i++){
    const x=1000+random()*930,y=930+random()*200,w=12+random()*16;
    birds.push(path('M'+fixed(x-w)+' '+fixed(y)+'q'+fixed(w*.6)+' '+fixed(-w*.7)+' '+fixed(w)+' 0q'+fixed(w*.4)+' '+fixed(-w*.7)+' '+fixed(w)+' 0','none',{stroke:p.ink,'stroke-width':3,opacity:.66,'stroke-linecap':'round'}));
  }
  for(let i=0;i<3;i++){
    const x=460+random()*1260,y=670+random()*400,size=.6+random()*.4;
    clouds.push(group({transform:'translate('+fixed(x)+' '+fixed(y)+') scale('+fixed(size)+')',opacity:.54},
      path('M-130 0Q-116-19-87-15Q-54-86-6-48Q40-74 65-21Q104-30 125 0Z',p.paper)));
  }
  for(let i=0;i<28;i++){
    const x=i<12?280+random()*430:1540+random()*550,y=2140+random()*190,size=.68+random()*.85;
    flowers.push(flower(x,y,size,(random()-.5)*42,p,i%3!==0));
  }
  for(let i=0;i<560;i++)grain.push(circle(fixed(220+random()*1960),fixed(460+random()*1850),fixed(.7+random()*1.2),p.ink,{opacity:.07}));
  for(let i=0;i<18;i++){
    const x=285+random()*580,y=1770+random()*420;
    cliffMarks.push(path('M'+fixed(x)+' '+fixed(y)+'q'+fixed(30+random()*100)+' -21 '+fixed(65+random()*160)+' 4','none',{stroke:p.paper,'stroke-width':2,opacity:.44}));
  }
  const lightBeam=path('M'+lighthouseX+' '+fixed(lighthouseY+114)+'L1320 '+fixed(lighthouseY+26)+'L1390 '+fixed(lighthouseY+237)+'Z',p.skyLight,{opacity:.35});
  return node('rect',{x:200,y:390,width:2000,height:1930,fill:'url(#shore-sky)'})+
    circle(sunX,sunY,sunRadius+30,p.sun,{opacity:.1})+circle(sunX,sunY,sunRadius,'url(#shore-sun)')+
    circle(sunX,sunY,sunRadius-14,'none',{stroke:p.paper,'stroke-width':2,opacity:.33})+
    clouds.join('')+lightBeam+
    path('M1430 '+horizon+'Q1510 '+(horizon-110)+' 1640 '+(horizon-70)+'Q1730 '+(horizon-180)+' 1860 '+(horizon-130)+'Q2080 '+(horizon-70)+' 2280 '+(horizon-160)+'V1470H1430Z',p.land,{opacity:.42})+
    path('M1970 '+(horizon-22)+'Q2100 '+(horizon-142)+' 2260 '+(horizon-91)+'V1410H1970Z',p.roof,{opacity:.15})+
    node('rect',{x:180,y:horizon,width:2060,height:1120,fill:'url(#shore-water)'})+
    sea.join('')+
    path('M200 1510Q452 1430 767 1530Q920 1560 1160 1670Q1200 1810 1365 1870Q1380 1965 1180 2080Q960 2210 820 2340H200Z',p.cliff)+
    path('M200 1495Q446 1420 742 1510Q938 1520 1160 1670Q826 1630 674 1700Q440 1730 200 1615Z',p.land)+
    path('M200 1670Q640 1770 958 1700Q844 1880 646 1980Q398 2110 200 2120Z',p.cliff,{opacity:.5})+
    path('M218 1840Q500 1900 646 1980Q761 2060 851 2180L780 2360H200Z',p.paper,{opacity:.2})+
    cliffMarks.join('')+
    path('M1365 1900Q1369 1980 1170 2110Q1030 2210 938 2250','none',{stroke:p.paper,'stroke-width':6,opacity:.64,'stroke-linecap':'round'})+
    path('M1394 1915Q1391 2011 1210 2125M1120 2181Q1059 2229 996 2253','none',{stroke:p.paper,'stroke-width':3,opacity:.5,'stroke-linecap':'round'})+
    path('M1315 2092Q1330 2068 1351 2088Q1382 2104 1373 2120H1304Z',p.cliff,{opacity:.65})+
    path('M1341 2106Q1355 2099 1362 2107','none',{stroke:p.paper,'stroke-width':2})+
    path('M951 1694Q895 1779 690 1850Q511 1926 830 2055Q981 2120 834 2290','none',{stroke:p.paper,'stroke-width':32,opacity:.63,'stroke-linecap':'round'})+
    path('M955 1694Q899 1779 694 1850Q515 1926 834 2055Q985 2120 838 2290','none',{stroke:p.cliff,'stroke-width':3,opacity:.8})+
    lighthouse(lighthouseX,lighthouseY,.93,p)+cottage(1030,1597,p)+
    path('M342 1540Q437 1585 519 1565M328 1567Q410 1618 486 1600','none',{stroke:p.foliage,'stroke-width':8,opacity:.3,'stroke-linecap':'round'})+
    sailboat(boatX,boatY,.78,p)+sailboat(1980+random()*80,horizon+170,.34,p)+
    birds.join('')+
    path('M180 2190Q400 2120 630 2213Q1040 2310 1330 2260Q1670 2120 2240 2180V2390H180Z',p.land)+
    path('M180 2290Q550 2180 900 2340Q1470 2270 1650 2230Q1950 2180 2240 2320V2390H180Z',p.foliage,{opacity:.28})+
    flowers.join('')+grain.join('');
}

export function renderKeepsake(visit,{name='',palette=visit.palette}={}){
  const p=PALETTES.find(item=>item.id===palette)||PALETTES[0],random=seededRandom(visit.seed),signature=cleanName(name);
  const arch='M210 2320V1380A990 990 0 0 1 2190 1380V2320Z';
  const metadata={collection:'Littora — A Moment Ashore',version:2,editionId:visit.id,seed:visit.seed,arrivedAt:visit.arrivedAt,date:visit.dateLabel,time:visit.timeLabel,timezone:visit.timezone,title:visit.title,palette:p.id,...(signature?{dedicatedTo:signature}:{})};
  const gradient=(id,start,end)=>node('linearGradient',{id,x1:0,y1:0,x2:0,y2:1},
    node('stop',{offset:0,'stop-color':start})+node('stop',{offset:1,'stop-color':end}));
  const defs=node('defs',{},node('clipPath',{id:'shore-window'},path(arch,'none'))+
    gradient('shore-sky',p.sky,p.skyLight)+gradient('shore-water',p.seaLight,p.water)+gradient('shore-sun',p.skyLight,p.sun));
  const border=node('rect',{x:90,y:90,width:2220,height:3020,rx:65,fill:'none',stroke:p.rule,'stroke-width':2});
  const mark=group({transform:'translate(1200 244)'},
    [-45,0,45,90].map(a=>node('ellipse',{cx:0,cy:-17,rx:6,ry:22,fill:p.sun,transform:'rotate('+a+')'})).join('')+
    circle(0,0,7,p.accent));
  const text=(x,y,size,value,extra={})=>node('text',{x,y,'font-size':size,fill:p.ink,...extra},xml(value));
  const brand=group({'font-family':"Georgia, 'Times New Roman', serif"},
    text(205,263,65,'Littora.',{'letter-spacing':-2}));
  const footer=group({'font-family':'Arial, sans-serif','font-size':22,fill:p.ink,'letter-spacing':2},
    text(210,3019,22,'EDITION '+visit.edition)+text(2190,3019,22,'LITTORA.ART',{'text-anchor':'end'}));
  const contents=node('title',{id:'print-title'},xml(visit.title+' — a Littora visit keepsake'+(signature?' for '+signature:'')))+
    node('desc',{id:'print-desc'},xml('An illustrated coastal keepsake with a lighthouse, sailboats and wildflowers. '+visit.dateLabel+', '+visit.timeLabel+'. Edition '+visit.edition+'.'))+
    node('metadata',{},xml(JSON.stringify(metadata)))+defs+
    node('rect',{width:WIDTH,height:HEIGHT,fill:p.paper})+border+brand+mark+
    text(2190,255,21,'A MOMENT ASHORE',{'text-anchor':'end','letter-spacing':4,'font-family':'Arial, sans-serif'})+
    group({'clip-path':'url(#shore-window)'},shorelineScene(random,p))+
    path(arch,'none',{stroke:p.rule,'stroke-width':2})+
    path('M184 2320V1380A1016 1016 0 0 1 2216 1380V2320','none',{stroke:p.rule,'stroke-width':1,opacity:.6})+
    group({'font-family':"Georgia, 'Times New Roman', serif"},
      text(1200,2520,100,visit.title,{'text-anchor':'middle','letter-spacing':-2})+dedicationSVG(signature,p.ink))+
    path('M1150 2760H1250','none',{stroke:p.rule,'stroke-width':3,'stroke-linecap':'round'})+
    text(1200,2840,36,visit.dateLabel,{'text-anchor':'middle','font-family':'Arial, sans-serif','letter-spacing':2})+
    text(1200,2905,28,visit.timeLabel,{'text-anchor':'middle','font-family':'Arial, sans-serif','letter-spacing':1.5})+footer;
  return node('svg',{xmlns:'http://www.w3.org/2000/svg',width:WIDTH,height:HEIGHT,viewBox:'0 0 '+WIDTH+' '+HEIGHT,role:'img','aria-labelledby':'print-title print-desc'},contents);
}
