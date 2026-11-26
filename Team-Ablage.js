const get=id=>document.getElementById(id);
const draftKey='fw-team-draft', loadKey='fw-team-load';
const status=get('team-status');
const login=get('team-login');
const content=get('team-content');
const designForm=get('team-design');
const renderForm=get('team-rendering');
const viewer=get('team-photo');
const authorKey='fw-team-author';
function rememberAuthor(author){
  try{localStorage.setItem(authorKey,author);}catch{}
  login.elements.author.value=designForm.elements.author.value=renderForm.elements.author.value=author;
}
try{rememberAuthor(localStorage.getItem(authorKey)??'');}catch{}
const maxImageSize=4*1024*1024;
let client,user,isAdmin=false,draft,renderings=[],photoIndex=0,photoRequest=0;

function showStatus(message){status.textContent=message;}
function validDesign(value){
  return value?.format==='fw-3d-materials'&&value.version===1&&value.selections&&
    typeof value.selections==='object'&&!Array.isArray(value.selections);
}
try{draft=JSON.parse(sessionStorage.getItem(draftKey));}catch{}
if(validDesign(draft)){
  designForm.elements.title.value=draft.name??'';
  get('team-draft').textContent='Der Entwurf aus dem Konfigurator ist bereit.';
}
function bindForm(form,submit){
  form.addEventListener('submit',async event=>{
    event.preventDefault();
    const button=form.querySelector('[type="submit"]');
    button.disabled=true;
    try{await submit(new FormData(form));}
    catch(error){showStatus(error.message||'Die Aktion ist fehlgeschlagen.');}
    finally{button.disabled=false;}
  });
}
function action(label,handler){
  const button=document.createElement('button');
  button.type='button';
  button.textContent=label;
  button.addEventListener('click',async()=>{
    button.disabled=true;
    try{await handler();}
    catch(error){showStatus(error.message||'Die Aktion ist fehlgeschlagen.');}
    finally{button.disabled=false;}
  });
  return button;
}
function data(result,message){
  if(result.error)throw new Error(message);
  return result.data;
}
function imageBase64(file){
  return new Promise((resolve,reject)=>{
    const reader=new FileReader();
    reader.onload=()=>resolve(String(reader.result).split(',')[1]);
    reader.onerror=()=>reject(new Error('Das Bild konnte nicht gelesen werden.'));
    reader.readAsDataURL(file);
  });
}
async function deleteEntry(entry){
  if((!isAdmin&&entry.owner_id!==user?.id)||!confirm('«'+entry.title+'» aus der gemeinsamen Ablage löschen?'))return;
  const removed=data(await client.from('fw_entries').delete().eq('id',entry.id).select('id'),
    'Der Eintrag konnte nicht gelöscht werden.');
  if(!removed.length)throw new Error('Der Eintrag ist nicht mehr vorhanden oder gehört einem anderen Konto.');
  if(viewer.open)viewer.close();
  await refresh();
  showStatus('Eintrag gelöscht.');
}
async function showPhoto(index){
  if(!renderings.length)return;
  photoIndex=(index+renderings.length)%renderings.length;
  const entry=renderings[photoIndex],request=++photoRequest;
  const image=get('team-photo-image');
  image.removeAttribute('src');
  get('team-photo-caption').textContent=entry.title+' · '+(photoIndex+1)+' / '+renderings.length;
  get('team-photo-delete').hidden=!isAdmin&&entry.owner_id!==user?.id;
  if(!viewer.open)viewer.showModal();
  try{
    const photo=data(await client.from('fw_entries').select('mime,image_data').eq('id',entry.id).single(),
      'Das Rendering konnte nicht geladen werden.');
    if(request!==photoRequest||!viewer.open)return;
    image.src='data:'+photo.mime+';base64,'+photo.image_data;
    image.alt=entry.title;
  }catch(error){
    if(request===photoRequest&&viewer.open)get('team-photo-caption').textContent=error.message;
  }
}
function card(entry){
  const article=document.createElement('article');
  const heading=document.createElement('h3');
  heading.textContent=entry.title;
  const line=document.createElement('p');
  line.textContent=entry.author+' · '+new Intl.DateTimeFormat('de-CH').format(new Date(entry.created_at))+(entry.source?' · '+entry.source:'');
  const actions=document.createElement('div');
  actions.className='actions';
  actions.append(entry.kind==='design'?action('Im Konfigurator öffnen',async()=>{
    const {payload}=data(await client.from('fw_entries').select('payload').eq('id',entry.id).single(),
      'Der Entwurf konnte nicht geladen werden.');
    sessionStorage.setItem(loadKey,JSON.stringify(payload));
    location.href='Kueche-Wohnen-3D.html?team=laden';
  }):action('Bild öffnen',()=>showPhoto(renderings.findIndex(item=>item.id===entry.id))));
  if(isAdmin||entry.owner_id===user?.id)actions.append(action('Löschen',()=>deleteEntry(entry)));
  article.append(heading,line,actions);
  return article;
}
async function refresh(){
  isAdmin=Boolean(user&&!user.is_anonymous)&&data(await client.rpc('fw_is_admin'),'Die Admin-Rechte konnten nicht geprüft werden.');
  const canWrite=isAdmin||Boolean(user)&&data(await client.rpc('fw_team_member'),'Die Freischaltung konnte nicht geprüft werden.');
  login.hidden=canWrite;
  get('team-admin').hidden=isAdmin;
  get('team-write-forms').hidden=!canWrite;
  get('team-logout').hidden=!user||Boolean(user.is_anonymous);
  const entries=[];
  for(let offset=0;;offset+=250){
    const page=data(await client.from('fw_entries').select('id,owner_id,author,title,kind,source,created_at,design_id')
      .order('created_at',{ascending:false}).order('id').range(offset,offset+249),'Die Team-Ablage konnte nicht geladen werden.');
    entries.push(...page);
    if(page.length<250)break;
  }
  const designs=entries.filter(entry=>entry.kind==='design');
  renderings=entries.filter(entry=>entry.kind==='rendering');
  const titles=new Map(designs.map(entry=>[entry.id,entry.title]));
  get('team-design-list').replaceChildren(...designs.map(card));
  get('team-render-list').replaceChildren(...renderings.map(entry=>{
    const article=card(entry);
    if(titles.has(entry.design_id)){
      const linked=document.createElement('p');
      linked.textContent='Entwurf · '+titles.get(entry.design_id);
      article.append(linked);
    }
    return article;
  }));
  const picker=get('team-render-design'),before=picker.value;
  picker.replaceChildren(new Option('Ohne Zuordnung',''),...designs.map(entry=>new Option(entry.title,entry.id)));
  if(titles.has(before))picker.value=before;
  content.hidden=false;
  showStatus('Team-Ablage geladen.');
}
async function setUser(session){
  user=session?.user??null;
  login.hidden=Boolean(user);
  content.hidden=true;
  get('team-account').textContent=user?.email??'';
  await refresh();
}
async function initialize(){
  const config=window.fwTeamConfig;
  if(!config?.url||!config.publishableKey){
    showStatus('Die gemeinsame Ablage ist noch nicht mit einem Supabase-Projekt verbunden.');
    return;
  }
  const {createClient}=await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.119.2/+esm');
  client=createClient(config.url,config.publishableKey);
  await setUser(data(await client.auth.getSession(),'Die Anmeldung konnte nicht geprüft werden.').session);
  if(validDesign(draft)&&!get('team-write-forms').hidden&&designForm.elements.author.value)designForm.requestSubmit();
  client.auth.onAuthStateChange((_event,session)=>{
    if((session?.user?.id??null)===user?.id||(!session&&!user))return;
    setTimeout(()=>setUser(session).catch(error=>showStatus(error.message)),0);
  });
}
bindForm(login,async form=>{
  const author=String(form.get('author')).trim();
  if(!author)throw new Error('Gib deinen Namen ein.');
  const teamCode=String(form.get('teamCode')).trim();
  if(!user){
    const auth=data(await client.auth.signInAnonymously(),'Die Browsersitzung konnte nicht gestartet werden.');
    user=auth.user;
  }
  if(!data(await client.rpc('fw_join_team',{team_code:teamCode}),'Die Freischaltung ist fehlgeschlagen.')){
    throw new Error('Der Speicher-PIN ist ungültig.');
  }
  login.reset();
  rememberAuthor(author);
  await setUser(data(await client.auth.getSession(),'Die Browsersitzung konnte nicht geprüft werden.').session);
  if(validDesign(draft))designForm.requestSubmit();
});
bindForm(get('team-admin-login'),async form=>{
  const email=String(form.get('email')).trim();
  data(await client.auth.signInWithOtp({email,options:{shouldCreateUser:true,
    emailRedirectTo:new URL('Team-Ablage.html',location.href).href}}),
    'Der Anmeldelink konnte nicht gesendet werden.');
  showStatus('Prüfe deine E-Mail und öffne den Anmeldelink in einem eigenen Browserprofil, wenn du dort deine bisherige Sitzung behalten möchtest.');
});
bindForm(designForm,async form=>{
  const file=form.get('file');
  if(file.size>200000)throw new Error('Die FW-JSON-Datei ist zu gross.');
  const payload=file.size?JSON.parse(await file.text()):draft;
  if(!validDesign(payload))throw new Error('Wähle eine gültige FW-JSON-Datei oder übergib den Entwurf aus dem Konfigurator.');
  const title=String(form.get('title')).trim(),author=String(form.get('author')).trim();
  if(!title||!author)throw new Error('Gib einen Entwurfsnamen und deinen Namen ein.');
  const saved=data(await client.from('fw_entries').insert({kind:'design',title,author,payload:{...payload,name:title}}).select('id').single(),
    'Der Entwurf konnte nicht gespeichert werden.');
  sessionStorage.removeItem(draftKey);
  draft=null;
  designForm.reset();
  rememberAuthor(author);
  get('team-draft').textContent='';
  await refresh();
  get('team-render-design').value=saved.id;
  showStatus('Entwurf gespeichert.');
});
bindForm(renderForm,async form=>{
  const files=form.getAll('file');
  const title=String(form.get('title')).trim(),author=String(form.get('author')).trim();
  if(!title||!author)throw new Error('Gib einen Titel und deinen Namen ein.');
  for(const file of files){
    if(!['image/jpeg','image/png','image/webp'].includes(file.type)||!file.size||file.size>maxImageSize)
      throw new Error('Verwende JPG, PNG oder WebP bis 4 MB pro Bild.');
  }
  for(const [index,file] of files.entries()){
    const entry={kind:'rendering',title:files.length===1?title:title.slice(0,130)+' '+(index+1),author,source:form.get('source'),
      design_id:form.get('design_id')||null,mime:file.type,image_data:await imageBase64(file)};
    const result=await client.from('fw_entries').insert(entry);
    if(result.error){
      await refresh();
      throw new Error('Ein Bild konnte nicht gespeichert werden. Bereits gespeicherte Bilder stehen in der Galerie.');
    }
  }
  renderForm.elements.file.value='';
  await refresh();
  showStatus(files.length===1?'Rendering gespeichert.':'Renderings gespeichert.');
});
get('team-refresh').onclick=()=>refresh().catch(error=>showStatus(error.message));
get('team-logout').onclick=async()=>{
  try{data(await client.auth.signOut(),'Die Abmeldung ist fehlgeschlagen.');await setUser(null);}
  catch(error){showStatus(error.message);}
};
get('team-photo-prev').onclick=()=>showPhoto(photoIndex-1);
get('team-photo-next').onclick=()=>showPhoto(photoIndex+1);
get('team-photo-delete').onclick=()=>deleteEntry(renderings[photoIndex]).catch(error=>showStatus(error.message));
get('team-photo-close').onclick=()=>viewer.close();
viewer.addEventListener('keydown',event=>{
  if(event.key==='ArrowLeft'||event.key==='ArrowRight'){
    event.preventDefault();
    void showPhoto(photoIndex+(event.key==='ArrowLeft'?-1:1));
  }
});
viewer.addEventListener('close',()=>{photoRequest++;get('team-photo-image').removeAttribute('src');});
initialize().catch(error=>showStatus(error.message));
