import { useState } from 'react';
import {
  BANKS_DATA,
  CreditType,
  getCreditTypeLabel,
  getBestRate,
  simulateCredit,
  formatAriary,
  CreditSimulation,
} from '../utils/bankRatesData';

function BankRatesPage() {
  const [selectedType, setSelectedType] = useState<CreditType>('immobilier');
  const [showSimulator, setShowSimulator] = useState(false);

  // Simulator state
  const [montantTotal, setMontantTotal] = useState<string>('50000000');
  const [dureeAnnees, setDureeAnnees] = useState<string>('15');
  const [selectedBank, setSelectedBank] = useState<string>(BANKS_DATA[0].banque);
  const [simulations, setSimulations] = useState<
    Array<{ banque: string; simulation: CreditSimulation }>
  >([]);

  const creditTypes: CreditType[] = ['immobilier', 'consommation', 'automobile', 'entreprise'];

  const bestRate = getBestRate(selectedType);

  const handleSimulate = () => {
    const montant = parseFloat(montantTotal);
    const duree = parseFloat(dureeAnnees);

    if (isNaN(montant) || montant <= 0) {
      alert('Veuillez entrer un montant valide');
      return;
    }

    if (isNaN(duree) || duree <= 0) {
      alert('Veuillez entrer une durée valide');
      return;
    }

    const results: Array<{ banque: string; simulation: CreditSimulation }> = [];

    BANKS_DATA.forEach(bank => {
      const creditInfo = bank.typesCredit[selectedType];
      // Utiliser le taux moyen pour la simulation
      const tauxMoyen = (creditInfo.tauxMin + creditInfo.tauxMax) / 2;

      const simulation = simulateCredit(
        montant,
        creditInfo.apportMin,
        tauxMoyen,
        Math.min(duree, creditInfo.dureeMax)
      );

      results.push({
        banque: bank.banque,
        simulation
      });
    });

    // Trier par mensualité croissante
    results.sort((a, b) => a.simulation.mensualite - b.simulation.mensualite);
    setSimulations(results);
  };

  const handleSimulateSingle = () => {
    const montant = parseFloat(montantTotal);
    const duree = parseFloat(dureeAnnees);

    if (isNaN(montant) || montant <= 0) {
      alert('Veuillez entrer un montant valide');
      return;
    }

    if (isNaN(duree) || duree <= 0) {
      alert('Veuillez entrer une durée valide');
      return;
    }

    const bank = BANKS_DATA.find(b => b.banque === selectedBank);
    if (!bank) return;

    const creditInfo = bank.typesCredit[selectedType];
    const tauxMoyen = (creditInfo.tauxMin + creditInfo.tauxMax) / 2;

    const simulation = simulateCredit(
      montant,
      creditInfo.apportMin,
      tauxMoyen,
      Math.min(duree, creditInfo.dureeMax)
    );

    setSimulations([{ banque: bank.banque, simulation }]);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Comparateur de Taux de Crédit
          </h1>
          <p className="text-gray-300 text-lg">
            Banques à Madagascar - Trouvez le meilleur taux pour votre projet
          </p>
        </div>

        {/* Legal Disclaimer */}
        <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-4 mb-6">
          <div className="flex items-start">
            <span className="text-2xl mr-3">⚠️</span>
            <div className="text-sm text-gray-800">
              <p className="font-bold mb-2">AVERTISSEMENT LÉGAL</p>
              <p className="mb-2">
                Les informations présentées sur cette page sont fournies à titre <strong>indicatif uniquement</strong> et ne constituent en aucun cas une offre de crédit, un conseil financier ou un engagement contractuel.
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Les taux affichés sont des estimations basées sur des informations publiques et peuvent varier</li>
                <li>Seules les banques sont habilitées à fournir des offres de crédit officielles</li>
                <li>Les simulations sont des calculs approximatifs pour information uniquement</li>
                <li>Consultez directement les établissements bancaires pour des conditions exactes et personnalisées</li>
                <li>Vérifiez toujours les conditions générales et le TAEG (Taux Annuel Effectif Global) auprès de votre banque</li>
                <li>Ce site n'est pas un courtier en crédit et ne perçoit aucune commission des banques</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Type Selection */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Type de crédit</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {creditTypes.map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedType === type
                    ? 'border-primary bg-primary text-white shadow-lg'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-primary'
                }`}
              >
                <div className="text-2xl mb-2">
                  {type === 'immobilier' && '🏠'}
                  {type === 'consommation' && '🛒'}
                  {type === 'automobile' && '🚗'}
                  {type === 'entreprise' && '💼'}
                </div>
                <div className="font-semibold text-sm">
                  {getCreditTypeLabel(type)}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Best Rate Highlight */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl shadow-2xl p-6 mb-6 text-white">
          <div className="text-center">
            <div className="text-lg mb-2 opacity-90">Meilleur taux pour {getCreditTypeLabel(selectedType)}</div>
            <div className="text-4xl font-bold mb-2">
              {bestRate.taux}% par an
            </div>
            <div className="text-xl opacity-90">
              chez {bestRate.banque}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setShowSimulator(!showSimulator)}
            className={`flex-1 py-4 px-6 rounded-xl font-bold text-lg transition-all ${
              showSimulator
                ? 'bg-primary text-white shadow-lg'
                : 'bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white'
            }`}
          >
            {showSimulator ? '📊 Voir les taux' : '🧮 Simuler un crédit'}
          </button>
        </div>

        {/* Simulator */}
        {showSimulator ? (
          <div className="bg-white rounded-2xl shadow-2xl p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Simulateur de crédit - {getCreditTypeLabel(selectedType)}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Montant du projet (Ar)
                </label>
                <input
                  type="text"
                  value={parseInt(montantTotal).toLocaleString('fr-FR')}
                  onChange={(e) => setMontantTotal(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Durée (années)
                </label>
                <input
                  type="number"
                  step="1"
                  value={dureeAnnees}
                  onChange={(e) => setDureeAnnees(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banque (simulation unique)
                </label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  {BANKS_DATA.map(bank => (
                    <option key={bank.banque} value={bank.banque}>
                      {bank.banque}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleSimulateSingle}
                className="flex-1 bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-all"
              >
                Simuler avec {selectedBank}
              </button>
              <button
                onClick={handleSimulate}
                className="flex-1 bg-gradient-to-r from-primary to-primary-dark text-white font-bold py-3 px-6 rounded-lg hover:shadow-lg transition-all"
              >
                Comparer toutes les banques
              </button>
            </div>

            {/* Simulation Results */}
            {simulations.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Résultats de simulation
                </h3>
                <div className="space-y-4">
                  {simulations.map((result, index) => (
                    <div
                      key={result.banque}
                      className={`border-2 rounded-xl p-6 ${
                        index === 0
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-xl font-bold text-gray-800">
                          {result.banque}
                          {index === 0 && (
                            <span className="ml-2 text-sm bg-green-500 text-white px-3 py-1 rounded-full">
                              Meilleure offre
                            </span>
                          )}
                        </h4>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">Taux moyen</div>
                          <div className="text-2xl font-bold text-primary">
                            {result.simulation.taux.toFixed(2)}%
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <div className="text-sm text-gray-600">Apport</div>
                          <div className="text-lg font-bold text-gray-800">
                            {formatAriary(result.simulation.apport)}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Montant emprunté</div>
                          <div className="text-lg font-bold text-gray-800">
                            {formatAriary(result.simulation.montant)}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Mensualité</div>
                          <div className="text-lg font-bold text-blue-600">
                            {formatAriary(result.simulation.mensualite)}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Coût du crédit</div>
                          <div className="text-lg font-bold text-orange-600">
                            {formatAriary(result.simulation.coutCredit)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Banks Comparison Table */
          <div className="bg-white rounded-2xl shadow-2xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Comparaison des taux - {getCreditTypeLabel(selectedType)}
            </h2>

            <div className="space-y-6">
              {BANKS_DATA.map(bank => {
                const creditInfo = bank.typesCredit[selectedType];
                const isBestRate = bank.banque === bestRate.banque;

                return (
                  <div
                    key={bank.banque}
                    className={`border-2 rounded-xl p-6 transition-all hover:shadow-lg ${
                      isBestRate
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-primary'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800">
                          {bank.banque}
                          {isBestRate && (
                            <span className="ml-2 text-sm bg-green-500 text-white px-3 py-1 rounded-full">
                              Meilleur taux
                            </span>
                          )}
                        </h3>
                        {bank.contact && (
                          <p className="text-sm text-gray-600 mt-1">
                            📞 {bank.contact}
                          </p>
                        )}
                      </div>
                      <div className="text-right mt-4 md:mt-0">
                        <div className="text-sm text-gray-600">Taux annuel</div>
                        <div className="text-3xl font-bold text-primary">
                          {creditInfo.tauxMin}% - {creditInfo.tauxMax}%
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="text-sm text-gray-600">Durée max</div>
                        <div className="text-xl font-bold text-gray-800">
                          {creditInfo.dureeMax} ans
                        </div>
                      </div>
                      <div className="bg-orange-50 rounded-lg p-3">
                        <div className="text-sm text-gray-600">Apport min</div>
                        <div className="text-xl font-bold text-gray-800">
                          {creditInfo.apportMin}%
                        </div>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-3">
                        <div className="text-sm text-gray-600">Taux moyen</div>
                        <div className="text-xl font-bold text-gray-800">
                          {((creditInfo.tauxMin + creditInfo.tauxMax) / 2).toFixed(2)}%
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Avantages:</h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {bank.avantages.map((avantage, idx) => (
                          <li key={idx} className="text-sm text-gray-700">
                            ✓ {avantage}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {bank.website && (
                      <div className="mt-4">
                        <a
                          href={`https://${bank.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-all text-sm font-semibold"
                        >
                          🌐 Visiter le site
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Important Notes */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Informations importantes
          </h2>
          <div className="space-y-3 text-sm text-gray-700">
            <p className="flex items-start">
              <span className="text-lg mr-2">ℹ️</span>
              <span>
                Les taux affichés sont indicatifs et peuvent varier selon votre profil (revenus, apport, durée, etc.)
              </span>
            </p>
            <p className="flex items-start">
              <span className="text-lg mr-2">⚠️</span>
              <span>
                Le taux effectif global (TEG) inclut les frais de dossier, d'assurance et de garantie
              </span>
            </p>
            <p className="flex items-start">
              <span className="text-lg mr-2">📄</span>
              <span>
                Documents généralement requis: pièce d'identité, justificatifs de revenus (3 derniers mois), relevés bancaires, titre de propriété (pour crédit immobilier)
              </span>
            </p>
            <p className="flex items-start">
              <span className="text-lg mr-2">💡</span>
              <span>
                Contactez directement les banques pour obtenir une simulation personnalisée et un devis officiel
              </span>
            </p>
            <p className="flex items-start">
              <span className="text-lg mr-2">🔒</span>
              <span>
                Vérifiez votre capacité d'endettement: vos mensualités de crédit ne doivent pas dépasser 33% de vos revenus
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BankRatesPage;
