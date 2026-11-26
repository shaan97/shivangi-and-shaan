(function(){
 const root=document.getElementById('chomu-palace-compact');
 const site=root.querySelector('.cc-site');

 root.querySelectorAll('[data-scroll-to]').forEach(link=>link.addEventListener('click',event=>{
  const target=document.getElementById(link.dataset.scrollTo);if(!target||!root.contains(target))return;
  event.preventDefault();const reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  target.scrollIntoView({block:'start',behavior:reduced?'auto':'smooth'});
 }));
 const design={darkness:.46,names:100,crop:root.getBoundingClientRect().width<=540?28:40};
 function applyDesign(){site.style.setProperty('--cc-darkness',design.darkness);site.style.setProperty('--cc-names-scale',String(design.names/100));site.style.setProperty('--cc-photo-position',design.crop+'%');}
 if(globalThis.Tweak){const tweak=new Tweak({container:site,onChange:applyDesign});tweak.addSlider(design,'darkness',{label:'Photo darkness',min:.3,max:.7,step:.01});tweak.addSlider(design,'names',{label:'Names size',min:85,max:110,step:1,unit:'%'});tweak.addSlider(design,'crop',{label:'Photo position',min:0,max:100,step:1,unit:'%'});}
})();

(function(){
 const root=document.getElementById('peacock-timeline');
 const stage=root.querySelector('.ps-stage');
 const design={motifs:true,spacing:5,ink:'#304638'};
 function apply(){stage.style.setProperty('--ps-motifs',design.motifs?'1':'0');stage.style.setProperty('--ps-space',design.spacing+'px');stage.style.setProperty('--ps-ink',design.ink);}
 if(globalThis.Tweak){const tweak=new Tweak({container:stage,onChange:apply});tweak.addToggle(design,'motifs',{label:'Peacock motifs'});tweak.addSlider(design,'spacing',{label:'Row spacing',min:3,max:9,step:1,unit:'px'});tweak.addColorPicker(design,'ink',{label:'Ink colour'});}
})();

(() => {
  const guide = document.getElementById('pink-city-guide');
  const places = JSON.parse(document.getElementById('jp-places').textContent);
  const keys = Array.from(guide.querySelectorAll('.jp-key'));
  const marks = Array.from(guide.querySelectorAll('.jp-mark'));
  const detail = guide.querySelector('.jp-detail-line');
  const description = detail.querySelector('span');
  const website = detail.querySelector('a');

  function select(id) {
    const place = places[id];
    if (!place) return;
    keys.forEach(key => key.setAttribute('aria-pressed', String(key.dataset.place === id)));
    marks.forEach(mark => mark.classList.toggle('is-selected', mark.dataset.place === id));
    detail.hidden = false;
    description.textContent = place.name + ' · ' + place.note;
    website.href = place.url;
  }

  keys.forEach(key => key.addEventListener('click', () => {
    const id = key.dataset.place;
    select(id);
    window.openai?.setWidgetState?.({modelContent: {jaipurPlace: id}})?.catch(() => {});
  }));
  select(window.openai?.widgetState?.modelContent?.jaipurPlace);
  window.addEventListener('openai:set_globals', event => {
    select(event.detail?.globals?.widgetState?.modelContent?.jaipurPlace);
  });
})();
