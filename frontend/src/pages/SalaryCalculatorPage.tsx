import { useState } from 'react';
import {
  calculateNetSalary,
  calculateGrossSalary,
  getIRSABracketInfo,
  formatAriary,
  calculateEmployerContributions,
  SalaryBreakdown,
} from '../utils/salaryCalculator';

type CalculationMode = 'brutToNet' | 'netToBrut';

function SalaryCalculatorPage() {
  const [mode, setMode] = useState<CalculationMode>('brutToNet');
  const [inputValue, setInputValue] = useState<string>('1000000');
  const [breakdown, setBreakdown] = useState<SalaryBreakdown | null>(null);

  const handleCalculate = () => {
    const value = parseFloat(inputValue.replace(/\s/g, ''));

    if (isNaN(value) || value <= 0) {
      alert('Veuillez entrer un montant valide');
      return;
    }

    if (mode === 'brutToNet') {
      const result = calculateNetSalary(value);
      setBreakdown(result);
    } else {
      const brutCalcule = calculateGrossSalary(value);
      const result = calculateNetSalary(brutCalcule);
      setBreakdown(result);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setInputValue(value);
  };

  const employerContributions = breakdown
    ? calculateEmployerContributions(breakdown.salaireBrut)
    : null;

  const irsaInfo = breakdown ? getIRSABracketInfo(breakdown.salaireImposable) : null;

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            💰 Calculateur de Salaire Madagascar
          </h1>
          <p className="text-gray-300 text-lg">
            Calculez votre salaire net avec IRSA et cotisations sociales
          </p>
        </div>

        {/* Mode Selection */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Mode de calcul</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setMode('brutToNet')}
              className={`p-4 rounded-xl border-2 transition-all ${
                mode === 'brutToNet'
                  ? 'border-primary bg-primary text-white shadow-lg'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-primary'
              }`}
            >
              <div className="text-lg font-semibold mb-1">Salaire Brut → Net</div>
              <div className="text-sm opacity-90">
                Je connais mon salaire brut
              </div>
            </button>

            <button
              onClick={() => setMode('netToBrut')}
              className={`p-4 rounded-xl border-2 transition-all ${
                mode === 'netToBrut'
                  ? 'border-primary bg-primary text-white shadow-lg'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-primary'
              }`}
            >
              <div className="text-lg font-semibold mb-1">Salaire Net → Brut</div>
              <div className="text-sm opacity-90">
                Je veux un salaire net spécifique
              </div>
            </button>
          </div>
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {mode === 'brutToNet' ? 'Salaire Brut Mensuel' : 'Salaire Net Souhaité'}
          </h2>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Montant en Ariary
              </label>
              <input
                type="text"
                value={inputValue ? parseInt(inputValue).toLocaleString('fr-FR') : ''}
                onChange={handleInputChange}
                placeholder="Ex: 1 000 000"
                className="w-full px-4 py-3 text-2xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={handleCalculate}
                className="w-full md:w-auto bg-gradient-to-r from-primary to-primary-dark text-white font-bold py-3 px-8 rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
              >
                Calculer
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {breakdown && (
          <>
            {/* Main Result */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl shadow-2xl p-8 mb-6 text-white">
              <div className="text-center">
                <div className="text-lg mb-2 opacity-90">
                  {mode === 'brutToNet' ? 'Votre salaire net est' : 'Salaire brut nécessaire'}
                </div>
                <div className="text-5xl font-bold mb-2">
                  {formatAriary(mode === 'brutToNet' ? breakdown.salaireNet : breakdown.salaireBrut)}
                </div>
                {mode === 'netToBrut' && (
                  <div className="text-lg opacity-90">
                    Pour obtenir {formatAriary(breakdown.salaireNet)} net
                  </div>
                )}
              </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Détail du Calcul</h2>

              <div className="space-y-4">
                {/* Salaire Brut */}
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="text-lg font-semibold text-gray-700">Salaire Brut</span>
                  <span className="text-xl font-bold text-gray-900">
                    {formatAriary(breakdown.salaireBrut)}
                  </span>
                </div>

                {/* Cotisations Sociales */}
                <div className="bg-red-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-800">Cotisations Sociales (Part Salarié)</span>
                    <span className="font-bold text-red-600">
                      - {formatAriary(breakdown.totalCotisations)}
                    </span>
                  </div>
                  <div className="ml-4 space-y-1 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>• CNAPS (1%)</span>
                      <span>{formatAriary(breakdown.cotisationsCNAPS)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>• OSTIE (1%)</span>
                      <span>{formatAriary(breakdown.cotisationsOSTIE)}</span>
                    </div>
                  </div>
                </div>

                {/* Salaire Imposable */}
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="text-lg font-semibold text-gray-700">Salaire Imposable</span>
                  <span className="text-xl font-bold text-gray-900">
                    {formatAriary(breakdown.salaireImposable)}
                  </span>
                </div>

                {/* IRSA */}
                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-800">
                      IRSA ({(breakdown.tauxIRSA * 100).toFixed(0)}%)
                    </span>
                    <span className="font-bold text-orange-600">
                      - {formatAriary(breakdown.irsa)}
                    </span>
                  </div>
                  {irsaInfo && (
                    <div className="ml-4 text-sm text-gray-600">
                      <div>Tranche: {irsaInfo.tranche}</div>
                      <div>Taux: {irsaInfo.taux}</div>
                      <div>Déduction: {irsaInfo.deduction}</div>
                    </div>
                  )}
                </div>

                {/* Salaire Net */}
                <div className="flex justify-between items-center py-4 bg-green-50 rounded-lg px-4">
                  <span className="text-xl font-bold text-gray-800">Salaire Net</span>
                  <span className="text-2xl font-bold text-green-600">
                    {formatAriary(breakdown.salaireNet)}
                  </span>
                </div>
              </div>
            </div>

            {/* Employer Contributions */}
            {employerContributions && (
              <div className="bg-white rounded-2xl shadow-2xl p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  💼 Informations Employeur
                </h2>
                <p className="text-gray-600 mb-4 text-sm">
                  Coûts pour l'employeur (à titre indicatif)
                </p>

                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-700">CNAPS Employeur (13%)</span>
                    <span className="font-semibold text-gray-900">
                      {formatAriary(employerContributions.cnapsEmployeur)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-700">OSTIE Employeur (5%)</span>
                    <span className="font-semibold text-gray-900">
                      {formatAriary(employerContributions.ostieEmployeur)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 bg-blue-50 rounded-lg px-4">
                    <span className="text-lg font-bold text-gray-800">Coût Total Employeur</span>
                    <span className="text-xl font-bold text-blue-600">
                      {formatAriary(employerContributions.coutTotalEmployeur)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Barème IRSA Reference */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 mt-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">📊 Barème IRSA 2024</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left">Tranche (Ar)</th>
                      <th className="px-4 py-2 text-left">Taux</th>
                      <th className="px-4 py-2 text-left">Déduction (Ar)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="px-4 py-2">0 - 350 000</td>
                      <td className="px-4 py-2">0%</td>
                      <td className="px-4 py-2">0</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2">350 001 - 400 000</td>
                      <td className="px-4 py-2">5%</td>
                      <td className="px-4 py-2">17 500</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2">400 001 - 500 000</td>
                      <td className="px-4 py-2">10%</td>
                      <td className="px-4 py-2">37 500</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2">500 001 - 600 000</td>
                      <td className="px-4 py-2">15%</td>
                      <td className="px-4 py-2">62 500</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2">600 001 et plus</td>
                      <td className="px-4 py-2">20%</td>
                      <td className="px-4 py-2">92 500</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-4 p-4 bg-blue-50 rounded-lg text-sm text-gray-700">
                <p className="font-semibold mb-2">Notes importantes:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>CNAPS: 1% salarié + 13% employeur</li>
                  <li>OSTIE: 1% salarié + 5% employeur</li>
                  <li>IRSA calculé sur le salaire imposable (brut - cotisations)</li>
                  <li>Barème valable pour les salaires mensuels</li>
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SalaryCalculatorPage;
