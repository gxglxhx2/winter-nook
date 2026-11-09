(() => {
  'use strict';
  // Traditional carol melodies arranged here for synthesized bells. The final track is original.
  const library = [
    ['jingle','铃儿响叮当','Jingle Bells',118,'C C F C G C G C','E4 E4 E4:2 E4 E4 E4:2 E4 G4 C4:1.5 D4:.5 E4:4 F4 F4 F4:1.5 F4:.5 F4 E4 E4 E4:.5 E4:.5 E4 D4 D4 E4 D4:2 G4:2 E4 E4 E4:2 E4 E4 E4:2 E4 G4 C4:1.5 D4:.5 E4:4 F4 F4 F4:1.5 F4:.5 F4 E4 E4 E4:.5 E4:.5 G4 G4 F4 D4 C4:4'],
    ['deck','装点大厅','Deck the Halls',117,'G D G G C G D G','D5:1.5 C5:.5 B4 A4 G4 A4 B4 G4 A4:.5 B4:.5 C5:.5 A4:.5 B4:1.5 A4:.5 G4 F#4 G4:2 D5:1.5 C5:.5 B4 A4 G4 A4 B4 G4 A4:.5 B4:.5 C5:.5 A4:.5 B4:1.5 A4:.5 G4 F#4 G4:2 A4:1.5 B4:.5 C5 A4 B4:1.5 C5:.5 D5 A4 B4:.5 C5:.5 D5 E5 F#5 G5 A5:2 D5:1.5 C5:.5 B4 A4 G4 A4 B4 G4 E5:.5 E5:.5 E5:.5 E5:.5 D5:1.5 C5:.5 B4 A4 G4:2'],
    ['wish','祝你圣诞快乐','We Wish You a Merry Christmas',112,'G C A D B E C D G','D4 G4 G4 A4 G4 F#4 E4 E4 E4 A4 A4 B4 A4 G4 F#4 D4 D4 B4 B4 C5 B4 A4 G4 E4 D4 D4 E4 A4 F#4 G4:3 D4 G4 G4 G4 F#4:2 F#4 G4 F#4 E4 D4:2 A4 B4 A4 G4 D5 D4 D4 D4 E4 A4 F#4 G4:3'],
    ['silent','平安夜','Silent Night',92,'C C G C F C F C G C C','G4:1.5 A4:.5 G4 E4:3 G4:1.5 A4:.5 G4 E4:3 D5:2 D5 B4:3 C5:2 C5 G4:3 A4:2 A4 C5:1.5 B4:.5 A4 G4:1.5 A4:.5 G4 E4:3 A4:2 A4 C5:1.5 B4:.5 A4 G4:1.5 A4:.5 G4 E4:3 D5:2 D5 F5:1.5 D5:.5 B4 C5:3 E5:3 C5 G4 E4 G4:1.5 F4:.5 D4 C4:3'],
    ['joy','普世欢腾','Joy to the World',113,'C G C F C G C','C5:2 B4:1.5 A4:.5 G4:2 F4:2 E4 D4 C4:3 G4:2 A4:2 A4 B4:2 B4 C5:3 C5 C5 B4 A4 G4 G4:.5 F4:.5 E4 C5 C5 B4 A4 G4 G4:.5 F4:.5 E4 E4 E4 E4 E4:.5 F4:.5 G4:2 F4:.5 E4:.5 D4 D4 D4 D4:.5 E4:.5 F4:2 E4:.5 D4:.5 C4 C5 A4 G4 F4 E4:2 F4:1.5 E4:.5 D4:2 C4:4'],
    ['tree','哦，圣诞树','O Christmas Tree',103,'F C F C F Bb C F','C4 F4:1.5 F4:.5 F4 G4 A4:1.5 A4:.5 A4:2 A4 G4 A4 Bb4 E4 G4 F4:3 C4 F4:1.5 F4:.5 F4 G4 A4:1.5 A4:.5 A4:2 A4 G4 A4 Bb4 E4 G4 F4:3 C5 C5 A4 D5 C5:1.5 C5:.5 Bb4:2 Bb4 Bb4 G4 C5 Bb4:1.5 Bb4:.5 A4:2 C4 F4:1.5 F4:.5 F4 G4 A4:1.5 A4:.5 A4:2 A4 G4 A4 Bb4 E4 G4 F4:3'],
    ['noel','第一支圣诞歌','The First Noel',101,'D A G D A Bm G A D','F#4:.5 E4:.5 D4:1.5 E4:.5 F#4:.5 G4:.5 A4:2 B4:.5 C#5:.5 D5 C#5 B4 A4:2 B4:.5 C#5:.5 D5 C#5 B4 A4 B4 C#5 D5 A4 G4 F#4:2 F#4:.5 E4:.5 D4:1.5 E4:.5 F#4:.5 G4:.5 A4:2 B4:.5 C#5:.5 D5 C#5 B4 A4:2 B4:.5 C#5:.5 D5 C#5 B4 A4 B4 C#5 D5 A4 G4 F#4:2 F#4:.5 E4:.5 D4:2 F#4:.5 G4:.5 A4:2 D5:.5 C#5:.5 B4:2 B4 A4:2 D5 C#5 B4 A4 B4 C#5 D5 A4 G4 F#4:3'],
    ['good','善良的温塞斯拉斯','Good King Wenceslas',112,'G D G G C G D G','G4 G4 G4 A4 G4 G4 D4:2 E4 D4 E4 F#4 G4:2 G4:2 G4 G4 G4 A4 G4 G4 D4:2 E4 D4 E4 F#4 G4:2 G4:2 D5 C5 B4 A4 B4 A4 G4:2 E4 D4 E4 F#4 G4:2 G4:2 D4 D4 E4 F#4 G4 G4 A4:2 D5 C5 B4 A4 G4:4'],
    ['rest','愿你平安喜乐','God Rest Ye Merry, Gentlemen',115,'Am Em Am G F C G Am','A4 A4 E5 E5 D5 C5 B4 A4 G4 A4 B4 C5 D5 E5:3 A4 A4 E5 E5 D5 C5 B4 A4 G4 A4 B4 C5 D5 E5:3 E5 F5 D5 E5 F5 G5 A5 E5 D5 C5 A4 B4 C5 D5:3 C5 D5 E5 F5 E5 D5 C5 B4 A4 C5 B4 A4:3'],
    ['bells','圣诞钟声','Shchedryk',155,'Am Am F E Am Am Dm E','C5 B4 C5 A4:2 C5 B4 C5 A4:2 C5 B4 C5 A4:2 C5 B4 C5 A4:2 E5 D5 E5 C5:2 E5 D5 E5 C5:2 G5 F5 G5 E5:2 G5 F5 G5 E5:2 C5 B4 C5 A4:2 C5 B4 C5 A4:2 A5 G5 F5 E5 D5 C5 B4 A4 E5:2 A4:4'],
    ['angels','天使歌唱','Hark! The Herald Angels Sing',109,'F C F Bb F C Bb C F','C4 F4 F4 E4 F4 A4 A4 G4:2 C5 C5 C5 Bb4 A4 G4 A4:2 C4 F4 F4 E4 F4 A4 A4 G4:2 C5 G4 G4 G4 E4 E4 D4 C4:2 C5 C5 C5 F4 Bb4 A4 A4 G4:2 C5 C5 C5 F4 Bb4 A4 A4 G4:2 D5 D5 D5 C5 Bb4 A4 Bb4:2 G4 A4 G4:2 C4:2 C5 C5 C5 F4 Bb4 A4 A4 G4:2 D5 D5 D5 C5 Bb4 A4 Bb4:2 G4 A4 G4:2 F4:3'],
    ['sugar','糖梅仙子之舞','Dance of the Sugar Plum Fairy',105,'Em B Em Am B Em','E5:.5 D#5:.5 E5:.5 B4:.5 C5:.5 A4:.5 B4:.5 G4:.5 E5:.5 D#5:.5 E5:.5 B4:.5 C5:.5 A4:.5 B4:.5 G4:.5 G5:.5 F#5:.5 E5:.5 D#5:.5 E5:.5 B4:.5 C5:.5 A4:.5 F#5:.5 E5:.5 D#5:.5 C5:.5 B4:.5 A4:.5 G4:.5 F#4:.5 E4:2'],
    ['list','圣诞愿望清单','Christmas Wish List · 原创',104,'C Am F G C Em F G Am F G C','G4:1.5 C5:.5 E5 G5 E5 D5 C5:2 A4:1.5 C5:.5 E5 A5 G5 E5 D5:2 A4:1.5 C5:.5 F5 A5 G5 E5 F5:2 G4:1.5 B4:.5 D5 G5 E5 D5 G5:2 E5:1.5 G5:.5 C6 B5 A5 G5 E5:2 D5:1.5 E5:.5 G5 B5 A5 G5 D5:2 C5:1.5 F5:.5 A5 G5 E5 F5 D5:2 G4 B4 D5 E5 G5 D5 C5:4']
  ];
  const pitches={C:0,D:2,E:4,F:5,G:7,A:9,B:11};
  function note(token){
    const m=/^([A-G])([#b]?)(\d)(?::([\d.]+))?$/.exec(token);
    return [(Number(m[3])+1)*12+pitches[m[1]]+(m[2]==='#'?1:m[2]==='b'?-1:0),Number(m[4]||1)];
  }
  const baseTracks=library.map(([id,cn,en,bpm,chords,score])=>({id,cn,en,bpm,chords:chords.split(' '),notes:score.split(' ').map(note)}));
  function init(state,save,notify){
    const $=id=>document.getElementById(id);
    const tracks=baseTracks.slice(), select=$('track-select'), gain=$('volume'), audioEl=new Audio();
    const active=new Set();
    let ctx,master,timer,start=0,offset=0,playing=false,rev=0,sequence=[],duration=0;
    const current=()=>tracks.find(x=>x.id===state.track)||tracks[0];
    function options(){
      select.replaceChildren(...tracks.map(track=>new Option(track.cn+'  ·  '+track.en,track.id)));
      select.value=current().id;
    }
    function update(){
      const t=current();
      select.value=t.id;
      $('track-title').textContent=t.cn;
      $('track-meta').textContent=t.en;
      $('music-count').textContent=tracks.length+' 首';
      document.body.classList.toggle('playing',playing);
      document.querySelectorAll('[data-play]').forEach(b=>{
        b.setAttribute('aria-pressed',String(playing));
        b.setAttribute('aria-label',playing?'暂停音乐':'播放音乐');
        b.title=playing?'暂停音乐':'播放音乐';
        b.querySelector('span').textContent=playing?'❚❚':'▶';
      });
    }
    function bell(midi,at,len,vol,bright=true){
      const g=ctx.createGain();
      g.connect(master);
      g.gain.setValueAtTime(.0001,at);
      g.gain.exponentialRampToValueAtTime(vol,at+.012);
      g.gain.exponentialRampToValueAtTime(.0001,at+len);
      const hz=440*2**((midi-69)/12);
      const parts=bright?[[1,.72],[2,.18],[3.01,.10]]:[[1,1]];
      let pending=parts.length;
      for(const [mul,amp] of parts){
        const o=ctx.createOscillator(),k=ctx.createGain();
        o.frequency.value=hz*mul;k.gain.value=amp;
        o.connect(k);k.connect(g);active.add(o);
        o.onended=()=>{active.delete(o);o.disconnect();k.disconnect();if(--pending===0)g.disconnect();};
        o.start(at);o.stop(at+len+.025);
      }
    }
    function silence(){
      clearTimeout(timer);
      for(const o of active)try{o.stop();}catch{}
      active.clear();
      audioEl.pause();
    }
    function score(t){
      sequence=[];let beats=0;
      const unit=60/t.bpm;
      for(const [p,d] of t.notes){sequence.push([p,beats*unit,Math.max(.22,Math.min(1.25,d*unit*1.18)),.095,true]);beats+=d;}
      for(let i=0;i<beats-1;i+=2){
        const ch=t.chords[Math.floor(i/4)%t.chords.length];
        const root=note(ch.replace(/m$/,'')+'3')[0];
        sequence.push([root,i*unit,Math.min(1.2,unit*2.8),.034,false]);
        if(i+1<beats)sequence.push([root+(ch.endsWith('m')?3:4)+12,(i+1)*unit,Math.min(.75,unit*1.6),.023,false]);
      }
      duration=beats*unit+.58;
    }
    async function play(){
      const generation=++rev,t=current();
      playing=true;update();
      try{
        if(t.url){
          if(audioEl.getAttribute('src')!==t.url)audioEl.src=t.url;
          audioEl.currentTime=offset;
          audioEl.volume=state.volume;
          await audioEl.play();
          if(generation!==rev&&!playing)audioEl.pause();
          return;
        }
        const AC=window.AudioContext||window.webkitAudioContext;
        if(!ctx){ctx=new AC();master=ctx.createGain();master.connect(ctx.destination);master.gain.value=state.volume;}
        await ctx.resume();
        if(generation!==rev)return;
        score(t);
        if(offset>=duration)offset=0;
        start=ctx.currentTime+.055-offset;
        for(const [p,at,len,vol,bright] of sequence)if(at>=offset-.001)bell(p,Math.max(ctx.currentTime+.02,start+at),len,vol,bright);
        timer=setTimeout(finished,Math.max(100,(start+duration-ctx.currentTime)*1000));
      }catch{if(generation===rev){playing=false;update();notify('这首歌没有成功播放，可以试试下一首。');}}
    }
    function pause(){
      ++rev;
      offset=current().url?audioEl.currentTime:ctx?Math.max(0,ctx.currentTime-start):0;
      if(!Number.isFinite(offset))offset=0;
      playing=false;silence();update();
    }
    function pick(id,go=playing){
      ++rev;silence();playing=false;offset=0;
      state.track=id;save();update();if(go)void play();
    }
    function step(n,go=playing){
      const idx=tracks.indexOf(current());
      pick(tracks[(idx+n+tracks.length)%tracks.length].id,go);
    }
    function finished(){if(!playing)return;if(state.loop==='one')pick(current().id,true);else step(1,true);}
    audioEl.addEventListener('ended',finished);
    select.addEventListener('change',()=>pick(select.value));
    document.querySelectorAll('[data-play]').forEach(b=>b.addEventListener('click',()=>playing?pause():void play()));
    document.querySelectorAll('[data-step]').forEach(b=>b.addEventListener('click',()=>step(Number(b.dataset.step))));
    gain.value=state.volume;
    gain.addEventListener('input',()=>{
      state.volume=Number(gain.value);
      if(master)master.gain.setTargetAtTime(state.volume,ctx.currentTime,.04);
      audioEl.volume=state.volume;save();
    });
    $('loop-mode').value=state.loop;
    $('loop-mode').addEventListener('change',()=>{state.loop=$('loop-mode').value;save();});
    $('import-songs').addEventListener('change',ev=>{
      const files=Array.from(ev.target.files||[]).filter(f=>/\.(mp3|m4a|aac|wav|ogg|flac|aiff)$/i.test(f.name)||f.type.startsWith('audio/')).slice(0,20);
      if(!files.length){notify('请选择 MP3、M4A 或 WAV 等音频文件。');return;}
      let first;
      for(const f of files){
        const id='local-'+tracks.length;
        if(!first)first=id;
        tracks.push({id,cn:f.name.replace(/\.[^.]+$/,''),en:'本次打开 · 本地歌曲',url:URL.createObjectURL(f)});
      }
      options();pick(first,playing);ev.target.value='';
    });
    options();update();
    return {cue(chord){if(playing&&ctx?.state==='running'&&!current().url)chord.forEach((p,i)=>bell(p,ctx.currentTime+.015+i*.068,.31,.033,false));}};
  }
  window.WinterMusic={init,ids:baseTracks.map(x=>x.id)};
})();
