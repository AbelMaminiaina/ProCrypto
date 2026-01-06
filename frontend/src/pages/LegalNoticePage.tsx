function LegalNoticePage() {
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Mentions Légales</h1>

          {/* Éditeur du site */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Éditeur du site</h2>
            <div className="text-gray-700 space-y-2">
              <p><strong>Nom du site :</strong> ProCrypto</p>
              <p><strong>Nature :</strong> Application web d'information et de calcul financier</p>
              <p><strong>Responsable de publication :</strong> [À COMPLÉTER - Votre nom/entreprise]</p>
              <p><strong>Adresse :</strong> [À COMPLÉTER - Votre adresse]</p>
              <p><strong>Email :</strong> [À COMPLÉTER - Votre email de contact]</p>
              <p><strong>Pays :</strong> Madagascar</p>
            </div>
          </section>

          {/* Hébergement */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Hébergement</h2>
            <div className="text-gray-700 space-y-2">
              <p><strong>Hébergeur :</strong> [À COMPLÉTER - Nom de votre hébergeur]</p>
              <p><strong>Adresse :</strong> [À COMPLÉTER - Adresse de l'hébergeur]</p>
              <p className="text-sm italic">
                (Exemple : Vercel Inc., 340 S Lemon Ave, Walnut, CA 91789, USA)
              </p>
            </div>
          </section>

          {/* Nature du service */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Nature du service</h2>
            <div className="text-gray-700 space-y-3">
              <p className="font-semibold">
                ProCrypto est un site web d'information gratuit proposant des outils de calcul et de comparaison à titre purement indicatif.
              </p>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <p className="font-bold text-yellow-800 mb-2">⚠️ IMPORTANT :</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Ce site ne constitue en aucun cas un conseil financier personnalisé</li>
                  <li>Ce site n'est pas un courtier en crédit ou en opérations bancaires</li>
                  <li>Ce site ne collecte aucune commission ou rémunération des établissements bancaires</li>
                  <li>Les informations fournies sont indicatives et non contractuelles</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Avertissement sur les taux de crédit */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              4. Avertissement - Comparateur de taux bancaires
            </h2>
            <div className="text-gray-700 space-y-3">
              <p>
                Les taux de crédit affichés proviennent d'informations publiques collectées auprès des
                établissements bancaires et sont fournis <strong>à titre indicatif uniquement</strong>.
              </p>
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <p className="font-bold text-red-800 mb-2">Conditions importantes :</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-800">
                  <li>Les taux peuvent varier selon le profil de l'emprunteur (revenus, apport, durée, garanties)</li>
                  <li>Seules les banques sont habilitées à accorder des crédits et à fournir des offres contractuelles</li>
                  <li>Les simulations de crédit sont des estimations mathématiques approximatives</li>
                  <li>Le TAEG (Taux Annuel Effectif Global) réel peut différer des simulations</li>
                  <li>Consultez toujours un établissement bancaire pour obtenir une offre personnalisée</li>
                  <li>L'emprunt vous engage et doit être remboursé</li>
                  <li>Vérifiez vos capacités de remboursement avant de vous engager</li>
                </ul>
              </div>
              <p className="text-sm italic">
                <strong>Sources des données :</strong> Sites web officiels des banques, plaquettes commerciales publiques,
                informations communiquées par les établissements. Dernière mise à jour : Janvier 2026.
              </p>
            </div>
          </section>

          {/* Avertissement Cryptomonnaies */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              5. Avertissement - Cryptomonnaies
            </h2>
            <div className="text-gray-700 space-y-3">
              <div className="bg-orange-50 border-l-4 border-orange-400 p-4">
                <p className="font-bold text-orange-800 mb-2">⚠️ Risques des cryptomonnaies :</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-800">
                  <li>Les cryptomonnaies sont des actifs hautement volatils et spéculatifs</li>
                  <li>Vous pouvez perdre tout ou partie de votre investissement</li>
                  <li>Les performances passées ne préjugent pas des performances futures</li>
                  <li>N'investissez que des sommes que vous pouvez vous permettre de perdre</li>
                  <li>Ce site fournit uniquement des informations, pas de conseils d'investissement</li>
                  <li>Consultez un conseiller financier agréé avant tout investissement important</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Propriété intellectuelle */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Propriété intellectuelle</h2>
            <div className="text-gray-700 space-y-2">
              <p>
                L'ensemble du contenu de ce site (textes, graphiques, logos, icônes, images, code source)
                est la propriété exclusive de l'éditeur, sauf mention contraire.
              </p>
              <p>
                Toute reproduction, distribution, modification ou utilisation à des fins commerciales
                sans autorisation préalable est interdite.
              </p>
              <p className="text-sm">
                <strong>Marques et logos des banques :</strong> Les noms et logos des établissements bancaires
                mentionnés appartiennent à leurs propriétaires respectifs. Leur utilisation se limite à l'information
                comparative et ne constitue pas un partenariat commercial.
              </p>
            </div>
          </section>

          {/* Protection des données */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              7. Protection des données personnelles (RGPD)
            </h2>
            <div className="text-gray-700 space-y-3">
              <p>
                Ce site est conforme au Règlement Général sur la Protection des Données (RGPD) et à la
                législation malgache sur la protection des données.
              </p>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="font-semibold mb-2">Données collectées :</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li><strong>Comptes utilisateurs :</strong> Email, mot de passe chiffré (pour les fonctionnalités protégées)</li>
                  <li><strong>Données de navigation :</strong> Cookies techniques nécessaires au fonctionnement du site</li>
                  <li><strong>Simulations :</strong> Les calculs sont effectués localement, aucune donnée n'est transmise</li>
                </ul>
              </div>

              <div className="bg-green-50 p-4 rounded-lg mt-3">
                <p className="font-semibold mb-2">Vos droits :</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Droit d'accès à vos données personnelles</li>
                  <li>Droit de rectification et de suppression</li>
                  <li>Droit à la portabilité de vos données</li>
                  <li>Droit d'opposition au traitement</li>
                  <li>Droit de limitation du traitement</li>
                </ul>
                <p className="text-sm mt-2">
                  Pour exercer ces droits, contactez : <strong>[VOTRE EMAIL]</strong>
                </p>
              </div>

              <p className="text-sm">
                <strong>Conservation des données :</strong> Les données de compte sont conservées pendant la durée
                d'utilisation du service et supprimées à la demande de l'utilisateur.
              </p>

              <p className="text-sm">
                <strong>Sécurité :</strong> Les mots de passe sont chiffrés. Aucune donnée bancaire ou financière
                personnelle n'est stockée sur nos serveurs.
              </p>
            </div>
          </section>

          {/* Cookies */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Cookies</h2>
            <div className="text-gray-700 space-y-2">
              <p>
                Ce site utilise des cookies strictement nécessaires à son fonctionnement (authentification,
                préférences utilisateur).
              </p>
              <p className="text-sm">
                <strong>Cookies utilisés :</strong>
              </p>
              <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                <li>Cookies de session : Authentification utilisateur (si connecté)</li>
                <li>Cookies de préférence : Stockage local des paramètres d'affichage</li>
                <li>Aucun cookie de tracking ou publicitaire</li>
              </ul>
              <p className="text-sm">
                Vous pouvez désactiver les cookies dans les paramètres de votre navigateur, mais certaines
                fonctionnalités du site pourraient être limitées.
              </p>
            </div>
          </section>

          {/* Limitation de responsabilité */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">9. Limitation de responsabilité</h2>
            <div className="text-gray-700 space-y-3">
              <p>
                L'éditeur s'efforce de fournir des informations exactes et à jour, mais ne peut garantir
                l'exactitude, la complétude ou la pertinence des informations diffusées.
              </p>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="font-semibold mb-2">L'éditeur ne pourra être tenu responsable :</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Des erreurs ou omissions dans les informations fournies</li>
                  <li>Des décisions prises sur la base des informations du site</li>
                  <li>Des variations de taux bancaires non mises à jour instantanément</li>
                  <li>Des interruptions temporaires du service</li>
                  <li>Des dommages directs ou indirects résultant de l'utilisation du site</li>
                  <li>Des pertes financières liées à des investissements en cryptomonnaies</li>
                </ul>
              </div>
              <p className="text-sm font-semibold">
                L'utilisation de ce site implique l'acceptation pleine et entière des présentes mentions légales.
              </p>
            </div>
          </section>

          {/* Liens externes */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">10. Liens externes</h2>
            <div className="text-gray-700 space-y-2">
              <p>
                Ce site peut contenir des liens vers des sites web externes (banques, fournisseurs de services).
              </p>
              <p>
                L'éditeur n'est pas responsable du contenu de ces sites tiers et ne peut être tenu responsable
                des dommages résultant de leur utilisation.
              </p>
            </div>
          </section>

          {/* Droit applicable */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">11. Droit applicable</h2>
            <div className="text-gray-700 space-y-2">
              <p>
                Les présentes mentions légales sont régies par le droit malgache.
              </p>
              <p>
                En cas de litige, et à défaut d'accord amiable, les tribunaux malgaches seront seuls compétents.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">12. Contact</h2>
            <div className="text-gray-700 space-y-2">
              <p>
                Pour toute question concernant ces mentions légales ou l'utilisation du site :
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p><strong>Email :</strong> [À COMPLÉTER - Votre email]</p>
                <p><strong>Adresse :</strong> [À COMPLÉTER - Votre adresse]</p>
              </div>
            </div>
          </section>

          {/* Mise à jour */}
          <section className="mb-8">
            <div className="bg-gray-100 p-4 rounded-lg text-sm text-gray-600">
              <p>
                <strong>Dernière mise à jour des mentions légales :</strong> 05 Janvier 2026
              </p>
              <p className="mt-2">
                L'éditeur se réserve le droit de modifier ces mentions légales à tout moment.
                Les utilisateurs sont invités à les consulter régulièrement.
              </p>
            </div>
          </section>

          {/* Action à compléter */}
          <div className="bg-red-50 border-2 border-red-400 rounded-xl p-6 mt-8">
            <h3 className="text-xl font-bold text-red-800 mb-3">⚠️ ACTION REQUISE</h3>
            <p className="text-red-800 mb-3">
              Avant de mettre ce site en production, vous DEVEZ compléter les informations suivantes :
            </p>
            <ul className="list-decimal list-inside space-y-2 text-sm text-red-700">
              <li>Nom complet de l'éditeur / entreprise</li>
              <li>Adresse complète (siège social si entreprise)</li>
              <li>Email de contact valide</li>
              <li>Informations sur l'hébergeur</li>
              <li>Si entreprise : Numéro d'enregistrement, NIF, STAT</li>
              <li>Vérifier la conformité avec la Commission Nationale de Protection des Données Personnelles (CNDP) de Madagascar</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LegalNoticePage;
