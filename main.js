/* ---------- scroll reveal ---------- */
const revealEls = document.querySelectorAll('.reveal, .timeline');
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('is-visible'); } });
},{threshold:0.15});
revealEls.forEach(el=>io.observe(el));

/* ---------- floating CTA ---------- */
const floatCta = document.getElementById('floatCta');
const rsvpSection = document.getElementById('rsvp');
window.addEventListener('scroll', ()=>{
  const trigger = window.innerHeight * 0.9;
  const rsvpTop = rsvpSection.getBoundingClientRect().top + window.scrollY;
  if(window.scrollY > trigger && window.scrollY < rsvpTop - 200){
    floatCta.classList.add('show');
  } else {
    floatCta.classList.remove('show');
  }
});

/* ---------- countdown ---------- */
const targetDate = new Date('2026-11-29T12:00:00+09:00').getTime();
function pulse(el){
  el.classList.remove('tick');
  void el.offsetWidth; /* restart animation */
  el.classList.add('tick');
}
function setIfChanged(id, value){
  const el = document.getElementById(id);
  if(el.textContent !== value){
    el.textContent = value;
    pulse(el);
  }
}
function updateCountdown(){
  const now = Date.now();
  let diff = targetDate - now;
  if(diff < 0) diff = 0;
  const d = Math.floor(diff/86400000);
  const h = Math.floor((diff%86400000)/3600000);
  const m = Math.floor((diff%3600000)/60000);
  const s = Math.floor((diff%60000)/1000);
  setIfChanged('cd-days', String(d));
  setIfChanged('cd-hours', String(h).padStart(2,'0'));
  setIfChanged('cd-mins', String(m).padStart(2,'0'));
  setIfChanged('cd-secs', String(s).padStart(2,'0'));
}
updateCountdown();
setInterval(updateCountdown, 1000);

/* ---------- starfield ---------- */
const starsLayer = document.getElementById('starsLayer');
const starColors = ['var(--butter)','var(--ivory)','var(--yellow)'];
for(let i=0;i<55;i++){
  const s = document.createElement('div');
  s.className='star';
  const size = (Math.random()*2 + 1).toFixed(1);
  s.style.width = size+'px';
  s.style.height = size+'px';
  s.style.left = (Math.random()*100)+'%';
  s.style.top = (Math.random()*70)+'%';
  s.style.background = starColors[Math.floor(Math.random()*starColors.length)];
  s.style.animationDuration = (2 + Math.random()*3.5)+'s';
  s.style.animationDelay = (Math.random()*4)+'s';
  starsLayer.appendChild(s);
}
for(let i=0;i<2;i++){
  const sh = document.createElement('div');
  sh.className='shooting-star';
  sh.style.left = (30 + Math.random()*50)+'%';
  sh.style.top = (10 + Math.random()*25)+'%';
  sh.style.animationDelay = (i*4 + Math.random()*3)+'s';
  starsLayer.appendChild(sh);
}

/* ---------- RSVP form ---------- */
/* ▼▼▼ ここにGoogleスプレッドシート側で発行したウェブアプリのURLを貼り付けてください ▼▼▼ */
const RSVP_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwthIQkI6LWNKzIZewmobJzHA3iZCn1ENphldii_ULLfzzRfEWVIYDJTCET11fV8lrjAA/exec';
/* ▲▲▲ 末尾は https://script.google.com/macros/s/～/exec の形になります ▲▲▲ */

let selectedAttend = '';
function selectAttend(el){
  document.querySelectorAll('.attend-btn').forEach(b=>b.classList.remove('selected'));
  el.classList.add('selected');
  selectedAttend = el.dataset.val;
}
function handleNoneAllergy(el){
  if(el.checked){
    document.querySelectorAll('input[name=allergy]').forEach(c=>{ if(c!==el) c.checked=false; });
  }
}
document.querySelectorAll('input[name=allergy]').forEach(c=>{
  c.addEventListener('click', function(){
    if(this.value!=='なし' && this.checked){
      const none = document.querySelector('input[name=allergy][value="なし"]');
      if(none) none.checked = false;
    }
  });
});

const rsvpForm = document.getElementById('rsvpForm');
const formError = document.getElementById('formError');
const submitBtn = document.getElementById('submitBtn');

rsvpForm.addEventListener('submit', async function(e){
  e.preventDefault();
  formError.style.display='none';

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const tel = document.getElementById('tel').value.trim();
  const zip = document.getElementById('zip').value.trim();
  const address = document.getElementById('address').value.trim();
  const message = document.getElementById('message').value.trim();
  const allergyDetail = document.getElementById('allergyDetail').value.trim();
  const allergies = Array.from(document.querySelectorAll('input[name=allergy]:checked')).map(c=>c.value);

  if(!selectedAttend || !name || !email || !tel || !zip || !address){
    formError.style.display='block';
    return;
  }

  const entry = {
    type: 'rsvp',
    attendance: selectedAttend,
    name, email, tel, zip, address,
    allergies: allergies.join('、'),
    allergyDetail,
    message,
    submittedAt: new Date().toISOString()
  };

  submitBtn.disabled = true;
  submitBtn.textContent = '送信中...';

  if(!RSVP_ENDPOINT || RSVP_ENDPOINT.indexOf('http') !== 0){
    formError.textContent = '現在　送信先の設定が完了していません　運営者にお問い合わせください';
    formError.style.display='block';
    submitBtn.disabled = false;
    submitBtn.textContent = '送信する';
    return;
  }

  try{
    await fetch(RSVP_ENDPOINT, {
      method:'POST',
      mode:'no-cors',
      headers:{'Content-Type':'text/plain;charset=utf-8'},
      body: JSON.stringify(entry)
    });
    /* no-cors では応答内容を確認できないため、通信自体が成功した時点で完了とみなします */
    rsvpForm.style.display = 'none';
    document.getElementById('thanksBox').classList.add('show');
  }catch(err){
    console.error(err);
    formError.textContent = '送信に失敗しました　通信環境をご確認のうえ　時間をおいて再度お試しください';
    formError.style.display='block';
    submitBtn.disabled = false;
    submitBtn.textContent = '送信する';
  }
});

/* ---------- PHOTO SHARE ---------- */
/* ▼▼▼ ここに思い出の写真フォルダ（Googleドライブ）の共有URLを貼り付けてください ▼▼▼ */
const PHOTO_ALBUM_URL = 'https://drive.google.com/drive/folders/17zXZ8y25v5B9VY4kq3bBcKZMjeiRp65t?usp=drive_link';
/* ▲▲▲ フォルダの共有設定を「リンクを知っている全員」→「閲覧者」にしてから貼り付けてください ▲▲▲ */

const MAX_PHOTO_FILES = 10;
const MAX_PHOTO_SIZE_MB = 15;

const photoInput = document.getElementById('photoInput');
const photoUploaderField = document.getElementById('photoUploaderField');
const photoSelected = document.getElementById('photoSelected');
const photoSubmitBtn = document.getElementById('photoSubmitBtn');
const photoStatus = document.getElementById('photoStatus');
let selectedPhotoFiles = [];

function openPhotoAlbum(){
  if(!PHOTO_ALBUM_URL || PHOTO_ALBUM_URL.indexOf('http') !== 0 || PHOTO_ALBUM_URL.indexOf('YOUR_FOLDER_ID') !== -1){
    alert('写真アルバムのURLがまだ設定されていません');
    return;
  }
  window.open(PHOTO_ALBUM_URL, '_blank', 'noopener');
}

photoInput.addEventListener('change', function(){
  const files = Array.from(photoInput.files).slice(0, MAX_PHOTO_FILES);
  const tooLarge = files.filter(f => f.size > MAX_PHOTO_SIZE_MB * 1024 * 1024);
  selectedPhotoFiles = files.filter(f => f.size <= MAX_PHOTO_SIZE_MB * 1024 * 1024);

  if(selectedPhotoFiles.length === 0){
    photoSelected.textContent = tooLarge.length ? 'ファイルサイズが大きすぎます　' + MAX_PHOTO_SIZE_MB + 'MB以下の写真をお選びください' : '';
    photoUploaderField.style.display = 'none';
    photoSubmitBtn.style.display = 'none';
    return;
  }
  let msg = selectedPhotoFiles.length + '枚の写真が選択されています';
  if(tooLarge.length) msg += '（' + tooLarge.length + '枚はサイズが大きいため対象外です）';
  photoSelected.textContent = msg;
  photoUploaderField.style.display = 'block';
  photoSubmitBtn.style.display = 'block';
  photoStatus.textContent = '';
});

function fileToBase64(file){
  return new Promise((resolve, reject)=>{
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

photoSubmitBtn.addEventListener('click', async function(){
  if(selectedPhotoFiles.length === 0) return;

  if(!RSVP_ENDPOINT || RSVP_ENDPOINT.indexOf('http') !== 0){
    photoStatus.textContent = '現在　送信先の設定が完了していません　運営者にお問い合わせください';
    return;
  }

  photoSubmitBtn.disabled = true;
  photoStatus.textContent = 'アップロード中です　しばらくお待ちください';
  const uploaderName = document.getElementById('photoUploaderName').value.trim();

  try{
    for(const file of selectedPhotoFiles){
      const base64 = await fileToBase64(file);
      await fetch(RSVP_ENDPOINT, {
        method:'POST',
        mode:'no-cors',
        headers:{'Content-Type':'text/plain;charset=utf-8'},
        body: JSON.stringify({
          type:'photo',
          filename: file.name,
          mimeType: file.type,
          data: base64,
          uploaderName,
          submittedAt: new Date().toISOString()
        })
      });
    }
    photoStatus.textContent = 'ご協力ありがとうございました　お写真を確かにお預かりしました';
    photoSelected.textContent = '';
    photoUploaderField.style.display = 'none';
    photoSubmitBtn.style.display = 'none';
    photoSubmitBtn.disabled = false;
    photoInput.value = '';
    selectedPhotoFiles = [];
  }catch(err){
    console.error(err);
    photoStatus.textContent = 'アップロードに失敗しました　通信環境をご確認のうえ　時間をおいて再度お試しください';
    photoSubmitBtn.disabled = false;
  }
});

/* ---------- ADMIN ---------- */
const ADMIN_PASSCODE = '20260314'; // 変更する場合はこの値を書き換えてください（入籍記念日になっています）
/* ▼▼▼ ここにGoogleスプレッドシートの共有URL（自分たちが見るためのURL）を貼り付けてください ▼▼▼ */
const ADMIN_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1pcrajhuFfK_qpKAN54nGRSfDcJvoslo33ZkDNwxh1_0/edit?usp=sharing';

function openAdmin(){
  document.getElementById('adminOverlay').classList.add('show');
}
function closeAdmin(){
  document.getElementById('adminOverlay').classList.remove('show');
  document.getElementById('adminLoginView').style.display='block';
  document.getElementById('adminDataView').style.display='none';
  document.getElementById('adminPass').value='';
  document.getElementById('adminError').style.display='none';
}
function checkAdminPass(){
  const val = document.getElementById('adminPass').value;
  if(val === ADMIN_PASSCODE){
    document.getElementById('adminLoginView').style.display='none';
    document.getElementById('adminDataView').style.display='block';
  }else{
    document.getElementById('adminError').style.display='block';
  }
}
function openSheet(){
  if(!ADMIN_SHEET_URL || ADMIN_SHEET_URL.indexOf('http') !== 0){
    alert('スプレッドシートのURLがまだ設定されていません');
    return;
  }
  window.open(ADMIN_SHEET_URL, '_blank', 'noopener');
}

/* ---------- LINK ROUTING (participant vs organizer) ---------- */
/* 参加者用リンク：このページのURLをそのまま共有してください。
   管理者用リンク：URLの末尾に ?admin=1 を付けたものを共有してください（例：このページのURL + ?admin=1）。
   （アプリによっては #admin 形式が共有時に消えることがあるため、?admin=1 の方を推奨します。#admin にも対応しています。）
   このリンクを開くと、自動的にパスコード入力画面が表示されます。 */
function checkEntryRoute(){
  const params = new URLSearchParams(window.location.search);
  if(params.get('admin') === '1' || window.location.hash === '#admin'){
    openAdmin();
  }
}
window.addEventListener('DOMContentLoaded', checkEntryRoute);
window.addEventListener('hashchange', checkEntryRoute);
