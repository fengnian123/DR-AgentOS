/* Illustrative fixtures only: this is not a live model or benchmark replay. */
(() => {
  'use strict';
  const root = document.querySelector('#world-explorer');
  if (!root) return;
  const $ = id => root.querySelector(`#ex-${id}`);
  const scenes = {
    kitchen: {name:'Kitchen', object:'mug', id:'023', appearance:'White ceramic mug', locations:['Table','Cabinet','Sink','Unknown'], prior:[.15,.65,.10,.10], relation:'Supported by table · near plate', pattern:'Repeated morning use makes the cabinet a plausible destination. After 48 hours, the old table observation carries less weight.', activity:'Breakfast and cleanup may move the mug.', recovered:'Sink', shape:'mug'},
    living: {name:'Living room', object:'remote', id:'041', appearance:'Slim graphite remote', locations:['Sofa','Drawer','Side table','Unknown'], prior:[.18,.60,.14,.08], relation:'On sofa · near cushion', pattern:'The remote is often put away after use. The drawer is a stronger hypothesis than its two-day-old sofa location.', activity:'Tidying may move the remote from the sofa.', recovered:'Side table', shape:'remote'},
    office: {name:'Office', object:'notebook', id:'067', appearance:'Blue clothbound notebook', locations:['Desk','Shelf','Meeting table','Unknown'], prior:[.20,.58,.15,.07], relation:'On desk · near keyboard', pattern:'End-of-day storage favors the shelf. The desk observation becomes less reliable as meetings and work sessions pass.', activity:'A meeting may move the notebook.', recovered:'Meeting table', shape:'notebook'},
    bedroom: {name:'Bedroom', object:'phone', id:'089', appearance:'Dark phone in a pale case', locations:['Desk','Nightstand','Dresser','Unknown'], prior:[.12,.68,.12,.08], relation:'On desk · beside lamp', pattern:'Overnight charging favors the nightstand. Elapsed time weakens the original desk observation without ruling it out.', activity:'Charging and morning routines may move the phone.', recovered:'Dresser', shape:'phone'}
  };
  let shown = [0.15,0.65,0.10,0.10], beliefFrame = 0, story = false, storyRun = 0;
  const initial = [.96,.02,.01,.01];
  let key = 'kitchen', hours = 48, stage = 'predict', busy = false, generation = 0;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const delay = ms => new Promise(resolve => setTimeout(resolve, reduced.matches ? 0 : ms));
  function beliefs() {
    const s = scenes[key], t = hours / 48;
    let p = initial.map((v,i) => v * (1-t) + s.prior[i] * t);
    if (stage === 'updated' || stage === 'found') {
      // P(not detected | candidate): 95% visibility at the inspected location.
      p = p.map((v,i) => v * (i === 1 ? .05 : 1));
      const z = p.reduce((a,b) => a+b,0); p = p.map(v => v/z);
    }
    if (stage === 'found') {
      // Positive detection: high likelihood at the recovered location, small false-positive likelihood elsewhere.
      p = p.map((v,i) => v * (i === 2 ? .98 : .002));
      const z = p.reduce((a,b) => a+b,0); p = p.map(v => v/z);
    }
    return p;
  }
  function percentages(p) {
    const values=p.map(v=>Math.floor(v*100));
    const order=p.map((v,i)=>({i,r:v*100-values[i]})).sort((a,b)=>b.r-a.r);
    const remaining=100-values.reduce((a,b)=>a+b,0);
    for(let i=0;i<remaining;i++) values[order[i].i]++;
    return values;
  }
  const project = (x,y,z=0) => [345+(x-y)*.82,68+(x+y)*.45-z];
  const pts = vertices => vertices.map(v=>project(...v).join(',')).join(' ');
  const polygon = (v,fill,stroke='#5d5d5d') => `<polygon points="${pts(v)}" fill="${fill}" stroke="${stroke}" stroke-width=".7" stroke-linejoin="round"/>`;
  function box(x,y,w,d,h,color='#7e7e7e',base=0) {
    return polygon([[x,y+d,base],[x+w,y+d,base],[x+w,y+d,h+base],[x,y+d,h+base]],'#525252')+
      polygon([[x+w,y,base],[x+w,y+d,base],[x+w,y+d,h+base],[x+w,y,h+base]],'#454545')+
      polygon([[x,y,h+base],[x+w,y,h+base],[x+w,y+d,h+base],[x,y+d,h+base]],color);
  }
  function surface(x,y,w,d,h,type) {
    let out=box(x,y,w,d,h);
    if(type==='table') {
      out='';for(const [a,b] of [[x+7,y+7],[x+w-13,y+7],[x+7,y+d-13],[x+w-13,y+d-13]])out+=box(a,b,6,6,h-6,'#646464');
      out+=box(x,y,w,d,6,'#9b9b9b',h-6);
      out+=box(x+15,y+15,24,18,2,'#c6c6c6',h);
    } else if(type==='sofa') {
      out=box(x,y,w,d,15,'#828282')+box(x,y,w,12,36,'#919191',15)+box(x,y,12,d,25,'#919191',15)+box(x+w-12,y,12,d,25,'#919191',15);
      for(let i=0;i<3;i++)out+=box(x+15+i*(w-30)/3,y+17,(w-35)/3,d-24,10,'#a4a4a4',15);
    } else if(type==='sink') {
      out+=polygon([[x+10,y+10,h+.5],[x+w-10,y+10,h+.5],[x+w-10,y+d-10,h+.5],[x+10,y+d-10,h+.5]],'#434343','#bdbdbd');
      const [a,b]=project(x+w/2,y+7,h);out+=`<path d="M${a} ${b}v-14q0-8 7-8t7 8" fill="none" stroke="#c1c1c1" stroke-width="2"/>`;
    } else if(type==='cabinet') {
      for(let i=1;i<3;i++){const a=project(x+i*w/3,y+d,4),b=project(x+i*w/3,y+d,h-4);out+=`<path d="M${a.join(' ')}L${b.join(' ')}" stroke="#929292" stroke-width=".8"/>`;}
      for(let i=0;i<3;i++){const a=project(x+(i+.5)*w/3,y+d,h-12);out+=`<path d="M${a.join(' ')}v6" stroke="#c4c4c4" stroke-width="1.5"/>`;}
    } else if(type==='shelf') {
      for(let i=0;i<5;i++)out+=box(x+10+i*12,y+6,8,d-12,12+i%2*6,['#a2a2a2','#b2b2b2','#777777'][i%3],h);
    }
    return '<g opacity=".35" filter="url(#ex-contact-shadow)">'+polygon([[x-5,y+4,.4],[x+w+12,y+4,.4],[x+w+12,y+d+16,.4],[x-5,y+d+16,.4]],'#141414','#141414')+'</g>'+out;
  }
  // A small articulated 3D model projected into the same coordinates as the room.
  // Diagonal leg pairs share a trot phase; heading follows the path tangent.
  let robotHeading = -Math.PI / 2;
  function quadruped(heading, phase=0, walking=false) {
    const c=Math.cos(heading),s=Math.sin(heading);
    const bob=walking?Math.cos(phase*2)*.65:0;
    const point=([x,y,z])=>[(x*c-y*s-(x*s+y*c))*.82,(x*c-y*s+x*s+y*c)*.45-z];
    const coord=p=>point(p).map(n=>n.toFixed(2)).join(',');
    const poly=(v,fill,stroke='#8d8d8d')=>`<polygon points="${v.map(coord).join(' ')}" fill="${fill}" stroke="${stroke}" stroke-width=".65" stroke-linejoin="round"/>`;
    function chassis(x,y,z,w,d,h,top,side) {
      const faces=[
        {v:[[x,y,z],[x+w,y,z],[x+w,y,z+h],[x,y,z+h]],fill:side},
        {v:[[x+w,y,z],[x+w,y+d,z],[x+w,y+d,z+h],[x+w,y,z+h]],fill:side},
        {v:[[x+w,y+d,z],[x,y+d,z],[x,y+d,z+h],[x+w,y+d,z+h]],fill:side},
        {v:[[x,y+d,z],[x,y,z],[x,y,z+h],[x,y+d,z+h]],fill:side}
      ].sort((a,b)=>a.v.reduce((n,p)=>n+point([p[0],p[1],0])[1],0)-b.v.reduce((n,p)=>n+point([p[0],p[1],0])[1],0));
      return faces.map(f=>poly(f.v,f.fill)).join('')+poly([[x,y,z+h],[x+w,y,z+h],[x+w,y+d,z+h],[x,y+d,z+h]],top,'#d4d4d4');
    }
    const legs=[[-18,-12,0],[18,-12,Math.PI],[-18,12,Math.PI],[18,12,0]].map(([x,y,offset])=>{
      const cycle=phase+offset,stride=walking?Math.sin(cycle)*6:0,lift=walking?Math.max(0,Math.cos(cycle))*5:0;
      const hip=[x,y,24+bob],knee=[x-5+stride*.4,y*1.1,13+lift*.4],foot=[x+stride+2,y*1.2,2+lift];
      const h=point(hip),k=point(knee),f=point(foot),near=point([x,y,0])[1];
      return {near,html:`<g class="ex-robot-leg"><path d="M${coord(hip)}L${coord(knee)}L${coord(foot)}" fill="none" stroke="#1c1c1c" stroke-width="5.5" stroke-linejoin="round" stroke-linecap="round"/><path d="M${coord(hip)}L${coord(knee)}" stroke="#c5c5c5" stroke-width="3.4"/><path d="M${coord(knee)}L${coord(foot)}" stroke="#909090" stroke-width="2.5"/><circle cx="${h[0]}" cy="${h[1]}" r="3.5" fill="#4d4d4d" stroke="#dedede" stroke-width=".8"/><circle cx="${k[0]}" cy="${k[1]}" r="2.4" fill="#555" stroke="#bdbdbd" stroke-width=".7"/><ellipse cx="${f[0]}" cy="${f[1]}" rx="3.6" ry="1.9" fill="#171717" stroke="#8b8b8b" stroke-width=".5"/></g>`};
    }).sort((a,b)=>a.near-b.near);
    let body=chassis(-25,-11,22+bob,50,22,11,'url(#ex-robot-metal)','#707070');
    body+=chassis(-14,-7,33+bob,26,14,2,'#3c3c3c','#555');
    body+=chassis(24,-8,24+bob,6,16,7,'#8c8c8c','#292929');
    // Forward stereo cameras, top lidar, side panel and restrained status light.
    for(const y of [-4,4]) {const p=point([30,y,28+bob]);body+=`<circle cx="${p[0]}" cy="${p[1]}" r="1.8" fill="#0c0c0c" stroke="#dfdfdf" stroke-width=".8"/>`;}
    const lidar=point([9,0,38+bob]);body+=`<ellipse cx="${lidar[0]}" cy="${lidar[1]}" rx="5" ry="3.5" fill="#2a2a2a" stroke="#d3d3d3" stroke-width="1"/>`;
    for(let i=0;i<4;i++)body+=`<path d="M${coord([-10+i*4,-4,35+bob])}L${coord([-10+i*4,4,35+bob])}" stroke="#858585" stroke-width=".8"/>`;
    return `<ellipse cy="2" rx="32" ry="12" fill="#090909" opacity=".35"/>${legs.slice(0,2).map(l=>l.html).join('')}${body}${legs.slice(2).map(l=>l.html).join('')}`;
  }
  function poseRobot(phase=0,walking=false) {$('agent').innerHTML=quadruped(robotHeading,phase,walking);}
  function robotState(text,mode='idle') {
    $('robot-status').textContent=text;root.dataset.robotState=mode;
  }
  function buildScene() {
    const s=scenes[key];
    $('task').textContent=`Find the ${s.object}`;
    const furnitureTypes=key==='living'?['sofa','shelf','table']:key==='office'?['table','shelf','table']:key==='bedroom'?['table','table','shelf']:['table','cabinet','sink'];
    let room=polygon([[0,0,-9],[420,0,-9],[420,340,-9],[0,340,-9]],'#262626');
    room+=box(0,0,420,340,8,'url(#ex-floor-metal)',-8);
    for(let x=30;x<420;x+=30)room+=`<polyline points="${pts([[x,0],[x,340]])}" fill="none" stroke="#5a5a5a" stroke-opacity=".25" stroke-width=".5"/>`;
    for(let y=30;y<340;y+=30)room+=`<polyline points="${pts([[0,y],[420,y]])}" fill="none" stroke="#5a5a5a" stroke-opacity=".25" stroke-width=".5"/>`;
    room+=box(0,0,420,5,58,'#6b6b6b')+box(0,0,5,340,58,'#6b6b6b');
    room+=polygon([[5,45,20],[5,150,20],[5,150,49],[5,45,49]],'#7a7a7a','#a6a6a6');
    room+=polygon([[5,95,20],[5,96,20],[5,96,49],[5,95,49]],'#b6b6b6');
    room+=polygon([[68,104,.5],[250,104,.5],[250,241,.5],[68,241,.5]],'#555555','#686868');
    room+=surface(285,20,100,52,52,furnitureTypes[1]);
    room+=surface(80,115,125,77,37,furnitureTypes[0]);
    room+=surface(312,212,75,65,42,furnitureTypes[2]);
    // Quiet contextual details distinguish each authored environment.
    if(key==='bedroom')room+=box(20,240,140,70,22,'#9d9d9d')+box(23,242,33,64,8,'#c2c2c2',22);
    else if(key==='office')room+=box(92,120,45,5,27,'#3a3a3a',37);
    else if(key==='kitchen')room+=box(180,18,64,48,46,'#888888')+box(188,26,19,18,2,'#434343',46)+box(214,26,19,18,2,'#434343',46);
    else room+=box(30,240,100,45,12,'#696969');
    // Planter with a sculpted crown, placed away from candidate regions.
    room+=box(360,305,22,22,20,'#7c7c7c');
    const plant=project(371,316,35);room+=`<ellipse cx="${plant[0]}" cy="${plant[1]}" rx="14" ry="21" fill="#828282"/><path d="M${plant[0]} ${plant[1]+20}v-30" stroke="#adadad" fill="none"/>`;
    const locs=[[142,155,37],[335,45,52],[350,245,42]];
    const overlays=locs.map(([x,y,z],i)=>{const [a,b]=project(x,y,z);return `<g><ellipse id="ex-halo-${i}" class="ex-halo" cx="${a}" cy="${b}" rx="70" ry="37" fill="url(#ex-glow)"/><ellipse cx="${a}" cy="${b}" rx="31" ry="17" fill="none" stroke="#bfbfbf" stroke-opacity=".35" stroke-dasharray="2 4"/><path d="M${a} ${b-10}v-32" stroke="#adadad" stroke-width=".7"/><rect class="ex-location-chip" x="${a-54}" y="${b-84}" width="108" height="41" rx="5"/><text class="ex-location-label" x="${a}" y="${b-67}">${s.locations[i]}</text><text class="ex-probability" id="ex-prob-${i}" x="${a}" y="${b-50}"></text></g>`;}).join('');
    $('map').setAttribute('viewBox','0 0 720 485');
    $('map').innerHTML=`<title id="ex-map-title">${s.name} spatial belief map</title><desc id="ex-map-desc"></desc><defs><filter id="ex-contact-shadow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="4"/></filter><linearGradient id="ex-robot-metal" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f5f5f5"/><stop offset=".45" stop-color="#bcbcbc"/><stop offset="1" stop-color="#ececec"/></linearGradient><linearGradient id="ex-floor-metal" x2="0.8" y2="1"><stop stop-color="#535353"/><stop offset="1" stop-color="#343434"/></linearGradient><radialGradient id="ex-glow"><stop stop-color="#cbcbcb" stop-opacity=".7"/><stop offset="1" stop-color="#bfbfbf" stop-opacity="0"/></radialGradient><filter id="room-shadow" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="22" stdDeviation="15" flood-color="#151515" flood-opacity=".6"/></filter></defs><g class="ex-room-enter"><g filter="url(#room-shadow)">${room}</g>${overlays}<path id="ex-route" fill="none" stroke="#cbcbcb" stroke-width="2" stroke-linecap="round" opacity="0"/><g id="ex-agent" aria-label="Articulated quadruped inspection robot"></g><g id="ex-scan"><ellipse class="ex-scan" rx="50" ry="28"/></g><g id="ex-object"><circle r="12" fill="#e0e0e0"/><path d="M-4-5H3V4H-4Z M3-3H6V1H3" fill="none" stroke="#525252" stroke-width="1.5"/></g></g>`;
    $('distribution').innerHTML=s.locations.map((name,i)=>`<div class="ex-bar" id="ex-bar-${i}"><div class="ex-bar-label"><span>${name}</span><strong id="ex-value-${i}"></strong></div><div class="ex-track"><i id="ex-fill-${i}"></i></div></div>`).join('');
    if(s.shape!=='mug')$('object').innerHTML='<rect x="-7" y="-10" width="14" height="20" rx="3" fill="#d9d9d9" stroke="#606060"/><path d="M-4-5H4M-4-1H4M-4 3H1" stroke="#787878"/>';
    $('robot-preview').innerHTML=quadruped(-.35);
    shown=beliefs();
    root.querySelectorAll('[data-scene]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.scene===key)));
  }
  function render() {
    if(!busy)robotState(stage==='found'?'Target confirmed':stage==='updated'?'Ready to replan':'Standing by',stage==='found'?'success':'idle');
    const s=scenes[key], p=beliefs(), pc=percentages(p), leader=p.indexOf(Math.max(...p));
    animateBelief(p);
    $('map-clock').textContent=`DAY ${String(1+Math.floor((9+hours)/24)).padStart(2,'0')} / ${String((9+hours)%24).padStart(2,'0')}:00`;
    $('map-desc').textContent=`${s.name}. ${s.locations.map((n,i)=>`${n}: ${pc[i]}%`).join(', ')}. ${stage==='found'?'Object recovered.':hours===0?'Object directly observed.':'Object location unobserved.'}`;
    $('time').value=hours; $('time').setAttribute('aria-valuetext',`${hours} hours since observation`); $('elapsed').textContent=hours===0?'Just observed':`${hours} hours`;
    root.querySelectorAll('[data-time]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.time)===hours)));
    $('phase').textContent=busy?'Inspecting':stage==='found'?'Target recovered':stage==='updated'?'Belief updated':hours===0?'Direct observation':hours<48?'Time elapsing':'Current query';
    $('evidence-age').textContent=stage==='found'?'Just observed':`${hours}h since observation`;
    $('evidence-source').textContent=stage==='found'?'Positive detection':stage==='updated'?'Negative inspection':'Historical observation';
    $('evidence-location').textContent=stage==='found'?s.recovered:stage==='updated'?s.locations[1]:s.locations[0];
    $('context').textContent=stage==='found'?`New observation · ${s.recovered} · Day 3, 09:15`: `Last seen: ${s.locations[0]} · Day 1, 09:00 · ${hours}h ago`;
    $('reason-title').textContent=stage==='updated'?'VISIBILITY-AWARE UPDATE':stage==='found'?'NEW EVIDENCE, NEW MEMORY':'WHY THIS PREDICTION?';
    $('explanation').textContent=stage==='updated'?`No ${s.object} detected at the ${s.locations[1].toLowerCase()}. With 95% inspection visibility, its probability falls to ${pc[1]}%. Other locations remain plausible.`:stage==='found'?`A positive observation at the ${s.recovered.toLowerCase()} raises its belief to ${pc[2]}%. The observation is recorded as a new memory version.`:hours===0?`The ${s.object} is directly observed on the ${s.locations[0].toLowerCase()}. A fresh observation anchors the belief at 96%.`:hours<48?`${s.activity} No new observation is available; uncertainty grows as the original memory ages.`:s.pattern;
    $('action').disabled=busy;
    $('action').innerHTML=busy?'Navigating & inspecting… <span>···</span>':stage==='found'?'Replay this scenario <span>↺</span>':stage==='updated'?`Inspect ${s.recovered.toLowerCase()} <span>→</span>`:hours<48?'Advance to current query <span>→</span>':`Inspect ${s.locations[1].toLowerCase()} <span>→</span>`;
    $('action-hint').textContent=stage==='updated'?'Inspect another plausible location to resolve uncertainty.':stage==='found'?'Evidence closes the loop. Memory stays current.':'Follow the belief. Gather new evidence.';
    $('object').setAttribute('transform',`translate(${(stage==='found'?project(350,245,51):project(142,155,45)).join(' ')})`);
    $('object').style.opacity=hours===0||stage==='found'?'1':'0';
    const active=busy?1:stage==='found'?3:stage==='updated'?2:0;
    root.querySelectorAll('[data-step]').forEach(el=>{el.dataset.active=String(Number(el.dataset.step)<=active);if(Number(el.dataset.step)===active)el.setAttribute('aria-current','step');else el.removeAttribute('aria-current');});
    $('status').textContent=busy?`Moving to the ${stage==='updated'?s.recovered.toLowerCase():s.locations[1].toLowerCase()} to gather evidence…`:stage==='found'?`Target found at the ${s.recovered.toLowerCase()}. The agent’s memory now contains a fresh observation.`:stage==='updated'?`${s.locations[1]} checked · target not detected · posterior renormalized across all candidates.`:hours===0?`Day 1 · ${s.object} observed on the ${s.locations[0].toLowerCase()}.`:`${hours} hours without direct observation. ${hours===48?'Inspect the leading hypothesis to see how evidence changes the belief.':'Move through time to see the belief evolve.'}`;
    $('memory-name').textContent=`${s.object} · object_${s.id}`;
    $('memory-content').innerHTML=`<div><h4>IDENTITY</h4><p>object_${s.id}<br>${s.appearance}<br>First observed: Day 1, 09:00</p></div><div><h4>OBSERVATION HISTORY</h4><p>Day 1 · ${s.locations[0]} · confidence 0.96<br>${hours>0?`Following ${hours}h · no direct observation`:'Fresh observation'}${stage==='updated'||stage==='found'?`<br>Day 3 · ${s.locations[1]} · negative evidence`:''}${stage==='found'?`<br>Day 3, 09:15 · ${s.recovered} · detected`:''}</p></div><div><h4>RELATIONS & PROVENANCE</h4><p>${stage==='found'?`Located at ${s.recovered}`:s.relation}<br>Source: authored illustrative scenario<br>${stage==='updated'?'P(s | no detection) ∝ P(no detection | s) P(s)':'Persistent identity · versioned observations'}</p></div>`;
  }
  function paintBelief(values) {
    shown=values;const rounded=percentages(values),leader=values.indexOf(Math.max(...values));
    for(let i=0;i<4;i++) {
      $(`value-${i}`).textContent=`${rounded[i]}%`;$(`fill-${i}`).style.width=`${values[i]*100}%`;$(`bar-${i}`).dataset.leader=String(i===leader);
      if(i<3){$(`prob-${i}`).textContent=`${rounded[i]}%`;$(`halo-${i}`).style.opacity=.12+values[i]*.88;$(`halo-${i}`).setAttribute('rx',40+values[i]*65);$(`halo-${i}`).setAttribute('ry',22+values[i]*34);}
    }
  }
  function animateBelief(target) {
    cancelAnimationFrame(beliefFrame);
    if(reduced.matches){paintBelief(target);return;}
    const from=[...shown],start=performance.now();
    const tick=now=>{const t=Math.min(1,(now-start)/700),ease=1-Math.pow(1-t,4);paintBelief(from.map((v,i)=>v+(target[i]-v)*ease));if(t<1)beliefFrame=requestAnimationFrame(tick);};
    beliefFrame=requestAnimationFrame(tick);
  }
  function stopStory(){storyRun++;story=false;$('play').textContent='▶ Play story';$('play').setAttribute('aria-pressed','false');}
  function reset(time=48, keepStory=false) {
    if(!keepStory)stopStory();
    generation++;busy=false;stage='predict';hours=time;
    robotHeading=-Math.PI/2;poseRobot();
    $('route').style.opacity=0;$('agent').setAttribute('transform',`translate(${project(230,305).join(' ')})`);
    $('scan').querySelector('ellipse').classList.remove('scanning');render();
  }
  function travel(path,token) {
    return new Promise(resolve=>{
      const route=$('route');route.setAttribute('d',path);route.style.opacity=1;
      const length=route.getTotalLength();route.style.strokeDasharray=length;route.style.strokeDashoffset=length;
      const start=performance.now(),duration=reduced.matches?0:2600;
      robotState('Walking · route tracking','walking');
      let last= start;
      function frame(now){
        if(token!==generation){resolve(false);return;}
        const t=duration?Math.min(1,(now-start)/duration):1;
        const ease=t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
        const point=route.getPointAtLength(length*ease);
        const before=route.getPointAtLength(Math.max(0,length*ease-.6));
        const after=route.getPointAtLength(Math.min(length,length*ease+.6));
        const dx=after.x-before.x,dy=after.y-before.y;
        const heading=Math.atan2((dy/.45-dx/.82)/2,(dy/.45+dx/.82)/2);
        const delta=Math.atan2(Math.sin(heading-robotHeading),Math.cos(heading-robotHeading));
        robotHeading+=delta*(reduced.matches?1:1-Math.exp(-Math.min(60,now-last)/85));last=now;
        poseRobot(length*ease*.12,t>0&&t<1&&!reduced.matches);
        $('agent').setAttribute('transform',`translate(${point.x} ${point.y})`);route.style.strokeDashoffset=length*(1-ease);
        if(t<1)requestAnimationFrame(frame);else resolve(true);
      }
      requestAnimationFrame(frame);
    });
  }
  async function inspect() {
    if(busy)return;
    if(stage==='found'){reset();return;}
    if(hours<48){reset();return;}
    const token=++generation,recovering=stage==='updated';busy=true;render();
    const point=v=>project(...v).join(' ');
    const path=recovering?`M${point([300,110])} Q${point([255,130])} ${point([260,195])} T${point([285,260])}`:`M${point([230,305])} L${point([230,220])} Q${point([230,110])} ${point([300,110])}`;
    if(!await travel(path,token))return;
    robotState('Stationary · visual scan','scanning');
    $('phase').textContent='Scanning';$('action').innerHTML='Acquiring visual evidence… <span>◌</span>';
    $('status').textContent=`Inspecting the ${recovering?scenes[key].recovered.toLowerCase():scenes[key].locations[1].toLowerCase()} · checking target visibility.`;
    $('scan').setAttribute('transform',`translate(${project(...(recovering?[350,245,42]:[335,45,52])).join(' ')})`);
    $('scan').querySelector('ellipse').classList.add('scanning');
    await delay(1100);if(token!==generation)return;
    $('scan').querySelector('ellipse').classList.remove('scanning');stage=recovering?'found':'updated';busy=false;render();
  }
  root.querySelectorAll('[data-scene]').forEach(b=>b.addEventListener('click',()=>{key=b.dataset.scene;stage='predict';hours=48;buildScene();reset();}));
  root.querySelectorAll('[data-time]').forEach(b=>b.addEventListener('click',()=>reset(Number(b.dataset.time))));
  $('time').addEventListener('input',e=>reset(Number(e.target.value)));
  $('reset').addEventListener('click',()=>reset());
  $('inspect-memory').addEventListener('click',()=>{$('memory').open=true;$('memory').querySelector('summary').focus();});
  $('action').addEventListener('click',()=>{stopStory();inspect();});
  $('play').addEventListener('click',async()=>{
    if(story){reset(hours);return;}
    reset(0);const run=++storyRun;story=true;$('play').textContent='Ⅱ Stop story';$('play').setAttribute('aria-pressed','true');
    let token=generation;await delay(1000);if(!story||run!==storyRun||token!==generation)return;
    // Advance historical time at a steady cadence; manual controls always cancel the story.
    for(let h=1;h<=48;h++){if(!story||run!==storyRun||token!==generation)return;hours=h;render();await delay(45);}
    await delay(600);if(!story||run!==storyRun||token!==generation)return;
    await inspect();if(!story||run!==storyRun)return;token=generation;
    await delay(1500);if(!story||run!==storyRun||token!==generation)return;
    await inspect();if(story&&run===storyRun)stopStory();
  });
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&(story||busy))reset(hours);});
  buildScene();reset();root.hidden=false;
})();
