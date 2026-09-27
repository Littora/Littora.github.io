import { createPixelRenderer } from './pixel-art.mjs';
const canvas=document.querySelector('#drift-cover');
const renderer=createPixelRenderer(canvas);
const world={
  islands:[{x:-102,y:-42,r:47,shape:1.3},{x:134,y:83,r:55,shape:3.1},{x:174,y:-107,r:40,shape:4.2}],
  lights:[{x:-12,y:-65,phase:0,collected:false},{x:90,y:6,phase:2,collected:false},{x:-88,y:97,phase:1,collected:false}]
};
function draw(){const rect=canvas.getBoundingClientRect();renderer.resize(rect.width,rect.height,Math.min(devicePixelRatio||1,2));renderer.draw({world,boat:{x:20,y:25},camera:{x:0,y:0},time:0,heading:-.55,trail:[{x:0,y:72},{x:5,y:60},{x:10,y:48}],reducedMotion:false});}
const observer=new ResizeObserver(draw);observer.observe(canvas);draw();
window.addEventListener('pagehide',()=>observer.disconnect(),{once:true});
window.addEventListener('pageshow',event=>{if(event.persisted){observer.observe(canvas);draw();}});
