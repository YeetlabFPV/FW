'use strict';

const sources = {
  sia: ['SIA 112 · Modell Bauplanung', 'https://shop.sia.ch/067941e9-9161-4e0f-9b98-c6a1f1d42a7d/D/DownloadAnhang'],
  sia102: ['SIA · Normenwerk mit SIA 102', 'https://cms.sia.ch/sites/default/files/2024-05/Inhaltsverzeichnis_Normenwerk.pdf'],
  crb: ['CRB · eBKP-H (SN 506 511)', 'https://www.crb.ch/de/normen-standards/baukostenplane/baukostenplan-hochbau-ebkp-h'],
  kitchen: ['Steinmark · Schweizer Richtwerte für Küchenumbau', 'https://steinmark.ch/kueche-umbauen-kosten/'],
  stone: ['Le Bau · Schweizer Arbeitsplattenpreise nach Material', 'https://www.lebau.ch/de/kueche/kuechenabdeckung-materialien-und-preis/'],
  trades: ['T&T Bischoff · Einheitspreise für Ausbauarbeiten', 'https://ttbischoff.ch/preise/'],
  labour: ['Le Bau · Schweizer Richtpreise nach Gewerk', 'https://www.lebau.ch/de/alle-preise/'],
  bath: ['suissetec · BadPlaner und Elementkalkulation Sanitär', 'https://suissetec.ch/de/digitaler-verkaufskanal-badplaner.html'],
  ikea: ['IKEA Schweiz · METOD Küchenkombinationen', 'https://www.ikea.com/ch/de/cat/metod-kuechenkombinationen-50005/'],
  appliances: ['IKEA Schweiz · Küchengeräte', 'https://www.ikea.com/ch/de/cat/elektrogeraete-fuer-metod-50382/'],
  premium: ['V-ZUG Schweiz · Backofen als Premium-Preisbeispiel', 'https://www.vzug.com/ch/de/produkte/kueche/backoefen/herde/combair-v600-7uh--p2203300000'],
  armchair: ['IKEA Schweiz · DYVLINGE Drehsessel', 'https://www.ikea.com/ch/de/p/dyvlinge-drehsessel-kelinge-schwarz-00555090/'],
  home: ['IKEA Schweiz · Möbel und Wohnaccessoires', 'https://www.ikea.com/ch/de/cat/produkte-products/'],
  pax: ['IKEA Schweiz · PAX / FORSAND 100 cm', 'https://www.ikea.com/ch/de/p/pax-forsand-kleiderschrank-weiss-weiss-s79503017/'],
  bed: ['IKEA Schweiz · Bettgestell TARVA mit Lattenrost', 'https://www.ikea.com/ch/de/p/tarva-bettgestell-kiefer-luroey-s69002426/'],
  lino: ['Forbo · Marmoleum-Oberflächen', 'https://www.forbo.com/flooring/en-us/commercial-products/marmoleum/marmoleum-solid/bcl6wy'],
  energy: ['EnergieSchweiz · Kostenvergleich für den Heizungsersatz', 'https://www.energieschweiz.ch/modernisieren/heizkostenrechner/']
};

const categories = [
  ['kitchen', 'Küche'],
  ['bath', 'Bad'],
  ['interior', 'Parkett, Malerarbeiten und Einbauten'],
  ['electric', 'Elektro und Deckenbeleuchtung'],
  ['furniture', 'Lose Möbel'],
  ['extras', 'Zusatzkosten']
];

const product = (label, low, high) => ({label, low, high});
const rate = (id, category, name, quantity, unit, variants, reference, note = '') =>
  ({id, category, name, quantity, unit, variants, reference, note});
const retain = product('Bestand behalten', 0, 0);
const surfaces = {
  paint: product('Einfarbig · neuer Anstrich', 25, 60),
  blue: product('Nebelblau · schmale Fliesen', 115, 205),
  petrol: product('Petrol · glasierte Stäbchen', 135, 255),
  green: product('Waldgrün · versetzt', 130, 240),
  square: product('Blau · quadratische Fliesen', 105, 195),
  beige: product('Beige · schmale Fliesen', 115, 205),
  limestone: product('Kalksteinoptik · Feinsteinzeug', 115, 220),
  mineral: product('Mineralputz · ausserhalb der direkten Nasszone', 75, 150),
  coated: product('Bestandsplättli übermalen', 60, 120),
  retained: retain
};

const rows = [
  rate('k-demo','kitchen','Rückbau und Entsorgung Küche',1,'Pausch.',{standard:product('Küche demontieren',600,1500)},'labour'),
  rate('k-cabinets','kitchen','Küchenmöbel, Fronten, Beschläge und Montage',1,'Pausch.',{
    standard:product('Systemküche, zwei Zeilen',6400,11500),
    bespoke:product('Schreinerküche nach Mass',12500,23500)
  },'ikea','Budgetansatz für ca. 4,3 m Plattenlänge plus Hoch- und Oberschränke. Geräte, Abdeckung und Anschlüsse separat.'),
  rate('k-top','kitchen','Arbeitsplatte inkl. Kanten, üblichem Aufmass und Montage',4.29,'lfm',{
    current:product('Bisherige Steinoptik · neuer Naturstein',700,1400),
    retained:retain,
    terrazzo:product('Terrazzo · Kunststein',650,1300),
    black:product('Schwarzer Naturstein · Granit',700,1500),
    white:product('Weisser Stein · Quarzkomposit',650,1250),
    oak:product('Eichenoptik · Laminat',150,400),
    solidWood:product('Massivholz · Eiche',350,750),
    concrete:product('Betonoptik · Laminat',170,420),
    travertine:product('Travertinoptik · Keramik',750,1550),
    marble:product('Marmoroptik · Quarzkomposit',650,1350)
  },'stone','Modell: 2,29 + 2,00 m. Spezialprofile und aufwendige Ausschnitte können Mehrkosten ergeben.'),
  rate('k-floor','kitchen','Küchenboden inkl. üblicher Untergrundvorbereitung',7.43,'m²',{
    slate:product('Schiefer / Schieferoptik',135,240),
    linoleum:product('Linoleum inkl. Verkleben',100,175),
    oak:product('Eichenparkett',110,190),
    rhomboid:product('Rauten · Altrosa',150,260),
    cubes:product('Würfelmuster · dreifarbig',155,275),
    terracotta:product('Terracotta · quadratische Fliesen',125,235),
    retained:retain
  },'trades','Bruttofläche 3,01 × 2,47 m. Für Linoleum sind Farbe, Feinstruktur und Verlegemuster im selben Richtpreis angesetzt.'),
  rate('k-splash','kitchen','Küchenrückwand',2.5,'m²',{
    tile:product('Platten inkl. Verlegung',180,360),
    glass:product('Glas nach Mass',260,575),
    paint:product('Abwaschbarer Anstrich',35,75),
    retained:retain
  },'labour'),
  rate('k-sink','kitchen','Spüle und Küchenarmatur',1,'Set',{standard:product('Standard inkl. Lieferung',420,1050),premium:product('Gehobene Ausführung',900,1900)},'ikea'),
  rate('k-water','kitchen','Wasser- und Abwasseranschluss Küche',1,'Pausch.',{standard:product('Bestehende Anschlusspunkte nutzen',800,2400),move:product('Anschlüsse versetzen',2000,4600)},'labour'),
  rate('k-power','kitchen','Elektroanschlüsse für die Küche',1,'Pausch.',{standard:product('Geräteanschlüsse und Steckdosen',950,2600)},'labour','Deckenbeleuchtung separat.'),
  rate('k-hob','kitchen','Induktionskochfeld',1,'Stk.',{standard:product('Standard',350,750),premium:product('Premium',1150,2550),retained:retain},'appliances'),
  rate('k-oven','kitchen','Backofen',1,'Stk.',{standard:product('Standard',450,900),premium:product('Premium',1800,3200),retained:retain},'premium'),
  rate('k-dishwasher','kitchen','Geschirrspüler, integriert',1,'Stk.',{standard:product('Standard',550,950),premium:product('Premium',1500,2900),retained:retain},'appliances'),
  rate('k-fridge','kitchen','Kühl-Gefrierkombination, integriert',1,'Stk.',{standard:product('Standard',650,1300),premium:product('Premium',1450,3000),retained:retain},'appliances'),
  rate('k-hood','kitchen','Dunstabzug',1,'Stk.',{standard:product('Standard',300,850),premium:product('Premium',1050,2300),retained:retain},'appliances'),
  rate('b-demo','bath','Rückbau Bad und Entsorgung',1,'Pausch.',{standard:product('Alte Sanitärobjekte und Oberflächen',950,2800),partial:product('Nur auszutauschende Objekte',450,1200)},'labour','Bei Überstreichen oder Teilumbau Umfang separat anpassen.'),
  rate('b-water','bath','Sanitärleitungen und Anschlüsse',1,'Pausch.',{standard:product('Anpassungen im Bad',1750,4300),partial:product('Anschlüsse weitgehend behalten',700,1750)},'bath','Leitungen und Anschlussarbeiten, Sanitärobjekte separat.'),
  rate('b-floor','bath','Badboden ausserhalb des Duschplatzes',3.03,'m²',{
    neu:product('Neue Standardfliesen',120,225),bestand:retain,
    sand:product('Sandbeige · quadratisch',125,225),slate:product('Schiefergrau · quadratisch',130,240),
    terracotta:product('Terracotta · quadratisch',135,250),white:product('Kreideweiss · rechteckig',125,225),
    terrazzo:product('Heller Terrazzo · Platten',155,290),
    coated:product('Bestandsboden geeignetenfalls beschichten',85,165)
  },'trades','4,27 m² Bad minus rund 1,24 m² Dusche. Kleinflächenpauschalen und Untergrund prüfen.'),
  rate('b-walls','bath','Badseitenwände',16.2,'m²',surfaces,'trades','Wandabwicklung aus dem Modell abzüglich Tür und Duschrückwand.'),
  rate('b-back','bath','Duschrückwand',3.39,'m²',{...surfaces,paint:product('Fugenlose Nassraumoberfläche',135,245)},'trades','1,42 × 2,39 m. Abdichtung separat. Plättlilack nur bei dafür freigegebenem System.'),
  rate('b-seal','bath','Verbundabdichtung direkt in der Nasszone',5,'m²',{standard:product('Mit Dichtbändern und Manschetten',65,110)},'labour'),
  rate('b-shower','bath','Bodengleiche Dusche mit Gefälle, Ablauf und Belag',1,'Pausch.',{
    standard:product('Gefälle und Standardbelag, inkl. Rinne',1750,3800),
    tray:product('Flache Duschwanne und Ablauf',1250,3100)
  },'labour','Zusätzlich zu Glas, Armatur und Verbundabdichtung.'),
  rate('b-glass','bath','Walk-in-Duschglas inkl. Montageteilen',1,'Stk.',{
    clear:product('Klarglas',650,1600),reeded:product('Riffelglas · ESG nach Mass',1100,2450)
  },'labour','Riffelglas als Zuschlagsschätzung für Strukturglas nach Mass.'),
  rate('b-tap','bath','Duscharmatur und Brause',1,'Set',{standard:product('Standard',300,850),premium:product('Thermostat und Regendusche',650,1700)},'bath'),
  rate('b-wc','bath','WC mit Spülkasten / Betätigungsplatte',1,'Set',{standard:product('Wand-WC, Standard',750,1750),premium:product('Gehoben',1250,2350)},'bath'),
  rate('b-basin','bath','Lavabo, Ablauf und Armatur',1,'Set',{standard:product('Keramik mit Standardarmatur',500,1250),premium:product('Gehoben',900,2100)},'bath'),
  rate('b-cabinet','bath','Kleiner Waschtischunterschrank',1,'Stk.',{standard:product('Standard 60 cm',370,950),bespoke:product('Massanfertigung',950,2200)},'bath'),
  rate('b-mirror','bath','Spiegel und Badzubehör',1,'Set',{standard:product('Spiegel, Halter, Kleinmaterial',220,650),lit:product('LED-Spiegel und Zubehör',450,1250)},'bath'),
  rate('b-elec','bath','Elektro im Bad',1,'Pausch.',{standard:product('Anschlüsse, Schalter und Schutz',450,1200)},'labour','Deckenspots separat.'),
  rate('i-parquet','interior','Parkett ausserhalb von Küche und Bad',58.5,'m²',{
    cross:product('Eiche · quer verlegt',110,185),long:product('Eiche · längs verlegt',110,190),
    sand:product('Bestand schleifen und versiegeln',38,68),retained:retain
  },'trades','Modellansatz aus Dielenfläche abzüglich Küchen- und Badfläche. Verlegeart und Zuschnitt können den Ansatz ändern.'),
  rate('i-paint','interior','Wohnung neu streichen',150,'m²',{
    standard:product('Innenwände und geeignete Decken, zwei Anstriche',14,27),
    repair:product('Mit zusätzlichem Spachtelaufwand',24,45)
  },'trades','Editierbare Mengenannahme für Anstrichflächen ausserhalb separat kalkulierter Badflächen. Sichtbare Holzdecken belassen.'),
  rate('i-builtins','interior','Zwei raumhohe Einbauschränke',2,'Stk.',{
    none:product('Grifflos',1500,3400),wood:product('Sperrholzgriffe',1550,3550),bore:product('Griffbohrungen',1550,3600)
  },'labour','Budgetansatz pro Einbau nach Mass, inkl. üblicher Montage. Lose Schränke separat.'),
  rate('e-spots','electric','Neue LED-Spots in der Decke',8,'Stk.',{
    standard:product('Einbauspot mit Standardanschluss',130,250),premium:product('Dimmbar / höherwertig',200,370)
  },'labour','8 Spots als editierbare Annahme. Leitungsführung, Brandschutz und geeignetes Deckensystem prüfen.'),
  rate('e-controls','electric','Treiber, Schaltung und gemeinsame Zuleitung',1,'Pausch.',{standard:product('Dimmer / Schaltung und Grundanschluss',300,850)},'labour')
];

const furniture = [
  ['beds','Betten 160 × 200 cm inkl. Lattenrost und Matratze','bed',450,950],
  ['wardrobe100','Kleiderschrank 100 cm mit Griffen und Innenausstattung','pax',320,700],
  ['wardrobe200','Kleiderschrank 200 cm mit Griffen und Innenausstattung','pax',620,1400],
  ['fold','Querklappbett 140 × 200 cm','bed',1450,3400],
  ['bedside','Beistelltische','home',55,165],
  ['desk','Pult mit Gestell','home',210,625],
  ['lamp','Pultleuchte','home',40,130],
  ['laptop','Laptop, falls neu angeschafft','appliances',600,1400],
  ['coffee','Couchtisch','home',140,425],
  ['sofa','Sofa','home',650,1900],
  ['sectional','Ecksofa 282 × 152 cm','home',1150,3200],
  ['armchair','Drehsessel','armchair',249,249],
  ['table','Esstisch 140 cm','home',350,1050],
  ['chairs','Esszimmerstühle','home',80,225],
  ['tvboard','TV-Sideboard','home',210,650],
  ['tv','Fernseher, falls neu angeschafft','appliances',420,1150],
  ['rug','Wohnteppich ca. 225 × 212 cm','home',140,420],
  ['entry','Schuhablage und Hakenleiste','home',110,320]
].map(([id, name, source, low, high])=>rate(id,'furniture',name,0,'Stk.',{standard:product('Richtwert',low,high)},source,
  id==='fold'?'Planungsannahme für ein Querklappbett; produktspezifische Offerte erforderlich.':'Budgetansatz für Kauf und übliche Ausstattung.'));
furniture.find(item=>item.id==='chairs').variants={
  standard:product('Schwarze Schalenstühle',80,225),
  wood:product('Holzstühle mit Herzlehne',135,310)
};
furniture.find(item=>item.id==='coffee').variants={
  standard:product('Holzplatte mit schrägen Beinen',140,425),
  skids:product('Schwarze Platte mit Kufengestell',170,490)
};
rows.push(...furniture);
rows.push(rate('heating','extras','Alte Elektroheizung ersetzen',1,'Pausch.',
  {pending:product('Offerte nach Abklärung eintragen',0,0)},'energy','Der Platzhalter ist deaktiviert. Wärmeerzeuger und Wärmeverteilung separat prüfen.'));

const defaults = JSON.parse(document.querySelector('#estimate-defaults').textContent);
const saveKey = 'fw-kostenschaetzung-v1';
const nf = new Intl.NumberFormat('de-CH',{maximumFractionDigits:2});
const $ = id=>document.getElementById(id);
const validNumber = (value, fallback = 0) => Number.isFinite(Number(value))&&Number(value)>=0 ? Number(value) : fallback;
const read = (storage, key, fallback) => {
  try{return JSON.parse(storage.getItem(key))??fallback;}catch{return fallback;}
};
const initialState = {rows:{}, custom:[], planning:8, reserve:12};
const state = read(localStorage,saveKey,initialState);
state.rows ??= {};
state.custom = Array.isArray(state.custom) ? state.custom : [];
const currentRows = new Map();
const sections = new Map();

function modelConfiguration(){
  const snapshot=read(sessionStorage,'fw-kosten-konfiguration',{});
  const cabinetWidths=Object.fromEntries(Object.keys(defaults.wardrobeWidths).map(id=>[id,read(localStorage,'fw-raum-materialien',{})['wardrobe-'+id]??snapshot.wardrobeWidths?.[id]??defaults.wardrobeWidths[id]]));
  return {
    selections:{...defaults.selections,...Object.fromEntries(Object.entries(snapshot.selections??{}).map(([id,o])=>[id,o.value])),...read(localStorage,'fw-raum-materialien',{})},
    widths:cabinetWidths,
    furniture:read(localStorage,'fw-moebelliste-v1',snapshot.furniture??defaults.furniture)
  };
}

function inventoryQuantities(config){
  const removed=new Set(config.furniture.removed??[]);
  const items=['bed-main','bed-second','wardrobe-main','wardrobe-second','wardrobe-entry',
    'fold-entry','night-left','night-right','night-main-left','night-main-right','desk','coffee','sofa','dining','tv']
    .filter(id=>!removed.has(id));
  for(const entry of config.furniture.added??[])if(Array.isArray(entry)&&typeof entry[1]==='string')items.push(entry[1]);
  const quantity={rug:1,entry:1};
  const count=(key,amount=1)=>{quantity[key]=(quantity[key]??0)+amount;};
  for(const id of items){
    if(id.startsWith('bed-'))count('beds');
    if(id.startsWith('wardrobe-')){
      const width=id==='wardrobe-small'?'100':id==='wardrobe-large'?'200':config.widths[id.slice(9)];
      count(width==='200'?'wardrobe200':'wardrobe100');
    }
    if(id.startsWith('night-'))count('bedside');
    if(id==='fold-entry')count('fold');
    if(id==='desk'){count('desk');count('lamp');count('laptop');}
    if(['coffee','sofa','sectional','armchair'].includes(id))count(id);
    if(id==='dining'){count('table');count('chairs',4);}
    if(id==='tv'){count('tv');count('tvboard');}
  }
  return quantity;
}

let configuration=modelConfiguration();
let furnitureQuantities=inventoryQuantities(configuration);
function modelVariant(row){
  const s=configuration.selections;
  return {
    'k-top':s.worktop,'k-floor':s.floor,'b-floor':s['bath-tile'],
    'b-walls':s.sideWallFinish,'b-back':s.showerFinish,'b-glass':s.showerGlass,
    'i-parquet':s.parquet==='laengs'?'long':'cross','i-builtins':s.builtinsHandle,
    chairs:s.chairStyle==='wood'?'wood':'standard',coffee:s.coffeeStyle==='skids'?'skids':'standard'
  }[row.id];
}

function record(row){
  return state.rows[row.id]??={};
}

function rowSettings(row){
  if(!row.variants)return {active:row.active, quantity:validNumber(row.quantity), unit:row.unit, low:validNumber(row.low), high:validNumber(row.high),quote:row.quote};
  const stored=record(row);
  const suggested=modelVariant(row);
  const variant=[stored.variant,suggested].find(key=>Object.hasOwn(row.variants,key))??Object.keys(row.variants)[0];
  const reference=row.variants[variant], overrides=stored.prices?.[variant];
  const defaultQuantity=row.category==='furniture'?(furnitureQuantities[row.id]??0):row.quantity;
  return {active:stored.active??!['heating','tv','laptop'].includes(row.id),quantity:validNumber(stored.quantity??defaultQuantity),
    unit:row.unit, variant, low:validNumber(overrides?.low??reference.low),high:validNumber(overrides?.high??reference.high),quote:overrides?.quote};
}

function amounts(row){
  const {active,quantity,low,high,quote}=rowSettings(row);
  if(active&&quote!=null)return [quote,quote];
  return active?[Math.min(low,high)*quantity,Math.max(low,high)*quantity]:[0,0];
}
const plus=(a,b)=>[a[0]+b[0],a[1]+b[1]];
const factor=(pair,ratio)=>pair.map(value=>value*ratio);
const range=pair=>pair[0]===pair[1]?nf.format(pair[0]):pair.map(value=>nf.format(value)).join(' – ');
function totals(){
  let sum=[0,0],planningBasis=[0,0];
  for(const [id,section] of sections){
    const total=section.rows.map(amounts).reduce(plus,[0,0]);
    section.total.textContent=range(total)+' CHF';
    sum=plus(sum,total);
    if(id!=='furniture'&&id!=='extras')planningBasis=plus(planningBasis,total);
    for(const row of section.rows)currentRows.get(row.id).textContent=range(amounts(row));
  }
  const planning=factor(planningBasis,validNumber(state.planning)/100);
  const reserve=factor(plus(sum,planning),validNumber(state.reserve)/100);
  $('subtotal').textContent=range(sum);
  $('planning-total').textContent=range(planning);
  $('reserve-total').textContent=range(reserve);
  $('grand-total').textContent=range(plus(plus(sum,planning),reserve));
}
function save(message='Änderungen in diesem Browser gespeichert.'){
  try{localStorage.setItem(saveKey,JSON.stringify(state));$('save-status').textContent=message;}
  catch{$('save-status').textContent='Speichern ist hier nicht verfügbar. Du kannst die Schätzung als CSV exportieren.';}
}
function element(tag,text){
  const e=document.createElement(tag);
  if(text!==undefined)e.textContent=text;
  return e;
}
function input(type,value,label,change,optional=false){
  const field=element('input');
  field.type=type;
  field.setAttribute('aria-label',label);
  if(type==='checkbox')field.checked=value;
  else field.value=value??'';
  if(type==='number'){field.min='0';field.step='any';}
  field.addEventListener(type==='checkbox'?'change':'input',()=>{
    if(type==='number'&&field.value!=='')change(validNumber(field.value));
    else if(type==='number'&&optional)change(undefined);
    else if(type!=='number')change(type==='checkbox'?field.checked:field.value);
    totals();save();
  });
  return field;
}
function cell(label,content){
  const td=element('td');
  if(label)td.dataset.label=label;
  td.append(content);
  return td;
}
function makeRow(row){
  const tr=element('tr');
  const settings=rowSettings(row);
  const stored=row.variants?record(row):row;
  const label=element('label');
  label.append(input('checkbox',settings.active,row.name+' einrechnen',v=>stored.active=v),' ');
  if(row.variants)label.append(row.name);
  else label.append(input('text',row.name,'Bezeichnung Zusatzposition',v=>row.name=v));
  const heading=cell('',label);
  if(row.note)heading.append(element('small',row.note));
  if(row.reference){
    const a=element('a','Vergleichsquelle');
    a.href=sources[row.reference][1];
    const small=element('small');
    small.append(a);
    heading.append(small);
  }
  const option=element('select');
  if(row.variants){
    option.setAttribute('aria-label',row.name+' Ausführung');
    for(const [id,item] of Object.entries(row.variants))option.add(new Option(item.label,id));
    option.value=settings.variant;
    option.onchange=()=>{
      stored.variant=option.value;
      tr.replaceWith(makeRow(row));
      totals();save();
    };
  }
  const setPrice=(key,value)=>{
    if(!row.variants){row[key]=value;return;}
    stored.prices??={};
    (stored.prices[settings.variant]??={})[key]=value;
  };
  const amount=element('output');
  const total=cell('Summe CHF',amount);
  total.className='amount';
  currentRows.set(row.id,amount);
  const unit=row.variants?row.unit:input('text',row.unit,'Einheit der Zusatzposition',v=>row.unit=v);
  tr.append(heading,cell('Ausführung',row.variants?option:element('span','Eigene Position')),
    cell('Menge',input('number',settings.quantity,row.name+' Menge',v=>stored.quantity=v)),
    cell('Einheit',unit),
    cell('CHF niedrig',input('number',settings.low,row.name+' Richtpreis niedrig',v=>setPrice('low',v))),
    cell('CHF hoch',input('number',settings.high,row.name+' Richtpreis hoch',v=>setPrice('high',v))),
    cell('Offerte total CHF',input('number',settings.quote,row.name+' Offerte total CHF',v=>setPrice('quote',v),true)),total);
  if(!row.variants){
    const remove=element('button','Entfernen');
    remove.type='button';remove.className='remove';
    remove.onclick=()=>{state.custom=state.custom.filter(item=>item.id!==row.id);render();save();};
    tr.append(cell('',remove));
  }
  return tr;
}
const openSections=new Set(['kitchen','bath']);
function render(){
  sections.clear();currentRows.clear();
  $('categories').replaceChildren();
  for(const [id,name] of categories){
    const details=element('details');
    details.className='category';
    details.open=openSections.has(id);
    details.ontoggle=()=>{if(details.open)openSections.add(id);else openSections.delete(id);};
    const summary=element('summary');
    const total=element('output');
    summary.append(element('h2',name),total);details.append(summary);
    const current=rows.filter(row=>row.category===id).concat(id==='extras'?state.custom:[]);
    sections.set(id,{rows:current,total});
    const wrapper=element('div');
    wrapper.className='table-scroll';
    const table=element('table');
    table.className='estimate';
    const headings=element('tr');
    for(const heading of ['Position','Ausführung','Menge','Einheit','CHF niedrig','CHF hoch','Offerte total CHF','Summe CHF',''])headings.append(element('th',heading));
    const thead=element('thead');
    const body=element('tbody');
    thead.append(headings);
    body.append(...current.map(makeRow));
    table.append(thead,body);wrapper.append(table);details.append(wrapper);
    if(id==='extras'){
      const add=element('button','Zusatzposition hinzufügen');
      add.type='button';
      add.onclick=()=>{
        state.custom.push({id:'custom-'+crypto.randomUUID(),name:'Zusatzposition',quantity:1,unit:'Pausch.',low:0,high:0,active:true});
        render();save();
      };
      const form=element('div');form.className='actions';form.append(add);details.append(form);
    }
    $('categories').append(details);
  }
  totals();
}

for(const key of ['planning','reserve']){
  $(key).value=validNumber(state[key]);
  $(key).oninput=()=>{state[key]=validNumber($(key).value);totals();save();};
}
$('save').onclick=()=>save('Kostenschätzung gespeichert.');
$('sync').onclick=()=>{
  configuration=modelConfiguration();
  furnitureQuantities=inventoryQuantities(configuration);
  for(const row of rows){
    if(modelVariant(row))delete record(row).variant;
    if(row.category==='furniture')delete record(row).quantity;
  }
  render();
  save('Auswahl und Möbelmengen übernommen. Eigene Einheitspreise bleiben gespeichert.');
};
$('export').onclick=()=>{
  const escape=v=>{
    let text=String(v);
    if(typeof v==='string'&&/^[=+@\-\t\r\n]/.test(text))text="'"+text;
    return '"'+text.replaceAll('"','""')+'"';
  };
  const csv=[['Bereich','Position','Ausführung','Aktiv','Menge','Einheit','CHF niedrig','CHF hoch','Offerte total CHF','Total niedrig','Total hoch']];
  for(const [id,label] of categories){
    for(const row of sections.get(id).rows){
      const s=rowSettings(row);
      csv.push([label,row.name,row.variants?.[s.variant]?.label??'',s.active?'Ja':'Nein',s.quantity,s.unit,s.low,s.high,s.quote??'',...amounts(row)]);
    }
  }
  const sum=[...sections.values()].flatMap(s=>s.rows).map(amounts).reduce(plus,[0,0]);
  const basis=rows.filter(row=>!['furniture','extras'].includes(row.category)).map(amounts).reduce(plus,[0,0]);
  const planning=factor(basis,validNumber(state.planning)/100);
  const reserve=factor(plus(sum,planning),validNumber(state.reserve)/100);
  for(const [name,values] of [['Planung',planning],['Reserve',reserve],['Gesamtbudget',plus(plus(sum,planning),reserve)]])
    csv.push(['',name,'','','','','','','',...values.map(value=>Math.round(value*100)/100)]);
  const file=new Blob(['\ufeff',csv.map(row=>row.map(escape).join(';')).join('\r\n')],{type:'text/csv;charset=utf-8'});
  const url=URL.createObjectURL(file);
  const a=element('a');a.download='FW-Kostenschaetzung.csv';a.href=url;document.body.append(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
};
for(const [name,url] of Object.values(sources)){
  const li=element('li'),link=element('a',name);
  link.href=url;li.append(link);$('sources').append(li);
}
render();
