// Khung trang quy trinh. Sua truc tiep HTML ben duoi; __CONTENT__ va __TITLE__ la cho app dien du lieu.
window.WORKFLOW_TEMPLATE=String.raw`<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>__TITLE__</title>
<style>
:root{--bg:#eef2f7;--card:#fff;--ink:#1b2a41;--mute:#5d6b82;--line:#d5dce8;--acc:#2f5bff;--acc-ink:#fff;--amb:#f5a524;box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#121a29;--card:#1b2538;--ink:#e8edf6;--mute:#9aa8c2;--line:#2c3a55;--acc:#7a98ff;--acc-ink:#0e1626}}
:root[data-theme="dark"]{--bg:#121a29;--card:#1b2538;--ink:#e8edf6;--mute:#9aa8c2;--line:#2c3a55;--acc:#7a98ff;--acc-ink:#0e1626}
html{scroll-padding-top:env(safe-area-inset-top,0px)}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.55 system-ui,"Segoe UI",Roboto,sans-serif}
.w{max-width:780px;margin:0 auto;padding:20px 16px 70px}
h1{font-size:clamp(26px,6vw,36px);line-height:1.15;margin:8px 0}
h2{font-size:20px;margin:30px 0 10px;border-left:5px solid var(--amb);padding-left:10px}
.sub{color:var(--mute);margin:0 0 14px}
.card{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:14px 16px;margin:12px 0}
.card h3{margin:0 0 6px;font-size:16px}
ol,ul{margin:6px 0;padding-left:22px}
li{margin:4px 0}
.k{font-size:12px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:var(--mute);margin:10px 0 4px}
pre{white-space:pre-wrap;background:var(--bg);border:1px solid var(--line);border-radius:10px;padding:10px 12px;margin:0 0 6px;font:13px/1.5 ui-monospace,Menlo,monospace;overflow-x:auto}
button{background:transparent;border:1px solid var(--line);color:var(--ink);border-radius:9px;padding:5px 11px;font:inherit;font-size:13px;cursor:pointer}
button:hover{border-color:var(--acc)}
button:focus-visible{outline:3px solid var(--acc);outline-offset:2px}
.t{display:inline-block;background:var(--amb);color:#1b2a41;font-weight:700;border-radius:8px;padding:2px 9px;font-size:13px}
.toast{position:fixed;left:50%;bottom:calc(18px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);background:var(--ink);color:var(--bg);padding:8px 15px;border-radius:10px;font-size:14px;opacity:0;pointer-events:none;transition:opacity .2s}
.toast.on{opacity:1}
</style>
</head>
<body>
<div class="w">
<h1 id="ttl"></h1>
<p class="sub" id="meta"></p>

<h2>0. Chuẩn bị một lần</h2>
<div class="card"><h3>Sửa lỗi ảnh bị tạo trùng</h3>
<ul><li>Flow, Cài đặt tác nhân, mục hình ảnh: chọn <b>x1</b> rồi bấm <b>Lưu</b> ở cuối bảng. Chưa bấm Lưu thì tác nhân vẫn dùng mức cũ (2x).</li>
<li>Thêm câu <b>generate exactly 1 image</b> vào cuối mỗi prompt (đã có sẵn trong prompt bên dưới).</li>
<li>Bản trùng thì chuyển vào thùng rác để thư viện gọn. Ảnh chưa thấy trừ credit, bạn vẫn nên nhìn bộ đếm credit sau vài lần tạo để chắc chắn.</li></ul></div>
<div class="card"><h3>Bảng đạo cụ dùng lại (tạo một lần)</h3><div id="props"></div></div>

<h2>1. Kịch bản và prompt từng đoạn</h2>
<p class="sub">Đính kèm ảnh Hiro đơn làm tham chiếu cho mọi prompt. Tỷ lệ 9:16.</p>
<div id="segs"></div>
<div class="card"><h3>Tiêu đề và caption đăng bài</h3><div id="post"></div></div>
<div class="card"><h3>Cụm từ cần tự kiểm chứng trước khi đăng</h3><pre id="srcs"></pre><p class="sub">Đây là cụm để tìm trên Google Scholar, không phải trích dẫn đã kiểm chứng. Ghi nguồn bạn xác minh được vào mô tả video, và bỏ ý nào không tìm thấy nguồn.</p></div>

<h2>2. Âm thanh</h2>
<div class="card"><h3>Giọng đọc</h3><ol>
<li>Dán toàn bộ lời đọc (nút Copy lời đọc ở trên) vào công cụ chuyển văn bản thành giọng nói của CapCut (tên menu có thể khác theo phiên bản, thường nằm trong Text hoặc Audio).</li>
<li>Chọn một giọng tiếng Anh điềm tĩnh và <b>dùng một giọng duy nhất cho cả kênh</b>. Tốc độ 0,95 đến 1,0.</li>
<li>Nghe lại cả đoạn để bắt chỗ phát âm sai, rồi sửa dấu câu (dấu chấm tạo quãng nghỉ).</li>
<li>Nếu bạn thoải mái thì tự thu giọng cũng được, giọng thật thường tạo cảm giác xác thực hơn.</li></ol></div>
<div class="card"><h3>Nhạc và hiệu ứng</h3><ul>
<li>Chỉ dùng nhạc trong thư viện không bản quyền của CapCut hoặc YouTube Audio Library, tránh bài hát thịnh hành vì dễ vướng bản quyền khi bật kiếm tiền.</li>
<li>Nhạc nền nhỏ hơn giọng rõ rệt (gợi ý: âm lượng nhạc khoảng 10 đến 15 phần trăm so với giọng), chọn nhạc nhẹ, không lời.</li>
<li>Thêm 3 đến 5 hiệu ứng âm thanh: tiếng "pop" khi có vật hiện ra, tiếng "whoosh" khi chuyển cảnh.</li></ul></div>

<h2>3. Dựng trong CapCut (khoảng 35 đến 50 phút khi đã quen)</h2>
<div class="card"><ol>
<li>Tạo dự án 9:16, nhập giọng đọc trước, cắt cho khớp độ dài kịch bản. <b>Giọng quyết định độ dài từng cảnh.</b></li>
<li>Đặt các ảnh theo thứ tự, mỗi ảnh theo thời gian của đoạn, rồi kéo mép cho khớp từng câu thoại.</li>
<li>Thêm chuyển động cho từng ảnh theo ghi chú ở mỗi đoạn (zoom vào chậm 100 đến 110 phần trăm, lia nhẹ). Đổi hướng xen kẽ giữa các ảnh.</li>
<li>Phụ đề: tự động nhận diện giọng hoặc nhập file SRT từ app. Mỗi lần hiện 2 đến 3 từ, chữ trắng viền đen, từ khóa tô hổ phách. Giữ chữ cách mép dưới và mép phải khoảng 20 phần trăm để không bị nút giao diện che.</li>
<li>Thêm nhạc nền và hiệu ứng, nghe lại cả video bằng tai nghe để cân âm lượng.</li>
<li>Câu cuối chuyển ngược về cảnh đầu (ảnh đầu tiên) để người xem xem lặp lại.</li>
<li>Xuất 1080x1920, 30 khung hình mỗi giây.</li></ol></div>

<h2>4. Đăng bài</h2>
<div class="card"><ol>
<li>Tải thẳng file đã xuất lên từng nền tảng (YouTube Shorts, Facebook Reels, TikTok), không tải lại video có watermark của nền tảng khác.</li>
<li>Dán tiêu đề, caption, hashtag ở trên. Ghi nguồn vào mô tả YouTube.</li>
<li>Hẹn giờ khoảng 7 đến 9 giờ sáng giờ Việt Nam, rồi sau 2 tuần chỉnh theo số liệu thực.</li>
<li>Ghi vào bảng theo dõi của app: nền tảng, ngày, lượt xem sau 48 giờ.</li></ol></div>
</div>
<div class="toast" id="toast" role="status"></div>
<script id="content" type="application/json">__CONTENT__</script>
<script>
const C=JSON.parse(document.getElementById("content").textContent);
const PROPS="Props sheet, simple line-art objects in a 3x3 grid with generous spacing, thick uniform black outline, white fill, plain pure white background (#FFFFFF), the main part of each object colored amber-orange (#F5A524): (1) round analog clock showing 3:00, (2) thought bubble with tangled scribbles inside, (3) notebook with a checklist and a pencil, (4) simple brain outline, (5) small snake, (6) crescent moon, (7) light bulb, (8) warning triangle, (9) question mark. No characters, no shadow, no grid lines, no text, no labels, generate exactly 1 image.";
const SEG=C.segments;
const POST=C.post;
function toast(m){const t=document.getElementById("toast");t.textContent=m;t.classList.add("on");setTimeout(()=>t.classList.remove("on"),1700)}
function copy(x){navigator.clipboard.writeText(x).then(()=>toast("Đã sao chép"),()=>toast("Không sao chép được, hãy chọn và copy tay"))}
function blk(label,txt){const d=document.createElement("div");const k=document.createElement("div");k.className="k";k.textContent=label;const p=document.createElement("pre");p.textContent=txt;const b=document.createElement("button");b.textContent="Copy";b.onclick=()=>copy(txt);d.append(k,p,b);return d}
document.getElementById("props").append(blk("Prompt bảng đạo cụ (đính kèm ảnh Hiro)",PROPS));
const S=document.getElementById("segs");
SEG.forEach((s,i)=>{const c=document.createElement("div");c.className="card";const h=document.createElement("h3");h.innerHTML="Đoạn "+(i+1)+" <span class='t'></span>";h.querySelector(".t").textContent=s.t;c.append(h);
 c.append(blk("Lời đọc",s.n),blk("Prompt ảnh",s.p));
 if(s.p2)c.append(blk("Prompt ảnh phụ (cắt sang ở giây thứ 4)",s.p2));
 const m=document.createElement("p");m.className="sub";m.style.margin="8px 0 0";m.textContent="Chuyển động trong CapCut: "+s.m;c.append(m);S.append(c)});
const all=document.createElement("div");all.className="card";all.append(blk("Toàn bộ lời đọc (để dán vào TTS)",SEG.map(s=>s.n).join("\n")));S.append(all);
document.getElementById("post").append(blk("Tiêu đề",POST.title),blk("Caption",POST.cap+"\n\n"+POST.tags));
document.getElementById("ttl").textContent="Quy trình: "+C.title;
document.getElementById("meta").textContent=SEG.length+" đoạn, khoảng "+C.duration+" giây. Bấm Copy ở từng khối để dán vào Flow hoặc CapCut. Hook: "+C.hook;
document.getElementById("srcs").textContent=(C.sources&&C.sources.length)?C.sources.join("\n"):"Tự tìm nguồn cho các ý chính.";
(function(){const key="hw:"+C.title;let sv={};try{sv=JSON.parse(localStorage.getItem(key)||"{}")}catch(e){}
document.querySelectorAll("ol li").forEach((li,i)=>{const c=document.createElement("input");c.type="checkbox";c.checked=!!sv[i];c.setAttribute("aria-label","Hoàn thành bước");c.onchange=()=>{sv[i]=c.checked;try{localStorage.setItem(key,JSON.stringify(sv))}catch(e){}};li.prepend(c," ")})})();
</script>
</body>
</html>
`;
