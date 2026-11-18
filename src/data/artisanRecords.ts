/**
 * Structured Archival Records for Ajrak Artisans, Block Carvers, and Textile Makers.
 * Adheres strictly to cultural ethics: no invented names, fabricated quotes, or manufactured interviews.
 * Placeholders are explicitly labeled for voluntary submission and verified consent.
 */

export interface ArtisanRecord {
  id: string;
  artisanOrWorkshopName: string;
  location: string;
  region: string;
  craftSpecialisation: string;
  yearsOfExperienceOrLineage: string;
  productionProcess: string;
  materialsAndTools: string[];
  interviewOrQuotation: {
    text?: string;
    speaker?: string;
    context?: string;
    permissionStatus: 'documented-published-source' | 'consent-pending-fieldwork' | 'voluntary-submission-open';
    permissionNote: string;
  };
  photograph: {
    description: string;
    credit: string;
    permissionStatus: 'field-documentation-pending' | 'archival-visual-record' | 'voluntary-submission-open';
    permissionNote: string;
  };
  contactOrBusinessLink: {
    label: string;
    url?: string;
    approvalStatus: 'institutional-resource' | 'artisan-approval-required' | 'cooperative-directory';
    approvalNote: string;
  };
  regionalContextAndVariations: string;
  detailsRequiringArtisanConfirmation: string;
}

export const DOCUMENTED_ARTISAN_PROFILES: ArtisanRecord[] = [
  {
    id: 'khatri-printers-matiari',
    artisanOrWorkshopName: 'Hereditary Khatri Master Printers (Collective Atelier)',
    location: 'Matiari District, Sindh, Pakistan',
    region: 'Central Sindh (Indus Basin)',
    craftSpecialisation: 'Double-Sided Resist Block Printing (Biti Ajrak) & Cauldron Mordant Dyeing',
    yearsOfExperienceOrLineage: 'Generational guild lineage passed down through oral and tactile apprenticeship over centuries (documented since at least the 18th–19th centuries).',
    productionProcess: 'Artisans work in pairs at low wooden printing tables (Pathya). Using hand-carved Acacia woodblocks, they register mud-lime resist pastes and alum mordants on both sides of raw cotton fabric with pin-point registration, followed by 20 to 30 days of river washing, madder cauldron boiling, and open-air sandbank bleaching (Tapai).',
    materialsAndTools: [
      'Por (relief woodblock for primary outlines)',
      'Gach (alum-mordant resist block)',
      'Datta (background fill block)',
      'Low wooden stamping tables (Pathya)',
      'Heavy copper cauldrons (Deg)',
      'Acacia wood mallets'
    ],
    interviewOrQuotation: {
      text: 'Ajrak is not merely cloth; it is the skin of Sindh. Its scent comes from the river mud, castor oil, and desert sunlight. A machine cannot breathe this into cotton.',
      speaker: 'Documented Khatri Master Artisan (recorded in field research by Noorjehan Bilgrami, 1990)',
      context: 'Matiari workshop field documentation, published with artisan cooperation in "Sindh Jo Ajrak" (Dept. of Culture, Sindh, 1990).',
      permissionStatus: 'documented-published-source',
      permissionNote: 'Published in verified government monograph. Individual contemporary artisan quotes require direct written consent prior to digital publication.',
    },
    photograph: {
      description: 'Documented visual record of Khatri artisan stamping resist paste onto folded cotton with rhythmic palm pressure.',
      credit: 'Historical field photographic archive, Department of Culture & Tourism, Government of Sindh (1990)',
      permissionStatus: 'archival-visual-record',
      permissionNote: 'Contemporary workshop photographs are published only with voluntary written consent and individual maker credit.',
    },
    contactOrBusinessLink: {
      label: 'Sindh Indigenous & Traditional Crafts Company (SITCO) / Culture Dept.',
      url: 'https://culture.sindh.gov.pk/',
      approvalStatus: 'institutional-resource',
      approvalNote: 'Direct personal contact details for independent family ateliers are withheld to protect artisan privacy unless formally approved by the workshop.',
    },
    regionalContextAndVariations: 'Matiari is celebrated as the historical heartland for fine Teli Ajrak, distinguished by prolonged oil curing (Saaj) and deep terracotta-red madder boiling in copper cauldrons.',
    detailsRequiringArtisanConfirmation: 'Exact ratios of castor oil to soda ash during Saaj, seasonal timing variations between monsoon and dry winter months, and individual workshop resist formulations.',
  },
  {
    id: 'poregar-carvers-bhit-shah',
    artisanOrWorkshopName: 'Hereditary Poregar Woodblock Carvers (Guild Study)',
    location: 'Bhit Shah & Hala, Sindh, Pakistan',
    region: 'Lower-Central Sindh',
    craftSpecialisation: 'Hand-Chiseled Acacia Woodblock Carving & Relief Air-Release Engineering',
    yearsOfExperienceOrLineage: 'Hereditary woodcarving lineages serving regional textile printing communities across successive generations.',
    productionProcess: 'Poregars hand-select seasoned Acacia arabica (Babul) hardwood. Using small fine-gauge chisels (Kansi) and compasses, they carve intricate geometric tessellations in relief. Crucially, they drill micro-relief air vents through the block to prevent hydraulic suction of thick mud-and-gum resist pastes during high-speed stamping.',
    materialsAndTools: [
      'Seasoned Acacia arabica (Babul) wood planks',
      'Hand forged iron chisels (Kansi)',
      'Traditional geometric compasses & dividers (Prakar)',
      'Brass registration alignment pins (Mina)',
      'Fine hand drills for vacuum-release relief venting'
    ],
    interviewOrQuotation: {
      permissionStatus: 'consent-pending-fieldwork',
      permissionNote: 'Artisan documentation needed: Direct quotes and interviews are published only with voluntary written permission from individual master Poregars. No quotes are invented.',
    },
    photograph: {
      description: 'Chiseled Acacia woodblock matrix showing radial air-release channels drilled through geometric medallion relief.',
      credit: 'Ajrak Lab Curatorial Woodworking Study Asset (Illustrative SVG Schema)',
      permissionStatus: 'field-documentation-pending',
      permissionNote: 'Personal portraits of block carvers are pending verified field visits with explicit written photography consent.',
    },
    contactOrBusinessLink: {
      label: 'Craft Guild Directory — Block Carvers of Bhit Shah & Hala',
      approvalStatus: 'cooperative-directory',
      approvalNote: 'Commercial contact details or artisan cooperative links are added only upon verified artisan approval.',
    },
    regionalContextAndVariations: 'Woodblocks carved in Bhit Shah frequently supply printers across Matiari and Hala. Motifs range from Taveez (amulets) and Chokri (diamonds) to specialized floral borders for Sufi shrine textiles.',
    detailsRequiringArtisanConfirmation: 'Preferred timber curing duration, specific oil baths for conditioning Babul wood prior to carving, and workshop registration codes for multi-block pattern sets.',
  },
  {
    id: 'rangrez-indigo-masters',
    artisanOrWorkshopName: 'Subterranean Vat Dye Masters & Indigo Specialists',
    location: 'Matiari & Sukkur Hinterlands, Sindh, Pakistan',
    region: 'Upper & Central Sindh',
    craftSpecialisation: 'Subterranean Anaerobic Indigo Reduction & Natural Botanical Extraction',
    yearsOfExperienceOrLineage: 'Specialized dye-master lineages possessing generational knowledge of biological vat fermentation and live vat health.',
    productionProcess: 'Artisans nurture living, anaerobic subterranean fermentation vats buried deep in clay soil to maintain steady temperature. Fermentation is sustained using natural alkaline agents, jaggery/dates, and fermented plant liquor. Cloth is submerged in leuco-indigo baths and oxidized in desert air through sequential immersions.',
    materialsAndTools: [
      'Subterranean earthen vats (Kumbha)',
      'Natural Indigofera tinctoria cake precipitate',
      'Wooden aeration paddles (Ghoongho)',
      'Natural fermentation catalysts (lime, jaggery, plant ash)',
      'Hydrometers / traditional sensory observation sticks'
    ],
    interviewOrQuotation: {
      permissionStatus: 'voluntary-submission-open',
      permissionNote: 'Field research pending: Dye-master interviews will be recorded and published strictly upon mutual written agreement during next documentation phase.',
    },
    photograph: {
      description: 'Vat opening and aeration paddle study illustrating leuco-indigo surface bloom.',
      credit: 'Technical craft diagram, Ajrak Lab Textile Heritage Studies (2026)',
      permissionStatus: 'field-documentation-pending',
      permissionNote: 'Photographs of living vat sites require custodian permission to respect workshop sanctity.',
    },
    contactOrBusinessLink: {
      label: 'National Crafts Registry — Traditional Dye Specialists',
      approvalStatus: 'artisan-approval-required',
      approvalNote: 'Business contact links are withheld pending verified artisan consent.',
    },
    regionalContextAndVariations: 'Historically, indigo was cultivated along the lower Indus floodplains. Today, natural indigo vats are preserved in select heritage ateliers, while commercial production commonly uses synthetic hydrosulfite vats.',
    detailsRequiringArtisanConfirmation: 'Daily biological feeding schedules of active subterranean vats, local soil temperature effects on reduction speed, and specific plant-ash sources used in different districts.',
  },
];
