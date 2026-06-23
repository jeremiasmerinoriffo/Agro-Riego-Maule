const crops=[{name:"Tomates",sector:"Sector 1",emoji:"🍅",humidity:32,temp:26,status:"Necesita riego",badge:"danger"},{name:"Maíz",sector:"Sector 2",emoji:"🌽",humidity:55,temp:24,status:"Óptimo",badge:"ok"},{name:"Lechuga",sector:"Sector 3",emoji:"🥬",humidity:42,temp:21,status:"Óptimo",badge:"ok"}];let selectedCrop=crops[0];let chartData=[74,78,70,58,72,71,60,55,56,49,45,39,32];function showScreen(id){document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));document.getElementById(id).classList.add("active");const titles={inicio:"Valle del Maule",cultivos:"Mis Cultivos",detalle:"Detalle del cultivo",riego:"Riego automático",alertas:"Alertas",graficos:"Gráficos",ajustes:"Ajustes",ajusteDetalle:"Ajustes"};document.getElementById("screenTitle").textContent=titles[id];document.querySelectorAll(".nav").forEach(btn=>btn.classList.remove("active"));const navMap={inicio:0,cultivos:1,detalle:1,graficos:1,riego:2,alertas:3,ajustes:4,ajusteDetalle:4};document.querySelectorAll(".nav")[navMap[id]]?.classList.add("active");if(id==="graficos")drawChart()}function renderCrops(){const list=document.getElementById("cropList");list.innerHTML="";crops.forEach((crop,index)=>{const card=document.createElement("div");card.className="card crop-card";card.innerHTML=`<div class="crop-img">${crop.emoji}</div><div class="data"><div class="title-row"><div><h3>${crop.name}</h3><p class="muted">${crop.sector}</p></div><b class="${crop.badge}">${crop.status}</b></div><div class="title-row"><span class="muted">Humedad del suelo</span><span class="value">${crop.humidity}%</span></div><div class="title-row"><span class="muted">Temperatura</span><b>${crop.temp}°C</b></div><button onclick="selectCrop(${index})">Ver detalle</button></div>`;list.appendChild(card)})}function selectCrop(index){selectedCrop=crops[index];document.getElementById("detailEmoji").textContent=selectedCrop.emoji;document.getElementById("detailName").textContent=selectedCrop.name;document.getElementById("detailSector").textContent=selectedCrop.sector;document.getElementById("detailHumidity").textContent=selectedCrop.humidity+"%";document.getElementById("detailTemp").textContent=selectedCrop.temp+"°C";document.getElementById("humidityBar").style.width=selectedCrop.humidity+"%";document.getElementById("chartCrop").textContent=`${selectedCrop.name} - ${selectedCrop.sector}`;document.getElementById("liveReading").textContent=`${selectedCrop.humidity}% humedad`;const badge=document.getElementById("humidityBadge");badge.textContent=selectedCrop.humidity<40?"Baja":"Óptima";showScreen("detalle")}let irrigationActive=false;
let irrigationTimer=null;

function toggleIrrigation(){
  const btn=document.getElementById("irrigationBtn");

  if(!irrigationActive){
    irrigationActive=true;
    document.getElementById("valveState").textContent="Abierta";
    btn.textContent="⏹ Detener riego";
    btn.style.background="linear-gradient(135deg,#c62828,#e53935)";
    toast("Riego activado. Puedes detenerlo manualmente.");

    irrigationTimer=setInterval(()=>{
      selectedCrop.humidity=Math.min(65,selectedCrop.humidity+1);
      document.getElementById("detailHumidity").textContent=selectedCrop.humidity+"%";
      document.getElementById("humidityBar").style.width=selectedCrop.humidity+"%";
      document.getElementById("liveReading").textContent=`${selectedCrop.humidity}% humedad`;
    },1200);

  }else{
    irrigationActive=false;
    clearInterval(irrigationTimer);
    document.getElementById("valveState").textContent="Cerrada";
    btn.textContent="💧 Activar riego ahora";
    btn.style.background="linear-gradient(135deg,#188038,#35a852)";
    toast("Riego detenido. Humedad actualizada.");
    renderCrops();
  }
}function updateRange(id,value){document.getElementById(id).textContent=value}function saveConfig(){toast("Configuración de riego automático guardada")}function toast(message){const el=document.getElementById("toast");el.textContent=message;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2200)}function randomChart(){chartData=chartData.map(v=>Math.max(20,Math.min(90,v+Math.round(Math.random()*20-10))));drawChart();toast("Datos de sensores actualizados")}function drawChart(){const canvas=document.getElementById("chart");const ctx=canvas.getContext("2d");const w=canvas.width;const h=canvas.height;ctx.clearRect(0,0,w,h);ctx.strokeStyle="#e4ece6";ctx.lineWidth=1;for(let i=0;i<=4;i++){const y=20+i*40;ctx.beginPath();ctx.moveTo(32,y);ctx.lineTo(w-12,y);ctx.stroke()}ctx.fillStyle="#66736a";ctx.font="12px Arial";ctx.fillText("100",5,25);ctx.fillText("75",12,65);ctx.fillText("50",12,105);ctx.fillText("25",12,145);ctx.fillText("0",18,185);const xStep=(w-60)/(chartData.length-1);const points=chartData.map((v,i)=>({x:36+i*xStep,y:180-(v/100)*160}));ctx.strokeStyle="#1976d2";ctx.lineWidth=4;ctx.beginPath();points.forEach((p,i)=>{if(i===0)ctx.moveTo(p.x,p.y);else ctx.lineTo(p.x,p.y)});ctx.stroke();ctx.fillStyle="#1976d2";points.forEach(p=>{ctx.beginPath();ctx.arc(p.x,p.y,4,0,Math.PI*2);ctx.fill()});ctx.fillStyle="#333";ctx.font="12px Arial";ctx.fillText("Últimos días",116,212)}setInterval(()=>{const water=Math.floor(55+Math.random()*20);document.getElementById("waterValue").textContent=water+"%";document.getElementById("waterLiters").textContent=`${water*100} / 10.000 L`;document.getElementById("waterBar").style.width=water+"%";crops.forEach(crop=>{crop.humidity=Math.max(25,Math.min(65,crop.humidity+Math.round(Math.random()*4-2)));crop.status=crop.humidity<40?"Necesita riego":"Óptimo";crop.badge=crop.humidity<40?"danger":"ok"});renderCrops()},6000);renderCrops();drawChart();
function openSetting(type){
  const box=document.getElementById("settingContent");
  const views={
    perfil: `
      <div class="card">
        <h2 class="setting-title">Perfil del predio</h2>
        <p class="muted">Datos principales del agricultor y predio monitoreado.</p>
        <label>Nombre del predio</label>
        <input class="setting-input" value="Predio San Ignacio">
        <label>Responsable</label>
        <input class="setting-input" value="Fernando Torres">
        <label>Ubicación</label>
        <input class="setting-input" value="Región del Maule">
        <button class="primary" onclick="toast('Perfil guardado correctamente')">Guardar cambios</button>
      </div>
    `,
    notificaciones: `
      <div class="card">
        <h2 class="setting-title">Notificaciones</h2>
        <p class="muted">Configura qué alertas recibirá el usuario.</p>
        <div class="setting-row"><span>Alertas de humedad baja</span><label class="switch"><input type="checkbox" checked><span></span></label></div>
        <div class="setting-row"><span>Alertas de estanque bajo</span><label class="switch"><input type="checkbox" checked><span></span></label></div>
        <div class="setting-row"><span>Sensor desconectado</span><label class="switch"><input type="checkbox" checked><span></span></label></div>
        <div class="setting-row"><span>Resumen diario</span><label class="switch"><input type="checkbox"><span></span></label></div>
        <button class="primary" onclick="toast('Notificaciones actualizadas')">Guardar preferencias</button>
      </div>
    `,
    sensores: `
      <div class="card">
        <h2 class="setting-title">Dispositivos y sensores</h2>
        <p class="muted">Estado simulado de sensores conectados al sistema.</p>
        <div class="sensor-item"><span><i class="sensor-dot"></i>Sensor humedad - Tomates</span><b>Conectado</b></div>
        <div class="sensor-item"><span><i class="sensor-dot"></i>Sensor humedad - Maíz</span><b>Conectado</b></div>
        <div class="sensor-item"><span><i class="sensor-dot off"></i>Sensor humedad - Lechuga</span><b>Sin conexión</b></div>
        <div class="sensor-item"><span><i class="sensor-dot"></i>Válvula de riego</span><b>Disponible</b></div>
        <button class="secondary" onclick="toast('Buscando nuevos sensores...')">Buscar sensores</button>
        <button class="primary" onclick="toast('Sensores sincronizados')">Sincronizar</button>
      </div>
    `,
    unidades: `
      <div class="card">
        <h2 class="setting-title">Unidades de medida</h2>
        <p class="muted">Selecciona cómo se mostrarán los datos del sistema.</p>
        <p>Temperatura</p>
        <button class="option-pill active" onclick="selectPill(this)">°C</button>
        <button class="option-pill" onclick="selectPill(this)">°F</button>
        <p style="margin-top:14px">Volumen de agua</p>
        <button class="option-pill active" onclick="selectPill(this)">Litros</button>
        <button class="option-pill" onclick="selectPill(this)">m³</button>
        <p style="margin-top:14px">Humedad</p>
        <button class="option-pill active" onclick="selectPill(this)">Porcentaje</button>
        <button class="primary" onclick="toast('Unidades guardadas')">Guardar unidades</button>
      </div>
    `,
    soporte: `
      <div class="card">
        <h2 class="setting-title">Ayuda y soporte</h2>
        <p class="muted">Sección informativa para el usuario del prototipo.</p>
        <div class="setting-row"><span>¿Cómo funciona el riego automático?</span><b>›</b></div>
        <div class="setting-row"><span>¿Qué significa humedad baja?</span><b>›</b></div>
        <div class="setting-row"><span>¿Cómo conectar un sensor?</span><b>›</b></div>
        <div class="setting-row"><span>Contacto de soporte</span><b>soporte@agroriego.cl</b></div>
        <button class="primary" onclick="toast('Solicitud de ayuda enviada')">Solicitar ayuda</button>
      </div>
    `
  };
  box.innerHTML=views[type];
  showScreen("ajusteDetalle");
}

function selectPill(btn){
  const parent=btn.parentElement;
  const all=parent.querySelectorAll(".option-pill");
  all.forEach(p=>p.classList.remove("active"));
  btn.classList.add("active");
}
