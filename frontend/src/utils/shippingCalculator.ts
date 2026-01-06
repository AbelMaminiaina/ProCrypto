// Calculateur de transport maritime et taxes douanières France-Madagascar

export interface ShippingCost {
  // Frais de transport maritime
  fretMaritime: number;
  assurance: number;
  manutention: number;
  documentationFrais: number;

  // Taxes douanières Madagascar
  droitDouane: number;  // Variable selon produit (5-20%)
  tva: number;          // 20% sur (valeur CIF + droits de douane)
  taxeStatistique: number; // 2% sur valeur CIF

  // Totaux
  totalTransport: number;
  totalTaxes: number;
  coutTotal: number;
}

export interface ContainerPrice {
  type: string;
  prixEUR: number;
  capaciteM3: number;
  capaciteKg: number;
}

// Tarifs de fret maritime (estimation 2026)
export const CONTAINER_PRICES: ContainerPrice[] = [
  {
    type: "20' Dry Container (FCL)",
    prixEUR: 2800,
    capaciteM3: 33,
    capaciteKg: 21700
  },
  {
    type: "40' Dry Container (FCL)",
    prixEUR: 4200,
    capaciteM3: 67,
    capaciteKg: 26500
  },
  {
    type: "40' High Cube (FCL)",
    prixEUR: 4500,
    capaciteM3: 76,
    capaciteKg: 26000
  },
  {
    type: "Groupage LCL (par m³)",
    prixEUR: 150,
    capaciteM3: 1,
    capaciteKg: 300
  }
];

// Taux de change (à actualiser)
const TAUX_EURO_ARIARY = 5000;
const TAUX_EUR_USD = 1.10;

// Frais additionnels (en EUR)
const FRAIS_MANUTENTION_FCL = 300;
const FRAIS_MANUTENTION_LCL_PAR_M3 = 50;
const FRAIS_DOCUMENTATION = 150;
const TAUX_ASSURANCE = 0.015; // 1.5% de la valeur

// Taux de taxes Madagascar
const TAUX_TVA_MADAGASCAR = 0.20; // 20%
const TAUX_TAXE_STATISTIQUE = 0.02; // 2%

export interface ShippingInput {
  direction: 'france-madagascar' | 'madagascar-france';
  containerType: string;
  volumeM3?: number;
  poidsKg?: number;
  valeurMarchandise: number; // en EUR
  categorieDouane: 'standard' | 'reduit' | 'eleve'; // Taux de droits de douane
  devise: 'EUR' | 'MGA' | 'USD';
}

export function getTauxDroitDouane(categorie: string): number {
  switch (categorie) {
    case 'reduit':
      return 0.05; // 5% (produits de première nécessité, médicaments)
    case 'standard':
      return 0.10; // 10% (la plupart des produits)
    case 'eleve':
      return 0.20; // 20% (produits de luxe, alcool, tabac)
    default:
      return 0.10;
  }
}

export function calculateShippingCost(input: ShippingInput): ShippingCost {
  const {
    containerType,
    volumeM3 = 1,
    valeurMarchandise,
    categorieDouane,
    direction
  } = input;

  // Trouver le conteneur sélectionné
  const container = CONTAINER_PRICES.find(c => c.type === containerType);
  if (!container) {
    throw new Error('Type de conteneur invalide');
  }

  // Calcul du fret maritime
  let fretMaritime: number;
  let manutention: number;

  if (containerType.includes('LCL')) {
    // Groupage: prix au m³
    fretMaritime = container.prixEUR * volumeM3;
    manutention = FRAIS_MANUTENTION_LCL_PAR_M3 * volumeM3;
  } else {
    // Conteneur complet (FCL)
    fretMaritime = container.prixEUR;
    manutention = FRAIS_MANUTENTION_FCL;
  }

  // Assurance
  const assurance = valeurMarchandise * TAUX_ASSURANCE;

  // Frais de documentation
  const documentationFrais = FRAIS_DOCUMENTATION;

  // Valeur CIF (Cost, Insurance, Freight)
  const valeurCIF = valeurMarchandise + fretMaritime + assurance;

  // Calcul des taxes douanières (uniquement pour importation à Madagascar)
  let droitDouane = 0;
  let tva = 0;
  let taxeStatistique = 0;

  if (direction === 'france-madagascar') {
    // Taxes à l'importation à Madagascar
    const tauxDroit = getTauxDroitDouane(categorieDouane);
    droitDouane = valeurCIF * tauxDroit;

    // Taxe statistique (2% sur valeur CIF)
    taxeStatistique = valeurCIF * TAUX_TAXE_STATISTIQUE;

    // TVA Madagascar (20% sur valeur CIF + droits de douane)
    tva = (valeurCIF + droitDouane) * TAUX_TVA_MADAGASCAR;
  } else {
    // Pour Madagascar vers France, taxes européennes (non calculées ici)
    // L'utilisateur devra vérifier avec les douanes françaises
  }

  // Totaux
  const totalTransport = fretMaritime + assurance + manutention + documentationFrais;
  const totalTaxes = droitDouane + tva + taxeStatistique;
  const coutTotal = totalTransport + totalTaxes;

  return {
    fretMaritime,
    assurance,
    manutention,
    documentationFrais,
    droitDouane,
    tva,
    taxeStatistique,
    totalTransport,
    totalTaxes,
    coutTotal
  };
}

export function formatDevise(montant: number, devise: 'EUR' | 'MGA' | 'USD'): string {
  switch (devise) {
    case 'EUR':
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
      }).format(montant);
    case 'MGA':
      return new Intl.NumberFormat('fr-FR', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(montant) + ' Ar';
    case 'USD':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(montant);
    default:
      return montant.toFixed(2);
  }
}

export function convertDevise(montantEUR: number, deviseCible: 'EUR' | 'MGA' | 'USD'): number {
  switch (deviseCible) {
    case 'EUR':
      return montantEUR;
    case 'MGA':
      return montantEUR * TAUX_EURO_ARIARY;
    case 'USD':
      return montantEUR * TAUX_EUR_USD;
    default:
      return montantEUR;
  }
}

export function getDelaiEstime(direction: string): string {
  if (direction === 'france-madagascar') {
    return '25-35 jours (Marseille/Le Havre → Toamasina)';
  } else {
    return '25-35 jours (Toamasina → Marseille/Le Havre)';
  }
}

export function getPortsInfo(direction: string): { depart: string[]; arrivee: string[] } {
  if (direction === 'france-madagascar') {
    return {
      depart: ['Marseille-Fos', 'Le Havre', 'Dunkerque'],
      arrivee: ['Toamasina (Tamatave)', 'Mahajanga', 'Toliara']
    };
  } else {
    return {
      depart: ['Toamasina (Tamatave)', 'Mahajanga', 'Toliara'],
      arrivee: ['Marseille-Fos', 'Le Havre', 'Dunkerque']
    };
  }
}
