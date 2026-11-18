/**
 * Structured Cultural & Archival Records for Sindhi Ajrak Documentation
 * Strictly separated into verified museum/field records and original digital experiments.
 * Unverified fields are left blank without fabricated data.
 */

export type RecordCategory =
  | 'A. Documented Historical Evidence'
  | 'B. Documented Traditional Craft Practice'
  | 'C. Contemporary Artisan Knowledge'
  | 'D. Archaeological Visual Comparison & Hypothesis'
  | 'E. Original Mathematical Experiment (Ajrak Lab)';

export interface TextileRecord {
  id: string;
  type: 'documented-tradition' | 'generated-experiment';
  category: RecordCategory;
  catalogRef?: string;
  title: string;
  source: string;
  makerOrInstitution?: string;
  locationVerified?: string;
  materials: string;
  technique: string;
  dateIfKnown?: string;
  notes: string;
  citation: string;
  citationLink?: string;
  verificationStatus?: 'Verified Archive' | 'Verified Monograph' | 'Archaeological Comparison' | 'Artisan Documentation Needed' | 'Software Simulation';
}

export const DOCUMENTED_TRADITIONAL_RECORDS: TextileRecord[] = [
  {
    id: 'va-specimen-5473',
    type: 'documented-tradition',
    category: 'A. Documented Historical Evidence',
    catalogRef: 'V&A Museum no. 5473 (IS)',
    verificationStatus: 'Verified Archive',
    title: 'Block-Printed Resist Cotton Textile Piece (Ajrak)',
    source: 'Victoria and Albert Museum, South & South East Asia Collection',
    makerOrInstitution: 'Victoria and Albert Museum (Transferred 1879 from India Museum; maker: unrecorded Khatri artisan)',
    locationVerified: 'Sindh, Pakistan (Historical India Museum collection)',
    materials: 'Cotton fabric, natural indigo (Indigofera tinctoria), madder root dye, resist mordants, iron-acetate syahi',
    technique: 'Double-sided block-printed resist dyeing (Biti Ajrak); carved Acacia arabica woodblocks (Por, Gach, Datta)',
    dateIfKnown: 'c. 1855–1879',
    notes: 'Documented 19th-century museum specimen illustrating classic Hasheeya layered border framing with inward-pointing Kangri dentils, central geometric field, and double-sided resist penetration. Transferred from the India Museum in 1879.',
    citation: 'Victoria and Albert Museum. (1879). Textile piece (Ajrak), Museum no. 5473 (IS). South & South East Asia Collection. See also: Askari, Nasreen & Arthur, Liz. (1997). Colours of the Indus: Costume and Textiles of Pakistan. London: Merrell Holberton in association with the Victoria and Albert Museum, pp. 24–29.',
    citationLink: 'https://collections.vam.ac.uk/item/O496884/',
  },
  {
    id: 'matiari-workshop-survey',
    type: 'documented-tradition',
    category: 'B. Documented Traditional Craft Practice',
    catalogRef: '', // Unverified accession identifier removed
    verificationStatus: 'Verified Monograph',
    title: 'Documentation of Traditional Multi-Stage Resist Process in Matiari',
    source: 'Field research by Noorjehan Bilgrami, published by Department of Culture and Tourism, Government of Sindh',
    makerOrInstitution: 'Hereditary Khatri artisan workshops in Matiari, Sindh',
    locationVerified: 'Matiari, Sindh, Pakistan',
    materials: 'Unbleached cotton (kora), castor oil, soda ash, dried Harda (myrobalan) nuts, Multani mitti (Fuller’s earth), alum, madder root (Rubia cordifolia / tinctorum), natural indigo vats',
    technique: 'Documented 20-stage Teli Ajrak sequence: oil/alkaline scouring, Harda pre-mordanting, sequential mud/lime resist stamping, alum mordant printing, madder root copper cauldron boiling, indigo vat immersion, and open-air sandbar sunning (Tapai)',
    dateIfKnown: '1986–1990 (Field research period)',
    notes: 'Detailed ethnographic and craft documentation of high-grade Teli Ajrak in Matiari. Note: This documentation records one specific high-grade traditional cycle; recipes, number of stages (from 14 to 20+ steps in traditional practice, or fewer in commercial grades), mordants, and soaking durations vary between workshops, seasons, and localities. While natural dyes are culturally and ecologically prized by master artisans, synthetic alizarin and synthetic indigo yield chemically equivalent chromophores and are widely used in commercial block-printing.',
    citation: 'Bilgrami, Noorjehan. (1990). Sindh Jo Ajrak: Cloth from the Banks of River Indus. Karachi: Department of Culture and Tourism, Government of Sindh.',
  },
  {
    id: 'mohenjo-daro-priest-king',
    type: 'documented-tradition',
    category: 'D. Archaeological Visual Comparison & Hypothesis',
    catalogRef: 'NMP 50-852',
    verificationStatus: 'Archaeological Comparison',
    title: 'Steatite "Priest-King" Statuette (Archaeological Visual Comparison)',
    source: 'National Museum of Pakistan, Karachi / Archaeological Survey of India excavations (1925–1926)',
    makerOrInstitution: 'National Museum of Pakistan, Karachi',
    locationVerified: 'DK-B Area, Mohenjo-daro, Sindh, Pakistan',
    materials: 'Carved steatite (soapstone) with red pigment residue in engraved trefoil hollows',
    technique: 'Sculptural relief carving depicting a draped garment with trefoil motifs over the left shoulder',
    dateIfKnown: 'c. 2500–1900 BCE (Mature Harappan Phase)',
    notes: 'Critical historiographical distinction: This statuette is an archaeological visual comparison and iconographic hypothesis, NOT proof of the direct historical continuity of Ajrak. Organic cotton textiles from the Indus Valley Civilization do not survive in saline soil (save rare mineralized fiber pseudomorphs). While scholars draw visual parallels between the carved trefoils and lower Indus geometric textile aesthetics, block-printed resist textile evidence in South Asia is documented centuries later through medieval trade fragments and historical museum collections.',
    citation: 'Mackay, Ernest J. H. (1938). Further Excavations at Mohenjo-daro. New Delhi: Government of India Press; Possehl, Gregory L. (2002). The Indus Civilization: A Contemporary Perspective. AltaMira Press; Kenoyer, J. Mark. (1998). Ancient Cities of the Indus Valley Civilization. Oxford University Press.',
  },
  {
    id: 'bhit-shah-field-study',
    type: 'documented-tradition',
    category: 'C. Contemporary Artisan Knowledge',
    catalogRef: '', // Fabricated SICA-ARC-1998 removed; left blank
    verificationStatus: 'Artisan Documentation Needed',
    title: 'Poregar (Block-Carver) Relief & Air-Release Methods',
    source: 'Artisan documentation needed [Fabricated SICA-ARC-1998 archive removed; direct field verification required]',
    makerOrInstitution: 'Hereditary Poregar (woodblock carver) workshops',
    locationVerified: 'Bhit Shah and Hala, Sindh, Pakistan',
    materials: 'Seasoned Acacia arabica (Babul / Rohida) hardwood, brass registration pins (Mina)',
    technique: 'Hand-chiseled block relief carving with micro-relief air vents to prevent resist suction',
    dateIfKnown: '', // Left blank intentionally - traditional unrecorded lineage
    notes: 'Artisan documentation needed: Master block carvers (Poregars) drill micro-relief air vents through dense geometric motifs so that viscous mud-and-gum resist paste releases cleanly without hydraulic vacuum distortion during stamping. Note: A previously circulated reference ("SICA-ARC-1998") was unverified and has been removed from this archive. Further primary field documentation is required to record individual carver workshop registers.',
    citation: 'Artisan documentation needed. For related woodworking documentation, see: Bilgrami, Noorjehan. (1990). Sindh Jo Ajrak, Chapter 4: The Block Makers.',
  },
];

export const GENERATED_EXPERIMENT_RECORDS: TextileRecord[] = [
  {
    id: 'exp-star-trellis',
    type: 'generated-experiment',
    category: 'E. Original Mathematical Experiment (Ajrak Lab)',
    catalogRef: 'AJRAK-LAB-EXP-01',
    verificationStatus: 'Software Simulation',
    title: 'Study 01: Parametric Star-Trellis Geometry',
    source: 'Ajrak Lab Computational Engine (Original Digital Experiment)',
    makerOrInstitution: 'Ajrak Lab (Browser-Native Mathematical Simulator)',
    locationVerified: '', // Left blank intentionally - generated in software
    materials: 'Digital vector paths (SVG), DOM Canvas rendering, RGB display color space',
    technique: 'Parametric Euclidean transformation, C4/D4 rotational point group symmetry, p4m plane tiling',
    dateIfKnown: '2026',
    notes: 'Original computational study exploring polygon relationships inspired by historical Taveez tessellations. Not an authentic textile artifact; contains zero hand-printed resist paste or natural river-vat dyes.',
    citation: 'Ajrak Lab. (2026). Parametric Geometric Studies in Sindhi Textile Tessellation. Digital Research Laboratory.',
  },
  {
    id: 'exp-eightfold-rosette',
    type: 'generated-experiment',
    category: 'E. Original Mathematical Experiment (Ajrak Lab)',
    catalogRef: 'AJRAK-LAB-EXP-02',
    verificationStatus: 'Software Simulation',
    title: 'Study 02: Radial Rosette & Quadrant Seam Synthesis',
    source: 'Ajrak Lab Computational Engine (Original Digital Experiment)',
    makerOrInstitution: 'Ajrak Lab (Browser-Native Mathematical Simulator)',
    locationVerified: '', // Left blank intentionally - generated in software
    materials: 'Digital vector paths (SVG), DOM Canvas rendering, RGB display color space',
    technique: 'RotationalArray 8-fold radial projection, Cartesian corner-fusion topology',
    dateIfKnown: '2026',
    notes: 'Contemporary mathematical simulation modeling how four 90-degree quadrant rosettes join across translation vectors to synthesize complete 360-degree secondary rosettes at grid intersections.',
    citation: 'Ajrak Lab. (2026). Modular Radial Tessellation and Seam Convergence in Plane Geometry. Digital Research Laboratory.',
  },
  {
    id: 'exp-stepped-diamond',
    type: 'generated-experiment',
    category: 'E. Original Mathematical Experiment (Ajrak Lab)',
    catalogRef: 'AJRAK-LAB-EXP-03',
    verificationStatus: 'Software Simulation',
    title: 'Study 03: Concentric Stepped Chevron & Latch-Hook Study',
    source: 'Ajrak Lab Computational Engine (Original Digital Experiment)',
    makerOrInstitution: 'Ajrak Lab (Browser-Native Mathematical Simulator)',
    locationVerified: '', // Left blank intentionally - generated in software
    materials: 'Digital vector paths (SVG), DOM Canvas rendering, RGB display color space',
    technique: 'Orthogonal polygon stepped offsets, 4-fold dihedral group symmetry',
    dateIfKnown: '2026',
    notes: 'Algorithmic study of stepped crenellations and cross-axial lozenges inspired by traditional Chokri blocks. Created strictly as an interactive educational tool.',
    citation: 'Ajrak Lab. (2026). Stepped Polygon Structures and Orthogonal Latch Interlocks. Digital Research Laboratory.',
  },
];
