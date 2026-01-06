import { useState } from 'react';
import {
  calculateShippingCost,
  formatDevise,
  convertDevise,
  getDelaiEstime,
  getPortsInfo,
  CONTAINER_PRICES,
  ShippingCost,
  ShippingInput,
} from '../utils/shippingCalculator';

type Direction = 'france-madagascar' | 'madagascar-france';
type Devise = 'EUR' | 'MGA' | 'USD';
type CategorieDouane = 'standard' | 'reduit' | 'eleve';

function ShippingCalculatorPage() {
  const [direction, setDirection] = useState<Direction>('france-madagascar');
  const [containerType, setContainerType] = useState<string>(CONTAINER_PRICES[0].type);
  const [volumeM3, setVolumeM3] = useState<string>('10');
  const [poidsKg, setPoidsKg] = useState<string>('1000');
  const [valeurMarchandise, setValeurMarchandise] = useState<string>('5000');
  const [categorieDouane, setCategorieDouane] = useState<CategorieDouane>('standard');
  const [devise, setDevise] = useState<Devise>('EUR');
  const [result, setResult] = useState<ShippingCost | null>(null);

  const handleCalculate = () => {
    const volume = parseFloat(volumeM3);
    const valeur = parseFloat(valeurMarchandise);

    if (isNaN(volume) || volume <= 0) {
      alert('Veuillez entrer un volume valide');
      return;
    }

    if (isNaN(valeur) || valeur <= 0) {
      alert('Veuillez entrer une valeur de marchandise valide');
      return;
    }

    const input: ShippingInput = {
      direction,
      containerType,
      volumeM3: volume,
      poidsKg: parseFloat(poidsKg),
      valeurMarchandise: valeur,
      categorieDouane,
      devise,
    };

    const calculatedResult = calculateShippingCost(input);
    setResult(calculatedResult);
  };

  const portsInfo = getPortsInfo(direction);
  const delaiEstime = getDelaiEstime(direction);

  const formatMontant = (montantEUR: number) => {
    const montantConverti = convertDevise(montantEUR, devise);
    return formatDevise(montantConverti, devise);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Calculateur de Transport Maritime
          </h1>
          <p className="text-gray-300 text-lg">
            France ⇄ Madagascar - Fret maritime et taxes douanières
          </p>
        </div>

        {/* Direction Selection */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Direction du transport</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setDirection('france-madagascar')}
              className={`p-4 rounded-xl border-2 transition-all ${
                direction === 'france-madagascar'
                  ? 'border-primary bg-primary text-white shadow-lg'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-primary'
              }`}
            >
              <div className="text-lg font-semibold mb-1">France → Madagascar</div>
              <div className="text-sm opacity-90">
                Importation à Madagascar (avec taxes douanières)
              </div>
            </button>

            <button
              onClick={() => setDirection('madagascar-france')}
              className={`p-4 rounded-xl border-2 transition-all ${
                direction === 'madagascar-france'
                  ? 'border-primary bg-primary text-white shadow-lg'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-primary'
              }`}
            >
              <div className="text-lg font-semibold mb-1">Madagascar → France</div>
              <div className="text-sm opacity-90">
                Exportation vers la France
              </div>
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Détails de l'envoi</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Container Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de conteneur
              </label>
              <select
                value={containerType}
                onChange={(e) => setContainerType(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
                {CONTAINER_PRICES.map((container) => (
                  <option key={container.type} value={container.type}>
                    {container.type} - {container.prixEUR}€
                  </option>
                ))}
              </select>
            </div>

            {/* Volume */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Volume (m³)
              </label>
              <input
                type="number"
                step="0.1"
                value={volumeM3}
                onChange={(e) => setVolumeM3(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            {/* Poids */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Poids (kg)
              </label>
              <input
                type="number"
                step="1"
                value={poidsKg}
                onChange={(e) => setPoidsKg(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            {/* Valeur */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valeur marchandise (EUR)
              </label>
              <input
                type="number"
                step="100"
                value={valeurMarchandise}
                onChange={(e) => setValeurMarchandise(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            {/* Catégorie douane */}
            {direction === 'france-madagascar' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie douanière
                </label>
                <select
                  value={categorieDouane}
                  onChange={(e) => setCategorieDouane(e.target.value as CategorieDouane)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="reduit">Taux réduit (5%) - Première nécessité</option>
                  <option value="standard">Taux standard (10%) - Produits courants</option>
                  <option value="eleve">Taux élevé (20%) - Produits de luxe</option>
                </select>
              </div>
            )}

            {/* Devise */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Devise d'affichage
              </label>
              <select
                value={devise}
                onChange={(e) => setDevise(e.target.value as Devise)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="EUR">Euro (EUR)</option>
                <option value="MGA">Ariary Malgache (MGA)</option>
                <option value="USD">Dollar US (USD)</option>
              </select>
            </div>
          </div>

          {/* Calculate Button */}
          <div className="mt-6">
            <button
              onClick={handleCalculate}
              className="w-full bg-gradient-to-r from-primary to-primary-dark text-white font-bold py-4 px-8 rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
            >
              Calculer le coût total
            </button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <>
            {/* Main Result */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-2xl p-8 mb-6 text-white">
              <div className="text-center">
                <div className="text-lg mb-2 opacity-90">
                  Coût total estimé
                </div>
                <div className="text-5xl font-bold mb-4">
                  {formatMontant(result.coutTotal)}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-white/20 rounded-lg p-3">
                    <div className="opacity-90">Transport maritime</div>
                    <div className="text-xl font-bold">{formatMontant(result.totalTransport)}</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-3">
                    <div className="opacity-90">Taxes et douanes</div>
                    <div className="text-xl font-bold">{formatMontant(result.totalTaxes)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Transport Details */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Détail des frais de transport</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="text-gray-700">Fret maritime</span>
                  <span className="font-bold text-gray-900">{formatMontant(result.fretMaritime)}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="text-gray-700">Assurance (1.5%)</span>
                  <span className="font-bold text-gray-900">{formatMontant(result.assurance)}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="text-gray-700">Manutention portuaire</span>
                  <span className="font-bold text-gray-900">{formatMontant(result.manutention)}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="text-gray-700">Frais de documentation</span>
                  <span className="font-bold text-gray-900">{formatMontant(result.documentationFrais)}</span>
                </div>
                <div className="flex justify-between items-center py-4 bg-blue-50 rounded-lg px-4">
                  <span className="text-lg font-bold text-gray-800">Sous-total transport</span>
                  <span className="text-xl font-bold text-blue-600">
                    {formatMontant(result.totalTransport)}
                  </span>
                </div>
              </div>
            </div>

            {/* Customs Details (only for imports to Madagascar) */}
            {direction === 'france-madagascar' && result.totalTaxes > 0 && (
              <div className="bg-white rounded-2xl shadow-2xl p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Taxes douanières Madagascar
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-gray-700">Droits de douane</span>
                    <span className="font-bold text-gray-900">{formatMontant(result.droitDouane)}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-gray-700">Taxe statistique (2%)</span>
                    <span className="font-bold text-gray-900">{formatMontant(result.taxeStatistique)}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-gray-700">TVA Madagascar (20%)</span>
                    <span className="font-bold text-gray-900">{formatMontant(result.tva)}</span>
                  </div>
                  <div className="flex justify-between items-center py-4 bg-orange-50 rounded-lg px-4">
                    <span className="text-lg font-bold text-gray-800">Sous-total taxes</span>
                    <span className="text-xl font-bold text-orange-600">
                      {formatMontant(result.totalTaxes)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Shipping Info */}
            <div className="bg-white rounded-2xl shadow-2xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Informations de transport
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="font-bold text-gray-800 mb-2">Ports de départ</h3>
                  <ul className="space-y-1">
                    {portsInfo.depart.map((port) => (
                      <li key={port} className="text-gray-700">• {port}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-bold text-gray-800 mb-2">Ports d'arrivée</h3>
                  <ul className="space-y-1">
                    {portsInfo.arrivee.map((port) => (
                      <li key={port} className="text-gray-700">• {port}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4 mb-4">
                <h3 className="font-bold text-gray-800 mb-2">Délai estimé</h3>
                <p className="text-gray-700">{delaiEstime}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-bold text-gray-800 mb-2">Notes importantes</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Les tarifs sont indicatifs et peuvent varier selon la compagnie (LMI, CMA CGM, MSC, etc.)</li>
                  <li>• Les délais peuvent être affectés par les conditions météo et les escales</li>
                  {direction === 'france-madagascar' && (
                    <>
                      <li>• Les taxes douanières sont calculées sur la valeur CIF (Cost + Insurance + Freight)</li>
                      <li>• Prévoir des frais de dédouanement et de transport terrestre à Madagascar</li>
                      <li>• Certains produits peuvent nécessiter des licences d'importation</li>
                    </>
                  )}
                  {direction === 'madagascar-france' && (
                    <li>• Pour les exportations, vérifier les taxes et réglementations douanières européennes</li>
                  )}
                  <li>• Contactez un transitaire pour un devis détaillé et personnalisé</li>
                </ul>
              </div>
            </div>
          </>
        )}

        {/* Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-3xl mb-3">📦</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Compagnies maritimes</h3>
            <p className="text-sm text-gray-600">
              LMI Line, CMA CGM, MSC, Maersk proposent des services réguliers France-Madagascar
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-3xl mb-3">⏱️</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Délais de transit</h3>
            <p className="text-sm text-gray-600">
              Compter 25-35 jours de port à port, plus dédouanement et acheminement final
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-3xl mb-3">📋</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Documents requis</h3>
            <p className="text-sm text-gray-600">
              Facture commerciale, liste de colisage, connaissement (Bill of Lading), certificat d'origine
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShippingCalculatorPage;
