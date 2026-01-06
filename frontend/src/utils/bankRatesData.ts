// Données des taux de crédit des banques à Madagascar (2026)
// AVERTISSEMENT : Ces données sont fournies à titre indicatif uniquement
// Source : Informations publiques des établissements bancaires
// Dernière mise à jour : Janvier 2026
// Les taux réels peuvent varier selon le profil de l'emprunteur

export interface BankLoanRate {
  banque: string;
  logo?: string;
  typesCredit: {
    immobilier: {
      tauxMin: number;
      tauxMax: number;
      dureeMax: number; // en années
      apportMin: number; // pourcentage
    };
    consommation: {
      tauxMin: number;
      tauxMax: number;
      dureeMax: number;
      apportMin: number;
    };
    automobile: {
      tauxMin: number;
      tauxMax: number;
      dureeMax: number;
      apportMin: number;
    };
    entreprise: {
      tauxMin: number;
      tauxMax: number;
      dureeMax: number;
      apportMin: number;
    };
  };
  avantages: string[];
  contact?: string;
  website?: string;
}

export const BANKS_DATA: BankLoanRate[] = [
  {
    banque: 'BNI Madagascar',
    typesCredit: {
      immobilier: {
        tauxMin: 9.5,
        tauxMax: 12.5,
        dureeMax: 20,
        apportMin: 20
      },
      consommation: {
        tauxMin: 12.0,
        tauxMax: 16.0,
        dureeMax: 7,
        apportMin: 10
      },
      automobile: {
        tauxMin: 10.5,
        tauxMax: 14.0,
        dureeMax: 5,
        apportMin: 20
      },
      entreprise: {
        tauxMin: 11.0,
        tauxMax: 15.0,
        dureeMax: 10,
        apportMin: 20
      }
    },
    avantages: [
      'Taux préférentiels pour les salariés',
      'Possibilité de remboursement anticipé',
      'Assurance emprunteur incluse',
      'Simulation en ligne disponible'
    ],
    contact: '020 22 666 00',
    website: 'www.bni.mg'
  },
  {
    banque: 'BOA Madagascar',
    typesCredit: {
      immobilier: {
        tauxMin: 9.0,
        tauxMax: 13.0,
        dureeMax: 25,
        apportMin: 15
      },
      consommation: {
        tauxMin: 11.5,
        tauxMax: 15.5,
        dureeMax: 7,
        apportMin: 10
      },
      automobile: {
        tauxMin: 10.0,
        tauxMax: 13.5,
        dureeMax: 5,
        apportMin: 15
      },
      entreprise: {
        tauxMin: 10.5,
        tauxMax: 14.5,
        dureeMax: 12,
        apportMin: 15
      }
    },
    avantages: [
      'Report d\'échéance possible',
      'Domiciliation bancaire non obligatoire',
      'Assurance vie groupe avantageuse',
      'Accompagnement personnalisé'
    ],
    contact: '020 22 299 99',
    website: 'www.boa.mg'
  },
  {
    banque: 'BFV-SG',
    typesCredit: {
      immobilier: {
        tauxMin: 9.75,
        tauxMax: 13.5,
        dureeMax: 20,
        apportMin: 20
      },
      consommation: {
        tauxMin: 12.5,
        tauxMax: 16.5,
        dureeMax: 5,
        apportMin: 10
      },
      automobile: {
        tauxMin: 11.0,
        tauxMax: 14.5,
        dureeMax: 5,
        apportMin: 20
      },
      entreprise: {
        tauxMin: 11.5,
        tauxMax: 15.5,
        dureeMax: 10,
        apportMin: 20
      }
    },
    avantages: [
      'Réseau Société Générale international',
      'Offres spéciales pour jeunes actifs',
      'Carte de crédit renouvelable',
      'Application mobile complète'
    ],
    contact: '020 22 239 00',
    website: 'www.bfv-sg.mg'
  },
  {
    banque: 'Accès Banque Madagascar',
    typesCredit: {
      immobilier: {
        tauxMin: 10.0,
        tauxMax: 14.0,
        dureeMax: 15,
        apportMin: 25
      },
      consommation: {
        tauxMin: 13.0,
        tauxMax: 17.0,
        dureeMax: 5,
        apportMin: 15
      },
      automobile: {
        tauxMin: 11.5,
        tauxMax: 15.0,
        dureeMax: 5,
        apportMin: 25
      },
      entreprise: {
        tauxMin: 12.0,
        tauxMax: 16.0,
        dureeMax: 10,
        apportMin: 25
      }
    },
    avantages: [
      'Procédure simplifiée',
      'Réponse rapide (72h)',
      'Conseillers dédiés',
      'Flexibilité sur les garanties'
    ],
    contact: '020 22 278 00',
    website: 'www.accessbanque-madagascar.com'
  },
  {
    banque: 'BMOI (Banque Malgache de l\'Océan Indien)',
    typesCredit: {
      immobilier: {
        tauxMin: 9.25,
        tauxMax: 12.75,
        dureeMax: 25,
        apportMin: 15
      },
      consommation: {
        tauxMin: 11.75,
        tauxMax: 15.75,
        dureeMax: 7,
        apportMin: 10
      },
      automobile: {
        tauxMin: 10.25,
        tauxMax: 13.75,
        dureeMax: 6,
        apportMin: 15
      },
      entreprise: {
        tauxMin: 10.75,
        tauxMax: 14.75,
        dureeMax: 12,
        apportMin: 15
      }
    },
    avantages: [
      'Taux compétitifs',
      'Durée de crédit flexible',
      'Assurance décès/invalidité incluse',
      'Service client réactif'
    ],
    contact: '020 22 266 88',
    website: 'www.bmoi.mg'
  },
  {
    banque: 'PAOSITRA MALAGASY (Paoma)',
    typesCredit: {
      immobilier: {
        tauxMin: 10.5,
        tauxMax: 14.5,
        dureeMax: 15,
        apportMin: 25
      },
      consommation: {
        tauxMin: 13.5,
        tauxMax: 18.0,
        dureeMax: 5,
        apportMin: 20
      },
      automobile: {
        tauxMin: 12.0,
        tauxMax: 16.0,
        dureeMax: 5,
        apportMin: 25
      },
      entreprise: {
        tauxMin: 12.5,
        tauxMax: 17.0,
        dureeMax: 8,
        apportMin: 25
      }
    },
    avantages: [
      'Présence dans tout Madagascar',
      'Accès facile en zones rurales',
      'Microcrédits disponibles',
      'Dossier simplifié'
    ],
    contact: '020 22 202 00',
    website: 'www.paoma.mg'
  }
];

export type CreditType = 'immobilier' | 'consommation' | 'automobile' | 'entreprise';

export interface CreditSimulation {
  montant: number;
  duree: number; // en mois
  taux: number;
  apport: number;
  mensualite: number;
  coutTotal: number;
  coutCredit: number;
}

export function calculateMonthlyPayment(
  montant: number,
  tauxAnnuel: number,
  dureeMois: number
): number {
  const tauxMensuel = tauxAnnuel / 100 / 12;
  if (tauxMensuel === 0) return montant / dureeMois;

  const mensualite =
    (montant * tauxMensuel * Math.pow(1 + tauxMensuel, dureeMois)) /
    (Math.pow(1 + tauxMensuel, dureeMois) - 1);

  return mensualite;
}

export function simulateCredit(
  montantTotal: number,
  apportPourcentage: number,
  tauxAnnuel: number,
  dureeAnnees: number
): CreditSimulation {
  const apport = montantTotal * (apportPourcentage / 100);
  const montantEmprunte = montantTotal - apport;
  const dureeMois = dureeAnnees * 12;

  const mensualite = calculateMonthlyPayment(montantEmprunte, tauxAnnuel, dureeMois);
  const coutTotal = mensualite * dureeMois;
  const coutCredit = coutTotal - montantEmprunte;

  return {
    montant: montantEmprunte,
    duree: dureeMois,
    taux: tauxAnnuel,
    apport,
    mensualite,
    coutTotal,
    coutCredit
  };
}

export function formatAriary(montant: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(montant) + ' Ar';
}

export function getCreditTypeLabel(type: CreditType): string {
  const labels: Record<CreditType, string> = {
    immobilier: 'Crédit Immobilier',
    consommation: 'Crédit à la Consommation',
    automobile: 'Crédit Automobile',
    entreprise: 'Crédit Entreprise'
  };
  return labels[type];
}

export function getBestRate(type: CreditType): { banque: string; taux: number } {
  let bestBank = '';
  let bestRate = Infinity;

  BANKS_DATA.forEach(bank => {
    const rate = bank.typesCredit[type].tauxMin;
    if (rate < bestRate) {
      bestRate = rate;
      bestBank = bank.banque;
    }
  });

  return { banque: bestBank, taux: bestRate };
}
