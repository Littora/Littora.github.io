import {PALETTES,WIDTH,HEIGHT,cleanName,isEnglishName,createVisit,renderKeepsake} from './art.mjs?v=4';

const $=s=>document.querySelector(s),preview=$('#print-preview'),input=$('#visitor-name'),status=$('#print-status'),pngButton=$('#download-png'),svgButton=$('#download-svg');
let visit=null,palette='',svg='',busy=false,disposed=false,inputTimer=0,previewURL=null,fileURL=null;
const urls=new Set();
pngButton.disabled=true;svgButton.disabled=true;
function announce(text='',error=false){status.textContent=text;status.hidden=!text;status.classList.toggle('error',error);}
function paint(){
  if(!visit)return false;if(previewURL){release(previewURL);previewURL=null;}if(fileURL){release(fileURL);fileURL=null;}$('#save-again').hidden=true;
  const valid=isEnglishName(input.value),name=valid?cleanName(input.value):'';input.setAttribute('aria-invalid',String(!valid));$('#name-error').hidden=valid;$('#name-error').textContent=valid?'':'Please use English letters, spaces, apostrophes, periods or hyphens.';
  pngButton.disabled=busy||!valid;svgButton.disabled=busy||!valid;svg=renderKeepsake(visit,{name,palette});preview.innerHTML=svg;preview.setAttribute('aria-busy','false');announce();return valid;
}
function lock(value){busy=value;pngButton.disabled=value||!isEnglishName(input.value);svgButton.disabled=value||!isEnglishName(input.value);input.disabled=value;document.querySelectorAll('.palette-option').forEach(button=>button.disabled=value);pngButton.querySelector('span').textContent=value?'Saving…':'Save my keepsake';}
function release(url){if(urls.delete(url))URL.revokeObjectURL(url);}
function objectURL(blob){const url=URL.createObjectURL(blob);urls.add(url);return url;}
function download(blob,extension){
  const url=objectURL(blob),link=$('#save-again');fileURL=url;link.href=url;link.download=`littora-${visit.localDate}-${visit.seed.slice(0,12)}.${extension}`;link.textContent=`Save ${extension.toUpperCase()} again ↗`;link.hidden=false;
  if(extension==='png'){const image=document.createElement('img');image.src=url;image.width=WIDTH;image.height=HEIGHT;image.alt=`${visit.title}, a visit print${cleanName(input.value)?' for '+cleanName(input.value):''}. ${visit.dateLabel}, ${visit.timeLabel}.`;preview.replaceChildren(image);previewURL=url;}
  link.click();
}
async function rasterize(source){
  const url=objectURL(new Blob([source],{type:'image/svg+xml;charset=utf-8'}));
  try{
    const image=new Image();await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error('The print took too long to render.')),15000);image.onload=()=>{clearTimeout(timer);resolve();};image.onerror=()=>{clearTimeout(timer);reject(new Error('The print could not be rendered.'));};image.src=url;});
    if(disposed)throw new Error('The page was left before export completed.');
    const canvas=document.createElement('canvas');canvas.width=WIDTH;canvas.height=HEIGHT;const context=canvas.getContext('2d');if(!context)throw new Error('PNG export is unavailable.');context.drawImage(image,0,0,WIDTH,HEIGHT);
    const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));canvas.width=1;canvas.height=1;if(!blob)throw new Error('PNG export is unavailable.');return blob;
  }finally{release(url);}
}
try{
  visit=createVisit(new Date(Number.isFinite(performance.timeOrigin)?performance.timeOrigin:Date.now()));palette=visit.palette;
  for(const ink of PALETTES){const button=document.createElement('button');button.type='button';button.className='palette-option';button.dataset.palette=ink.id;button.setAttribute('aria-pressed',String(ink.id===palette));const swatch=document.createElement('span');swatch.style.background=ink.water;swatch.setAttribute('aria-hidden','true');const label=document.createElement('span');label.textContent=ink.name;button.append(swatch,label);button.addEventListener('click',()=>{if(busy)return;palette=ink.id;document.querySelectorAll('.palette-option').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));paint();});$('#palette-options').append(button);}
  paint();
}catch{input.disabled=true;preview.setAttribute('aria-busy','false');announce('Your keepsake could not be made. Please try a current browser.',true);}
input.addEventListener('input',()=>{if(input.value.length>48)input.value=input.value.slice(0,48);clearTimeout(inputTimer);inputTimer=setTimeout(()=>{if(!disposed)paint();},120);});
input.addEventListener('blur',()=>{if(isEnglishName(input.value))input.value=cleanName(input.value);paint();});
$('#signature-form').addEventListener('submit',event=>{event.preventDefault();if(!visit||busy)return;clearTimeout(inputTimer);if(!paint()){input.focus({preventScroll:true});return;}input.value=cleanName(input.value);paint();});
pngButton.addEventListener('click',async()=>{if(!visit||busy)return;clearTimeout(inputTimer);if(!paint())return;lock(true);announce('Preparing your keepsake…');try{const blob=await rasterize(svg);if(!disposed){download(blob,'png');announce('Ready. If it did not save, use the link below.');}}catch{if(!disposed)announce('PNG could not be saved. Try the SVG original.',true);}finally{lock(false);}});
svgButton.addEventListener('click',()=>{if(!visit||busy)return;clearTimeout(inputTimer);if(!paint())return;download(new Blob([svg],{type:'image/svg+xml;charset=utf-8'}),'svg');announce('Ready. If it did not save, use the link below.');});
window.addEventListener('pagehide',event=>{disposed=true;clearTimeout(inputTimer);if(!event.persisted)for(const url of [...urls])release(url);});
window.addEventListener('pageshow',()=>{disposed=false;});
