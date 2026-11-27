'use strict';

// Budgetansätze für das Projekt in Graubünden inkl. MwSt. Oberflächen mit üblicher Ausführung,
// Geräte inkl. vorgesehenem Filter/Kanalzubehör, ohne separate Anschlussarbeiten.
// Pro Option: Preisstufe, unterer und oberer Ansatz in CHF je Einheit.
const materialPriceGuide = {
  'k-top': {
    current:[3,710,920], marquina:[3,700,1100], quartz:[2,630,825], stoneLaminate:[1,150,300], terrazzo:[3,750,1150], black:[3,720,950], white:[3,650,1050],
    oak:[1,150,300], solidWood:[2,350,650], concrete:[1,170,320], travertine:[3,850,1300], marble:[3,700,1100]
  },
  'k-floor': {
    slate:[2,140,180], linoleum:[1,110,145], oak:[2,125,160], rhomboid:[3,155,215], cementRust:[3,155,215],
    cubes:[3,165,225], terracotta:[2,130,185]
  },
  'b-floor': {
    marquina:[3,155,225], neu:[2,125,170], bestand:[0,0,0], sand:[2,115,165], slate:[2,125,175],
    terracotta:[2,130,185], white:[2,125,175], terrazzo:[3,155,225],
    sandHerringbone:[3,155,215], charcoalCube:[3,150,215], coated:[1,85,145],
    microSand:[2,135,190], microChalk:[2,135,190], microGreige:[2,135,190], microWarmGrey:[2,135,190]
  },
  'b-walls': {
    paint:[1,25,50], coated:[1,65,105], mineral:[2,85,135], marquina:[3,145,205], blue:[2,120,165], beige:[2,120,165],
    ivory:[2,120,165], roseStack:[2,120,165], square:[2,110,155], limestone:[2,120,175],
    petrol:[3,145,205], green:[3,140,195], iceCube:[3,145,205]
  },
  'b-glass': {clear:[1,900,1350], reeded:[3,1100,2050]},
  'k-hob': {ceramic:[1,430,690], bora:[3,2480,2800], vzug:[3,4800,5250]},
  'k-hood': {wall:[1,240,480], island:[2,930,1350], integrated:[0,0,0]},
  'k-oven': {standard:[1,450,850]},
  'k-dishwasher': {standard:[1,599,899]}
};
materialPriceGuide['b-back']={...materialPriceGuide['b-walls'],paint:[2,145,210]};

// Kochfeld und Abzug gehören zur selben Modellwahl. Bei integriertem Abzug
// steht der vollständige Ansatz beim Kochfeld.
const cookingPriceOptions={
  integrated:{hob:'vzug',hood:'integrated'},
  boraWallOven:{hob:'bora',hood:'integrated'},
  ceramicIsland:{hob:'ceramic',hood:'island'},
  ceramicWall:{hob:'ceramic',hood:'wall'}
};
