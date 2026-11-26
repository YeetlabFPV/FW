import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const stage = document.querySelector('main');
const canvas = document.querySelector('canvas');
const status = document.querySelector('#status');
const lock = document.querySelector('#mouse');
const renderer = new THREE.WebGLRenderer({canvas, antialias:true});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.shadowMap.autoUpdate = false;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.03;
const scene = new THREE.Scene();
scene.background = new THREE.Color('#d8e1e4');
const camera = new THREE.PerspectiveCamera(64, 1, .035, 75);
camera.rotation.order = 'YXZ';
const starts = {
  Eingang:[4.74, .52, Math.PI/2],
  Küche:[7.83, 3.06, 1.96],
  Stube:[5.10, 5.38, .66],
  Bad:[5.75, .54, .28]
};
let heading, pitch, ready=false, needsRender=true;
const held = new Map();
let pointer = null;
const radius = .145;
let walls = [];
const light = new THREE.HemisphereLight(0xfff6e8, 0xbabacc, 1.10);
scene.add(light);
function roomLight(x,z,color,power,far){
  const lamp = new THREE.PointLight(color,power,far,2);
  lamp.position.set(x,1.96,z);
  scene.add(lamp);
}
roomLight(6.45,6.15,0xffedda,15,5);
roomLight(6.83,2.89,0xfff3e6,18,4.2);
roomLight(6.86,.76,0xfff1e1,22,3.7);
roomLight(4.66,2.56,0xfff3df,20,4.1);
roomLight(2.45,6.27,0xfff3dd,25,5);
roomLight(2.30,3.74,0xfff3dd,25,5);
const sun=new THREE.DirectionalLight(0xfff0d8,2.1);
sun.position.set(10.2,4.7,11.4);
sun.target.position.set(5.8,.2,5.1);
sun.castShadow=true;
sun.shadow.mapSize.set(1536,1536);
Object.assign(sun.shadow.camera,{left:-6,right:6,top:6,bottom:-6,near:.5,far:23});
sun.shadow.normalBias=.025;
sun.shadow.bias=-.00012;
scene.add(sun,sun.target);

function resize(){
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.65));
  renderer.setSize(stage.clientWidth, stage.clientHeight, false);
  camera.aspect=stage.clientWidth/Math.max(1,stage.clientHeight);
  camera.updateProjectionMatrix();
  needsRender=true;
}
new ResizeObserver(resize).observe(stage);
function enter(room){
  const [x,z,angle]=starts[room];
  camera.position.set(x,1.58,z);
  heading=angle;
  pitch=-.11;
  document.querySelector('#room').value=room;
  needsRender=true;
}
function canStand(x,z){
  if(x<.34||x>8.26||z<.34||z>8.66)return false;
  return !walls.some(([x1,z1,x2,z2])=>{
    const dx=x-Math.max(x1,Math.min(x,x2));
    const dz=z-Math.max(z1,Math.min(z,z2));
    return dx*dx+dz*dz<radius*radius;
  });
}
function move(dt){
  const directions=new Set(held.values());
  const f=Number(directions.has('w'))-Number(directions.has('s'));
  const r=Number(directions.has('d'))-Number(directions.has('a'));
  if(!f&&!r)return;
  const step=1.40*dt/Math.hypot(f,r);
  const dx=step*(f*Math.cos(heading)-r*Math.sin(heading));
  const dz=step*(f*Math.sin(heading)+r*Math.cos(heading));
  const {x,z}=camera.position;
  if(canStand(x+dx,z))camera.position.x+=dx;
  if(canStand(camera.position.x,z+dz))camera.position.z+=dz;
}
function look(dx,dy){
  needsRender=true;
  heading+=dx*.0031;
  pitch=Math.max(-1.31,Math.min(1.31,pitch-dy*.0031));
}
const query=new URLSearchParams(location.search);
const requested=query.get('raum');
const previousScenes=new Set(['taubenblau','rekonstruiert','flieder']);
const variant=previousScenes.has(query.get('variante'))?query.get('variante'):'taubenblau-2';
document.querySelector('#blender-render').hidden=variant!=='taubenblau-2';
const returnLink=document.querySelector('#pano-return');
let panoramaRoom=requested??'kueche';
function updateReturnLink(){
  const url=new URL(returnLink.href);
  url.searchParams.set('variante',variant);
  url.searchParams.set('room',panoramaRoom);
  returnLink.href=url.href;
}
updateReturnLink();
const roomBySlug={wohn:'Stube',essen:'Stube',kueche:'Küche',flur:'Eingang',bad:'Bad'};
enter(Object.hasOwn(roomBySlug,requested)?roomBySlug[requested]:'Küche');
resize();
let previous=0;
renderer.setAnimationLoop(time=>{
  const dt=Math.min(.032,(time-(previous||time))/1000);
  previous=time;
  if(!ready||(!needsRender&&!held.size))return;
  move(dt);
  needsRender=false;
  camera.rotation.set(pitch,-Math.PI/2-heading,0);
  renderer.render(scene,camera);
});
async function loadScene(loader){
  if(location.port==='8768'&&variant==='taubenblau-2')return loader.loadAsync('Taubenblau-2.glb');
  const paths=variant==='taubenblau-2'
    ?['aa','ab','ac','ad','ae','af','ag'].map(name=>'szene.glb.gz.'+name)
    :['varianten/'+variant+'.glb.gz'];
  const parts=await Promise.all(paths.map(async path=>{
    const response=await fetch(path);
    if(!response.ok)throw Error('Szenendatei konnte nicht geladen werden.');
    return response.arrayBuffer();
  }));
  const compressed=new Blob(parts).stream();
  const bytes=await new Response(compressed.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();
  return loader.parseAsync(bytes,new URL('./',location.href).href);
}
async function load(){
  const loader=new GLTFLoader();
  const [gltf,configuration,panorama]=await Promise.all([
    loadScene(loader),
    fetch(variant==='taubenblau-2'?'Begehung-Daten.json':'varianten/'+variant+'.json').then(response=>{
      if(!response.ok)throw Error('Grundriss konnte nicht geladen werden.');
      return response.json();
    }),
    new THREE.TextureLoader().loadAsync(location.port==='8768'?'Alpen-Ausblick.jpg':'../Alpen-Ausblick.jpg')
  ]);
  walls=configuration.wallCoordinates==='plan'?configuration.walls:configuration.walls.map(([x1,y1,x2,y2])=>[x1,-y2,x2,-y1]);
  if(configuration.reflect)gltf.scene.scale.z=-1;
  if(configuration.starts){
    for(const [slug,room] of Object.entries(roomBySlug)){
      if(slug==='essen'||!configuration.starts[slug])continue;
      starts[room].splice(0,2,...configuration.starts[slug]);
    }
    enter(Object.hasOwn(roomBySlug,requested)?roomBySlug[requested]:'Küche');
    if(requested==='essen'&&configuration.starts.essen){
      const [x,z]=configuration.starts.essen;
      camera.position.set(x,1.58,z);
    }
  }
  document.querySelector('#title').textContent='Blender-Begehung · '+configuration.name;
  document.title=document.querySelector('#title').textContent;
  gltf.scene.traverse(object=>{
    if(!object.isMesh)return;
    object.receiveShadow=true;
    object.castShadow=!object.name.startsWith('Duschglas');
    for(const material of [object.material].flat())material.side=THREE.DoubleSide;
  });
  panorama.colorSpace=THREE.SRGBColorSpace;
  panorama.mapping=THREE.EquirectangularReflectionMapping;
  scene.background=panorama;
  scene.environment=panorama;
  scene.environmentIntensity=.68;
  scene.add(gltf.scene);
  needsRender=true;
  renderer.shadowMap.needsUpdate=true;
  ready=true;
  status.textContent='';
  canvas.focus({preventScroll:true});
}
load().catch(error=>{status.textContent='Die 3D-Szene konnte nicht geladen werden.';console.error(error);});

document.querySelector('#room').onchange=event=>{
  const room=event.target.value;
  enter(room);
  panoramaRoom={Küche:'kueche',Stube:'wohn',Eingang:'flur',Bad:'bad'}[room];
  updateReturnLink();
  canvas.focus();
};
document.querySelector('#full').onclick=async()=>{
  if(document.fullscreenElement)await document.exitFullscreen();
  else await document.querySelector('#experience').requestFullscreen?.();
};
document.querySelector('#exit-full').onclick=()=>document.exitFullscreen();
document.addEventListener('fullscreenchange',()=>{
  document.querySelector('#full').textContent=document.fullscreenElement?'Vollbild verlassen':'Vollbild';
});
if(location.port==='8768'){
  for(const link of document.querySelectorAll('.project-nav a[href^="../"]')){
    link.href=new URL(link.getAttribute('href').slice(3),'https://yeetlabfpv.github.io/FW/').href;
  }
}
lock.onclick=async()=>{
  if(document.pointerLockElement===canvas){document.exitPointerLock();return;}
  try{await canvas.requestPointerLock?.();}
  catch{status.textContent='Zum Umschauen im Bild ziehen.';}
};
document.addEventListener('pointerlockchange',()=>{
  const active=document.pointerLockElement===canvas;
  lock.textContent=active?'Maus freigeben':'Maus übernehmen';
  if(active)canvas.focus();
});
if(matchMedia('(pointer:coarse)').matches)lock.hidden=true;
document.addEventListener('mousemove',event=>{
  if(document.pointerLockElement===canvas)look(event.movementX,event.movementY);
});
canvas.addEventListener('pointerdown',event=>{
  if(document.pointerLockElement||!event.isPrimary)return;
  canvas.setPointerCapture(event.pointerId);
  pointer=[event.clientX,event.clientY];
});
canvas.addEventListener('pointermove',event=>{
  if(!pointer||!event.isPrimary)return;
  look(event.clientX-pointer[0],event.clientY-pointer[1]);
  pointer=[event.clientX,event.clientY];
});
for(const type of ['pointerup','pointercancel','lostpointercapture']){
  canvas.addEventListener(type,()=>{pointer=null;});
}
document.addEventListener('keydown',event=>{
  const key=event.key.toLowerCase();
  const direction={arrowup:'w',arrowdown:'s',arrowleft:'a',arrowright:'d'}[key]??key;
  if(['w','a','s','d'].includes(direction)&&event.target.tagName!=='SELECT'){
    held.set(key,direction);
    event.preventDefault();
  }
});
document.addEventListener('keyup',event=>held.delete(event.key.toLowerCase()));
window.addEventListener('blur',()=>held.clear());
for(const button of document.querySelectorAll('[data-step]')){
  button.addEventListener('pointerdown',event=>{
    button.setPointerCapture(event.pointerId);
    held.set(event.pointerId,button.dataset.step);
  });
  for(const type of ['pointerup','pointercancel','lostpointercapture']){
    button.addEventListener(type,event=>held.delete(event.pointerId));
  }
}
