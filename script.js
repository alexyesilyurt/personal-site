(function(){
"use strict";
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const RM=matchMedia("(prefers-reduced-motion: reduce)").matches;
const C={I:"#2BD9E4",J:"#3D6DF0",L:"#F5952B",O:"#F5D51F",S:"#41D16A",T:"#B44BE0",Z:"#F0413F"};
const GLYPH={I:[[1,1,1,1]],J:[[1,0,0],[1,1,1]],L:[[0,0,1],[1,1,1]],O:[[1,1],[1,1]],
             S:[[0,1,1],[1,1,0]],T:[[0,1,0],[1,1,1]],Z:[[1,1,0],[0,1,1]]};
const KEYS=Object.keys(C);
const rnd=a=>a[Math.floor(Math.random()*a.length)];
document.body.classList.add("js");

function glyph(el,k){
  const g=GLYPH[k];
  el.style.gridTemplateColumns=`repeat(${g[0].length},var(--gs,6px))`;
  el.style.setProperty("--c",C[k]);
  el.innerHTML=g.flat().map(v=>`<span class="${v?"on":""}"></span>`).join("");
}
$$(".pc[data-piece]").forEach(el=>glyph(el,el.dataset.piece));

const LET={A:[[0,1,0],[1,0,1],[1,1,1],[1,0,1],[1,0,1]],Y:[[1,0,1],[1,0,1],[0,1,0],[0,1,0],[0,1,0]]};
(function(){
  const wrap=$("#titleMark");
  [["A","I"],["Y","T"]].forEach(([ch,pc])=>{
    const d=document.createElement("div"); d.className="glyph";
    d.innerHTML=LET[ch].flat().map(v=>
      `<span class="${v?"on":""}" style="background:${v?C[pc]:"rgba(237,241,247,.05)"}"></span>`).join("");
    wrap.appendChild(d);
  });
})();

/* Pixel art for the ADDITIONAL tiles. The Tetris well keeps the beveled-mino look
   of the board; the rest are fine-grained sprites on a 16px-wide grid with their
   own palettes, so they can be properly shaded. */
const ART={
  tetris:{pal:C, rows:["......I","......I","......I","......I",
                       "LOOJST.","LZTJSO.","ZZTTOL."]},

  trail:{fine:1, pal:{w:"#F4F8FC",W:"#B9C8D8",k:"#43301F",b:"#6B5236",B:"#93724E",
                      g:"#3FA057",G:"#27693A",l:"#6ACB80",o:"#FFE98C",O:"#F6BC4A",y:"#EF9A2E"},
         rows:["............yOy.",
               "...........yOoOy",
               "...........OoooO",
               "......w....yOoOy",
               ".....WwW....yOy.",
               "....WwwwW.......",
               "...kbwwwBB......",
               "..kkbbbbBBB.....",
               "..kkbbbbbBBBB...",
               ".kkkbbbbbBBBBB..",
               ".GGggggggggGGGG.",
               "GGgggllggggGGGGG",
               "GgggllgggglggGGG",
               "GGgggggggggggGGG"]},

  plane:{fine:1, pal:{w:"#F2F6FA",W:"#CBD6E2",b:"#3D7FD6",B:"#27508F",c:"#8FC0F0",
                      p:"#E4EAF1",P:"#A9B4C1",r:"#E05A4A",g:"#5FBF6E",o:"#F2A93B",n:"#9C6B3F"},
         rows:["................",
               "..w.............",
               "..ww............",
               "..www...........",
               ".wwwwwwwwwwww...",
               "wwbbbbbbbbbbbw..",
               ".wwwwwwwwwww....",
               "...cbbbc........",
               "................",
               "..........rgo...",
               "........ngrrogn.",
               "........pwwwwwwp",
               ".........PPPPPP.",
               "................"]},

  lift:{fine:1, pal:{k:"#262C35",d:"#39414C",m:"#727B89",l:"#A2ABB8",w:"#CDD4DD"},
        rows:["..dkd.....dkd...",
              ".dkkkd...dkkkd..",
              ".dkkkd...dkkkd..",
              ".dkkkd...dkkkd..",
              "mlkkklmmmlkkklmm",
              "wlkkklmmmlkkklmm",
              ".dkkkd...dkkkd..",
              ".dkkkd...dkkkd..",
              ".dkkkd...dkkkd..",
              "..dkd.....dkd..."]},

  cat:{fine:1, pal:{k:"#2B313A",d:"#434B57",w:"#F4F7FA",W:"#D2D9E1",
                    y:"#F5D14B",o:"#C9A62F",p:"#E8909B"},
       rows:["..k.........k...",
             "..kk.......kk...",
             ".kdkk.....kkdk..",
             ".kkkkkkkkkkkkkk.",
             "kkkkkkkkkkkkkkkk",
             "kkkyykkkkkkyykkk",
             "kkkyokkkkkkyokkk",
             "kkkkkkwwwwkkkkkk",
             "kkkkkwwppwwkkkkk",
             ".kkkwwwwwwwwkkk.",
             ".kkwwwwwwwwwwkk.",
             "..kwwwwwwwwwwk..",
             "...wwwwwwwwww...",
             "....wwwwwwww...."]}
};
function drawArt(el){
  const a=ART[el.dataset.art]; if(!a) return;
  el.classList.toggle("fine",!!a.fine);
  el.style.gridTemplateColumns=`repeat(${a.rows[0].length}, var(--as))`;
  el.innerHTML=a.rows.join("").split("").map(ch=>{
    const col=ch==="."?null:a.pal[ch];
    return col?`<span class="on" style="background:${col}"></span>`:"<span></span>";
  }).join("");
}
$$(".art[data-art]").forEach(drawArt);

/* ---------- ambient ---------- */
let stopAmbient=()=>{};
(function(){
  if(RM) return;
  const cv=$("#ambient"), ctx=cv.getContext("2d");
  let w,h,raf; const bits=[];
  const size=()=>{w=cv.width=innerWidth; h=cv.height=innerHeight;};
  size(); addEventListener("resize",size);
  for(let i=0;i<24;i++) bits.push({x:Math.random()*w,y:Math.random()*h,s:8+Math.random()*13,
    v:.16+Math.random()*.5,k:rnd(KEYS),a:.05+Math.random()*.09});
  (function loop(){
    ctx.clearRect(0,0,w,h);
    for(const b of bits){
      b.y+=b.v; if(b.y>h+40){b.y=-40;b.x=Math.random()*w;b.k=rnd(KEYS);}
      ctx.globalAlpha=b.a; ctx.fillStyle=C[b.k];
      GLYPH[b.k].forEach((row,r)=>row.forEach((v,c)=>{ if(v) ctx.fillRect(b.x+c*b.s,b.y+r*b.s,b.s-1.5,b.s-1.5); }));
    }
    ctx.globalAlpha=1; raf=requestAnimationFrame(loop);
  })();
  stopAmbient=()=>cancelAnimationFrame(raf);
})();

/* ================= MODE ================= */
const boot=$("#boot");
function setMode(m){
  document.body.classList.toggle("mode-arcade",m==="arcade");
  document.body.classList.toggle("mode-plain",m==="plain");
  try{ localStorage.setItem("ay_mode",m); }catch(e){}
  if(m==="plain"){ stopAmbient(); boot.classList.add("gone"); }
  else { fitBoard(); layoutRows(); }
}
$("#toPlain").addEventListener("click",()=>setMode("plain"));
$("#toArcade").addEventListener("click",()=>{ boot.classList.add("gone"); boot.classList.remove("live"); setMode("arcade"); });

/* ================= BOARD ================= */
const SECTIONS=$$("#doc .sec").map(el=>({
  id:el.id, label:el.dataset.label, piece:el.dataset.piece,
  tally:el.dataset.tally, color:C[el.dataset.piece], el
}));
const GAPS=[9,6,8,5,9,7,6];              /* right-half gaps keep the left-aligned labels legible */
const board=$("#board"), cursor=$("#cursor"), ghost=$("#ghost");
let target=0, cleared=new Set(), score=0, busy=false;

function fitBoard(){
  const vw=innerWidth, vh=innerHeight;
  const byH=(vh-(vw<1120?190:210))/12, byW=(vw-(vw<1120?28:480))/10;
  const bc=Math.max(20,Math.min(vw<1120?46:56,Math.floor(Math.min(byH,byW))));
  document.documentElement.style.setProperty("--bc",bc+"px");
  return bc;
}
function buildRows(){
  $$(".brow").forEach(n=>n.remove());
  SECTIONS.forEach((s,i)=>{
    const row=document.createElement("div");
    row.className="brow"; row.dataset.i=i; row.style.setProperty("--c",s.color);
    let cells="";
    for(let c=0;c<10;c++) cells+=`<span class="cell${c===GAPS[i]?" gap":""}"></span>`;
    row.innerHTML=cells+`<span class="blabel">${s.label}<em>${s.tally}</em></span>`;
    row.addEventListener("click",()=>{ if(busy) return; target=i; paint(); select(i); });
    row.addEventListener("mouseenter",()=>{ if(busy||cleared.has(i)) return; target=i; paint(); });
    board.appendChild(row);
  });
}
function liveRows(){ return SECTIONS.map((_,i)=>i).filter(i=>!cleared.has(i)); }
function layoutRows(){
  const bc=parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--bc"));
  const live=liveRows();
  SECTIONS.forEach((s,i)=>{
    const row=board.querySelector(`.brow[data-i="${i}"]`); if(!row) return;
    const pos=live.indexOf(i);
    if(pos<0){ row.classList.add("cleared"); return; }
    row.style.top=((12-live.length+pos)*bc)+"px";
  });
  paint();
}
function paint(){
  const live=liveRows();
  if(!live.length){ cursor.style.opacity=0; ghost.style.opacity=0; return; }
  if(cleared.has(target)) target=live[0];
  const bc=parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--bc"));
  const row=board.querySelector(`.brow[data-i="${target}"]`);
  $$(".brow").forEach(r=>r.classList.toggle("target",+r.dataset.i===target));
  const col=GAPS[target], s=SECTIONS[target];
  cursor.style.opacity=1; cursor.style.left=(col*bc)+"px"; cursor.style.top="0px";
  cursor.style.setProperty("--c",s.color);
  cursor.querySelectorAll("i").forEach(i=>i.style.background=s.color);
  ghost.style.opacity=1; ghost.style.setProperty("--c",s.color);
  ghost.style.left=(col*bc)+"px"; ghost.style.top=row.style.top;
  $$("#queue button").forEach((b,i)=>b.classList.toggle("active",i===target));
}
function cycle(d){
  const live=liveRows(); if(!live.length) return;
  let p=live.indexOf(target); if(p<0) p=0;
  target=live[(p+d+live.length)%live.length]; paint();
}
function select(i){
  if(busy) return;
  if(cleared.has(i)){ openPanel(i); return; }
  busy=true; target=i; paint();
  const bc=parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--bc"));
  const row=board.querySelector(`.brow[data-i="${i}"]`);
  ghost.style.opacity=0;
  cursor.classList.add("dropping");
  cursor.style.top=(parseFloat(row.style.top)-3*bc)+"px";   /* bottom mino lands in the gap */
  /* one flat timeline, not a cascade: each beat is scheduled up front, so a delayed
     or dropped timer can never strand the board mid-drop. */
  const at=(ms,fn)=>setTimeout(fn,RM?0:ms);
  at(270,()=>{ board.classList.add("shake"); row.classList.add("flash"); cursor.style.opacity=0; });
  at(570,()=>{
    board.classList.remove("shake"); row.classList.remove("flash");
    cleared.add(i); score+=800; updStats(); layoutRows();
    cursor.classList.remove("dropping");
  });
  at(830,()=>{
    busy=false;
    if(!cleared.has(i)){ cleared.add(i); score+=800; updStats(); layoutRows(); }
    openPanel(i);
  });
}
function updStats(){
  $("#sCleared").textContent=cleared.size+"/7";
  $("#aLines").textContent=cleared.size;
  $("#sScore").textContent=score.toLocaleString();
  $("#aScore").textContent=score.toLocaleString();
  $("#sLevel").textContent=String(cleared.size+1).padStart(2,"0");
  $$("#queue button").forEach((b,i)=>b.classList.toggle("done",cleared.has(i)));
  $$(".brow").forEach(r=>r.classList.toggle("done",cleared.has(+r.dataset.i)));
  if(cleared.size===SECTIONS.length) perfectClear();
}
function perfectClear(){
  if($("#pc")) return;
  const d=document.createElement("div");
  d.id="pc";
  d.style.cssText=`position:absolute;inset:0;display:grid;place-items:center;text-align:center;padding:18px;
    font-family:var(--arcade);color:var(--I);z-index:4`;
  d.innerHTML=`<div><div style="font-size:calc(var(--bc)*.32);letter-spacing:.1em;
      text-shadow:0 0 22px rgba(43,217,228,.75);margin-bottom:16px">PERFECT CLEAR</div>
    <div style="font-family:var(--mono);font-size:12px;color:var(--muted);letter-spacing:.06em;line-height:1.9">
      7/7 sections &middot; ${score.toLocaleString()} pts<br>thanks for playing &mdash; feel free to reach out!</div></div>`;
  board.appendChild(d);
}
function resetBoard(){
  cleared.clear(); score=0; target=0; busy=false;
  const pc=$("#pc"); if(pc) pc.remove();
  $$(".brow").forEach(r=>r.classList.remove("cleared","done","flash"));
  cursor.style.opacity=1;
  layoutRows(); updStats();
}
$("#resetBoard").addEventListener("click",resetBoard);
$("#mReset").addEventListener("click",resetBoard);
$("#mPlain").addEventListener("click",()=>setMode("plain"));
$("#mPlay").addEventListener("click",()=>openGame());

/* queue rail */
$("#queue").innerHTML=SECTIONS.map((s,i)=>
  `<button data-i="${i}" style="--c:${s.color}"><span class="pc" data-piece="${s.piece}"></span><span class="nm">${s.label}</span></button>`).join("");
$$("#queue .pc[data-piece]").forEach(el=>glyph(el,el.dataset.piece));
$$("#queue button").forEach(b=>b.addEventListener("click",()=>{ const i=+b.dataset.i; target=i; paint(); select(i); }));

/* ---------- panel ---------- */
const panel=$("#panel");
function openPanel(i){
  const s=SECTIONS[i];
  $("#pTitle").textContent=s.label;
  $("#pTitle").style.color=s.color;
  $("#pPts").textContent="+800";
  $("#pPts").style.setProperty("--c",s.color);
  glyph($("#pPiece"),s.piece);
  const body=$("#pBody"); body.innerHTML="";
  body.style.setProperty("--c",s.color);
  body.appendChild(s.el.querySelector(".sec-content").cloneNode(true));
  panel.classList.add("on");
  $("#pClose").focus();
}
function closePanel(){ panel.classList.remove("on"); paint(); }
$("#pClose").addEventListener("click",closePanel);
panel.addEventListener("click",e=>{ if(e.target===panel) closePanel(); });
$("#pBody").addEventListener("click",e=>{ if(e.target.closest("[data-game]")) openGame(); });
$$("#doc [data-game]").forEach(t=>t.addEventListener("click",()=>openGame()));

/* ================= BOOT SEQUENCE ================= */
const STACK=["LLOOJJSST".split(""),"LOOJJSSTT".split(""),
             "LLZZTTJJS".split(""),"ZZTTJJLLO".split("")];
function showStage(n){ $$(".stage").forEach(s=>s.classList.toggle("on",s.dataset.stage===n)); }
function enterWell(){
  boot.classList.add("gone"); stopAmbient();
  setTimeout(()=>boot.classList.remove("live"),560);
  fitBoard(); layoutRows(); updStats();
}
(function(){
  const bar=$("#loadBar"), pct=$("#loadPct");
  for(let i=0;i<10;i++) bar.appendChild(document.createElement("i"));
  const bits=[...bar.children];
  if(RM){ showStage("title"); return; }
  let i=0;
  (function step(){
    if(i>=10){ pct.textContent="100%"; setTimeout(()=>showStage("title"),330); return; }
    bits[i].classList.add("fill"); bits[i].style.background=C[rnd(KEYS)];
    i++; pct.textContent=(i*10)+"%";
    setTimeout(step,55+Math.random()*85);
  })();
})();
function runDrop(){
  showStage("drop");
  const well=$("#dropWell"), cap=$("#dropCap"), call=$("#call");
  well.querySelectorAll(".mino,.piece").forEach(n=>n.remove());
  call.classList.remove("on");
  const dc=parseFloat(getComputedStyle(well).width)/10;
  const put=(r,c,color)=>{
    const d=document.createElement("div"); d.className="mino";
    d.style.setProperty("--c",color);
    d.style.left=(c*dc)+"px"; d.style.top=(r*dc)+"px";
    d.style.width=dc+"px"; d.style.height=dc+"px"; d.dataset.row=r;
    well.appendChild(d); return d;
  };
  STACK.forEach((row,i)=>row.forEach((k,c)=>put(8+i,c,C[k])));
  cap.textContent="one column open \u2014 4 rows deep";
  const piece=document.createElement("div");
  piece.className="piece";
  piece.style.cssText=`position:absolute;left:${9*dc}px;top:0;width:${dc}px;height:${4*dc}px;
    transform:translateY(${-5*dc}px);will-change:transform`;
  for(let i=0;i<4;i++){
    const d=document.createElement("div"); d.className="mino";
    d.style.cssText=`position:absolute;left:0;top:${i*dc}px;width:${dc}px;height:${dc}px`;
    d.style.setProperty("--c",C.I); piece.appendChild(d);
  }
  well.appendChild(piece);
  const land=()=>{
    well.classList.add("shake"); cap.textContent="locked";
    for(let i=0;i<4;i++){ const m=put(8+i,9,C.I); m.style.transition="none"; }
    piece.remove();
    const rowMinos=[...well.querySelectorAll(".mino")].filter(m=>+m.dataset.row>=8);
    setTimeout(()=>{ rowMinos.forEach(m=>m.classList.add("flash"));
      call.classList.add("on"); cap.textContent="4 lines \u2014 800 pts"; },150);
    setTimeout(()=>{ rowMinos.forEach(m=>{
      const c=parseFloat(m.style.left)/dc;
      setTimeout(()=>m.classList.add("clear"),Math.abs(c-4.5)*38); }); },560);
    setTimeout(enterWell,1180);
  };
  /* never gate the sequence on rAF: a hidden tab stops firing frames and would strand the visitor */
  let started=false;
  const start=()=>{ if(started) return; started=true;
    piece.style.transition="transform 680ms cubic-bezier(.5,0,.85,.35)";
    piece.style.transform=`translateY(${8*dc}px)`; };
  requestAnimationFrame(start); setTimeout(start,60);
  let landed=false;
  setTimeout(()=>{ if(landed) return; landed=true; land(); },760);
  setTimeout(()=>{ if(!boot.classList.contains("gone")) enterWell(); },3400);
}
$("#playBtn").addEventListener("click",()=>{ RM ? enterWell() : runDrop(); });
$("#skipBtn").addEventListener("click",enterWell);
document.addEventListener("visibilitychange",()=>{
  if(document.hidden && !boot.classList.contains("gone")) boot.dataset.left="1";
  else if(!document.hidden && boot.dataset.left==="1") enterWell();
});

/* ================= KEYS ================= */
addEventListener("keydown",e=>{
  const k=e.key;
  if($("#game").classList.contains("on")) return;           /* game owns its keys */
  if(!boot.classList.contains("gone")){
    if(k==="Enter"||k===" "){ e.preventDefault();
      if($(".stage.on")?.dataset.stage==="title") RM?enterWell():runDrop(); }
    else if(k==="Escape") enterWell();
    return;
  }
  if(panel.classList.contains("on")){ if(k==="Escape") closePanel(); return; }
  if(!document.body.classList.contains("mode-arcade")) return;
  if(k==="ArrowDown"||k==="ArrowRight"||k==="s"||k==="d"){ e.preventDefault(); cycle(1); }
  else if(k==="ArrowUp"||k==="ArrowLeft"||k==="w"||k==="a"){ e.preventDefault(); cycle(-1); }
  else if(k===" "||k==="Enter"){ e.preventDefault(); select(target); }
  else if(k==="t"||k==="T"){ openGame(); }
  else if(k==="p"||k==="P"){ setMode("plain"); }
});
addEventListener("resize",()=>{ if(document.body.classList.contains("mode-arcade")){ fitBoard(); layoutRows(); } });

/* ================= PLAYABLE TETRIS ================= */
let openGame;
(function(){
  const SH={I:[[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
    J:[[1,0,0],[1,1,1],[0,0,0]],L:[[0,0,1],[1,1,1],[0,0,0]],O:[[1,1],[1,1]],
    S:[[0,1,1],[1,1,0],[0,0,0]],T:[[0,1,0],[1,1,1],[0,0,0]],Z:[[1,1,0],[0,1,1],[0,0,0]]};
  const W=10,H=20;
  const cv=$("#gboard"), ctx=cv.getContext("2d");
  const nx=$("#nextC"), nctx=nx.getContext("2d");
  const hd=$("#holdC"), hctx=hd.getContext("2d");
  let CELL=26,grid,cur,bag=[],next=[],hold=null,canHold=true,
      score=0,lines=0,level=1,dead=false,paused=false,acc=0,last=0,raf=null;
  const best=()=>+(localStorage.getItem("ay_tetris_best")||0);
  const rot=m=>m[0].map((_,i)=>m.map(r=>r[i]).reverse());
  const narrow=()=>innerWidth<700;
  function fit(){
    const n=narrow();
    /* narrow screens stack the readouts above the board, so reserve height not width */
    CELL=Math.max(13,Math.min(n?24:26,
      Math.floor((innerHeight-(n?300:150))/H),
      Math.floor((innerWidth-(n?34:230))/W)));
    cv.width=W*CELL; cv.height=H*CELL;
    nx.width=n?216:76; nx.height=n?44:210;
    hd.width=n?58:76;  hd.height=n?44:56;
  }
  function refill(){ if(!bag.length) bag=[...KEYS].sort(()=>Math.random()-.5); }
  function pull(){ refill(); return bag.pop(); }
  function spawn(k){
    const key=k||next.shift(); while(next.length<5) next.push(pull());
    const m=SH[key].map(r=>[...r]);
    cur={k:key,m,x:Math.floor((W-m[0].length)/2),y:key==="I"?-1:0};
    if(hits(cur.m,cur.x,cur.y)) over();
  }
  function hits(m,px,py){
    for(let r=0;r<m.length;r++)for(let c=0;c<m[r].length;c++){
      if(!m[r][c]) continue;
      const x=px+c,y=py+r;
      if(x<0||x>=W||y>=H) return true;
      if(y>=0&&grid[y][x]) return true;
    } return false;
  }
  function clearLines(){
    let n=0;
    for(let r=H-1;r>=0;r--) if(grid[r].every(v=>v)){ grid.splice(r,1); grid.unshift(Array(W).fill(0)); n++; r++; }
    if(n){ lines+=n; score+=[0,100,300,500,800][n]*level; level=Math.floor(lines/10)+1; }
  }
  function lock(){
    cur.m.forEach((row,r)=>row.forEach((v,c)=>{ if(v&&cur.y+r>=0) grid[cur.y+r][cur.x+c]=cur.k; }));
    clearLines(); canHold=true; if(!dead) spawn(); sync();
  }
  function ghostY(){ let y=cur.y; while(!hits(cur.m,cur.x,y+1)) y++; return y; }
  function block(g,x,y,color,s,alpha){
    g.globalAlpha=alpha==null?1:alpha; g.fillStyle=color; g.fillRect(x,y,s,s);
    g.fillStyle="rgba(255,255,255,.32)"; g.fillRect(x,y,s,2.5); g.fillRect(x,y,2.5,s);
    g.fillStyle="rgba(0,0,0,.38)"; g.fillRect(x,y+s-2.5,s,2.5); g.fillRect(x+s-2.5,y,2.5,s);
    g.globalAlpha=1;
  }
  function draw(){
    ctx.fillStyle="#0B0D12"; ctx.fillRect(0,0,cv.width,cv.height);
    ctx.strokeStyle="rgba(237,241,247,.045)"; ctx.lineWidth=1;
    for(let x=1;x<W;x++){ctx.beginPath();ctx.moveTo(x*CELL+.5,0);ctx.lineTo(x*CELL+.5,cv.height);ctx.stroke();}
    for(let y=1;y<H;y++){ctx.beginPath();ctx.moveTo(0,y*CELL+.5);ctx.lineTo(cv.width,y*CELL+.5);ctx.stroke();}
    for(let r=0;r<H;r++)for(let c=0;c<W;c++) if(grid[r][c]) block(ctx,c*CELL,r*CELL,C[grid[r][c]],CELL);
    if(cur&&!dead){
      const gy=ghostY();
      cur.m.forEach((row,r)=>row.forEach((v,c)=>{ if(v&&gy+r>=0) block(ctx,(cur.x+c)*CELL,(gy+r)*CELL,C[cur.k],CELL,.2); }));
      cur.m.forEach((row,r)=>row.forEach((v,c)=>{ if(v&&cur.y+r>=0) block(ctx,(cur.x+c)*CELL,(cur.y+r)*CELL,C[cur.k],CELL); }));
    }
  }
  function bbox(sh){
    let r0=9,r1=-1,c0=9,c1=-1;
    sh.forEach((row,r)=>row.forEach((v,c)=>{ if(v){
      if(r<r0)r0=r; if(r>r1)r1=r; if(c<c0)c0=c; if(c>c1)c1=c; }}));
    return {r0,c0,w:c1-c0+1,h:r1-r0+1};
  }
  function mini(g,cvs,keys){
    g.clearRect(0,0,cvs.width,cvs.height);
    const horiz=cvs.width>cvs.height, s=horiz?9:11;
    const n=Math.max(1,keys.length);
    const slot=horiz?cvs.width/n:42;
    keys.forEach((k,i)=>{ if(!k) return;
      const sh=SH[k], b=bbox(sh);
      const cx=horiz? i*slot+slot/2 : cvs.width/2;
      const cy=horiz? cvs.height/2 : i*slot+slot/2;
      const ox=Math.round(cx-b.w*s/2)-b.c0*s, oy=Math.round(cy-b.h*s/2)-b.r0*s;
      sh.forEach((row,r)=>row.forEach((v,c)=>{ if(v) block(g,ox+c*s,oy+r*s,C[k],s); })); });
  }
  function sync(){
    $("#gScore").textContent=score.toLocaleString(); $("#gLines").textContent=lines;
    $("#gLevel").textContent=level; $("#gBest").textContent=best().toLocaleString();
    mini(nctx,nx,next.slice(0,5)); mini(hctx,hd,[hold]);
  }
  function over(){
    dead=true; if(score>best()) localStorage.setItem("ay_tetris_best",score);
    $("#gOverP").textContent=`${score.toLocaleString()} pts \u00B7 ${lines} lines \u00B7 best ${best().toLocaleString()}`;
    $("#gOver").classList.add("on"); sync();
  }
  function reset(){
    fit(); grid=Array.from({length:H},()=>Array(W).fill(0));
    bag=[]; next=[]; hold=null; canHold=true;
    score=0; lines=0; level=1; dead=false; paused=false; acc=0; last=0;
    for(let i=0;i<5;i++) next.push(pull());
    spawn(); $("#gOver").classList.remove("on"); sync();
  }
  function loop(t){
    if(!last) last=t;
    const dt=t-last; last=t;
    if(!dead&&!paused){ acc+=dt;
      if(acc>Math.max(55,800-(level-1)*68)){ acc=0; if(!hits(cur.m,cur.x,cur.y+1)) cur.y++; else lock(); } }
    draw(); raf=requestAnimationFrame(loop);
  }
  const g=$("#game");
  openGame=function(){ g.classList.add("on"); reset(); if(!raf) raf=requestAnimationFrame(loop); };
  function close(){ g.classList.remove("on"); if(raf){cancelAnimationFrame(raf); raf=null;} }
  /* Thumb controls dispatch the same keys the keyboard path already handles,
     so there is exactly one input implementation to keep correct. */
  $$("#gTouch button").forEach(b=>{
    const map={rotate:"ArrowUp", drop:" ", hold:"c"};
    const key=map[b.dataset.k]||b.dataset.k;
    b.addEventListener("pointerdown",e=>{
      e.preventDefault();
      window.dispatchEvent(new KeyboardEvent("keydown",{key,bubbles:true,cancelable:true}));
    });
  });
  $("#openGame").addEventListener("click",openGame);
  $("#closeGame").addEventListener("click",close);
  $("#retry").addEventListener("click",()=>{reset(); last=0;});
  addEventListener("resize",()=>{ if(g.classList.contains("on")){ fit(); sync(); } });
  addEventListener("keydown",e=>{
    if(!g.classList.contains("on")) return;
    const k=e.key;
    if(k==="Escape"){ close(); return; }
    if(dead){ if(k==="Enter"){reset(); last=0;} return; }
    if(k==="p"||k==="P"){ paused=!paused; return; }
    if(paused) return;
    if(["ArrowLeft","ArrowRight","ArrowDown","ArrowUp"," "].includes(k)) e.preventDefault();
    if(k==="ArrowLeft"){ if(!hits(cur.m,cur.x-1,cur.y)) cur.x--; }
    else if(k==="ArrowRight"){ if(!hits(cur.m,cur.x+1,cur.y)) cur.x++; }
    else if(k==="ArrowDown"){ if(!hits(cur.m,cur.x,cur.y+1)){cur.y++; score++;} else lock(); }
    else if(k==="ArrowUp"||k==="x"||k==="X"||k==="z"||k==="Z"){
      let m=cur.m; for(let i=0;i<((k==="z"||k==="Z")?3:1);i++) m=rot(m);
      for(const [ox,oy] of [[0,0],[-1,0],[1,0],[-2,0],[2,0],[0,-1],[-1,-1],[1,-1]])
        if(!hits(m,cur.x+ox,cur.y+oy)){ cur.m=m; cur.x+=ox; cur.y+=oy; break; }
    }
    else if(k===" "){ let d=0; while(!hits(cur.m,cur.x,cur.y+1)){cur.y++; d++;} score+=d*2; lock(); }
    else if(k==="c"||k==="C"){ if(canHold){ const kk=cur.k;
      if(hold===null){ hold=kk; spawn(); } else { const h=hold; hold=kk; spawn(h); }
      canHold=false; } }
    sync();
  });
})();

/* ================= INIT ================= */
buildRows(); fitBoard(); layoutRows(); updStats();
let mode="arcade";
try{ if(localStorage.getItem("ay_mode")==="plain") mode="plain"; }catch(e){}
/* reduced motion keeps the arcade -- every transition is already neutralised in CSS --
   but the intro is skipped below via `seen`. */
setMode(mode);
/* The intro runs on every load -- a refresh should always land on the loading
   screen. Only reduced-motion or an explicit ?skip bypasses it. */
const seen=RM||/[?&]skip/.test(location.search);
if(mode!=="arcade"||seen){ boot.classList.add("gone"); boot.classList.remove("live"); stopAmbient(); }
/* deep link: ?s=projects opens that section straight away */
const want=(location.search.match(/[?&]s=([a-z]+)/)||[])[1];
if(want){ const i=SECTIONS.findIndex(s=>s.id===want);
  if(i>=0){ target=i; paint(); if(seen) setTimeout(()=>openPanel(i),120); } }
})();
