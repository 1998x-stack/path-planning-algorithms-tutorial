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
