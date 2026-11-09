(() => {
  'use strict';
  const art=window.WinterArt,host=window.WinterNookHost;
  const bridge=window.webkit?.messageHandlers?.winterNook;
  const $=id=>document.getElementById(id);
  const canvas=$('landscape'), ctx=canvas.getContext('2d');
  const items=[
    ['classic','彩灯松树','tree'],['ice','冰蓝杉','tree'],['rose','莓粉杉','tree'],['gold','金箔松','tree'],['rainbow','彩虹树','tree'],['mint','薄荷杉','tree'],
    ['santa','圣诞老人','friend'],['elf','绿帽精灵','friend'],['penguin','围巾企鹅','friend'],['ginger','姜饼小人','friend'],['nutcracker','胡桃夹子','friend'],['bear','极地小熊','friend'],
    ['gifts','礼物堆','decor'],['snowman','小雪人','decor'],['lamp','暖灯笼','decor'],['candy','糖果手杖','decor'],['sleigh','小雪橇','decor'],
    ['stocking','红袜挂饰','decor'],['bells','金铃铛','decor'],['wreath','冬青花环','decor'],['train','礼物火车','decor'],['musicbox','发条音乐盒','decor'],['holly','冬青果','decor'],['baubles','彩球挂串','decor'],['caneArch','糖果拱门','decor'],['snowglobe','雪花玻璃球','decor'],['parcel','圣诞邮筒','decor']
  ];
  const ids=group=>items.filter(x=>x[2]===group).map(x=>x[0]);
  const treeIDs=ids('tree'),decorIDs=ids('decor'),friendIDs=ids('friend');
  const labels=Object.fromEntries(items);
  const actions=['feed','pet','sleep'],key='winter-nook.save.v1';
  const today=()=>{const d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();};
  let loaded;
  try{loaded=host?.saved ?? JSON.parse(localStorage.getItem(key));}catch{}
  const oldTree=loaded?.tree===null||loaded?.tree===false?false:treeIDs.includes(loaded?.tree)?loaded.tree:'classic';
  const state={
    trees:Array.isArray(loaded?.trees)?[0,1,2].map(i=>treeIDs.includes(loaded.trees[i])?loaded.trees[i]:false):['mint',oldTree,'rose'],
    decor:Array.isArray(loaded?.decor)?[...new Set(loaded.decor.filter(x=>decorIDs.includes(x)))]:['gifts','lamp','candy','bells','wreath','musicbox','sleigh'],
    friends:Array.isArray(loaded?.friends)?[...new Set(loaded.friends.filter(x=>friendIDs.includes(x)))]:['santa','penguin','ginger'],
    theme:['festive','candy','aurora'].includes(loaded?.theme)?loaded.theme:'festive',
    length:['standard','long','wide'].includes(loaded?.length)?loaded.length:'long',
    track:window.WinterMusic.ids.includes(loaded?.track)?loaded.track:'jingle',
    volume:typeof loaded?.volume==='number'?Math.min(1,Math.max(0,loaded.volume)):.62,
    loop:loaded?.loop==='one'?'one':'all',
    day:today(),
    care:loaded?.day===today()&&Array.isArray(loaded?.care)?[...new Set(loaded.care.filter(x=>actions.includes(x)))]:[]
  };
  let mini=false,pose='idle',poseTimer,toastTimer,last=0,player,group='tree',zone=1;
  function cue(chord){player?.cue(chord);}
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
      const {id,category}=b.dataset;
      b.hidden=category!==group;
      b.setAttribute('aria-pressed',String(category==='tree'?state.trees[zone]===id:state[category==='friend'?'friends':'decor'].includes(id)));
    }
    $('decor-count').textContent='已摆放 '+(state.trees.filter(Boolean).length+state.friends.length+state.decor.length)+' 件';
    $('zone-label').hidden=group!=='tree';
    $('shelf-arrows').hidden=group!=='decor';
  }
  function toggle(id,category){
    let removed=false;
    if(category==='tree'){removed=state.trees[zone]===id;state.trees[zone]=removed?false:id;}
    else {const list=state[category==='friend'?'friends':'decor'];const i=list.indexOf(id);removed=i>=0;if(removed)list.splice(i,1);else list.push(id);}
    paintItems();repaint();store();
    $('live').textContent=(removed?'已收起':'已摆放')+labels[id];
    cue(removed?[69,65]:[72,79]);
  }
  for(const [id,label,category] of items){
    const b=document.createElement('button');b.className='item';b.type='button';b.dataset.id=id;b.dataset.category=category;
    b.title=label;b.setAttribute('aria-label',label);
    b.innerHTML='<canvas width="46" height="45" aria-hidden="true"></canvas><span class="item-name"></span><span class="item-check" aria-hidden="true"><svg class="ico"><use href="#i-check"/></svg></span>';
    b.querySelector('.item-name').textContent=label;
    $('items').append(b);
    art.icon(b.querySelector('canvas'),id);
    b.addEventListener('click',()=>toggle(id,category));
  }
  for(const button of document.querySelectorAll('[data-group]')){
    button.addEventListener('click',()=>{
      group=button.dataset.group;
      document.querySelectorAll('[data-group]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
      $('items').scrollLeft=0;
      paintItems();
    });
  }
  $('shelf-prev').addEventListener('click',()=>$('items').scrollBy({left:-325,behavior:'smooth'}));
  $('shelf-next').addEventListener('click',()=>$('items').scrollBy({left:325,behavior:'smooth'}));
  $('tree-zone').addEventListener('change',()=>{zone=Number($('tree-zone').value);paintItems();});
  $('color-theme').value=state.theme;
  $('color-theme').addEventListener('change',()=>{state.theme=$('color-theme').value;repaint();store();});
  $('strip-size').value=state.length;
  function previewLength(){document.body.dataset.length=state.length;}
  $('strip-size').addEventListener('change',()=>{state.length=$('strip-size').value;previewLength();store();});
  previewLength();
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
    canvas.width=mini?art.DOCK_W:art.W;
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

  player=window.WinterMusic.init(state,store,say);
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
