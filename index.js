const TOPICS={
"Con người, lịch sử và hành vi":"why humans behave the way they do, explained through history, evolution and behavioral science; curious, accurate, evergreen, for an English-speaking audience",
"Cảm xúc và triết lý":"emotional, philosophical, relatable everyday life, ends with a line that makes people reflect and share",
"Cơ thể người":"surprising things the human body does without us noticing",
"Quy mô và góc nhìn":"mind-bending scale and perspective comparisons (size, time, numbers)",
"Khoa học nhẹ nhàng":"gentle science: space, oceans, atoms, microbes, nuclear",
"Lịch sử và nhân văn":"ordinary people across eras, a human story told in a few scenes",
"What-if":"a what-if scenario explained step by step with a twist"
};
let topic=Object.keys(TOPICS)[0],cur=null;
const $=id=>document.getElementById(id);
const esc=s=>String(s==null?"":s).replace(/[&<>\"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
function toast(m){const t=$("toast");t.textContent=m;t.classList.add("on");setTimeout(()=>t.classList.remove("on"),1800)}
function drawTopics(){const b=$("topics");b.innerHTML="";Object.keys(TOPICS).forEach(k=>{const c=document.createElement("button");c.className="chip";c.textContent=k;c.setAttribute("aria-pressed",k===topic);c.onclick=()=>{topic=k;drawTopics()};b.appendChild(c)})}
drawTopics();

function load(){try{return JSON.parse(localStorage.getItem("sf_hist")||"[]")}catch(e){return[]}}
function save(r){try{const h=[r,...load().filter(x=>x.title!==r.title)].slice(0,60);localStorage.setItem("sf_hist",JSON.stringify(h))}catch(e){}drawHist()}
function drawHist(){const h=load(),p=$("histp"),box=$("hist");p.hidden=!h.length;box.innerHTML="";h.forEach(r=>{const b=document.createElement("button");b.className="btn";b.textContent=r.title+" ("+r.duration+"s)";b.onclick=()=>{cur=r;render()};box.appendChild(b)})}
drawHist();

function tc(s){const ms=Math.round(s*1000),h=Math.floor(ms/3600000),m=Math.floor(ms%3600000/60000),x=Math.floor(ms%60000/1000),y=ms%1000,p=(n,l)=>String(n).padStart(l,"0");return p(h,2)+":"+p(m,2)+":"+p(x,2)+","+p(y,3)}
function makeSRT(r,alt){
  let n=1,out="",t=0;const total=r.duration,sc=r.scenes,per=total/sc.length;
  sc.forEach((s,i)=>{
    const start=i*per,end=(i+1)*per,w=String((alt&&s.narration_alt)||s.narration).trim().split(/\s+/).filter(Boolean);
    const chunks=[];for(let j=0;j<w.length;j+=3)chunks.push(w.slice(j,j+3).join(" "));
    const len=chunks.reduce((a,c)=>a+c.length,0)||1;let cs=start;
    chunks.forEach(c=>{const d=(end-start)*c.length/len;out+=n++ +"\n"+tc(cs)+" --> "+tc(cs+d)+"\n"+c+"\n\n";cs+=d});
  });
  return out.trim()+"\n";
}
function fullText(r){
  return r.title+"\n\nHOOK: "+r.hook+"\n\n"+r.scenes.map((s,i)=>"Cảnh "+(i+1)+" ["+s.time+"]\nLời: "+s.narration+"\nHình: "+s.visual_prompt).join("\n\n")+"\n\nCaption: "+r.post_caption+"\n"+(r.hashtags||[]).join(" ");
}
function slugify(value){return String(value||"script").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,80)||"script"}
function buildScriptTemplate(r){
  const title=String(r.title||"Script");
  const desc=String(r.hook||"");
  const scenes=(r.scenes||[]).map((s,i)=>`<div class="card"><div class="k">Cảnh ${i+1} <span class="tag">${esc(s.time||"")}</span></div><p class="scene-text">${esc(s.narration||"")}</p>${s.narration_alt?`<p class="scene-alt">${esc(s.narration_alt)}</p>`:""}<p class="scene-visual"><b>Visual:</b> ${esc(s.visual_prompt||"")}</p></div>`).join("");
  const hashtags=(r.hashtags||[]).join(" ");
  const caption=String(r.post_caption||"");
  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${esc(title)}</title>
  <style>
    :root{--bg:#eef2f7;--card:#fff;--ink:#1b2a41;--mute:#5d6b82;--line:#d5dce8;--acc:#2f5bff;--amb:#f5a524;--shadow:rgba(27,42,65,.08);box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}
    *{box-sizing:border-box} html{scroll-behavior:smooth} body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.55 system-ui,"Segoe UI",sans-serif} .w{max-width:780px;margin:0 auto;padding:24px 16px 80px}.hero{background:linear-gradient(180deg,#fff,#f7f9ff);border:1px solid var(--line);border-radius:18px;padding:18px 18px 10px;box-shadow:0 18px 36px var(--shadow)}.eyebrow{display:inline-block;padding:4px 10px;border-radius:999px;background:rgba(245,165,36,.18);color:#7c4a00;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em}.h1{font-size:clamp(28px,6vw,40px);line-height:1.12;margin:12px 0 10px}.sub{color:var(--mute);margin:0 0 20px}.card{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:16px;margin:12px 0}.k{font-size:12px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:var(--mute);margin:0 0 8px}.tag{display:inline-block;padding:3px 8px;border-radius:999px;background:rgba(47,91,255,.08);color:var(--acc);font-size:11px;font-weight:700;margin-left:8px}.scene-text{font-size:17px;line-height:1.6;margin:0 0 8px}.scene-alt{font-size:14px;color:var(--mute);margin:0 0 8px;font-style:italic}.scene-visual{font-size:14px;color:var(--mute);margin:0}.caption{white-space:pre-wrap} pre{white-space:pre-wrap;background:var(--bg);border:1px solid var(--line);border-radius:10px;padding:12px;font:13px/1.5 ui-monospace,Menlo,monospace;margin:0}.b{display:inline-block;background:var(--amb);color:#1b2a41;font-weight:700;border-radius:8px;padding:3px 9px;font-size:13px;margin-bottom:8px}.foot{font-size:13px;color:var(--mute);margin-top:16px}
  </style>
</head>
<body>
<div class="w">
  <div class="hero">
    <div class="eyebrow">Short video script</div>
    <h1 class="h1">${esc(title)}</h1>
    <p class="sub">${esc(desc)}</p>
  </div>
  ${scenes}
  <div class="card">
    <div class="k">Caption</div>
    <pre>${esc(caption)}</pre>
    <div class="foot"><b>Hashtags:</b> ${esc(hashtags)}</div>
  </div>
</div>
</body>
</html>`;
}
async function saveGeneratedScriptFile(fileName, html){
  if (window.showDirectoryPicker && window.isSecureContext !== false) {
    try {
      const rootHandle = await window.showDirectoryPicker({ mode: "readwrite" });
      const contentDir = await rootHandle.getDirectoryHandle("content", { create: true });
      const fileHandle = await contentDir.getFileHandle(fileName, { create: true });
      const writable = await fileHandle.createWritable();
      await writable.write(html);
      await writable.close();
      toast("Đã lưu file vào thư mục content");
      return true;
    } catch (e) {
      if (e && e.name === "AbortError") {
        toast("Đã hủy lưu file");
        return false;
      }
    }
  }
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = fileName;
  a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href), 1000);
  toast("Đã tải file HTML về máy");
  return true;
}
async function exportCurrentScript(){
  if (!cur) {
    toast("Chưa có kịch bản nào để xuất");
    return;
  }
  const safeName = slugify(cur.title || "script") + ".html";
  const html = buildScriptTemplate(cur);
  await saveGeneratedScriptFile(safeName, html);
}

function copy(t,m){
  const text=String(t==null?"":t);
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(()=>toast(m||"Đã sao chép"),()=>toast("Không sao chép được, hãy chọn và copy tay")).catch(()=>toast("Không sao chép được, hãy chọn và copy tay"));
    return;
  }
  try {
    const ta=document.createElement("textarea");
    ta.value=text;document.body.appendChild(ta);ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    toast(m||"Đã sao chép");
  } catch (e) {
    toast("Không sao chép được, hãy chọn và copy tay");
  }
}
async function dl(name,data){
  try{
    const d = window.claude && typeof window.claude.use === "function" ? await window.claude.use("downloads") : null;
    if(!d){
      const blob=new Blob([String(data==null?"":data)],{type:"text/plain;charset=utf-8"});
      const a=document.createElement("a");
      a.href=URL.createObjectURL(blob);a.download=name;a.click();
      setTimeout(()=>URL.revokeObjectURL(a.href),1000);
      toast("Đã lưu "+name);
      return;
    }
    await d.save({filename:name,data});
    toast("Đã lưu "+name);
  }catch(e){toast("Đã hủy lưu")}
}

function render(keep){
  const r=cur,o=$("out");if(!r){o.innerHTML="";return}
  o.innerHTML='<div class="hook"><b>'+esc(r.title)+'</b>'+esc(r.hook)+'</div>'+extraPanel(r)+
  '<div class="bar"><button class="btn" id="b1">Sao chép toàn bộ</button><button class="btn" id="b2">Lưu SRT '+LN(r.lang)+'</button><button class="btn" id="b6">Lưu SRT '+LN(r.lang==="en"?"vi":"en")+'</button><button class="btn" id="b3">Sao chép lời đọc</button><button class="btn" id="b4">Lưu JSON</button><button class="btn" id="b9">Lưu làm mẫu</button><button class="btn" id="b10">Copy prompt hình</button><button class="btn" id="b11">Lưu prompts.txt</button><button class="btn" id="b12">Xuất file HTML</button></div>'+
  '<div class="panel">'+r.scenes.map((s,i)=>'<div class="scene"><div class="t">'+esc(s.time)+'</div><div><p class="nar" contenteditable="true" role="textbox" data-n="'+i+'" aria-label="Lời đọc cảnh '+(i+1)+'">'+esc(s.narration)+'</p>'+(s.narration_alt?'<p class="alt" contenteditable="true" role="textbox" data-a="'+i+'" aria-label="Bản dịch cảnh '+(i+1)+'">'+esc(s.narration_alt)+'</p>':'')+'<p class="vis">Hình: '+esc(s.visual_prompt)+'</p><div class="act"><input data-r="'+i+'" placeholder="Yêu cầu sửa (không bắt buộc)" aria-label="Yêu cầu sửa cảnh '+(i+1)+'"><button class="btn" data-w="'+i+'">Viết lại cảnh</button><button class="btn" data-i="'+i+'">Copy prompt</button></div></div></div>').join("")+"</div>"+
  '<div class="panel"><h2>Đăng bài</h2><pre>'+esc(r.post_caption)+"\n\n"+esc((r.hashtags||[]).join(" "))+'</pre><button class="btn" id="b5">Sao chép caption</button> <button class="btn" id="b7">Tạo gói đăng 3 nền tảng</button> <button class="btn" id="b8">Thêm vào theo dõi</button><div id="pack"></div></div>'+
  '<div class="panel"><h2>Phụ đề SRT (3 từ mỗi dòng, tự cập nhật khi bạn sửa lời)</h2><pre id="srt">'+esc(makeSRT(r))+'</pre></div>';
  $("b1").onclick=()=>copy(fullText(r));
  $("b2").onclick=()=>dl("subtitles.srt",makeSRT(r));
  $("b3").onclick=()=>copy(r.scenes.map(s=>s.narration).join(" "),"Đã sao chép lời đọc (dán vào ElevenLabs/CapCut TTS)");
  $("b4").onclick=()=>dl("script.json",JSON.stringify(r,null,2));
  $("b5").onclick=()=>copy(r.post_caption+"\n\n"+(r.hashtags||[]).join(" "));
  o.querySelectorAll("[data-i]").forEach(b=>b.onclick=()=>copy(vp(r,r.scenes[b.dataset.i]),"Đã sao chép prompt hình"));
  $("b6").onclick=()=>dl("subtitles-"+(r.lang==="en"?"vi":"en")+".srt",makeSRT(r,true));
  o.querySelectorAll("[data-n]").forEach(p=>p.onblur=()=>{r.scenes[p.dataset.n].narration=p.innerText.trim();touch()});
  o.querySelectorAll("[data-a]").forEach(p=>p.onblur=()=>{r.scenes[p.dataset.a].narration_alt=p.innerText.trim();touch()});
  o.querySelectorAll("[data-w]").forEach(b=>b.onclick=()=>rewrite(+b.dataset.w,b));
  $("b10").onclick=()=>copy(allPrompts(r),"Đã sao chép "+r.scenes.length+" prompt");$("b11").onclick=()=>dl("prompts.txt",allPrompts(r));
  $("b12").onclick=()=>exportCurrentScript();
  $("b9").onclick=()=>addRef(r.scenes.map(s=>s.narration).join("\n"),r.title);
  $("b7").onclick=()=>makePack($("b7"));$("b8").onclick=()=>addTrack();if(r.pack)showPack(r.pack);
  if(!keep&&!window.BATCH)o.scrollIntoView({behavior:"smooth",block:"start"});
}

const LN=l=>l==="en"?"EN":"VI";
function vp(r,s){return [r.sp?r.style:"",r.sp?r.char:"",r.sp&&!/9:16/.test(r.style||"")?r.ar:"",s.visual_prompt].filter(Boolean).join(" ")}
function allPrompts(r){return r.scenes.map(s=>vp(r,s)).join("\n\n")}
function extraPanel(r){if(!r.titles&&!r.sources_to_verify)return "";return '<div class="panel"><h2>Tiêu đề gợi ý</h2><pre>'+esc((r.titles||[]).join("\n"))+'</pre><h2>Cần tự xác minh trước khi đăng</h2><pre>'+esc((r.sources_to_verify||[]).join("\n"))+'</pre><p class="sub" style="margin:0;font-size:13px">Đây là cụm từ để tìm trên Google Scholar hoặc PubMed, không phải trích dẫn đã kiểm chứng.</p></div>'}
function touch(){if(!cur)return;save(cur);const s=$("srt");if(s)s.textContent=makeSRT(cur)}
async function rewrite(i,btn){
  const r=cur,s=r.scenes[i],inp=document.querySelector('[data-r="'+i+'"]'),ask=inp.value.trim();
  const L=r.lang==="en"?"English":"Vietnamese",L2=r.lang==="en"?"Vietnamese":"English",n=s.narration.split(/\s+/).length;
  const prompt="Rewrite ONE scene of a short vertical video script. Full script for context:\n"+r.scenes.map((x,k)=>(k+1)+". "+x.narration).join("\n")+"\n\nRewrite scene "+(i+1)+" only, coherent with the others"+(i===0?" (it must stay a 3-second curiosity hook)":"")+(i===r.scenes.length-1?" (it must keep the twist ending)":"")+". About "+n+" words. narration in "+L+"; narration_alt is a faithful "+L2+" translation. visual_prompt in English, keeping the same style prefix and character descriptions as this one: "+s.visual_prompt+"\n"+(ask?"Creator request: "+ask+"\n":"Make it fresher and stronger.\n")+"Return ONLY JSON: {\"narration\":string,\"narration_alt\":string,\"visual_prompt\":string}";
  btn.disabled=true;btn.textContent="Đang viết...";
  try{
    const sample=await claude.use("sample");if(!sample)throw {code:"none"};
    const j=await sample.json(prompt,{cache:false});
    if(!j||!j.narration)throw {code:"bad"};
    Object.assign(s,{narration:j.narration,narration_alt:j.narration_alt||"",visual_prompt:j.visual_prompt||s.visual_prompt});
    save(r);render(true);toast("Đã viết lại cảnh "+(i+1));
  }catch(e){toast(e&&e.code==="rate_limited"?"Gọi quá nhanh, đợi chút rồi thử lại":"Chưa viết lại được, thử lại nhé");btn.disabled=false;btn.textContent="Viết lại cảnh"}
}
const HAS=!!window.claude;
const DEFAULT_GEMINI_MODEL="gemini-3.8-flash";
function getGeminiModel(){
  try{
    const saved=(localStorage.getItem("sf_model")||"").trim();
    return saved||DEFAULT_GEMINI_MODEL;
  }catch(e){
    return DEFAULT_GEMINI_MODEL;
  }
}
if(!HAS){
  const gs={
    json: async p=>{
      let k="",m="";
      try{k=localStorage.getItem("sf_key")||"";m=getGeminiModel()}catch(e){m=DEFAULT_GEMINI_MODEL}
      if(!k)throw {code:"none"};
      const model=(m||DEFAULT_GEMINI_MODEL).trim()||DEFAULT_GEMINI_MODEL;
      const r=await fetch("https://generativelanguage.googleapis.com/v1beta/models/"+encodeURIComponent(model)+":generateContent?key="+encodeURIComponent(k),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:p}]}],generationConfig:{responseMimeType:"application/json"}})});
      if(r.status===429)throw {code:"rate_limited"};
      if(!r.ok){
        let detail="";
        try{detail=await r.text()}catch(e){}
        throw {code:"bad",status:r.status,detail};
      }
      const d=await r.json();
      const txt=(d&&d.candidates&&d.candidates[0]&&d.candidates[0].content&&d.candidates[0].content.parts&&d.candidates[0].content.parts[0]&&d.candidates[0].content.parts[0].text) || "";
      if(!txt)throw {code:"bad",status:r.status,detail:"empty response"};
      return JSON.parse(txt)
    }
  };
  const bd={
    save: async ({filename,data})=>{
      const a=document.createElement("a");
      a.href=URL.createObjectURL(new Blob([data],{type:"text/plain"}));
      a.download=filename;
      a.click();
    }
  };
  window.claude={use:async n=>n==="sample"?gs:n==="downloads"?bd:null};
  $("setp").hidden=false;
  try{
    const saved=localStorage.getItem("sf_model")||"";
    $("gm").value=saved||DEFAULT_GEMINI_MODEL;
    if(!saved)localStorage.setItem("sf_model",DEFAULT_GEMINI_MODEL);
    $("gk").value=localStorage.getItem("sf_key")||"";
  }catch(e){}
  $("gk").onchange=()=>{try{localStorage.setItem("sf_key",$("gk").value.trim())}catch(e){}};
  $("gm").onchange=()=>{try{localStorage.setItem("sf_model",$("gm").value.trim()||DEFAULT_GEMINI_MODEL)}catch(e){}};
}
async function ask(p){const s=await claude.use("sample");if(!s)throw {code:"none"};return s.json(p,{cache:false})}
function prof(){try{return JSON.parse(localStorage.getItem("sf_prof")||"{}")}catch(e){return {}}}
function profileText(){const p=prof();return (p.character?"Recurring channel character/world (context only; the app adds it to image prompts): "+p.character+"\n":"")+(p.rules?"Channel voice and rules: "+p.rules+"\n":"")}
{const p=prof();$("pf_char").value=p.character||"";$("pf_rules").value=p.rules||"";
 const sv=()=>{try{localStorage.setItem("sf_prof",JSON.stringify({character:$("pf_char").value.trim(),rules:$("pf_rules").value.trim()}))}catch(e){}};
 $("pf_char").oninput=sv;$("pf_rules").oninput=sv}
const HIRO="Hiro, a classic simple stick figure with a round head, thick uniform black outline, white fill, two small dot eyes, simple eyebrows, small curved line mouth";
$("pfA").onclick=()=>{$("pf_char").value=HIRO+", and a tiny solid black mole dot on the cheek just below the eye on the right side of the image";$("pf_char").dispatchEvent(new Event("input"));toast("Đã điền Hiro (có nốt ruồi)")};
$("pfB").onclick=()=>{$("pf_char").value=HIRO;$("pf_char").dispatchEvent(new Event("input"));toast("Đã điền Hiro (trơn)")};
$("ideaBtn").onclick=async()=>{const b=$("ideaBtn");b.disabled=true;b.textContent="Đang nghĩ...";
  const pr=profileText()+'Give 8 distinct, specific ideas for faceless short videos. Theme: '+topic+' ('+TOPICS[topic]+'). Each idea has a working title and a one-line hook in '+($("lang").value==="en"?"English":"Vietnamese")+'. Return ONLY JSON: {"ideas":[{"title":string,"hook":string}]}';
  try{const j=await ask(pr),l=$("ideaList");l.innerHTML="";(j.ideas||[]).forEach(x=>{const d=document.createElement("button");d.className="btn";d.style.cssText="display:block;width:100%;text-align:left;margin-top:6px";d.textContent=x.title+": "+x.hook;d.onclick=()=>{$("idea").value=x.title+". "+x.hook;toast("Đã điền ý tưởng, bấm Tạo kịch bản")};l.appendChild(d)})}
  catch(e){toast(e&&e.code==="none"?"Chưa có nguồn AI (xem Cài đặt)":"Chưa gợi ý được, thử lại nhé")}
  b.disabled=false;b.textContent="Gợi ý 8 ý tưởng"};
const PL={facebook:"Facebook Reels",youtube:"YouTube Shorts",tiktok:"TikTok"};
function packText(q){return (q.title?q.title+"\n\n":"")+(q.text||"")+"\n\n"+(q.tags||[]).join(" ")}
function showPack(p){const b=$("pack");if(!b)return;b.innerHTML=Object.keys(PL).map(k=>'<h2 style="margin-top:14px">'+PL[k]+'</h2><pre>'+esc(packText(p[k]||{}))+'</pre><button class="btn" data-pk="'+k+'">Sao chép</button>').join("");b.querySelectorAll("[data-pk]").forEach(x=>x.onclick=()=>copy(packText(p[x.dataset.pk]||{}))) }
async function makePack(btn){const r=cur;btn.disabled=true;btn.textContent="Đang viết...";
  const pr='Write post copy for this short video on three platforms, adapted to each platform culture (YouTube title max 70 chars; TikTok caption short and punchy; Facebook Reels caption conversational and ending with a question that drives comments). Language: '+(r.lang==="en"?"English":"Vietnamese")+'.\n'+(prof().rules?'Channel rules: '+prof().rules+'\n':'')+'Script: '+r.scenes.map(s=>s.narration).join(" ")+"\nReturn ONLY JSON: {\"facebook\":{\"text\":string,\"tags\":[strings]},\"youtube\":{\"title\":string,\"text\":string,\"tags\":[strings]},\"tiktok\":{\"text\":string,\"tags\":[strings]}}";
  try{r.pack=await ask(pr);save(r);showPack(r.pack)}catch(e){toast("Chưa tạo được gói đăng, thử lại nhé")}
  btn.disabled=false;btn.textContent="Tạo gói đăng 3 nền tảng"}
function refs(){try{return JSON.parse(localStorage.getItem("sf_refs")||"[]")}catch(e){return []}}
function rsave(a){try{localStorage.setItem("sf_refs",JSON.stringify(a))}catch(e){}drawRefs()}
function addRef(text,label){text=(text||"").trim().slice(0,1500);if(!text){toast("Hãy dán nội dung kịch bản mẫu");return false}const a=refs();a.unshift({id:Date.now(),label:(label||"").trim()||text.slice(0,40),text,on:true});rsave(a.slice(0,10));toast("Đã thêm vào thư viện mẫu");return true}
function refsText(){const a=refs().filter(x=>x.on).slice(0,3);return a.length?"Reference scripts from the creator's favorite videos. Study their structure, pacing, sentence length, hook style and ending, and imitate that style, but never copy their content or wording:\n"+a.map((x,i)=>"--- Reference "+(i+1)+" ---\n"+x.text).join("\n")+"\n--- End references ---\n":""}
function drawRefs(){const a=refs(),b=$("refList");$("refCnt").textContent=a.length?" ("+a.length+")":"";
  b.innerHTML=a.map(x=>'<div class="trow" data-id="'+x.id+'"><b>'+esc(x.label)+'</b><label style="margin:0;font-weight:400;font-size:13px"><input type="checkbox" data-on="1"'+(x.on?" checked":"")+'> Dùng làm mẫu</label><button class="btn" data-d="1">Xóa</button></div>').join("");
  b.querySelectorAll("[data-on]").forEach(el=>el.onchange=()=>{const id=+el.closest(".trow").dataset.id,a=refs(),x=a.find(y=>y.id===id);if(x){x.on=el.checked;rsave(a)}});
  b.querySelectorAll("[data-d]").forEach(el=>el.onclick=()=>{const id=+el.closest(".trow").dataset.id;rsave(refs().filter(y=>y.id!==id))})
}
$("refAdd").onclick=()=>{if(addRef($("refText").value,$("refLabel").value)){$("refText").value="";$("refLabel").value=""}};
drawRefs();
const PLAN30=["How people woke up before alarm clocks (knocker-uppers)","Why you replay embarrassing moments at 3 a.m.","Same notes, rereading vs recalling: same 30 minutes, different result","Vikings never wore horned helmets","The doorway effect: why you forget why you entered a room","Why a week has seven days","Zero: one of the youngest big ideas in math","Same 20 minutes: daily practice vs one big cram","Why deadlines make you faster (Parkinson’s law)","Napoleon wasn’t actually short","How sailors navigated without GPS","The spotlight effect: nobody notices you as much as you think","Why clocks run clockwise","Same paycheck, different order: pay yourself first","The 10% of the brain myth","Why waiting feels longer than doing","Why a dozen is twelve","Same 1% a day, up vs down, over a year","Why we procrastinate (present bias)","Humans didn’t evolve from chimps","How people kept food cold before refrigerators","Where the word OK came from","Why first impressions stick","Same 2 minutes: start now vs plan forever","Medieval people didn’t all think the Earth was flat","How people cleaned their teeth before toothbrushes","Phantom vibration: why your phone buzzes when it didn’t","The first photograph of a person","Same book: reading it vs teaching it to someone","Why you can’t tickle yourself"];
$("batchPlan").onclick=()=>{$("batchTxt").value=PLAN30.join("\n")};
$("batchRun").onclick=async()=>{const L=$("batchTxt").value.split("\n").map(x=>x.trim()).filter(Boolean),b=$("batchRun"),m=$("batchMsg");if(!L.length)return;
  b.disabled=true;window.BATCH=1;let ok=0;const bad=[];
  for(let i=0;i<L.length;i++){m.textContent="Đang tạo "+(i+1)+"/"+L.length+": "+L[i];$("idea").value=L[i];let done=false;
    for(let t=0;t<2&&!done;t++){const before=cur;await $("go").onclick();done=cur!==before;if(!done)await new Promise(r=>setTimeout(r,4000))}
    done?ok++:bad.push(L[i])}
  window.BATCH=0;b.disabled=false;m.textContent="Xong "+ok+"/"+L.length+(bad.length?". Lỗi: "+bad.join("; "):"")+". Xem mục Đã tạo gần đây."};
function csvCell(v){return '"'+String(v==null?"":v).replace(/"/g,'""')+'"'}
$("batchCsv").onclick=()=>{const h=load().slice().reverse();if(!h.length){toast("Chưa có kịch bản");return}
  const rows=[["#","title","duration_s","lang","hook","narration","image_prompts","post_caption","hashtags"]].concat(h.map((r,i)=>[i+1,r.title,r.duration,r.lang,r.hook,r.scenes.map(s=>s.narration).join(" "),allPrompts(r).replace(/\n\n/g," || "),r.post_caption,(r.hashtags||[]).join(" ")]));
  dl("production-plan.csv","\ufeff"+rows.map(r=>r.map(csvCell).join(",")).join("\n"))};
function cc(){const d=+$("dur").value,m=+$("cc_m").value||0,c=+$("cc_c").value||0,i=+$("cc_i").value||0,clips=Math.ceil(d/8),imgs=d>=300?Math.round(d/12):6,A=clips*c,H=2*c+4*i,I=imgs*i,f=x=>x>0?"~"+Math.floor(m/x)+" video/tháng":"không giới hạn bởi credit";
  $("cc_out").innerHTML="Video "+d+"s: <b>toàn clip</b> ("+clips+" clip) "+A+" credit, "+f(A)+". <b>Kết hợp</b> (2 clip + 4 ảnh) "+H+" credit, "+f(H)+". <b>Toàn ảnh</b> ("+imgs+" ảnh) "+I+" credit, "+f(I)+"."}
["cc_m","cc_c","cc_i","dur"].forEach(id=>{$(id).addEventListener("input",cc);$(id).addEventListener("change",cc)});cc();
function tk(){try{return JSON.parse(localStorage.getItem("sf_trk")||"[]")}catch(e){return []}}
function tsave(a){try{localStorage.setItem("sf_trk",JSON.stringify(a))}catch(e){}drawTrk()}
function addTrack(){const a=tk();a.unshift({id:Date.now(),title:cur.title,platform:"facebook",date:new Date().toISOString().slice(0,10),status:"Lên lịch",views:0});tsave(a);toast("Đã thêm vào bảng theo dõi")}
function drawTrk(){const a=tk(),b=$("trkBody"),tot=a.reduce((s,x)=>s+(+x.views||0),0);
  $("trkTot").textContent=a.length?a.length+" video, tổng "+tot.toLocaleString("vi-VN")+" view":"Chưa có video nào. Mở một kịch bản và bấm Thêm vào theo dõi.";
  b.innerHTML=a.map(x=>'<div class="trow" data-id="'+x.id+'"><b>'+esc(x.title)+'</b><select data-f="platform" aria-label="Nền tảng">'+Object.keys(PL).map(k=>'<option value="'+k+'"'+(x.platform===k?" selected":"")+'>'+PL[k]+'</option>').join("")+'</select><input type="date" data-f="date" aria-label="Ngày đăng" value="'+esc(x.date)+'"><select data-f="status" aria-label="Trạng thái">'+["Lên lịch","Đã đăng"].map(s=>'<option'+(x.status===s?" selected":"")+'>'+s+'</option>').join("")+'</select><input type="number" min="0" data-f="views" aria-label="Lượt xem" value="'+(+x.views||0)+'"><button class="btn" data-d="1">Xóa</button></div>').join("");
  b.querySelectorAll("[data-f]").forEach(el=>el.onchange=()=>{const id=+el.closest(".trow").dataset.id,a=tk(),x=a.find(y=>y.id===id);if(x){x[el.dataset.f]=el.value;tsave(a)}});
  b.querySelectorAll("[data-d]").forEach(el=>el.onclick=()=>{const id=+el.closest(".trow").dataset.id;tsave(tk().filter(y=>y.id!==id))})
}
drawTrk();
$("go").onclick=async()=>{
  const btn=$("go"),o=$("out");
  const dur=+$("dur").value,lang=$("lang").value,idea=$("idea").value.trim(),style=$("style").value;
  const lg=dur>=300,nsc=lg?dur/15:{15:4,30:6,45:7,60:9}[dur],words=Math.round(dur*(lang==="en"?2.3:2.7));
  const L=lang==="en"?"English":"Vietnamese",L2=lang==="en"?"Vietnamese":"English";
  const prompt="You write scripts for faceless vertical short videos (Facebook Reels, YouTube Shorts, TikTok) in the style of calm, wordless-feeling 3D animated stories with a thoughtful twist.\n"+
  profileText()+refsText()+"Theme: "+topic+" ("+TOPICS[topic]+").\n"+(idea?"Creator idea: "+idea+"\n":"Pick an original, specific idea.\n")+
  "Narration language: "+L+". Total narration about "+words+" words for "+dur+" seconds, split into exactly "+nsc+" scenes.\n"+
  "Rules: scene 1 narration is a hook that creates curiosity in 3 seconds; the last scene lands a twist or emotional line that echoes the hook so viewers rewatch; short plain sentences; no clichés; no claims that need citations unless well established.\n"+
  "Each visual_prompt is in English, self-contained, describes ONE shot only (composition, pose, action, props, background, camera). Never describe style or the character's looks: the app prepends them. Call the recurring character \"the character\".\n"+
  "Return ONLY JSON: {\"title\":string,\"hook\":string,\"scenes\":[{\"time\":\"0-5s\",\"narration\":string,\"narration_alt\":string (faithful "+L2+" translation of narration),\"visual_prompt\":string}],\"post_caption\":string (in "+L+", 1-2 lines),\"hashtags\":[5 strings]}. The time ranges must cover 0 to "+dur+"s evenly."+(lg?" LONG VIDEO: write time as m:ss-m:ss; set narration_alt to an empty string; add \"titles\" (3 SEO titles phrased as questions people search) and \"sources_to_verify\" (5 specific search queries a human can use to verify the key claims; never invent citations). Each scene is about "+Math.round(words/nsc)+" words; add an open question or pattern interrupt about every 45 seconds; no filler.":"");
  btn.disabled=true;btn.textContent="Đang viết kịch bản...";o.innerHTML="";
  try{
    const sample=await claude.use("sample");
    if(!sample)throw {code:"none"};
    const j=await sample.json(prompt,{cache:false});
    if(!j||!Array.isArray(j.scenes)||!j.scenes.length)throw {code:"bad"};
    cur={...j,duration:dur,lang,topic,style,sp:1,char:(prof().character||""),ar:lg?"horizontal 16:9":"vertical 9:16"};save(cur);render();
  }catch(e){
    const m=e&&e.code==="not_granted"?"Bạn cần cho phép trang này gọi Claude, rồi bấm lại.":e&&e.code==="rate_limited"?"Đang gọi quá nhanh. Đợi một chút rồi bấm lại.":e&&e.code==="none"?"Chưa có nguồn AI: mở trang trong claude.ai hoặc nhập Gemini API key ở mục Cài đặt.":e&&e.code==="bad"?"Gemini API key / model sai hoặc bị chặn quyền. Kiểm tra lại key và model trong Cài đặt AI.":"Kết quả chưa đúng định dạng. Bấm Tạo kịch bản để thử lại.";
    console.error("AI call failed:", e);
    o.innerHTML='<p class="err" role="alert">'+m+'</p>';
  }
  btn.disabled=false;btn.textContent="Tạo kịch bản";
};
