(() => {
  'use strict';
  const art=window.WinterArt,host=window.WinterNookHost;
  const bridge=window.webkit?.messageHandlers?.winterNook;
  const $=id=>document.getElementById(id);
  const canvas=$('landscape'), ctx=canvas.getContext('2d');
  const items=[
    ['classic','经典松树','tree'],['ice','冰蓝杉','tree'],['rose','莓粉杉','tree'],
    ['gifts','礼物堆'],['snowman','小雪人'],['lamp','暖灯笼'],['candy','糖果手杖'],['sleigh','小雪橇']
  ];
  const treeIDs=items.filter(x=>x[2]).map(x=>x[0]),decorIDs=items.filter(x=>!x[2]).map(x=>x[0]);
  const labels=Object.fromEntries(items);
  const actions=['feed','pet','sleep'],key='winter-nook.save.v1';
  const today=()=>{const d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();};
  let loaded;
  try{loaded=host?.saved ?? JSON.parse(localStorage.getItem(key));}catch{}
  const state={
    tree:loaded?.tree===null||loaded?.tree===false?null:treeIDs.includes(loaded?.tree)?loaded.tree:'classic',
    decor:Array.isArray(loaded?.decor)?[...new Set(loaded.decor.filter(x=>decorIDs.includes(x)))]:['gifts','lamp','candy'],
    day:today(),
    care:loaded?.day===today()&&Array.isArray(loaded?.care)?[...new Set(loaded.care.filter(x=>actions.includes(x)))]:[]
  };
  let mini=false,pose='idle',poseTimer,toastTimer,last=0,theme=false,audio,loop,scheduled=[];
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  const savedEl=document.querySelector('.saved');
  function store() {
    try{
      if(bridge)bridge.postMessage({type:'save',state});
      else localStorage.setItem(key,JSON.stringify(state));
    }catch{savedEl.textContent='此窗口无法保存进度';}
  }
  function updateDay(){
    if(state.day!==today()){state.day=today();state.care=[];store();}
  }
  function stamps(){
    updateDay();
    const n=state.care.length;
    $('stamp-count').textContent=n+' / 3';
    $('stamp-pips').querySelectorAll('i').forEach((el,i)=>el.classList.toggle('lit',i<n));
  }
  function say(msg,ms=3300){
    clearTimeout(toastTimer);
    const el=$('pet-toast');
    el.textContent=msg;el.classList.remove('hidden');
    $('live').textContent=msg;
    toastTimer=setTimeout(()=>el.classList.add('hidden'),ms);
  }
  function repaint(t=performance.now()/1000){(mini?art.desktop:art.scene)(ctx,t,state,pose);}
  function setPose(p){
    pose=p;
    $('pet-status').textContent={idle:'想跟你一起看雪',feed:'正开心地嚼饼干',pet:'很喜欢你的摸摸',sleep:'围着围巾做梦呢'}[p];
    const sleepBtn=document.querySelector('[data-action=sleep]');
    const sleepLabel=p==='sleep'?'叫醒小栗':'打个盹';
    sleepBtn.querySelector('span').textContent=sleepLabel;
    sleepBtn.title=sleepLabel;sleepBtn.setAttribute('aria-label',sleepLabel);
    repaint();
  }
  function care(type){
    clearTimeout(poseTimer);
    if(type==='sleep'&&pose==='sleep'){setPose('idle');say('我醒啦，一起看雪吧！');cue([72,76]);return;}
    updateDay();
    const before=state.care.length;
    if(!state.care.includes(type))state.care.push(type);
    const complete=before<3&&state.care.length===3;
    stamps();store();
    setPose(type);
    if(type==='feed')cue([72,76,79]);
    if(type==='pet')cue([76,81,84]);
    if(type==='sleep')cue([76,72,67]);
    say(complete?'今天集齐了三枚雪花！':{
      feed:'咔嚓！是我最喜欢的饼干。',pet:'摸摸头，暖呼呼！',sleep:'晚安……呼噜。'
    }[type]);
    poseTimer=setTimeout(()=>setPose('idle'),type==='sleep'?9000:2700);
  }
  function paintItems(){
    for(const b of $('items').querySelectorAll('button')){
      const id=b.dataset.id;
      b.setAttribute('aria-pressed',String(state.tree===id||state.decor.includes(id)));
    }
    $('decor-count').textContent='已摆放 '+(Number(!!state.tree)+state.decor.length)+' 件';
  }
  function toggle(id,isTree){
    let removed=false;
    if(isTree){removed=state.tree===id;state.tree=removed?null:id;}
    else {const i=state.decor.indexOf(id);removed=i>=0;if(removed)state.decor.splice(i,1);else state.decor.push(id);}
    paintItems();repaint();store();
    $('live').textContent=(removed?'已收起':'已摆放')+labels[id];
    cue(removed?[69,65]:[72,79]);
  }
  for(const [id,label,category] of items){
    const b=document.createElement('button');b.className='item';b.type='button';b.dataset.id=id;
    b.title=label;b.setAttribute('aria-label',label);
    b.innerHTML='<canvas width="46" height="45" aria-hidden="true"></canvas><span class="item-name"></span><span class="item-check" aria-hidden="true"><svg class="ico"><use href="#i-check"/></svg></span>';
    b.querySelector('.item-name').textContent=label;
    $('items').append(b);
    art.icon(b.querySelector('canvas'),id);
    b.addEventListener('click',()=>toggle(id,category==='tree'));
    if(id==='rose'){const divider=document.createElement('div');divider.className='item-divider';divider.setAttribute('aria-hidden','true');$('items').append(divider);}
  }
  for(const icon of document.querySelectorAll('[data-sprite]'))art.icon(icon,icon.dataset.sprite);
  for(const b of document.querySelectorAll('[data-action]')){
    const label=b.querySelector('span').textContent;
    b.setAttribute('aria-label',label);b.title=label;
    b.addEventListener('click',()=>care(b.dataset.action));
  }
  $('pet-hit').addEventListener('click',()=>care('pet'));
  function setMini(value){
    mini=!!value;
    document.body.classList.toggle('mini',mini);
    document.documentElement.classList.toggle('mini',mini);
    canvas.height=mini?art.DOCK_H:art.H;
    repaint();
    canvas.setAttribute('aria-label',mini?'屏幕底部的像素小鹿与圣诞树林':'像素画：雪地里有小鹿、木屋和圣诞装饰');
    const button=$('mode');
    const label=mini?'返回布置':'桌面挂件';
    button.setAttribute('aria-pressed',String(mini));
    button.setAttribute('aria-label',label);
    button.title=mini?'返回完整窗口（⌥⌘M）':'把小栗放在屏幕底部（⌥⌘M）';
    if(!bridge)button.title=label;
    $('mode-label').textContent=label;
    $('mode-icon').setAttribute('href',mini?'#i-max':'#i-mini');
  }
  window.WinterNook=Object.freeze({setMini});
  if(!bridge)document.body.classList.add('preview');
  setMini(host?.mini||false);
  $('mode').addEventListener('click',()=>{
    if(bridge)bridge.postMessage({type:'mode'});
    else setMini(!mini);
  });

  // A soft, optional chiptune. Audio is synthesized locally and starts on a click.
  const notes=[
    [64,1],[64,1],[64,2],[64,1],[64,1],[64,2],[64,1],[67,1],[60,1.5],[62,.5],[64,4],
    [65,1],[65,1],[65,1.5],[65,.5],[65,1],[64,1],[64,1],[64,.5],[64,.5],[64,1],[62,1],[62,1],[64,1],[62,2],[67,2],
    [64,1],[64,1],[64,2],[64,1],[64,1],[64,2],[64,1],[67,1],[60,1.5],[62,.5],[64,4],
    [65,1],[65,1],[65,1.5],[65,.5],[65,1],[64,1],[64,1],[64,.5],[64,.5],[67,1],[67,1],[65,1],[62,1],[60,4]
  ];
  function playTone(midi,when,duration,vol,type='triangle'){
    const o=audio.createOscillator(),g=audio.createGain();
    o.type=type;o.frequency.value=440*2**((midi-69)/12);
    g.gain.setValueAtTime(.0001,when);g.gain.exponentialRampToValueAtTime(vol,when+.017);
    g.gain.exponentialRampToValueAtTime(.0001,when+duration);
    o.connect(g);g.connect(audio.destination);scheduled.push(o);
    o.onended=()=>{scheduled=scheduled.filter(x=>x!==o);o.disconnect();g.disconnect();};
    o.start(when);o.stop(when+duration+.02);
  }
  function music(){
    if(!theme)return;
    const beat=.29,start=audio.currentTime+.06;
    let n=0;
    for(const [pitch,length] of notes){playTone(pitch,start+n*beat,Math.min(.68,length*beat*.91),.045);n+=length;}
    for(let i=0;i<n;i+=2){
      const p=[48,48,53,55,48,53,55,48][Math.floor(i/4)%8];
      playTone(i%4?p+7:p,start+i*beat,.49,.018,'sine');
    }
    loop=setTimeout(music,(n*beat+.85)*1000);
  }
  function cue(chord){if(theme&&audio?.state==='running'){chord.forEach((p,i)=>playTone(p,audio.currentTime+.012+i*.066,.15,.031,'sine'));}}
  const musicBtn=document.querySelector('[data-music]');
  let soundBusy=false;
  musicBtn.addEventListener('click',async()=>{
    if(soundBusy)return;
    soundBusy=true;
    try{
      if(theme){
        theme=false;clearTimeout(loop);
        for(const o of scheduled)try{o.stop();}catch{}
        scheduled=[];
      }else{
        const Audio=window.AudioContext||window.webkitAudioContext;
        audio=audio||new Audio();
        await audio.resume();theme=true;music();
      }
    }catch{theme=false;say('这次没能播放音乐。');}
    finally{
      musicBtn.setAttribute('aria-pressed',String(theme));
      const s=theme?'关闭音乐':'播放音乐';
      musicBtn.title=s;musicBtn.setAttribute('aria-label',s);soundBusy=false;
    }
  });
  function tick(ms){
    if(!motion.matches&&!document.hidden&&ms-last>=63){last=ms;repaint(ms/1000);}
    requestAnimationFrame(tick);
  }
  motion.addEventListener('change',repaint);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden){stamps();repaint();}});
  setInterval(stamps,60000);
  paintItems();stamps();repaint();
  toastTimer=setTimeout(()=>$('pet-toast').classList.add('hidden'),5400);
  requestAnimationFrame(tick);
})();
