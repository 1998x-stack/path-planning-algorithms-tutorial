"use strict";
document.addEventListener("DOMContentLoaded",()=>{const search=document.getElementById("chapter-search");if(search){const cards=[...document.querySelectorAll(".chapter-card")],sections=[...document.querySelectorAll(".catalog-section")],status=document.getElementById("filter-status");const filter=()=>{const q=search.value.trim().toLocaleLowerCase();let count=0;for(const card of cards){const show=card.dataset.title.toLocaleLowerCase().includes(q);card.hidden=!show;if(show)count++}for(const section of sections)section.hidden=![...section.querySelectorAll(".chapter-card")].some(card=>!card.hidden);status.textContent=q?("匹配 "+count+" / "+cards.length+" 个章节"):""};search.addEventListener("input",filter);}
const demo=document.querySelector("[data-grid-demo]");if(demo){const cells=[...demo.querySelectorAll(".demo-cell")],status=demo.querySelector(".demo-status"),buttons=[...demo.querySelectorAll("[data-step]")];const walls=new Set([12,21,30,39,48,57,58,59,32,41,50]),start=64,goal=16;const W=9;const neighbors=(v)=>[v-W,v+W,v-1,v+1].filter(n=>n>=0&&n<81&&(Math.abs((n%W)-(v%W))+Math.abs(Math.floor(n/W)-Math.floor(v/W))===1)&&!walls.has(n));let steps=[],pos=0;function calculate(){const q=[start],parent=new Map([[start,null]]),depth=new Map([[start,0]]);steps=[{cur:-1,frontier:[start],seen:[],route:[]}];let k=0;while(k<q.length){const cur=q[k++];if(cur===goal)break;for(const n of neighbors(cur)){if(!parent.has(n)){parent.set(n,cur);depth.set(n,depth.get(cur)+1);q.push(n);}}steps.push({cur,frontier:q.slice(k),seen:q.slice(0,k),route:[]});}if(parent.has(goal)){const route=[];for(let p=goal;p!==null;p=parent.get(p))route.push(p);steps.push({cur:goal,frontier:[],seen:q.slice(0,k),route:route.reverse()});}}function render(){const st=steps[pos];cells.forEach((node,i)=>{node.className="demo-cell"+(walls.has(i)?" wall":"")+(st.seen.includes(i)?" visited":"")+(st.frontier.includes(i)?" frontier":"")+(st.route.includes(i)?" route":"")+(i===start?" start":"")+(i===goal?" goal":"");node.textContent=i===start?"S":i===goal?"G":""});status.textContent=st.route.length?"已到达终点，路径共 "+(st.route.length-1)+" 步。":"第 "+pos+" / "+(steps.length-1)+" 次展开；探索过 "+st.seen.length+" 格；待探索 "+st.frontier.length+" 格。";buttons.forEach(b=>b.disabled=b.dataset.step==="next"&&pos===steps.length-1); }calculate();render();buttons.forEach(btn=>btn.addEventListener("click",()=>{if(btn.dataset.step==="reset")pos=0;else pos=Math.min(pos+1,steps.length-1);render()}));}
});

// Interactive WA* toy example used by chapter 08.
document.addEventListener("DOMContentLoaded",()=>{
 const demo=document.querySelector("[data-weighted-demo]");
 if(!demo)return;
 const status=demo.querySelector(".demo-status");
 const buttons=[...demo.querySelectorAll("[data-weight]")];
 const edges={S:[["A",2],["B",1]],A:[["G",2]],B:[["G",5]],G:[]};
 const heuristic={S:1,A:2,B:0,G:0};
 function run(weight){
   const queue=[{u:"S",g:0,f:weight*heuristic.S}],best={S:0},parent={S:null};
   let popped=0;
   while(queue.length){
     queue.sort((a,b)=>a.f-b.f||a.g-b.g||a.u.localeCompare(b.u));
     const cur=queue.shift();
     if(cur.g!==best[cur.u])continue;
     popped++;
     if(cur.u==="G"){
       const route=[];let p="G";
       while(p!==null){route.push(p);p=parent[p];}
       return {route:route.reverse(),cost:cur.g,popped};
     }
     for(const [v,w] of edges[cur.u]){
       const next=cur.g+w;
       if(next<(best[v]??Infinity)){best[v]=next;parent[v]=cur.u;queue.push({u:v,g:next,f:next+weight*heuristic[v]});}
     }
   }
   return null;
 }
 function render(weight){
   const result=run(weight);
   status.textContent=result?("ε="+weight+"：路径 "+result.route.join("→")+"，总代价 "+result.cost+"；有效弹出 "+result.popped+" 次（教学图）。"):"无路径";
   for(const b of buttons)b.setAttribute("aria-pressed",String(Number(b.dataset.weight)===weight));
 }
 for(const b of buttons)b.addEventListener("click",()=>render(Number(b.dataset.weight)));
 render(1);
});

// Interactive structural tradeoff on sampling-planner overview.
document.addEventListener("DOMContentLoaded",()=>{
 const demo=document.querySelector("[data-sampling-choice]");if(!demo)return;
 const status=demo.querySelector(".demo-status"),buttons=[...demo.querySelectorAll("[data-choice]")];
 const messages={
   single:"单次规划：优先评估 RRT / RRT*（按可行性与最优性预算区分）。",
   multi:"多次查询：优先评估 PRM / PRM*（分开计预处理与各次查询成本）。"
 };
 for(const b of buttons)b.addEventListener("click",()=>{
   const selected=b.dataset.choice;
   status.textContent=messages[selected];
   for(const item of buttons)item.setAttribute("aria-pressed",String(item===b));
 });
});
// Collision-validated shortcut geometry illustrated in chapter 15.
// Both path variants are prevalidated against the fixed rectangle used in the teaching diagram.
document.addEventListener("DOMContentLoaded",()=>{
 const demo=document.querySelector("[data-shortcut-demo]");if(!demo)return;
 const line=demo.querySelector("[data-shortcut-polyline]");
 const status=demo.querySelector(".demo-status"),buttons=[...demo.querySelectorAll("[data-path-mode]")];
 const variants={
   raw:{points:"67,120 67,196 153,207 327,207 413,196 413,120",text:"原始路径：6 个节点；每段保持不穿越禁区。"},
   safe:{points:"67,120 153,207 327,207 413,120",text:"已检验捷径：4 个节点；仍经障碍下缘绕行。"}
 };
 for(const b of buttons)b.addEventListener("click",()=>{
   const value=variants[b.dataset.pathMode];
   line.setAttribute("points",value.points);
   status.textContent=value.text;
   for(const item of buttons)item.setAttribute("aria-pressed",String(item===b));
 });
});

// DWA: score only the already collision- and braking-filtered candidate set.
document.addEventListener("DOMContentLoaded",()=>{
 const demo=document.querySelector("[data-dwa-demo]");if(!demo)return;
 const status=demo.querySelector(".demo-status"),buttons=[...demo.querySelectorAll("[data-dwa-mode]")];
 const candidates=[
  {label:"slow-straight",v:.1,w:0,heading:.972,velocity:.1,clearance:.791},
  {label:"medium-straight",v:.3,w:0,heading:.965,velocity:.3,clearance:.471},
  {label:"fast-left",v:.6,w:.6,heading:.882,velocity:.6,clearance:.235}
 ];
 const weights={balanced:[.50,.25,.25],progress:[.35,.45,.20]};
 function render(mode){
  const [wh,wv,wc]=weights[mode];
  const best=candidates.map(c=>({...c,score:wh*c.heading+wv*c.velocity+wc*Math.min(c.clearance,1)}))
    .sort((a,b)=>b.score-a.score)[0];
  status.textContent=(mode==="balanced"?"均衡净空":"偏向前进")+ "：选中 "+best.label+
    "，v="+best.v.toFixed(1)+" m/s，ω="+best.w.toFixed(1)+" rad/s；候选均通过演示安全筛选。";
  for(const b of buttons)b.setAttribute("aria-pressed",String(b.dataset.dwaMode===mode));
 }
 for(const b of buttons)b.addEventListener("click",()=>render(b.dataset.dwaMode));
 render("balanced");
});
// Pareto example: discard dominated routes, then re-rank the non-dominated set by normalized weights.
document.addEventListener("DOMContentLoaded",()=>{
 const demo=document.querySelector("[data-pareto-demo]");if(!demo)return;
 const status=demo.querySelector(".demo-status"),buttons=[...demo.querySelectorAll("[data-pareto-mode]")];
 const routes={
  "A-short":[8,9,5],
  "B-balanced":[10,5,6],
  "C-safe":[12,3,4]
 };
 const scales=[14,10,8];
 const weights={length:[.8,.1,.1],risk:[.1,.8,.1]};
 function render(mode){
  const w=weights[mode];
  const ranked=Object.entries(routes).map(([name,cost])=>({
    name,score:cost.reduce((sum,value,i)=>sum+w[i]*value/scales[i],0)
  })).sort((a,b)=>a.score-b.score);
  const best=ranked[0];
  status.textContent=(mode==="length"?"长度优先":"风险优先")+ "：选择 "+best.name+
    "，归一化加权成本 "+best.score.toFixed(3)+"；非支配候选 "+ranked.length+" 条。";
  for(const b of buttons)b.setAttribute("aria-pressed",String(b.dataset.paretoMode===mode));
 }
 for(const b of buttons)b.addEventListener("click",()=>render(b.dataset.paretoMode));
 render("length");
});

// Chapter 21: explain the two high-level branches for the first CBS conflict.
document.addEventListener("DOMContentLoaded",()=>{
 const demo=document.querySelector("[data-cbs-demo]"); if(!demo)return;
 const status=demo.querySelector(".demo-status"),buttons=[...demo.querySelectorAll("[data-cbs-mode]")];
 const labels={
  root:"根节点：两机器人在 t=1 占据中间格，发生顶点冲突。",
  a:"分支 A：禁止机器人 A 在 t=1 占据 (1,0)；低层只重规划 A，继续检查全部冲突。",
  b:"分支 B：禁止机器人 B 在 t=1 占据 (1,0)；低层只重规划 B，继续检查全部冲突。"
 };
 for(const b of buttons)b.addEventListener("click",()=>{
  status.textContent=labels[b.dataset.cbsMode];
  for(const x of buttons)x.setAttribute("aria-pressed",String(x===b));
 });
});
// Chapter 22: controls are actual outputs of the deterministic 81-sequence example.
document.addEventListener("DOMContentLoaded",()=>{
 const demo=document.querySelector("[data-mpc-demo]"); if(!demo)return;
 const status=demo.querySelector(".demo-status"),buttons=[...demo.querySelectorAll("[data-mpc-mode]")];
 const outputs={
  initial:"初始预测：控制 a=[1,1,0,-1] m/s²；预测末端 x=1.775 m。",
  replan:"受扰动后重规划：实测 x=0.225 m、v=0.5 m/s；新控制 a=[1,0,0,-1] m/s²；预测末端 x=1.975 m。"
 };
 for(const b of buttons)b.addEventListener("click",()=>{
  status.textContent=outputs[b.dataset.mpcMode];
  for(const x of buttons)x.setAttribute("aria-pressed",String(x===b));
 });
});
// Chapter 23: symptom to reproducible diagnostic evidence, no automatic root-cause claim.
document.addEventListener("DOMContentLoaded",()=>{
 const demo=document.querySelector("[data-debug-demo]"); if(!demo)return;
 const status=demo.querySelector(".demo-status"),buttons=[...demo.querySelectorAll("[data-debug-mode]")];
 const diagnostics={
  wall:"路径穿墙：检查边碰撞、足迹膨胀、四/八邻域切角规则和地图原点。",
  oscillate:"路线频繁跳变：对齐地图更新时间、重规划触发、控制周期和状态估计抖动。",
  pose:"RViz 位姿偏移：检查 TF map→odom→base_link、Fixed Frame、frame_id 与消息时间戳。"
 };
 for(const b of buttons)b.addEventListener("click",()=>{
  status.textContent=diagnostics[b.dataset.debugMode];
  for(const x of buttons)x.setAttribute("aria-pressed",String(x===b));
 });
});
// Chapter 24: show the denominator error without altering the underlying sample.
document.addEventListener("DOMContentLoaded",()=>{
 const demo=document.querySelector("[data-benchmark-demo]"); if(!demo)return;
 const status=demo.querySelector(".demo-status"),buttons=[...demo.querySelectorAll("[data-benchmark-mode]")];
 const records=Array.from({length:10},(_,i)=>i<6);
 const successes=records.filter(Boolean).length;
 const modes={
  all:"正确口径："+successes+" / "+records.length+" = "+(100*successes/records.length).toFixed(0)+"%；4 次失败仍保留在记录中。",
  success:"错误筛选："+successes+" / "+successes+" = 100%；将 4 次失败从分母删除会产生选择偏差。"
 };
 for(const b of buttons)b.addEventListener("click",()=>{
  status.textContent=modes[b.dataset.benchmarkMode];
  for(const x of buttons)x.setAttribute("aria-pressed",String(x===b));
 });
});
// Chapter 25: different preflight stages must not be mistaken for safety approval.
document.addEventListener("DOMContentLoaded",()=>{
 const demo=document.querySelector("[data-deployment-demo]"); if(!demo)return;
 const status=demo.querySelector(".demo-status"),buttons=[...demo.querySelectorAll("[data-deploy-mode]")];
 const gates={
  sim:"仿真：检查地图、足迹、TF、路径碰撞、控制收敛和确定性重放。",
  robot:"低速实车：除仿真证据外，验证硬件限速、急停与看门狗、TF/传感器时延、制动距离、隔离场地和故障注入；需人工批准。"
 };
 for(const b of buttons)b.addEventListener("click",()=>{
  status.textContent=gates[b.dataset.deployMode];
  for(const x of buttons)x.setAttribute("aria-pressed",String(x===b));
 });
});
