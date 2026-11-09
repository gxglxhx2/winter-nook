(() => {
  'use strict';
  const W=384,H=152,DOCK_H=82;
  
  let c;
  const rect=(x,y,w,h,k)=>{c.fillStyle=k;c.fillRect(Math.round(x),Math.round(y),w,h);};
  const poly=(points,k)=>{
    const ys=points.map(p=>p[1]);
    for(let y=Math.min(...ys);y<Math.max(...ys);y++){
      const xs=[];
      for(let i=0,j=points.length-1;i<points.length;j=i++){
        let [x1,y1]=points[j], [x2,y2]=points[i];
        if((y1<=y+.5&&y2>y+.5)||(y2<=y+.5&&y1>y+.5))xs.push(x1+(y+.5-y1)/(y2-y1)*(x2-x1));
      }
      xs.sort((a,b)=>a-b);
      for(let i=0;i+1<xs.length;i+=2)rect(Math.floor(xs[i]),y,Math.ceil(xs[i+1])-Math.floor(xs[i]),1,k);
    }
  };
  const scatter=(n,seed,fn)=>{let s=seed;const r=()=>((s=(Math.imul(s,1664525)+1013904223)>>>0)/4294967296);for(let i=0;i<n;i++)fn(r,i);};
  const line=(x,y,x2,y2,k,size=1)=>{let dx=Math.abs(x2-x),dy=-Math.abs(y2-y),sx=x<x2?1:-1,sy=y<y2?1:-1,e=dx+dy;while(true){rect(x,y,size,size,k);if(x===x2&&y===y2)break;const v=e*2;if(v>=dy){e+=dy;x+=sx;}if(v<=dx){e+=dx;y+=sy;}}};
  const star=(x,y,k)=>{rect(x-2,y,5,1,k);rect(x,y-2,1,5,k);};
  const snowBank=(x,y,w,k='#d6d5ef')=>{rect(x+3,y-1,w-7,1,k);rect(x,y,w,1,k);rect(x+2,y+1,w-4,1,k);};
  function pine(x,y,h,k,k2,snow){
    const f=h/40;
    rect(x-1,y-9,3,10,k2);
    [0,.19,.38,.57].forEach((v,i)=>{
      let yy=Math.round(y-h+v*h), wide=Math.round((6+i*3.25)*f), end=Math.round(yy+h*(.43-i*.013));
      if(wide<1)wide=1;
      poly([[x,yy],[x+wide-2,end-4],[x+wide,end-3],[x+wide-1,end],[x+2,end-1],[x-4,end+1],[x-wide,end],[x-wide+2,end-4]],k);
      if(i<3)poly([[x,yy+1],[x+2,yy+6],[x+wide-3,end-3],[x+1,end-5],[x-3,end-4]],k2);
      if(snow){
        line(x,yy+1,x-wide+2,end-3,snow);
        rect(x-wide+2,end-3,Math.max(2,Math.round(wide*.62)),1,snow);
        if(i>0)rect(x+wide-5,end-3,4,1,snow);
      }
    });
  }
  function lantern(x,y,scale=1) {
    rect(x-4,y-12,8,2,'#52334c');rect(x-3,y-10,6,7,'#58374a');rect(x-2,y-9,4,5,'#ee9b55');
    rect(x-1,y-8,2,4,'#ffe3a1');rect(x-4,y-3,8,2,'#59394c');rect(x-1,y-15,2,3,'#74475a');
    if(scale>1)rect(x-1,y-1,2,4,'#5b3d58');
  }
  function cabin(){
    // Ground, foundation and side wall.
    poly([[56,112],[133,107],[175,112],[178,116],[167,121],[72,121],[52,117]],'#b5b4d7');
    poly([[63,110],[157,109],[171,112],[168,116],[64,117]],'#8c83ae');
    rect(67,76,66,36,'#533247');
    rect(68,78,64,31,'#99604f');
    poly([[131,76],[160,77],[166,84],[166,108],[131,113]],'#654253');
    for(let y=80;y<=108;y+=4){rect(68,y,63,1,'#744450');rect(69,y+1,60,1,'#b57558');line(132,y+1,165,y-1,'#523448');}
    for(let y=79;y<109;y+=6){rect(68,y,4,3,'#b87d61');rect(128,y,4,3,'#b87d61');rect(164,y-1,3,3,'#7d5260');}
    rect(66,110,68,3,'#523851');rect(64,113,71,2,'#695272');
    // Chimney and stepped roof.
    rect(132,45,12,22,'#5f4055');rect(132,48,7,17,'#8b5360');rect(130,43,15,4,'#67425a');rect(129,42,16,2,'#eee2f5');
    for(let y=50;y<65;y+=4){rect(132,y,11,1,'#54344c');rect(y%8===2?136:139,y+1,1,3,'#55374c');}
    poly([[53,79],[91,49],[131,47],[174,77],[172,82],[126,85],[94,58],[57,85],[52,84]],'#48364f');
    poly([[55,77],[93,48],[128,76],[128,82],[94,55],[57,84]],'#765165');
    poly([[91,49],[130,48],[171,76],[128,80]],'#8f89b6');
    poly([[88,50],[95,45],[128,45],[135,47],[141,52],[151,58],[157,64],[174,76],[170,79],[157,78],[153,79],[144,78],[139,80],[126,81],[125,77],[116,68],[108,63],[102,55],[95,53],[87,59],[80,63],[75,69],[69,73],[66,78],[57,83],[51,82],[51,79],[61,71],[69,67],[75,61]],'#d7d5ef');
    poly([[95,45],[128,45],[135,47],[142,53],[141,54],[130,53],[122,51],[114,51],[109,50],[101,51],[95,50],[86,56],[79,63],[73,65],[64,74],[56,78],[53,79],[60,72],[72,64],[80,57]],'#f4e8f7');
    line(101,55,124,73,'#bcb8df');line(141,58,158,72,'#bcb8df');
    rect(133,73,7,2,'#c2bee1');rect(150,74,7,1,'#bbb5da');rect(148,77,3,2,'#bab4da');
    rect(71,75,3,5,'#b4b5d8');rect(138,79,2,4,'#a9aed2');rect(155,78,2,3,'#b5b4d9');
    // Front gable and small attic window.
    poly([[71,79],[94,58],[119,79]],'#a46754');
    for(let y=66;y<=78;y+=4){let w=(y-57);rect(94-w,y,w*2+1,1,'#7b4a4d');}
    rect(90,68,9,8,'#58384b');rect(92,69,5,5,'#ecae6b');rect(94,69,1,5,'#89555a');rect(91,74,7,1,'#f5c988');
    // Warm window, shutters and door.
    rect(74,87,21,16,'#57394e');rect(75,88,19,13,'#f0ab69');rect(76,89,17,10,'#ffcf70');
    rect(76,96,17,4,'#f5a450');rect(77,90,2,4,'#fff0ba');rect(86,90,5,1,'#fff0ba');
    rect(83,88,2,13,'#94585a');rect(75,94,19,1,'#ab695d');
    rect(72,88,2,13,'#704a55');rect(95,88,3,13,'#754a56');rect(73,101,23,2,'#c28c72');rect(74,101,6,1,'#e5cee0');
    rect(105,87,16,25,'#593647');rect(107,88,12,24,'#805053');rect(108,89,9,22,'#975c57');rect(110,89,1,21,'#a66a5d');rect(115,90,1,20,'#764751');rect(116,102,2,2,'#edb16c');
    rect(103,112,20,2,'#755572');rect(100,114,25,2,'#877498');snowBank(100,115,22);
    poly([[144,87],[155,86],[155,97],[144,99]],'#55364e');poly([[146,88],[153,87],[153,96],[146,97]],'#dc9262');line(149,88,149,96,'#9f605e');line(146,93,153,92,'#9f605e');
    // Wreath and string lights.
    rect(111,93,5,1,'#315759');rect(110,94,2,4,'#456c5c');rect(115,94,2,4,'#3b6059');rect(111,98,5,1,'#3b6059');rect(112,98,3,2,'#e47d77');rect(111,94,1,1,'#86a77d');
    line(69,84,92,85,'#56394a');line(92,85,126,83,'#56394a');
    for(let x=71,i=0;x<128;x+=6,i++){let y=x<92?85:Math.round(86-(x-92)/18);rect(x,y,2,2,['#ffc877','#ed8d8b','#acceb0'][i%3]);}
    lantern(124,101);
    snowBank(64,112,10);snowBank(123,113,12);snowBank(153,109,16);
    rect(54,108,11,5,'#644756');rect(55,107,9,2,'#9b6b63');rect(56,109,1,2,'#d19a77');rect(61,109,1,2,'#d19a77');snowBank(54,106,11,'#f4e8f7');
  }
  const base=document.createElement('canvas');base.width=W;base.height=H;
  c=base.getContext('2d');
  const shades=['#1d163d','#251946','#2d2053','#37265d','#43306c','#533975','#654382','#765488'];
  for(let i=0;i<shades.length;i++)rect(0,i*10,W,10,shades[i]);
  // Fine dither between sky bands and clusters of winter stars.
  scatter(720,517,r=>{const y=7+Math.floor(r()*72),x=Math.floor(r()*W);if(y%10>6)rect(x,y,1,1,shades[Math.min(7,Math.floor(y/10)+1)]);});
  scatter(105,412,(r,i)=>{let x=4+Math.floor(r()*376),y=4+Math.floor(r()*67);
    if((x<61&&y<27)||(x>327&&y<20))return;
    rect(x,y,1,i%8===0?2:1,['#85789f','#a496b9','#62577e','#c2acd1'][i%4]);
  });
  [[67,22],[155,14],[206,26],[239,16],[309,23],[350,31],[117,32]].forEach(([x,y],i)=>star(x,y,i%2?'#bda3ca':'#e7bdd7'));
  // Moon, pixel halo and craters.
  const moon=(r,k)=>{for(let y=-r;y<=r;y++){let w=Math.floor(Math.sqrt(r*r-y*y));rect(267-w,35+y,w*2+1,1,k);}};
  moon(23,'#3a2d55');moon(19,'#49375e');moon(16,'#594467');moon(13,'#ebc6d3');moon(11,'#f9d9d5');
  poly([[259,28],[264,26],[267,27],[266,30],[262,32],[258,32]],'#eac2ce');
  poly([[273,34],[276,33],[279,36],[276,40],[273,42],[271,41],[272,38]],'#ecc2ca');
  rect(261,41,3,2,'#efc9d0');rect(266,32,2,1,'#f3ccd0');rect(265,25,3,1,'#ffe6db');
  poly([[0,72],[17,62],[40,68],[67,51],[80,55],[97,67],[117,65],[148,76],[173,65],[193,49],[204,53],[222,61],[244,52],[253,56],[266,66],[281,62],[295,52],[321,44],[341,60],[354,55],[384,63],[384,108],[0,108]],'#4f456f');
  poly([[0,82],[18,74],[43,77],[63,69],[77,73],[95,68],[117,75],[150,79],[166,70],[185,68],[199,59],[210,61],[229,74],[250,69],[271,76],[300,67],[314,70],[330,60],[347,66],[365,66],[384,73],[384,106],[0,106]],'#61567f');
  poly([[192,50],[204,53],[213,58],[202,55],[196,56],[189,54],[179,62]],'#75688c');
  poly([[301,50],[321,44],[337,57],[324,52],[315,52],[308,55],[298,54]],'#7c6f94');
  // Forest, near snow banks and little tracks.
  scatter(102,100,(r,i)=>{let x=Math.floor(r()*W),y=82+Math.floor(r()*17),h=7+Math.floor(r()*18);pine(x,y,h,i%2?'#4c426b':'#514871','#5f527b');});
  poly([[0,100],[22,94],[50,96],[67,101],[93,102],[123,93],[151,96],[173,90],[202,92],[230,96],[251,94],[278,92],[315,99],[342,94],[361,95],[384,91],[384,152],[0,152]],'#a39bc7');
  poly([[0,109],[21,107],[45,109],[81,104],[112,107],[135,104],[167,105],[188,97],[205,96],[228,102],[255,102],[280,96],[303,102],[326,104],[348,101],[369,105],[384,102],[384,152],[0,152]],'#bab6da');
  poly([[0,128],[22,123],[48,124],[65,120],[100,122],[124,117],[158,120],[188,115],[217,118],[238,112],[264,115],[294,110],[320,114],[342,112],[363,117],[384,115],[384,152],[0,152]],'#d3d0e9');
  poly([[0,141],[26,135],[51,140],[75,131],[101,134],[128,131],[142,126],[170,127],[199,133],[231,129],[260,130],[289,122],[317,126],[339,122],[367,129],[384,126],[384,152],[0,152]],'#dddaf0');
  poly([[0,147],[24,142],[43,146],[72,143],[88,145],[111,143],[137,145],[151,143],[170,145],[207,142],[233,145],[258,143],[286,145],[310,139],[338,141],[363,137],[384,141],[384,152],[0,152]],'#e7e1f3');
  poly([[109,114],[118,114],[130,118],[147,119],[156,123],[156,127],[149,131],[147,135],[158,140],[189,148],[198,152],[173,152],[156,147],[142,142],[131,138],[130,133],[138,127],[138,124],[131,122],[120,121]],'#c3bedf');
  scatter(145,12,(r,i)=>{let x=Math.floor(r()*W),y=97+Math.floor(r()*55),w=1+Math.floor(r()*5);
    rect(x,y,w,1,y<119?(i%2?'#d1cbe6':'#a6a0c8'):(i%2?'#f0e9f6':'#c7c2e0'));});
  [[9,110,49],[24,105,35],[42,109,28],[48,100,20],[354,114,53],[374,119,63],[335,108,29],[13,128,45],[33,121,33],[365,136,50],[382,139,57]].forEach(([x,y,h],i)=>{
    snowBank(x-Math.round(h/4),y,Math.round(h/2),i<7?'#a39bc6':'#b0a9d2');
    pine(x,y,h,i<7?'#41476a':'#364864',i<7?'#55567a':'#435d76',i<7?'#a5a3cc':'#c0c5e4');
  });
  cabin();
  // Village sign and rim of snowy path.
  rect(174,108,2,14,'#64485c');rect(169,105,13,5,'#755064');rect(168,105,1,3,'#8b6270');rect(170,104,12,1,'#e6deef');
  rect(171,107,6,1,'#d9ae99');rect(178,106,1,3,'#efc5ad');
  for(let i=0;i<9;i++){let x=[164,173,182,193,204,215,226,237,248][i],y=[136,135,137,135,136,134,135,133,134][i];rect(x,y,2,1,'#aea7cf');rect(x+2,y-2,2,1,'#c0badb');}
  const flakes=[];
  scatter(90,167,(r,i)=>flakes.push([r()*W,r()*H,.7+r()*3.5,r()*7,i%11===0]));
  function gift(x,y,k='#a74d69',light='#df7d87',ribbon='#ffcc88'){
    rect(x-7,y-9,14,9,'#65405a');rect(x-6,y-8,12,7,k);rect(x-8,y-9,16,3,light);
    rect(x-1,y-9,2,9,ribbon);rect(x-3,y-12,3,2,ribbon);rect(x+1,y-12,3,2,ribbon);rect(x-2,y-10,4,2,ribbon);
    rect(x-6,y-6,1,4,light);
  }
  function snowman(x,y){
    snowBank(x-9,y,19,'#b5afd4');rect(x-7,y-10,14,9,'#edf0fa');rect(x-5,y-12,10,12,'#edf0fa');
    rect(x-5,y-18,11,8,'#f4edf8');rect(x-3,y-20,7,2,'#f4edf8');rect(x-5,y-12,11,2,'#a74668');rect(x+3,y-10,2,4,'#c45d78');
    rect(x-6,y-20,13,2,'#515275');rect(x-3,y-25,7,5,'#404665');rect(x-3,y-21,7,1,'#b85e7c');
    rect(x-2,y-16,1,1,'#43344b');rect(x+2,y-16,1,1,'#43344b');rect(x,y-14,5,1,'#ed9a61');rect(x,y-8,1,1,'#746080');rect(x,y-5,1,1,'#746080');
    line(x-7,y-8,x-11,y-14,'#825a6c');line(x+6,y-8,x+10,y-12,'#825a6c');
  }
  function tree(x,y,style,t=0,mini=false){
    const s={
      classic:['#196049','#28896a','#c3e9e4',['#ffdc72','#ff5977','#a8f5a7','#ffa778']],
      ice:['#256b98','#3d99b6','#d6f1ff',['#e5fbff','#7de8ff','#ddadff','#ffed99']],
      rose:['#863e7a','#b15d9d','#f7cbe5',['#ffe2f6','#ff819e','#ffeb93','#f5b6ff']]
    }[style];
    snowBank(x-26,y+1,52,'#b4adcf');snowBank(x-20,y+2,43,'#bfb7d7');
    rect(x-3,y-11,6,11,'#795365');rect(x-1,y-10,2,8,'#9e6e6c');
    pine(x,y-5,mini?49:53,s[0],s[1],s[2]);
    const path=[[0,-48],[5,-40],[-5,-36],[6,-31],[-7,-27],[10,-23],[-11,-20],[13,-15],[-4,-14],[4,-11],[-17,-13],[16,-12]];
    for(let i=0;i<path.length;i++){
      const [dx,dy]=path[i],k=s[3][i%4];rect(x+dx-1,y+dy,3,2,k);rect(x+dx,y+dy-1,1,1,t%2===i%2?'#fff0d4':k);
    }
    line(x-5,y-34,x+8,y-31,'#aa976b');line(x-11,y-24,x+12,y-19,'#b5a176');line(x-15,y-15,x+14,y-10,'#ad9d74');
    star(x,y-58,'#ffdc93');rect(x-1,y-59,3,3,'#ffedb5');rect(x,y-61,1,7,'#ffdf91');
    if(t%3===1){rect(x-4,y-59,1,1,'#f9c780');rect(x+4,y-57,1,1,'#f9c780');}
  }
  function lamp(x,y){
    snowBank(x-7,y,14,'#b2acd1');
    rect(x-1,y-27,2,26,'#5c526f');rect(x,y-24,1,23,'#887792');rect(x-4,y-3,8,3,'#756682');
    lantern(x,y-20,2);
  }
  function candy(x,y){
    for(let i=0;i<2;i++){let xx=x+i*10,yy=y-i*3;
      rect(xx,yy-19,3,19,'#f7dce6');rect(xx+2,yy-21,5,3,'#f7dce6');rect(xx+6,yy-19,3,5,'#f7dce6');
      for(let j=0;j<4;j++)rect(xx,yy-17+j*5,3,2,'#d84863');
      rect(xx+4,yy-21,2,3,'#ed6683');rect(xx+6,yy-16,3,2,'#ed6683');
    }
  }
  function sleigh(x,y){
    line(x-14,y,x+12,y,'#92697e');rect(x+12,y-3,2,3,'#92697e');rect(x+13,y-5,3,2,'#92697e');
    rect(x-9,y-5,2,5,'#7c4c67');rect(x+7,y-5,2,5,'#7c4c67');rect(x-13,y-10,24,6,'#a24e6a');rect(x-13,y-11,23,2,'#df808d');
    rect(x-13,y-8,24,1,'#f1ad91');rect(x-12,y-5,22,1,'#713d58');rect(x-10,y-12,15,1,'#f5e2ed');
  }
  function pet(x,y,pose='idle',t=0){
    const sleepy=pose==='sleep',up=pose==='pet'?Math.round(Math.abs(Math.sin(t*7))*2):0;
    y-=up;
    snowBank(x-16,y+1+up,33,'#b2a6cb');
    const a='#4a3045',b='#ab554b',m='#e58b5e',hi='#ffae69',cream='#ffe5ad',ear='#eb7b87';
    // Tail and body, then little hooves.
    let tail=t%2>.75?1:0;
    poly([[x+8,y-13],[x+15,y-16-tail],[x+19,y-14-tail],[x+16,y-10],[x+10,y-9]],a);
    rect(x+12,y-14-tail,5,3,b);rect(x+15,y-14-tail,3,2,cream);
    poly([[x-6,y-15],[x+6,y-17],[x+13,y-14],[x+15,y-8],[x+12,y-3],[x-6,y-3],[x-9,y-7]],a);
    poly([[x-5,y-14],[x+7,y-15],[x+12,y-13],[x+13,y-7],[x+10,y-4],[x-5,y-5],[x-7,y-8]],m);
    rect(x+6,y-13,2,2,'#f5bb8b');rect(x+10,y-11,2,1,'#f5bb8b');rect(x+6,y-8,2,1,'#f5bb8b');
    if(!sleepy){
      rect(x-6,y-6,4,6,b);rect(x+8,y-6,4,6,b);rect(x-6,y-2,4,2,a);rect(x+8,y-2,4,2,a);rect(x-1,y-5,2,4,'#92535a');
    } else{rect(x-6,y-4,18,3,b);rect(x-5,y-2,5,2,a);rect(x+7,y-2,5,2,a);}
    // Antlers, ears and big head.
    let h=sleepy?4:0;
    line(x-10,y-23+h,x-12,y-33+h,a,2);line(x-12,y-29+h,x-16,y-31+h,a,2);rect(x-16,y-34+h,2,4,a);rect(x-12,y-35+h,2,4,a);
    line(x+1,y-23+h,x+3,y-33+h,a,2);line(x+3,y-29+h,x+7,y-31+h,a,2);rect(x+7,y-34+h,2,4,a);rect(x+3,y-35+h,2,4,a);
    rect(x-12,y-33+h,1,4,'#ab7870');rect(x+4,y-33+h,1,4,'#ab7870');
    poly([[x-11,y-24+h],[x-19,y-26+h],[x-20,y-23+h],[x-16,y-18+h],[x-10,y-18+h]],a);
    poly([[x-13,y-22+h],[x-18,y-24+h],[x-17,y-21+h],[x-14,y-20+h]],ear);
    poly([[x+1,y-24+h],[x+9,y-26+h],[x+11,y-23+h],[x+7,y-18+h],[x+1,y-18+h]],a);
    poly([[x+3,y-22+h],[x+9,y-24+h],[x+8,y-21+h],[x+5,y-20+h]],ear);
    poly([[x-12,y-25+h],[x-1,y-25+h],[x+4,y-21+h],[x+5,y-15+h],[x+2,y-10+h],[x-2,y-8+h],[x-13,y-9+h],[x-17,y-13+h],[x-17,y-20+h]],a);
    poly([[x-11,y-24+h],[x-2,y-24+h],[x+2,y-21+h],[x+3,y-15+h],[x,y-11+h],[x-4,y-10+h],[x-13,y-11+h],[x-15,y-14+h],[x-15,y-20+h]],m);
    rect(x-11,y-23+h,9,3,hi);rect(x-13,y-21+h,5,2,hi);rect(x-6,y-21+h,2,2,cream);
    poly([[x-15,y-15+h],[x-12,y-17+h],[x-5,y-17+h],[x-3,y-16+h],[x+1,y-16+h],[x+1,y-12+h],[x-4,y-10+h],[x-13,y-11+h],[x-15,y-13+h]],cream);
    const blink=sleepy||pose==='pet'||t%4.2>4.04;
    if(blink){rect(x-13,y-18+h,3,1,a);rect(x-3,y-18+h,3,1,a);}
    else{rect(x-12,y-19+h,2,3,a);rect(x-3,y-19+h,2,3,a);rect(x-12,y-19+h,1,1,'#fff0d0');rect(x-3,y-19+h,1,1,'#fff0d0');}
    rect(x-15,y-15+h,3,1,'#ec9b89');rect(x,y-15+h,2,1,'#ec9b89');
    rect(x-10,y-15+h,4,2,'#be274b');rect(x-9,y-15+h,2,1,'#ff7180');rect(x-8,y-12+h,2,1,'#865262');
    // Holly scarf.
    rect(x-4,y-10+h,12,3,'#aa2449');rect(x-3,y-10+h,10,1,'#ff666b');rect(x+4,y-8+h,4,6,'#de3756');rect(x+5,y-6+h,3,1,'#f4b096');
    if(pose==='feed'){let q=1+Math.floor(t*6)%4;rect(x-11-q,y-14+h+q,2,2,'#b67458');rect(x-15-q,y-12+h+q,1,1,'#efba7d');}
  }
  function prop(id,x,y,t=0){
    if(['classic','ice','rose'].includes(id))tree(x,y,id,t,true);
    if(id==='gifts'){gift(x-8,y,'#ac2853','#ee5b77','#ffd77d');gift(x+7,y+2,'#227d69','#50ba94','#ffe084');}
    if(id==='snowman')snowman(x,y);
    if(id==='lamp')lamp(x,y);
    if(id==='candy')candy(x-7,y);
    if(id==='sleigh')sleigh(x,y);
  }
  const slots={gifts:[281,128],snowman:[332,124],lamp:[190,116],candy:[54,130],sleigh:[258,135]};
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  function scene(ctx,t,state,pose) {
    c=ctx;c.drawImage(base,0,0);
    const clock=motion.matches?0:t;
    // Chimney smoke, drifting up in little squares.
    for(let i=0;i<5;i++){
      const d=(clock*4+i*5)%25, y=40-Math.floor(d),x=137+Math.floor(d*.54+Math.sin(d*.21)*3);
      c.globalAlpha=(1-d/27)*.55;
      rect(x,y,3+Math.floor(d/8),2,'#b5a5c2');rect(x+2,y-1,3,1,'#d6bdd3');
    }
    c.globalAlpha=1;
    if(state.decor.includes('lamp'))prop('lamp',...slots.lamp);
    if(state.decor.includes('candy'))prop('candy',...slots.candy);
    if(state.tree)tree(302,120,state.tree,Math.floor(clock*2));
    if(state.decor.includes('gifts'))prop('gifts',...slots.gifts);
    if(state.decor.includes('snowman'))prop('snowman',...slots.snowman);
    if(state.decor.includes('sleigh'))prop('sleigh',...slots.sleigh);
    pet(216,128,pose,clock);
    if(pose==='pet'){
      const rise=Math.floor(clock*8)%12;
      heart(227,93-rise,'#f195a3');heart(232,89-rise,'#ffc1bd');
    }
    if(pose==='sleep'){
      let d=Math.floor(clock*5)%8;
      line(227,92-d,231,92-d,'#775f93');line(231,92-d,227,96-d,'#775f93');line(227,96-d,231,96-d,'#775f93');
    }
    // Slow, sparse foreground snowfall.
    for(let i=0;i<flakes.length;i++){
      const [a,b,v,p,big]=flakes[i];
      const x=Math.floor((a+clock*v*.55+Math.sin(clock*.44+p)*2+W)%W),y=Math.floor((b+clock*v)%H);
      const k=i%3===0?'#fcf0f8':i%3===1?'#dccfe8':'#c2b4d5';
      c.globalAlpha=y>115?.47:big?.80:.66;
      if(big&&y<117)star(x,y,k);else rect(x,y,1,1,k);
    }
    c.globalAlpha=1;
  }
  const dock=document.createElement('canvas');dock.width=W;dock.height=DOCK_H;c=dock.getContext('2d');
  // A snowy silhouette for the desktop. The desktop stays visible around the trees.
  poly([[17,68],[29,65],[51,64],[66,59],[86,57],[105,59],[131,56],[150,59],[176,58],[195,61],[218,57],[240,59],[262,55],[282,54],[305,58],[320,58],[336,62],[354,65],[365,68],[369,72],[361,76],[342,79],[313,80],[274,82],[103,82],[56,80],[32,78],[16,75],[12,72]],'#4b37664f');
  poly([[21,67],[38,62],[56,63],[70,58],[89,56],[110,58],[130,54],[146,57],[171,56],[196,59],[214,57],[237,56],[260,52],[282,53],[307,56],[323,58],[338,60],[353,65],[362,68],[363,71],[353,74],[334,76],[309,77],[266,79],[111,79],[62,77],[34,74],[21,71]],'#a39cc6');
  poly([[21,66],[43,62],[56,63],[69,58],[89,56],[109,58],[131,54],[149,57],[171,56],[195,59],[215,56],[236,56],[260,52],[280,53],[305,55],[322,57],[338,61],[353,65],[362,68],[350,70],[327,72],[302,73],[270,75],[114,75],[62,73],[38,71],[21,69]],'#ede5f7');
  scatter(54,613,r=>{let x=Math.floor(39+r()*306),y=63+Math.floor(r()*8);rect(x,y,2+Math.floor(r()*5),1,y%2?'#fff4f7':'#d9d0ee');});
  pine(59,65,35,'#176051','#329c78','#ddf2ec');
  pine(113,64,28,'#236452','#398e73','#d1eadf');
  pine(311,62,33,'#245a55','#358b6d','#d7eee9');
  pine(337,66,28,'#19564e','#2b8c6e','#d8e5ef');
  pine(140,65,19,'#377f73','#4c9b89','#e1f2f1');
  snowBank(63,68,43,'#bfb2d5');snowBank(292,70,38,'#c7b9db');
  function desktop(ctx,t,state,pose){
    c=ctx;ctx.clearRect(0,0,W,DOCK_H);ctx.drawImage(dock,0,0);
    const clock=motion.matches?0:t;
    if(state.decor.includes('candy'))prop('candy',41,72);
    if(state.decor.includes('lamp'))prop('lamp',144,72);
    tree(89,69,'classic',Math.floor(clock*2)+1,true);
    if(state.tree)tree(265,69,state.tree,Math.floor(clock*2));
    if(state.decor.includes('gifts'))prop('gifts',110,73);
    if(state.decor.includes('sleigh'))prop('sleigh',225,75);
    if(state.decor.includes('snowman'))prop('snowman',302,71);
    pet(185,74,pose,clock);
    if(pose==='pet'){
      let rise=Math.floor(clock*8)%10;heart(196,37-rise,'#ff7191');heart(201,34-rise,'#ffd1cc');
    }
    if(pose==='sleep'){
      let d=Math.floor(clock*5)%6;
      line(197,40-d,201,40-d,'#9f86c7');line(201,40-d,197,44-d,'#9f86c7');line(197,44-d,201,44-d,'#9f86c7');
    }
    for(let i=0;i<38;i++){
      const [a,b,v,p,big]=flakes[i];
      const x=Math.floor((a+clock*v*.45+Math.sin(clock*.44+p)*2+W)%W),y=Math.floor((b+clock*v)%72);
      if(x<28||x>355||y<6)continue;
      c.globalAlpha=y>60?.63:big?.94:.78;
      if(big&&y<58)star(x,y,i%2?'#ffe6b0':'#fff1fc');else rect(x,y,1,1,'#f3e9ff');
    }
    c.globalAlpha=1;
  }
  function heart(x,y,k){rect(x-2,y-2,2,2,k);rect(x+1,y-2,2,2,k);rect(x-2,y-1,5,2,k);rect(x-1,y+1,3,1,k);rect(x,y+2,1,1,k);}
  function icon(canvas,id) {
    c=canvas.getContext('2d');
    c.clearRect(0,0,canvas.width,canvas.height);
    if(id==='pet'){pet(22,39,'idle',0);return;}
    if(id==='logo'){c.save();c.scale(.52,.52);tree(32,63,'classic',1,true);c.restore();return;}
    if(['classic','ice','rose'].includes(id)){c.save();c.scale(.68,.68);tree(34,64,id,1,true);c.restore();return;}
    c.save();c.scale(1.18,1.18);prop(id,19,33);c.restore();
  }
  window.WinterArt={scene,desktop,icon,W,H,DOCK_H};
})();
