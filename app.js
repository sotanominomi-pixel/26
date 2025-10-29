const alarmsDiv = document.getElementById('alarmsDiv');
const alarmsList = document.getElementById('alarmsList');
const addAlarmBtn = document.getElementById('addAlarmBtn');
let alarms = JSON.parse(localStorage.getItem('nclock_alarms')||'[]'); // [{h,m,enabled}]

function saveAlarms(){ localStorage.setItem('nclock_alarms', JSON.stringify(alarms)); }

function renderAlarms(){
  if(!alarmsList) return;
  if(alarms.length===0){
    alarmsList.innerHTML = '<div style="color:var(--muted); padding:8px;">アラームなし</div>';
    return;
  }
  alarmsList.innerHTML = alarms.map((a,i)=>{
    const checked = a.enabled?'checked':'';
    return `<div class="alarm-item" style="display:flex; justify-content:space-between; padding:6px; font-size:18px;">
      <div>${String(a.h).padStart(2,'0')}:${String(a.m).padStart(2,'0')}</div>
      <div>
        <input type="checkbox" data-index="${i}" class="alarm-toggle" ${checked}>
        <button data-index="${i}" class="alarm-delete">×</button>
      </div>
    </div>`;
  }).join('');

  // toggle
  document.querySelectorAll('.alarm-toggle').forEach(el=>{
    el.addEventListener('change', e=>{
      const idx = e.target.dataset.index;
      alarms[idx].enabled = e.target.checked;
      saveAlarms();
    });
  });

  // delete
  document.querySelectorAll('.alarm-delete').forEach(el=>{
    el.addEventListener('click', e=>{
      const idx = e.target.dataset.index;
      alarms.splice(idx,1);
      renderAlarms();
      saveAlarms();
    });
  });
}

if(addAlarmBtn){
  addAlarmBtn.addEventListener('click', ()=>{
    const h = parseInt(prompt('時(0-23)を入力してください'),10);
    const m = parseInt(prompt('分(0-59)を入力してください'),10);
    if(!isNaN(h) && !isNaN(m)){
      alarms.push({h,h:m,enabled:true});
      renderAlarms();
      saveAlarms();
    }
  });
}

/* Tick でアラームチェック */
function tick(now){
  if(mode==='alarm'){
    const nowD = new Date();
    alarms.forEach(a=>{
      if(!a.enabled) return;
      if(a.h===nowD.getHours() && a.m===nowD.getMinutes() && nowD.getSeconds()===0){
        alert(`アラーム ${String(a.h).padStart(2,'0')}:${String(a.m).padStart(2,'0')} が鳴ります！`);
      }
    });
  }
  requestAnimationFrame(tick);
}

// 初回レンダリング
renderAlarms();
