const images=[...document.querySelectorAll('.gallery-item')].map((el,i)=>({src:el.querySelector('img').src,alt:el.querySelector('img').alt,label:`LIVE / ${String(i+1).padStart(2,'0')}`}));
const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
const header=$('#siteHeader'),menu=$('#menuToggle'),nav=$('#siteNav'),backTop=$('#backTop'),lightbox=$('#lightbox'),lbImg=$('#lightboxImage'),lbCount=$('#lightboxCount'),lbCaption=$('#lightboxCaption');
let current=0;
function openMenu(){const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',open);menu.innerHTML=`<i class="fa-solid fa-${open?'xmark':'bars'}"></i>`}
menu?.addEventListener('click',openMenu);
$$('.nav a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.innerHTML='<i class="fa-solid fa-bars"></i>'}));
window.addEventListener('scroll',()=>{header.classList.toggle('scrolled',scrollY>30);backTop.classList.toggle('visible',scrollY>600)});
backTop?.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));
const observer=new IntersectionObserver(entries=>entries.forEach(e=>e.isIntersecting&&e.target.classList.add('visible')),{threshold:.12});
$$('.reveal').forEach(el=>observer.observe(el));
function showImage(i){current=(i+images.length)%images.length;const item=images[current];lbImg.src=item.src;lbImg.alt=item.alt;lbCount.textContent=`${String(current+1).padStart(2,'0')} / ${String(images.length).padStart(2,'0')}`;lbCaption.textContent=item.label}
function openLightbox(i){showImage(i);lightbox.classList.add('open');lightbox.setAttribute('aria-hidden','false');document.body.classList.add('locked')}
function closeLightbox(){lightbox.classList.remove('open');lightbox.setAttribute('aria-hidden','true');document.body.classList.remove('locked')}
$$('.gallery-item').forEach(item=>item.addEventListener('click',()=>openLightbox(Number(item.dataset.index))));
$('#galleryLaunch')?.addEventListener('click',()=>openLightbox(0));
$('#lightboxClose')?.addEventListener('click',closeLightbox);$('#prevImage')?.addEventListener('click',()=>showImage(current-1));$('#nextImage')?.addEventListener('click',()=>showImage(current+1));
lightbox?.addEventListener('click',e=>{if(e.target===lightbox)closeLightbox()});
document.addEventListener('keydown',e=>{if(!lightbox.classList.contains('open'))return;if(e.key==='Escape')closeLightbox();if(e.key==='ArrowLeft')showImage(current-1);if(e.key==='ArrowRight')showImage(current+1)});
let startX=0;lightbox?.addEventListener('touchstart',e=>startX=e.changedTouches[0].screenX,{passive:true});lightbox?.addEventListener('touchend',e=>{const d=startX-e.changedTouches[0].screenX;if(Math.abs(d)>50)showImage(current+(d>0?1:-1))},{passive:true});
$('#playButton')?.addEventListener('click',e=>{e.currentTarget.innerHTML='<i class="fa-solid fa-circle-info"></i>';e.currentTarget.setAttribute('aria-label','Audio belum tersedia');setTimeout(()=>{e.currentTarget.innerHTML='<i class="fa-solid fa-play"></i>';e.currentTarget.setAttribute('aria-label','Preview player')},1400)});
$('#contactForm')?.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(e.currentTarget);const subject=encodeURIComponent(`Booking DIMENSI — ${d.get('name')}`);const body=encodeURIComponent(`Nama: ${d.get('name')}\nEmail: ${d.get('email')}\n\nPesan:\n${d.get('message')}`);window.location.href=`mailto:dimensi@unida.ac.id?subject=${subject}&body=${body}`});
$('#year').textContent=new Date().getFullYear();