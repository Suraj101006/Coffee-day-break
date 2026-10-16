(function(){
'use strict';
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const money=new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'});

/* coffee shrubs in the hero background */
(function(){
  let seed=7;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};
  let out='';
  for(let i=0;i<13;i++){
    const x=40+i*112+rnd()*40,y=842+rnd()*26,s=.8+rnd()*.7;
    out+=`<g transform="translate(${x} ${y}) scale(${s})">`;
    for(let k=0;k<5;k++){out+=`<ellipse cx="0" cy="-30" rx="15" ry="42" fill="${k%2?'#1F4A38':'#2A5E45'}" transform="rotate(${-60+k*30+rnd()*10})"/>`}
    for(let c=0;c<7;c++){out+=`<circle cx="${((rnd()-.5)*70).toFixed(1)}" cy="${(-10-rnd()*60).toFixed(1)}" r="${4+rnd()*2}" fill="#D13A5A"/>`}
    out+='</g>';
  }
  $('#shrubG').innerHTML=out;
})();

/* nav */
const nav=$('#nav'),links=$('#links'),burger=$('#burger');
const navLinks=$$('a[data-n]',links),sections=navLinks.map(a=>$('#'+a.dataset.n));
let menuOpen=false,lastY=window.scrollY,ticking=false;
burger.addEventListener('click',()=>{
  menuOpen=!menuOpen;links.classList.toggle('open',menuOpen);burger.setAttribute('aria-expanded',menuOpen);
  nav.classList.toggle('solid',menuOpen||window.scrollY>40);nav.classList.remove('hide');
});
links.addEventListener('click',e=>{if(e.target.closest('a')&&menuOpen)burger.click()});

/* simple parallax: hero background drifts down slower than the page */
const heroBg=$('#heroBg'),hero=$('#home');
function update(){
  ticking=false;
  const y=window.scrollY;
  nav.classList.toggle('solid',y>40||menuOpen);
  if(!menuOpen){
    if(y>lastY+6&&y>220)nav.classList.add('hide');
    else if(y<lastY-6||y<=220)nav.classList.remove('hide');
  }
  lastY=y;
  let idx=0;const mark=window.innerHeight*0.4;
  sections.forEach((s,i)=>{if(s.getBoundingClientRect().top<=mark)idx=i});
  navLinks.forEach((a,k)=>{a.classList.toggle('on',k===idx);k===idx?a.setAttribute('aria-current','true'):a.removeAttribute('aria-current')});
  if(!reduce&&y<=hero.offsetHeight){heroBg.style.setProperty('--ty',(y*0.4).toFixed(1)+'px')}
}
window.addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(update)}},{passive:true});
window.addEventListener('resize',update);

/* brew calculator */
const METHODS={
  espresso:{label:'Espresso',unit:'Shots',ml:36,max:4,ratio:{Mild:2.5,Balanced:2,Bold:1.7},grind:'Fine',temp:'93 °C',time:'25–30 s',
    note:'Water shown is the liquid yield in the cup, not the water you put in the machine.',
    steps:['Weigh the coffee into your portafilter and level it.','Tamp firmly and evenly.','Start the shot and a timer together.','Stop at the yield shown, around 25–30 seconds.']},
  pour:{label:'Pour over',unit:'Cups',ml:240,max:8,ratio:{Mild:17,Balanced:16,Bold:14},grind:'Medium',temp:'94 °C',time:'3 min',
    note:'A cup is 240 ml.',
    steps:['Rinse the filter with hot water and discard it.','Add coffee and pour twice its weight in water. Wait 40 seconds.','Pour the rest in slow circles until you hit the total.','Let it drain fully, about 3 minutes in all.']},
  french:{label:'French press',unit:'Cups',ml:240,max:8,ratio:{Mild:17,Balanced:15,Bold:12},grind:'Coarse',temp:'95 °C',time:'4 min',
    note:'A cup is 240 ml.',
    steps:['Add coffee and pour in all the water.','Stir gently and put the lid on without pressing.','Wait 4 minutes.','Press slowly and pour right away so it doesn\'t over-extract.']},
  cold:{label:'Cold brew',unit:'Servings',ml:120,max:8,ratio:{Mild:10,Balanced:8,Bold:6},grind:'Extra coarse',temp:'Cold water',time:'12–16 h',
    note:'Makes a concentrate. Dilute each serving 1:1 with water, milk or ice.',
    steps:['Combine coffee and cold water in a jar and stir.','Cover and leave in the fridge for 12 to 16 hours.','Strain through a fine filter.','Dilute 1:1 and pour over ice.']}
};
let mKey='pour',sKey='Balanced',cups=2;
const mBox=$('#methods'),sBox=$('#strength'),cupsIn=$('#cups');
Object.keys(METHODS).forEach(k=>{const b=document.createElement('button');b.type='button';b.textContent=METHODS[k].label;b.dataset.k=k;mBox.appendChild(b)});
['Mild','Balanced','Bold'].forEach(k=>{const b=document.createElement('button');b.type='button';b.textContent=k;b.dataset.k=k;sBox.appendChild(b)});
function calc(){
  const m=METHODS[mKey];
  cupsIn.max=m.max;if(cups>m.max)cups=m.max;cupsIn.value=cups;
  $('#cupsLab').textContent=m.unit;$('#cupsOut').textContent=cups;
  const water=cups*m.ml,coffee=water/m.ratio[sKey];
  $('#rWater').textContent=Math.round(water);
  $('#rCoffee').textContent=coffee<20?coffee.toFixed(1).replace('.0',''):Math.round(coffee);
  $('#rGrind').textContent=m.grind;$('#rTemp').textContent=m.temp;$('#rTime').textContent=m.time;
  $('#bnote').textContent=m.note;
  $('#lvl').style.setProperty('--lvl',(18+cups/m.max*74)+'%');
  $('#rSteps').innerHTML=m.steps.map(s=>`<li>${s}</li>`).join('');
  $$('button',mBox).forEach(b=>b.setAttribute('aria-pressed',b.dataset.k===mKey));
  $$('button',sBox).forEach(b=>b.setAttribute('aria-pressed',b.dataset.k===sKey));
}
mBox.addEventListener('click',e=>{const b=e.target.closest('button');if(b){mKey=b.dataset.k;calc()}});
sBox.addEventListener('click',e=>{const b=e.target.closest('button');if(b){sKey=b.dataset.k;calc()}});
cupsIn.addEventListener('input',()=>{cups=+cupsIn.value;calc()});
calc();

/* shop */
const bagSvg=(c,t)=>`<svg viewBox="0 0 120 150" role="img" aria-label="${t}"><path d="M22 28h76l8 106a8 8 0 0 1-8 8H22a8 8 0 0 1-8-8z" fill="${c}"/><path d="M22 28h76l1 14H21z" fill="rgba(0,0,0,.2)"/><rect x="34" y="62" width="52" height="42" fill="rgba(255,255,255,.9)"/><circle cx="60" cy="83" r="10" fill="${c}"/></svg>`;
const gearSvg=(c,t)=>`<svg viewBox="0 0 120 150" role="img" aria-label="${t}"><path d="M20 40h80l-22 54H42z" fill="${c}"/><rect x="38" y="94" width="44" height="8" fill="rgba(0,0,0,.25)"/><path d="M30 102h60v14c0 14-12 24-30 24s-30-10-30-24z" fill="#F5EEDF"/><path d="M90 108h6c8 0 12 5 11 11-1 7-8 11-17 11" fill="none" stroke="#F5EEDF" stroke-width="6"/></svg>`;
const PRODUCTS=[
  {id:'guji',name:'Guji Sunrise',kind:'beans',meta:'Ethiopia · light · peach, jasmine',price:18,c:'#D77A5C',bg:'#F8DCC4'},
  {id:'huila',name:'Huila Panela',kind:'beans',meta:'Colombia · medium · apple, cocoa',price:16,c:'#3E7A62',bg:'#D3E6D6'},
  {id:'lintong',name:'Lintong Cedar',kind:'beans',meta:'Sumatra · dark · cedar, chocolate',price:17,c:'#46508B',bg:'#D5DAF0'},
  {id:'blend',name:'Daybreak Blend',kind:'beans',meta:'House blend · medium-dark',price:15,c:'#8A4B2E',bg:'#EBD3BF'},
  {id:'cold',name:'Cold Brew Pack',kind:'beans',meta:'500 g · extra coarse grind',price:24,c:'#1F3A47',bg:'#CFE1E8'},
  {id:'dripper',name:'Ceramic Dripper Set',kind:'gear',meta:'Dripper, server and 40 filters',price:38,c:'#B8284A',bg:'#F5D3DB'}
];
let filter='all';
const grid=$('#products'),filters=$('#filters');
[['all','All'],['beans','Beans'],['gear','Gear']].forEach(([k,l])=>{const b=document.createElement('button');b.type='button';b.dataset.k=k;b.textContent=l;filters.appendChild(b)});
function renderProducts(){
  $$('button',filters).forEach(b=>b.setAttribute('aria-pressed',b.dataset.k===filter));
  grid.innerHTML=PRODUCTS.filter(p=>filter==='all'||p.kind===filter).map(p=>`
    <article class="prod">
      <div class="p-art" style="background:${p.bg}">${p.kind==='gear'?gearSvg(p.c,p.name):bagSvg(p.c,p.name+' bag')}</div>
      <h3>${p.name}</h3><p class="meta">${p.meta}</p>
      <div class="p-foot"><span class="price">${money.format(p.price)}</span><button class="add" data-id="${p.id}">Add to cart</button></div>
    </article>`).join('');
}
filters.addEventListener('click',e=>{const b=e.target.closest('button');if(b){filter=b.dataset.k;renderProducts()}});
renderProducts();

/* cart */
let cart={};
try{const s=localStorage.getItem('daybreak-cart');if(s){const o=JSON.parse(s);if(o&&typeof o==='object')cart=o}}catch(e){}
Object.keys(cart).forEach(k=>{if(!PRODUCTS.find(p=>p.id===k)||!(cart[k]>0))delete cart[k]});
const drawer=$('#drawer'),scrim=$('#scrim'),dList=$('#dList'),badge=$('#badge');
let lastFocus=null;
function save(){try{localStorage.setItem('daybreak-cart',JSON.stringify(cart))}catch(e){}}
function renderCart(){
  const items=Object.keys(cart).map(id=>({p:PRODUCTS.find(x=>x.id===id),q:cart[id]}));
  const count=items.reduce((a,i)=>a+i.q,0),sum=items.reduce((a,i)=>a+i.q*i.p.price,0);
  badge.textContent=count;
  dList.innerHTML=items.length?items.map(({p,q})=>`
    <li class="d-item"><div class="th" style="background:${p.bg}">${p.kind==='gear'?gearSvg(p.c,''):bagSvg(p.c,'')}</div>
      <div><b>${p.name}</b><div class="qty"><button data-a="dec" data-id="${p.id}" aria-label="Remove one ${p.name}">−</button><span>${q}</span><button data-a="inc" data-id="${p.id}" aria-label="Add one ${p.name}">+</button></div></div>
      <span class="price">${money.format(p.price*q)}</span></li>`).join(''):'<li class="empty">Your cart is empty. Add a bag to get started.</li>';
  $('#dSum').textContent=money.format(sum);
  $('#checkout').disabled=!items.length;
}
function openCart(){lastFocus=document.activeElement;drawer.inert=false;drawer.classList.add('open');scrim.classList.add('show');$('#closeCart').focus()}
function closeCart(){drawer.classList.remove('open');scrim.classList.remove('show');drawer.inert=true;if(lastFocus&&lastFocus.focus)lastFocus.focus()}
grid.addEventListener('click',e=>{
  const b=e.target.closest('.add');if(!b)return;
  cart[b.dataset.id]=(cart[b.dataset.id]||0)+1;save();renderCart();
  b.textContent='Added';b.classList.add('ok');setTimeout(()=>{b.textContent='Add to cart';b.classList.remove('ok')},1100);
});
dList.addEventListener('click',e=>{
  const b=e.target.closest('button[data-a]');if(!b)return;const id=b.dataset.id;
  cart[id]=(cart[id]||0)+(b.dataset.a==='inc'?1:-1);if(cart[id]<=0)delete cart[id];save();renderCart();
});
$('#cartBtn').addEventListener('click',openCart);
$('#closeCart').addEventListener('click',closeCart);
scrim.addEventListener('click',closeCart);
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(drawer.classList.contains('open'))closeCart();else if(menuOpen)burger.click()}});
$('#checkout').addEventListener('click',()=>{
  cart={};save();renderCart();
  dList.innerHTML='<li class="empty"><b style="font-family:var(--display);font-size:1.4rem;color:var(--fg)">Order placed</b><br>Thanks for trying the demo. Nothing was charged and nothing will ship.</li>';
});
renderCart();

/* newsletter */
$('#subForm').addEventListener('submit',e=>{
  e.preventDefault();
  const v=$('#email').value.trim(),m=$('#msg');
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)){m.textContent='Enter a valid email address, like you@example.com.';$('#email').focus();return}
  m.textContent='You\'re on the list. See you Tuesday. (Demo form: nothing was sent.)';$('#email').value='';
});

update();
})();
