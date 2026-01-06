/**
 * Calculateur de salaire net à Madagascar
 * Inclut IRSA (Impôt sur les Revenus Salariaux et Assimilés) et cotisations
 */

export interface SalaryBreakdown {
  salaireBrut: number;
  cotisationsCNAPS: number;
  cotisationsOSTIE: number;
  totalCotisations: number;
  salaireImposable: number;
  irsa: number;
  salaireNet: number;
  tauxIRSA: number;
}

// Barème IRSA Madagascar 2024
const IRSA_BRACKETS = [
  { min: 0, max: 350000, rate: 0, deduction: 0 },
  { min: 350001, max: 400000, rate: 0.05, deduction: 17500 },
  { min: 400001, max: 500000, rate: 0.10, deduction: 37500 },
  { min: 500001, max: 600000, rate: 0.15, deduction: 62500 },
  { min: 600001, max: Infinity, rate: 0.20, deduction: 92500 },
];

// Taux de cotisations sociales
const CNAPS_RATE = 0.01; // 1% pour l'employé
const OSTIE_RATE = 0.01; // 1% pour l'employé

/**
 * Calcule le salaire net à partir du salaire brut
 */
export function calculateNetSalary(salaireBrut: number): SalaryBreakdown {
  // 1. Cotisations sociales
  const cotisationsCNAPS = salaireBrut * CNAPS_RATE;
  const cotisationsOSTIE = salaireBrut * OSTIE_RATE;
  const totalCotisations = cotisationsCNAPS + cotisationsOSTIE;

  // 2. Salaire imposable (brut - cotisations)
  const salaireImposable = salaireBrut - totalCotisations;

  // 3. Calcul IRSA selon le barème
  let irsa = 0;
  let tauxIRSA = 0;

  for (const bracket of IRSA_BRACKETS) {
    if (salaireImposable >= bracket.min && salaireImposable <= bracket.max) {
      irsa = salaireImposable * bracket.rate - bracket.deduction;
      tauxIRSA = bracket.rate;
      break;
    }
  }

  // L'IRSA ne peut pas être négatif
  irsa = Math.max(0, irsa);

  // 4. Salaire net
  const salaireNet = salaireImposable - irsa;

  return {
    salaireBrut,
    cotisationsCNAPS,
    cotisationsOSTIE,
    totalCotisations,
    salaireImposable,
    irsa,
    salaireNet,
    tauxIRSA,
  };
}

/**
 * Calcule le salaire brut à partir du salaire net souhaité (inverse)
 */
export function calculateGrossSalary(salaireNetSouhaite: number): number {
  // Méthode itérative pour trouver le salaire brut
  let brutEstime = salaireNetSouhaite * 1.15; // Estimation initiale
  let iterations = 0;
  const maxIterations = 100;
  const precision = 1; // Précision d'1 Ariary

  while (iterations < maxIterations) {
    const result = calculateNetSalary(brutEstime);
    const difference = salaireNetSouhaite - result.salaireNet;

    if (Math.abs(difference) < precision) {
      return Math.round(brutEstime);
    }

    // Ajuster l'estimation
    brutEstime += difference * 1.15;
    iterations++;
  }

  return Math.round(brutEstime);
}

/**
 * Obtient les informations du barème IRSA pour un salaire donné
 */
export function getIRSABracketInfo(salaireImposable: number) {
  for (const bracket of IRSA_BRACKETS) {
    if (salaireImposable >= bracket.min && salaireImposable <= bracket.max) {
      return {
        tranche: `${bracket.min.toLocaleString()} - ${
          bracket.max === Infinity ? '∞' : bracket.max.toLocaleString()
        } Ar`,
        taux: `${(bracket.rate * 100).toFixed(0)}%`,
        deduction: `${bracket.deduction.toLocaleString()} Ar`,
      };
    }
  }
  return null;
}

/**
 * Formate un montant en Ariary
 */
export function formatAriary(amount: number): string {
  return `${Math.round(amount).toLocaleString('fr-FR')} Ar`;
}

/**
 * Calcule les cotisations employeur (pour information)
 */
export function calculateEmployerContributions(salaireBrut: number) {
  const cnapsEmployeur = salaireBrut * 0.13; // 13% pour l'employeur
  const ostieEmployeur = salaireBrut * 0.05; // 5% pour l'employeur
  const totalEmployeur = cnapsEmployeur + ostieEmployeur;

  return {
    cnapsEmployeur,
    ostieEmployeur,
    totalEmployeur,
    coutTotalEmployeur: salaireBrut + totalEmployeur,
  };
}
