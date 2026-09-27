import test from 'node:test';
import assert from 'node:assert/strict';
import {PALETTES,cleanName,isEnglishName,xml,seededRandom,createVisit,renderKeepsake,WIDTH,HEIGHT} from '../art.mjs';
const crypto={getRandomValues:bytes=>{bytes.forEach((_,i)=>bytes[i]=(i*19+17)%256);return bytes;}};
const date=new Date('2026-09-26T08:12:34.000Z');
const visit=createVisit(date,crypto);

test('visit captures an immutable exact time, a 128-bit identity and an English date',()=>{
  assert.equal(visit.arrivedAt,date.toISOString());assert.equal(visit.seed.length,32);assert.match(visit.id,/^[0-9A-F]{32}$/);assert.match(visit.edition,/^[0-9A-F]{4} · [0-9A-F]{4} · [0-9A-F]{4}$/);assert.match(visit.dateLabel,/26 September 2026/);assert.match(visit.timeLabel,/\d{2}:\d{2}:34 UTC[+-]\d{2}:\d{2}/);
  assert.ok(PALETTES.some(p=>p.id===visit.palette));assert.throws(()=>createVisit(new Date('invalid'),crypto));
});
test('artwork is deterministic and different edition seeds produce different patterns',()=>{
  assert.equal(renderKeepsake(visit),renderKeepsake(visit));const other={...visit,seed:'e91302c781684aecb3f1165631f1e5ae'};assert.notEqual(renderKeepsake(visit),renderKeepsake(other));
  const a=seededRandom(visit.seed),b=seededRandom(other.seed);assert.notDeepEqual(Array.from({length:8},a),Array.from({length:8},b));
});
test('signature and ink changes keep the edition time and geometry intact',()=>{
  const base=renderKeepsake(visit),edited=renderKeepsake(visit,{name:'Alex Morgan',palette:'apricot'});
  const geometry=s=>[...s.matchAll(/<path d="([^"]+)"/g)].map(m=>m[1]);assert.deepEqual(geometry(base),geometry(edited));assert.ok(edited.includes(visit.arrivedAt));assert.ok(edited.includes(visit.id));assert.ok(edited.includes('Alex Morgan'));assert.ok(edited.includes('width="2400" height="3200"'));assert.equal(WIDTH/HEIGHT,3/4);
});
test('optional English signatures preserve familiar punctuation and stay within 48 characters',()=>{
  assert.equal(cleanName('  Mary-Jane   O\u2019Neill  '),"Mary-Jane O'Neill");
  assert.equal(cleanName('James W. Anderson'),'James W. Anderson');
  assert.equal(cleanName('W'.repeat(70)),'W'.repeat(48));
  for(const name of ['', 'Alex Morgan', "Mary-Jane O'Neill", 'James W. Anderson'])assert.equal(isEnglishName(name),true);
  for(const name of ['Alex_42','Alex & Morgan','Alex\u0000Morgan'])assert.equal(isEnglishName(name),false);
});
test('invalid markup is rejected and cannot become active SVG content',()=>{
  const name='Alex & <script>alert("hi")</script>',svg=renderKeepsake(visit,{name});assert.equal(isEnglishName(name),false);assert.ok(!svg.includes('<script>'));assert.ok(!svg.includes('foreignObject'));assert.ok(!svg.includes('href='));assert.ok(!svg.includes('https://'));assert.equal(xml('"<&>\''),'&quot;&lt;&amp;&gt;&apos;');
});

test('long English signatures wrap into two legible lines without changing the print frame',()=>{
  for(const name of ['W'.repeat(48),'William Montgomery Wellington Worthington']){
    const svg=renderKeepsake(visit,{name}),dedication=svg.match(/<text x="1200" y="2615" font-size="([\d.]+)"[^>]*>(.*?)<\/text>/s);
    assert.ok(dedication);assert.ok(Number(dedication[1])>=45);assert.equal((dedication[2].match(/<tspan/g)||[]).length,2);
  }
});
