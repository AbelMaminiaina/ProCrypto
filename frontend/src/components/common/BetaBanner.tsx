import { useState } from 'react';

function BetaBanner() {
  const [isVisible, setIsVisible] = useState(() => {
    // Vérifier si l'utilisateur a déjà fermé le banner (stocké dans localStorage)
    const dismissed = localStorage.getItem('betaBannerDismissed');
    return !dismissed;
  });

  const handleDismiss = () => {
    localStorage.setItem('betaBannerDismissed', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="text-2xl mt-0.5">⚠️</div>
            <div className="flex-1">
              <div className="font-bold text-lg mb-1">
                VERSION BÊTA - Site en cours de mise en conformité légale
              </div>
              <div className="text-sm text-orange-100 space-y-1">
                <p className="mb-1">
                  Ce site est actuellement en phase de test (BETA). Les démarches de conformité
                  légale sont en cours auprès des autorités malgaches (CNIL, BCM).
                </p>
                <ul className="text-xs space-y-1 ml-4">
                  <li>
                    • <strong>Comparateur de taux :</strong> Informations indicatives uniquement.
                    Contactez directement les banques pour des offres officielles.
                  </li>
                  <li>
                    • <strong>Cryptomonnaies :</strong> Outil éducatif. Risque de perte totale du capital.
                    Pas de conseil d'investissement.
                  </li>
                  <li>
                    • <strong>Données personnelles :</strong> Déclaration CNIL en cours.
                    Vos données sont sécurisées.
                  </li>
                </ul>
                <p className="text-xs mt-2 font-semibold">
                  En utilisant ce site, vous reconnaissez son caractère informatif et non contractuel.
                </p>
              </div>
            </div>
          </div>

          {/* Bouton de fermeture */}
          <button
            onClick={handleDismiss}
            className="text-white hover:text-orange-200 transition-colors flex-shrink-0 text-2xl leading-none"
            aria-label="Fermer"
            title="Fermer (vous pourrez le revoir en vidant le cache)"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

export default BetaBanner;
