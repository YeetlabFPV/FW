'use strict';

const sources = {
  sia: ['SIA 112 · Modell Bauplanung', 'https://shop.sia.ch/067941e9-9161-4e0f-9b98-c6a1f1d42a7d/D/DownloadAnhang'],
  sia102: ['SIA · Normenwerk mit SIA 102', 'https://cms.sia.ch/sites/default/files/2024-05/Inhaltsverzeichnis_Normenwerk.pdf'],
  crb: ['CRB · eBKP-H (SN 506 511)', 'https://www.crb.ch/de/normen-standards/baukostenplane/baukostenplan-hochbau-ebkp-h'],
  kitchen: ['HMA Interior · Küchenbau in Graubünden, Anbieter-Richtwert', 'https://hma-interior.ch/regionen/graubuenden'],
  regionalLabour: ['Elementum Group Chur · Regieansatz Ausbau 2026', 'https://elementum-group.ch/wp-content/uploads/2026/04/EG_AGB_2026-1.pdf'],
  parquetInstall: ['HORNBACH Schweiz · Verlegepreise für Parkett', 'https://cdn.hornbach.ch/cmsm/ch/de-ch/parkett.pdf'],
  parquetMaterial: ['HORNBACH Schweiz · Produktpreise für Eichenparkett', 'https://www.hornbach.ch/de/c/bodenbelaege-fliesen/parkett/S5637/'],
  bathBuild: ['Bodin Bau · Vergleichspreise für Badumbau nach Gewerk', 'https://www.bodin-bau.swiss/ratgeber/badumbau-kosten/'],
  stone: ['HMA Interior · Arbeitsplatten inkl. Standardmontage', 'https://hma-interior.ch/ratgeber/kuechenarbeitsplatte-austauschen'],
  trades: ['T&T Bischoff · Einheitspreise für Ausbauarbeiten', 'https://ttbischoff.ch/preise/'],
  labour: ['Le Bau · Schweizer Richtpreise nach Gewerk', 'https://www.lebau.ch/de/alle-preise/'],
  bath: ['suissetec · BadPlaner und Elementkalkulation Sanitär', 'https://suissetec.ch/de/digitaler-verkaufskanal-badplaner.html'],
  ikea: ['IKEA Schweiz · METOD Küchenkombinationen', 'https://www.ikea.com/ch/de/cat/metod-kuechenkombinationen-50005/'],
  appliances: ['IKEA Schweiz · Küchengeräte', 'https://www.ikea.com/ch/de/cat/elektrogeraete-fuer-metod-50382/'],
  smsOven: ['Sanigroup · Elektrogeräte, u. a. SMS-Backofen EB6L5DSP', 'https://sanigroup.ch/Marke/electrolux/'],
  smsDishwasher: ['Fust · Vollintegrierte Geschirrspüler 55 cm', 'https://www.fust.ch/kuechengeraete/kuecheneinbaugeraete/einbau-geschirrspueler-spuelmaschine/einbau-geschirrspueler-55-cm-vollintegriert/c/GS_Geschirrspueler_Einbau_CH55cm_Vollintegriert'],
  smsFridge: ['Fust · Integrierte Kühl-Gefriergeräte 55 cm', 'https://www.fust.ch/kuechengeraete/kuecheneinbaugeraete/einbaukuehlschrank/einbaukuehlschrank-55-cm/einbaukuehlschrank-mit-gefrierfach-55-cm-vollintegriert/c/KUE_Kuehlschrank_Einbau_2tuerig_CH55cm_Vollintegriert'],
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
  marquina:product('Marquina · Richtwert Naturstein',145,205),
  paint: product('Einfarbig · neuer Anstrich', 25, 60),
  blue: product('Nebelblau · schmale Fliesen', 115, 205),
  petrol: product('Petrol · glasierte Stäbchen', 135, 255),
  green: product('Waldgrün · versetzt', 130, 240),
  square: product('Blau · quadratische Fliesen', 105, 195),
  beige: product('Beige · schmale Fliesen', 115, 205),
  ivory: product('Elfenbein · glasierte Fliesen 10 × 30 cm', 115, 205),
  roseStack: product('Rosé · Hochformat', 115, 205),
  iceCube: product('Eisblau · Rauten', 130, 240),
  limestone: product('Kalksteinoptik · Feinsteinzeug', 115, 220),
  mineral: product('Mineralputz · ausserhalb der direkten Nasszone', 75, 150),
  coated: product('Bestandsplättli übermalen', 60, 120),
  retained: retain
};

const rows = [
  rate('k-demo','kitchen','Rückbau und Entsorgung Küche',1,'Pausch.',{standard:product('Küche demontieren',750,1150)},'regionalLabour'),
  rate('k-wall','kitchen','Küche öffnen und alte Türöffnung schliessen',1,'Pausch.',{
    standard:product('Nichttragende Trennwand und Türverschluss',2400,3600)
  },'regionalLabour','Ansatz für Schutz, Rückbau, Entsorgung, Verschluss der früheren Küchentür und lokale Anschlussarbeiten. Tragwerk und Schadstoffe bleiben separat. Flächenanstrich unter Malerarbeiten.'),
  rate('k-cabinets','kitchen','Küchenmöbel, Fronten, Beschläge und Montage',1,'Pausch.',{
    standard:product('Systemküche, zwei Zeilen',8000,10500),
    bespoke:product('Schreinerküche nach Mass',13500,17900)
  },'kitchen','Budgetansatz für ca. 4,3 m Plattenlänge plus Hoch- und Oberschränke. Platten, Geräte und Anschlüsse separat. Schrankbreiten und Frontaufteilung entsprechen dem Entwurf, der Ansatz enthält übliche Lieferung und Montage.'),
  rate('k-top','kitchen','Arbeitsplatte inkl. Kanten, üblichem Aufmass und Montage',4.29,'lfm',{
    current:product('Steinoptik · neuer Naturstein',700,1400),
    marquina:product('Marquina · Richtwert Naturstein',700,1100),
    quartz:product('Kunststein · Quarzkomposit',550,900),
    stoneLaminate:product('Steinoptik · Laminat',150,300),
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
    cementRust:product('Zementrauten · Rostrot',155,215),
    rhomboid:product('Rauten · Altrosa',150,260),
    cubes:product('Würfelmuster · dreifarbig',155,275),
    terracotta:product('Terracotta · quadratische Fliesen',125,235),
    retained:retain
  },'trades','Bruttofläche 3,01 × 2,47 m. Für Linoleum sind Farbe, Feinstruktur und Verlegemuster im selben Richtpreis angesetzt.'),
  rate('k-splash','kitchen','Küchenrückwand',2.5,'m²',{
    tile:product('Platten inkl. Verlegung',180,250),
    glass:product('Glas nach Mass',280,425),
    paint:product('Abwaschbarer Anstrich',40,65),
    retained:retain
  },'labour'),
  rate('k-sink','kitchen','Spüle und Küchenarmatur',1,'Set',{standard:product('Standard inkl. Lieferung',480,750),premium:product('Gehobene Ausführung',950,1450)},'ikea'),
  rate('k-water','kitchen','Wasser- und Abwasseranschluss Küche',1,'Pausch.',{short:product('Kurze neue Leitungsführung zur Halbinsel',1600,2500),standard:product('Bestehende Anschlusspunkte nutzen',850,1350),move:product('Aufwendige Leitungsführung mit Öffnen des Bodens',2800,4200)},'labour','Für den Entwurf ist eine kurze Leitungsführung angenommen. Gefälle und Leitungsweg beim Aufmass klären.'),
  rate('k-power','kitchen','Elektroanschlüsse für die Küche',1,'Pausch.',{standard:product('Geräteanschlüsse und Steckdosen',1350,2100)},'labour','Deckenbeleuchtung separat.'),
  rate('k-hob','kitchen','Kochfeld',1,'Stk.',{standard:product('Standard',350,750),premium:product('Premium',1150,2550),retained:retain},'appliances'),
  rate('k-oven','kitchen','Backofen · 55 cm SMS',1,'Stk.',{standard:product('Standard',1050,1450),premium:product('Premium',1800,3200),retained:retain},'smsOven'),
  rate('k-dishwasher','kitchen','Geschirrspüler · 55 cm SMS',1,'Stk.',{standard:product('Standard',1100,1550),premium:product('Premium',1500,2900),retained:retain},'smsDishwasher'),
  rate('k-fridge','kitchen','Kühl-Gefrierkombination · 55 cm SMS',1,'Stk.',{standard:product('Standard',1250,1650),premium:product('Premium',1600,2350),retained:retain},'smsFridge'),
  rate('k-hood','kitchen','Dunstabzug',1,'Stk.',{standard:product('Standard',300,850),premium:product('Premium',1050,2300),retained:retain},'appliances'),
  rate('b-demo','bath','Rückbau Bad und Entsorgung',1,'Pausch.',{standard:product('Sanitärobjekte sowie Beläge in den erneuerten Zonen',1250,1850),partial:product('Nur auszutauschende Objekte',550,950)},'bathBuild','Bei Überstreichen oder Teilumbau Umfang separat anpassen.'),
  rate('b-water','bath','Sanitärleitungen und Anschlüsse',1,'Pausch.',{standard:product('Anschlüsse und Fallstrang bleiben in der Nähe',2100,3100),partial:product('Anschlüsse weitgehend behalten',1050,1650),move:product('Anschlüsse über längere Strecke versetzen',3200,4600)},'bath','Für den Entwurf ist die Dusche am bisherigen Ort vorgesehen. Leitungen und Anschlüsse separat von Armaturen, Apparaten und Punktablauf bzw. Rinne.'),
  rate('b-floor','bath','Badboden ausserhalb des Duschplatzes',3.03,'m²',{
    marquina:product('Marquina · Richtwert Naturstein',155,225),
    neu:product('Neue Standardfliesen',120,225),bestand:retain,
    sand:product('Sandbeige · quadratisch',125,225),slate:product('Schiefergrau · quadratisch',130,240),
    terracotta:product('Terracotta · quadratisch',135,250),white:product('Kreideweiss · rechteckig',125,225),
    sandHerringbone:product('Sand · Fischgrät',150,260),
    charcoalCube:product('Anthrazit · Rauten',150,260),
    terrazzo:product('Heller Terrazzo · Platten',155,290),
    coated:product('Bestandsboden geeignetenfalls beschichten',85,165),
    microSand:product('Fugenlos · Sand',120,220),
    microChalk:product('Fugenlos · Kreide',120,220),
    microGreige:product('Fugenlos · Greige',120,220),
    microWarmGrey:product('Fugenlos · Warmgrau',120,220)
  },'trades','4,27 m² Bad minus rund 1,24 m² Dusche. Kleinflächenpauschalen und Untergrund prüfen. Fugenlos ist als Mikrozementoptik kalkuliert.'),
  rate('b-walls','bath','Badseitenwände',16.2,'m²',surfaces,'trades','Wandabwicklung aus dem Modell abzüglich Tür und Duschrückwand.'),
  rate('b-back','bath','Duschrückwand',3.39,'m²',{...surfaces,paint:product('Fugenlose Nassraumoberfläche',135,245)},'trades','1,42 × 2,39 m. Abdichtung separat. Plättlilack nur bei dafür freigegebenem System.'),
  rate('b-seal','bath','Verbundabdichtung direkt in der Nasszone',5,'m²',{standard:product('Mit Dichtbändern und Manschetten',65,110)},'labour'),
  rate('b-shower','bath','Bodengleiche Dusche mit Gefälle, Ablauf und Belag',1,'Pausch.',{
    standard:product('Gefälle und Standardbelag, inkl. Rinne',2200,3000),
    tray:product('Flache Duschwanne und Ablauf',1550,2350),
    seamless:product('Gefälle und fugenloser Belag, inkl. Rinne',2200,3000)
  },'labour','Zusätzlich zu Glas, Armatur und Verbundabdichtung.'),
  rate('b-glass','bath','Walk-in-Duschglas inkl. Montageteilen',1,'Stk.',{
    clear:product('Klarglas',650,1600),reeded:product('Riffelglas · ESG nach Mass',1100,2450)
  },'labour','Riffelglas als Zuschlagsschätzung für Strukturglas nach Mass.'),
  rate('b-tap','bath','Duscharmatur und Brause',1,'Set',{standard:product('Standard',350,650),premium:product('Thermostat und Regendusche',650,1700)},'bath'),
  rate('b-wc','bath','WC mit Spülkasten / Betätigungsplatte',1,'Set',{standard:product('Wand-WC, Standard',950,1450),premium:product('Gehoben',1250,2350)},'bath'),
  rate('b-basin','bath','Lavabo, Ablauf und Armatur',1,'Set',{standard:product('Keramik mit Standardarmatur',600,950),premium:product('Gehoben',900,2100)},'bath'),
  rate('b-cabinet','bath','Kleiner Waschtischunterschrank',1,'Stk.',{standard:product('Standard 60 cm',480,800),bespoke:product('Massanfertigung',950,2200)},'bath'),
  rate('b-mirror','bath','Spiegel und Badzubehör',1,'Set',{standard:product('Spiegel, Halter, Kleinmaterial',280,500),lit:product('LED-Spiegel und Zubehör',480,800)},'bath'),
  rate('b-elec','bath','Elektro im Bad',1,'Pausch.',{standard:product('Anschlüsse, Schalter und Schutz',650,950)},'labour','Deckenspots separat.'),
  rate('i-parquet','interior','Parkett ausserhalb von Küche und Bad',0,'m²',{
    cross:product('Eiche · quer verlegt',105,135),long:product('Eiche · längs verlegt',105,135),
    sand:product('Bestand schleifen und versiegeln',38,68),retained:retain
  },'parquetInstall','Nettofläche aus dem 3D-Grundriss, ohne Küche, Bad und Wandflächen. Mehrschicht-Eiche matt, ortsüblicher Verlegeaufwand, normaler Verschnitt und Standard-Sockel im Ansatz. Altbelag und aufwendiger Untergrund separat.'),
  rate('i-paint','interior','Wohnung neu streichen',150,'m²',{
    standard:product('Innenwände und geeignete Decken, zwei Anstriche',16,22),
    repair:product('Mit zusätzlichem Spachtelaufwand',26,38)
  },'trades','Editierbare Mengenannahme für Anstrichflächen ausserhalb separat kalkulierter Badflächen. Sichtbare Holzdecken belassen.'),
  rate('i-builtins','interior','Zwei raumhohe Einbauschränke',2,'Stk.',{
    none:product('Grifflos',1950,2550),wood:product('Sperrholzgriffe',2000,2650),bore:product('Griffbohrungen',2000,2700)
  },'regionalLabour','Budgetansatz pro Einbau nach Mass, inkl. üblicher Montage. Lose Schränke separat.'),
  rate('e-spots','electric','Neue LED-Spots in der Decke',6,'Stk.',{
    standard:product('Einbauspot mit Standardanschluss',155,205),premium:product('Dimmbar / höherwertig',215,285)
  },'labour','Je drei Spots in Küche und Gang. Die Menge ist editierbar. Leitungsführung, Brandschutz und geeignetes Deckensystem prüfen.'),
  rate('e-controls','electric','Treiber, Schaltung und gemeinsame Zuleitung',1,'Pausch.',{standard:product('Dimmer / Schaltung und Grundanschluss',400,650)},'labour')
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
rows.push(rate('access','extras','Erschwerte Anfahrt, Etappierung oder Materialtransport',1,'Pausch.',{
  standard:product('Budgetannahme bei erhöhtem Logistikaufwand',1200,2500)
},'regionalLabour','Optional. Aktivieren, wenn die Anfahrt, Zufahrt oder der Materialtransport nach Besichtigung zusätzlichen Aufwand verursacht. Übliche lokale Anfahrt ist in den Standardansätzen enthalten.'));
rows.push(rate('subfloor','extras','Altbelag entfernen oder Untergrund zusätzlich ausgleichen',30,'m²',{
  standard:product('Mehrarbeit bei schlechtem Untergrund',30,55)
},'parquetInstall','Optional. Menge nach Besichtigung einsetzen. Nur zusätzliche Arbeiten am Boden ausserhalb der separat kalkulierten Küche und des Bads.'));
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
state.bundles = Array.isArray(state.bundles) ? state.bundles : [];
const layoutDeviceLabels={
  'k-hob':{ceramic:'Glaskeramik · für 55-cm-SMS-Modul',bora:'BORA S Pure mit Abzug',vzug:'V-ZUG CombiCookTop I804 mit Abzug'},
  'k-hood':{wall:'Umluft-Einbauhaube im Oberschrank',island:'Hängende Umluft-Inselhaube',integrated:'Im Kochfeld enthalten'}
};
for(const row of rows){
  for(const [key,[,low,high]] of Object.entries(materialPriceGuide[row.id]??{})){
    const label=row.variants[key]?.label??layoutDeviceLabels[row.id]?.[key];
    if(label)row.variants[key]=product(label,low,high);
  }
}

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
  const cooking=cookingPriceOptions[s.cookingSetup??'integrated'];
  return {
    'k-hob':cooking?.hob,'k-hood':cooking?.hood,
    'k-top':s.worktop,'k-floor':s.floor,'b-floor':s['bath-tile'],
    'b-walls':s.sideWallFinish,'b-back':s.showerFinish,'b-glass':s.showerGlass,
    'b-shower':s['bath-tile']?.startsWith('micro')?'seamless':undefined, 'b-mirror':'lit',
    'i-parquet':s.parquet==='laengs'?'long':'cross','i-builtins':s.builtinsHandle,
    chairs:s.chairStyle==='wood'?'wood':'standard',coffee:s.coffeeStyle==='skids'?'skids':'standard'
  }[row.id];
}

function record(row){
  return state.rows[row.id]??={};
}

const scopeOptions={unknown:'Noch offen',retain:'Bestand behalten',renew:'Erneuern'};
const connectionOptions={unknown:'Noch offen',retain:'Am gleichen Ort',move:'Versetzen'};
const questions=[
  ['kitchen','Küche insgesamt',{unknown:'Noch offen',retain:'Kein Küchenumbau',renew:'Küche umbauen'}],
  ['cabinets','Küchenmöbel',{...scopeOptions,system:'Neue Systemküche',bespoke:'Schreinerküche nach Mass'}],
  ['appliances','Küchengeräte',{unknown:'Einzeln festlegen',retain:'Alle bestehenden Geräte behalten',standard:'Alle neu · Standard',premium:'Alle neu · Premium'}],
  ['top','Küchenarbeitsplatte',scopeOptions],
  ['kitchenFloor','Küchenboden',scopeOptions],
  ['kitchenWater','Wasseranschlüsse Küche',connectionOptions],
  ['bath','Bad insgesamt',{unknown:'Noch offen',retain:'Kein Badumbau',renew:'Bad umbauen'}],
  ['bathWater','Sanitäranschlüsse Bad',connectionOptions],
  ['bathFloor','Badboden ausserhalb der Dusche',{...scopeOptions,coat:'Geeigneten Bestand beschichten'}],
  ['bathWalls','Badseitenwände',{...scopeOptions,coat:'Bestandsplättli übermalen'}],
  ['fixtures','WC, Lavabo und Unterschrank',scopeOptions],
  ['bathShower','Duschplatz, Glas und Armatur',{...scopeOptions,tray:'Neue flache Duschwanne'}],
  ['looseFurniture','Lose Möbel',{unknown:'Einzeln in der Schätzung festlegen',retain:'Alle vorhandenen Möbel behalten',renew:'Möbel gemäss Modell neu anschaffen'}],
  ['parquet','Parkett',{...scopeOptions,sand:'Bestand schleifen und versiegeln'}],
  ['builtinsCount','Anzahl neue Einbauschränke'],
  ['paintScope','Zu streichende Fläche',{unknown:'Fläche manuell eingeben (optional)',all:'Alles · freie, nicht geplättelte Flächen'}],
  ['paintArea','Manuelle Malerfläche in m²'],
  ['spotCount','Anzahl neue Deckenspots']
];
const queryAnswers=()=>state.questionnaire??{};
let questionnaireEffects=new Map();
let estimateModel=null;
function calculateQuestionnaire(){
  const answers=queryAnswers();
  const effects=new Map();
  const set=(id,values)=>effects.set(id,{...effects.get(id),...values});
  const scope=(key,id,option)=>{
    if(answers[key]==='retain')set(id,{active:false});
    if(answers[key]==='renew')set(id,{active:true});
    if(answers[key]==='coat'||answers[key]==='sand')set(id,{variant:option});
  };
  scope('top','k-top');
  scope('kitchenFloor','k-floor');
  scope('bathWalls','b-walls','coated');
  scope('bathFloor','b-floor','coated');
  scope('parquet','i-parquet','sand');
  if(answers.bathFloor==='renew'&&configuration.selections['bath-tile']==='bestand')set('b-floor',{variant:'neu'});
  if(answers.cabinets==='retain')for(const id of ['k-cabinets','k-demo'])set(id,{active:false});
  if(['system','bespoke'].includes(answers.cabinets))
    set('k-cabinets',{variant:answers.cabinets==='system'?'standard':'bespoke'});
  if(['retain','standard','premium'].includes(answers.appliances)){
    for(const id of ['k-hob','k-oven','k-dishwasher','k-fridge','k-hood']){
      const row=rows.find(item=>item.id===id);
      if(answers.appliances==='retain')set(id,{active:false});
      else if(!['k-hob','k-hood'].includes(id)||!modelVariant(row))set(id,{variant:answers.appliances});
    }
  }
  if(answers.kitchenWater==='retain'||answers.kitchenWater==='move')
    set('k-water',{variant:answers.kitchenWater==='move'?'move':'standard'});
  if(answers.bathWater==='retain'||answers.bathWater==='move')
    set('b-water',{variant:answers.bathWater==='retain'?'partial':'move'});
  if(answers.fixtures==='retain')for(const id of ['b-wc','b-basin','b-cabinet'])set(id,{active:false});
  if(answers.bathShower==='tray')set('b-shower',{variant:'tray'});
  if(answers.bathShower==='retain')for(const id of ['b-shower','b-glass','b-tap'])set(id,{active:false});
  for(const [name,id] of [['paintArea','i-paint'],['spotCount','e-spots'],['builtinsCount','i-builtins']]){
    if(typeof answers[name]!=='number')continue;
    set(id,{quantity:answers[name]});
    if(name==='spotCount'&&answers[name]===0)set('e-controls',{active:false});
  }
  for(const row of rows){
    if(['kitchen','bath'].includes(row.category)&&answers[row.category]==='retain')set(row.id,{active:false});
    if(row.category==='furniture'&&answers.looseFurniture==='retain')set(row.id,{active:false});
  }
  if(answers.paintScope==='all'&&estimateModel){
    const bathRow=state.rows['b-walls'];
    const manualBath=Boolean(bathRow&&Object.keys(bathRow).length);
    const includeBath=!manualBath&&!coveredBy('b-walls')&&answers.bath!=='retain'&&
      !['coat','retain'].includes(answers.bathWalls)&&modelVariant(rows.find(row=>row.id==='b-walls'))==='paint';
    set('i-paint',{quantity:paintableArea(estimateModel,includeBath),fromModel:true});
    if(includeBath)set('b-walls',{active:false});
  }
  return effects;
}
questionnaireEffects=calculateQuestionnaire();

function coveredBy(id){
  return state.bundles.find(bundle=>bundle.covers.includes(id));
}
function rowSettings(row){
  if(!row.variants)return {active:row.active, quantity:validNumber(row.quantity), unit:row.unit, low:validNumber(row.low), high:validNumber(row.high),quote:row.quote};
  const stored=record(row);
  const suggested=modelVariant(row), answer=questionnaireEffects.get(row.id);
  const quotedVariant=answer&&Object.keys(stored.prices??{}).find(id=>stored.prices[id].quote!=null);
  const variant=[stored.variant,quotedVariant,answer?.variant,suggested].find(key=>Object.hasOwn(row.variants,key))??Object.keys(row.variants)[0];
  const reference=row.variants[variant], overrides=stored.prices?.[variant];
  const defaultQuantity=row.category==='furniture'?(furnitureQuantities[row.id]??0):row.quantity;
  return {active:!coveredBy(row.id)&&(stored.active??(overrides?.quote!=null?true:answer?.active??!['heating','access','subfloor','tv','laptop'].includes(row.id))),quantity:validNumber(row.id==='i-parquet'?defaultQuantity:answer?.fromModel?answer.quantity:stored.quantity??answer?.quantity??defaultQuantity),
    unit:row.unit, variant, low:validNumber(overrides?.low??reference.low),high:validNumber(overrides?.high??reference.high),quote:overrides?.quote};
}

function amounts(row,settings=rowSettings(row)){
  const {active,quantity,low,high,quote}=settings;
  if(active&&quote!=null)return [quote,quote];
  return active?[Math.min(low,high)*quantity,Math.max(low,high)*quantity]:[0,0];
}
const plus=(a,b)=>[a[0]+b[0],a[1]+b[1]];
const factor=(pair,ratio)=>pair.map(value=>value*ratio);
const range=pair=>pair[0]===pair[1]?nf.format(pair[0]):pair.map(value=>nf.format(value)).join(' – ');
const budgetTarget=([low,high])=>low===high?low:Math.round((low+high)/2000)*1000;
function calculateBudget(){
  let quoteTotal=0,quoteCount=0,open=[0,0],planningBasis=[0,0];
  const gaps=[];
  for(const [id,section] of sections){
    let total=[0,0];
    for(const row of section.rows){
      const settings=rowSettings(row), values=amounts(row,settings);
      total=plus(total,values);
      if(settings.active&&settings.quote!=null){
        quoteTotal+=settings.quote;
        quoteCount++;
      }
      else open=plus(open,values);
      if(values[1]>values[0])gaps.push({row,values,width:values[1]-values[0]});
    }
    if(id!=='furniture'&&id!=='extras')planningBasis=plus(planningBasis,total);
  }
  const sum=plus([quoteTotal,quoteTotal],open);
  const planning=factor(planningBasis,validNumber(state.planning)/100);
  const reserve=factor(plus(sum,planning),validNumber(state.reserve)/100);
  return {quoteTotal,quoteCount,open,planning,reserve,grand:plus(plus(sum,planning),reserve),gaps};
}
const wholeFrancs=new Intl.NumberFormat('de-CH',{maximumFractionDigits:0});
const summaryMoney=([low,high])=> {
  const a=wholeFrancs.format(low), b=wholeFrancs.format(high);
  return (a===b?a:a+'–'+b)+' CHF';
};
function totals(){
  const {quoteTotal,quoteCount,open,planning,reserve,grand,gaps}=calculateBudget();
  for(const section of sections.values()){
    section.total.textContent=range(section.rows.map(row=>amounts(row)).reduce(plus,[0,0]))+' CHF';
    for(const row of section.rows)currentRows.get(row.id).textContent=range(amounts(row));
  }
  const quoted=$('quoted-total');
  quoted.textContent=quoteCount?summaryMoney([quoteTotal,quoteTotal]):'Noch keine';
  quoted.classList.toggle('muted',!quoteCount);
  $('open-total').textContent=summaryMoney(open);
  $('planning-total').textContent=summaryMoney(planning);
  $('reserve-total').textContent=summaryMoney(reserve);
  const roundHeadline=grand[0]!==grand[1]&&grand[1]-grand[0]>=1000;
  $('grand-total').textContent=roundHeadline?'ca. '+summaryMoney(grand.map(value=>Math.round(value/1000)*1000)):summaryMoney(grand);
  $('budget-target').textContent=summaryMoney([budgetTarget(grand),budgetTarget(grand)]);
  $('cost-gaps').replaceChildren(...gaps.sort((a,b)=>b.width-a.width).slice(0,6).map(({row,values,width})=>{
    const item=element('li'),button=element('button',row.name);
    button.type='button';
    button.append(element('small',range(values)+' CHF · Spanne '+nf.format(width)+' CHF'));
    button.onclick=()=>{
      const target=currentRows.get(row.id).closest('tr');
      target.closest('details').open=true;
      target.querySelector('td[data-label="Offerte total CHF"] input').focus();
    };
    item.append(button);
    return item;
  }));
  $('cost-gaps-empty').hidden=gaps.length>0;
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
  const checked=input('checkbox',settings.active,row.name+' einrechnen',v=>stored.active=v);
  const bundle=coveredBy(row.id);
  checked.disabled=Boolean(bundle)||Boolean(row.covers);
  label.append(checked,' ');
  if(row.variants)label.append(row.name);
  else label.append(input('text',row.name,'Bezeichnung Zusatzposition',v=>row.name=v));
  const heading=cell('',label);
  if(bundle)heading.append(element('small','In Sammelofferte «'+bundle.name+'» enthalten.'));
  if(row.covers)heading.append(element('small',row.covers.map(id=>rows.find(item=>item.id===id)?.name??id).join(' · ')));
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
    for(const [id,item] of Object.entries(row.variants)){
      const tier=materialPriceGuide[row.id]?.[id]?.[0];
      option.add(new Option(tier?item.label+'  '+'$'.repeat(tier):item.label,id));
    }
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
  const quoteInput=input('number',settings.quote,row.name+' Offerte total CHF',v=>setPrice('quote',v),!row.covers);
  if(row.covers)quoteInput.addEventListener('blur',()=>{if(quoteInput.value==='')quoteInput.value=row.quote;});
  tr.append(heading,cell('Ausführung',row.variants?option:element('span',row.covers?'Sammelofferte':'Eigene Position')),
    cell('Menge',row.covers||row.id==='i-parquet'||questionnaireEffects.get(row.id)?.fromModel?element('span',row.id==='i-parquet'&&parquetArea===null?'–':nf.format(settings.quantity)):input('number',settings.quantity,row.name+' Menge',v=>stored.quantity=v)),
    cell('Einheit',row.covers?row.unit:unit),
    cell('CHF niedrig',row.covers?'–':input('number',settings.low,row.name+' Richtpreis niedrig',v=>setPrice('low',v))),
    cell('CHF hoch',row.covers?'–':input('number',settings.high,row.name+' Richtpreis hoch',v=>setPrice('high',v))),
    cell('Offerte total CHF',quoteInput),total);
  if(!row.variants){
    const remove=element('button','Entfernen');
    remove.type='button';remove.className='remove';
    remove.onclick=()=>{
      if(row.covers){
        state.bundles=state.bundles.filter(item=>item.id!==row.id);
        questionnaireEffects=calculateQuestionnaire();
        updatePaintQuestion();
      }else state.custom=state.custom.filter(item=>item.id!==row.id);
      render();save();
    };
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
    const current=rows.filter(row=>row.category===id).concat(state.bundles.filter(offer=>offer.category===id),id==='extras'?state.custom:[]);
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
    if(id!=='extras'){
      const addOffer=element('button','Sammelofferte erfassen');
      addOffer.type='button';
      addOffer.onclick=()=>openBundleDialog(id,name);
      const actions=element('div');actions.className='actions';actions.append(addOffer);details.append(actions);
    }
    $('categories').append(details);
  }
  totals();
}

const bundleDialog=$('bundle-dialog');
const bundleForm=$('bundle-form');
let bundleCategory;
function openBundleDialog(id,name){
  bundleCategory=id;
  bundleForm.reset();
  $('bundle-heading').textContent='Sammelofferte · '+name;
  $('bundle-status').textContent='';
  $('bundle-positions').replaceChildren(...rows.filter(row=>row.category===id&&!coveredBy(row.id)).map(row=>{
    const label=element('label');
    const checkbox=element('input');
    checkbox.type='checkbox';checkbox.name='covered';checkbox.value=row.id;
    label.append(checkbox,' '+row.name);
    return label;
  }));
  bundleDialog.showModal();
}
$('bundle-cancel').onclick=()=>bundleDialog.close();
bundleForm.onsubmit=event=>{
  event.preventDefault();
  const data=new FormData(bundleForm);
  const covers=data.getAll('covered').filter(id=>!coveredBy(id));
  const name=data.get('name').trim();
  if(!covers.length||!name){
    $('bundle-status').textContent='Gib eine Bezeichnung ein und wähle die enthaltenen Positionen.';
    return;
  }
  state.bundles.push({id:'bundle-'+crypto.randomUUID(),category:bundleCategory,covers,
    name,quantity:1,unit:'Pausch.',low:0,high:0,active:true,quote:validNumber(data.get('quote'))});
  openSections.add(bundleCategory);
  bundleDialog.close();
  questionnaireEffects=calculateQuestionnaire();
  updatePaintQuestion();
  render();save();
};

const questionFields=$('questionnaire-fields');
for(const [key,label,options] of questions){
  const wrapper=element('label',label);
  const field=element(options?'select':'input');
  field.name=key;
  if(options){
    for(const [value,name] of Object.entries(options))field.add(new Option(name,value));
    field.value=queryAnswers()[key]??'unknown';
  }else{
    field.type='number';
    field.min='0';
    field.step=['spotCount','builtinsCount'].includes(key)?'1':'0.01';
    field.placeholder='Noch offen';
    field.value=queryAnswers()[key]??'';
  }
  wrapper.append(field);
  questionFields.append(wrapper);
}
const paintScope=questionFields.querySelector('[name="paintScope"]');
const manualPaint=questionFields.querySelector('[name="paintArea"]');
function updatePaintQuestion(){
  manualPaint.disabled=paintScope.value==='all';
  manualPaint.closest('label').hidden=manualPaint.disabled;
  const area=questionnaireEffects.get('i-paint');
  $('paint-model-area').hidden=paintScope.value!=='all';
  $('paint-model-area').textContent=area?.fromModel
    ?'Malerfläche aus dem Modell: '+nf.format(area.quantity)+' m²'
    :estimateModel?'Die Fläche wird mit «Antworten übernehmen» berechnet.':'Modellfläche noch nicht verfügbar.';
}
paintScope.addEventListener('change',updatePaintQuestion);
function applyQuestionnaire(message){
  questionnaireEffects=calculateQuestionnaire();
  updatePaintQuestion();
  render();
  save();
  $('questionnaire-status').textContent=message;
}
$('questionnaire-form').onsubmit=event=>{
  event.preventDefault();
  const fields=new FormData(event.currentTarget);
  state.questionnaire={};
  for(const [key,,options] of questions){
    const value=fields.get(key);
    if(value!==null&&value!==''&&value!=='unknown')state.questionnaire[key]=options?value:validNumber(value);
  }
  applyQuestionnaire('Antworten gespeichert und in der Schätzung berücksichtigt.');
};
$('questionnaire-reset').onclick=()=>{
  delete state.questionnaire;
  $('questionnaire-form').reset();
  applyQuestionnaire('Antworten zurückgesetzt. Manuelle Eingaben bleiben erhalten.');
};

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
  questionnaireEffects=calculateQuestionnaire();
  updatePaintQuestion();
  render();
  save('Auswahl und Möbelmengen übernommen. Eigene Einheitspreise bleiben gespeichert.');
};
$('export').onclick=()=>{
  const escape=v=>{
    let text=String(v);
    if(typeof v==='string'&&/^[=+@\-\t\r\n]/.test(text))text="'"+text;
    return '"'+text.replaceAll('"','""')+'"';
  };
  const csv=[['Bereich','Position','Ausführung','Aktiv','Menge','Einheit','CHF niedrig','CHF hoch','Offerte total CHF','Total niedrig','Total hoch','Enthalten in']];
  for(const [id,label] of categories){
    for(const row of sections.get(id).rows){
      const s=rowSettings(row);
      csv.push([label,row.name,row.variants?.[s.variant]?.label??'',s.active?'Ja':'Nein',s.quantity,s.unit,s.low,s.high,s.quote??'',...amounts(row),coveredBy(row.id)?.name??'']);
    }
  }
  const {quoteTotal,open,planning,reserve,grand}=calculateBudget();
  for(const [name,values] of [['Offertierte Beträge',[quoteTotal,quoteTotal]],['Offene Richtwerte',open],['Planung',planning],['Reserve',reserve],['Gesamtbudget',grand]])
    csv.push(['',name,'','','','','','','',...values.map(value=>Math.round(value*100)/100)]);
  csv.push(['','Planungswert (gerundete Mitte)','','','','','','','',budgetTarget(grand),budgetTarget(grand)]);
  const file=new Blob(['\ufeff',csv.map(row=>row.map(escape).join(';')).join('\r\n')],{type:'text/csv;charset=utf-8'});
  const url=URL.createObjectURL(file);
  const a=element('a');a.download='FW-Kostenschaetzung.csv';a.href=url;document.body.append(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
};
for(const [name,url] of Object.values(sources)){
  const li=element('li'),link=element('a',name);
  link.href=url;li.append(link);$('sources').append(li);
}
let parquetArea=null;
function planBounds(model){
  const boards=model.filter(piece=>piece.name==='Eichenparkett_Diele');
  if(!boards.length)throw Error('Grundriss unvollständig');
  return [
    Math.min(...boards.map(p=>p.x)),Math.max(...boards.map(p=>p.x+p.w)),
    Math.min(...boards.map(p=>p.y)),Math.max(...boards.map(p=>p.y+p.d))
  ];
}
function uncoveredArea([left,right,top,bottom],rectangles){
  const cutouts=rectangles
    .map(([x1,x2,y1,y2])=>[Math.max(left,x1),Math.min(right,x2),Math.max(top,y1),Math.min(bottom,y2)])
    .filter(([x1,x2,y1,y2])=>x2>x1&&y2>y1);
  const edges=[...new Set([left,right,...cutouts.flatMap(c=>c.slice(0,2))])].sort((a,b)=>a-b);
  let area=0;
  for(let i=1;i<edges.length;i++){
    const x=(edges[i-1]+edges[i])/2;
    const blocked=cutouts.filter(([x1,x2])=>x>x1&&x<x2).map(c=>c.slice(2)).sort(([a],[b])=>a-b);
    let length=0,covered=top;
    for(const [start,end] of blocked){
      length+=Math.max(0,end-Math.max(start,covered));
      covered=Math.max(covered,end);
    }
    area+=(edges[i]-edges[i-1])*(bottom-top-length);
  }
  return area;
}
const footprint=({x,y,w,d})=>[x,x+w,y,y+d];
const roundArea=area=>Math.round(area*100)/100;
function floorArea(model){
  const kitchen=model.find(piece=>piece.name==='Linoleum_Kuechenboden');
  const bath=model.find(piece=>piece.name==='Bad_Boden');
  if(!kitchen||!bath)throw Error('Grundriss unvollständig');
  return roundArea(uncoveredArea(planBounds(model),[kitchen,bath,...model.filter(piece=>piece.wall&&piece.z<=.02)].map(footprint)));
}
function paintableArea(model,includeBath){
  const [left,right,top,bottom]=planBounds(model);
  const bath=model.find(piece=>piece.name==='Bad_Boden');
  const counter=model.find(piece=>piece.name==='Wandzeile_Arbeitsplatte');
  const uppers=model.filter(piece=>/^Oberschrank_\d$/.test(piece.name));
  const walls=model.filter(piece=>piece.wall||piece.name==='Bad_geflieste_Vorwand');
  const builtIns=model.filter(piece=>/^(Einbauschrank_.*_Korpus|Unterschrank_|Oberschrank_\d|Kuehlschrank_Vollgroesse)/.test(piece.name));
  const backsplash=counter&&uppers.length
    ?[{x:counter.x,y:counter.y-.025,z:counter.z+counter.h,w:counter.w,d:.05,h:Math.min(...uppers.map(p=>p.z))-counter.z-counter.h}]
    :[];
  const hide=[...walls,...builtIns,...backsplash];
  let sum=0;
  for(const wall of walls){
    // Project each room-facing side onto a vertical plane, then remove covered rectangles.
    for(const [axis,along,size,span,min,max] of [['x','y','w','d',left,right],['y','x','d','w',top,bottom]]){
      for(const direction of [-1,1]){
        const edge=wall[axis]+(direction>0?wall[size]:0);
        const sample=edge+direction*.002;
        if(sample<min||sample>max)continue;
        if(wall.material==='Duschrueckwand')continue;
        const rangeStart=Math.max(wall[along],axis==='x'?top:left);
        const rangeEnd=Math.min(wall[along]+wall[span],axis==='x'?bottom:right);
        if(rangeEnd<=rangeStart)continue;
        const crossing=hide.filter(piece=>piece!==wall&&
          sample>piece[axis]-(piece.wall?0:.025)&&sample<piece[axis]+piece[size]+(piece.wall?0:.025));
        const covered=crossing.map(p=>[p[along],p[along]+p[span],p.z,p.z+p.h]);
        if(!includeBath&&sample>bath[axis]-.001&&sample<bath[axis]+bath[size]+.001){
          covered.push([bath[along]-.001,bath[along]+bath[span]+.001,0,wall.z+wall.h]);
        }
        sum+=uncoveredArea([rangeStart,rangeEnd,wall.z,wall.z+wall.h],covered);
      }
    }
  }
  if(configuration.selections.ceiling==='weiss'){
    const height=Math.max(...walls.map(p=>p.z+p.h));
    const roofCutouts=walls.filter(p=>p.z+p.h>=height-.01);
    if(queryAnswers().bath==='retain')roofCutouts.push(bath);
    sum+=uncoveredArea(planBounds(model),roofCutouts.map(footprint));
  }
  return roundArea(sum);
}
async function loadParquetArea(){
  const field=$('parquet-area');
  try{
    const response=await fetch('Kueche-Wohnen-3D.html');
    if(!response.ok)throw Error('Modell konnte nicht geladen werden');
    const source=await response.text();
    const modelLine=source.split('\n').find(line=>line.startsWith('const {model,materials}='));
    const {model}=JSON.parse(modelLine.slice(modelLine.indexOf('=')+1,-1));
    estimateModel=model;
    parquetArea=floorArea(model);
    rows.find(row=>row.id==='i-parquet').quantity=parquetArea;
    field.textContent=nf.format(parquetArea)+' m²';
    questionnaireEffects=calculateQuestionnaire();
    updatePaintQuestion();
    render();
  }catch{
    field.textContent='Nicht verfügbar. Parkett fehlt im Total.';
  }
}
updatePaintQuestion();
render();
loadParquetArea();
