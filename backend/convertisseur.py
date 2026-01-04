import requests
from datetime import datetime, timedelta
import json

print("=" * 70)
print("💱 CONVERTISSEUR DE DEVISES MULTI-MONNAIES / MULTI-CURRENCY CONVERTER 💱")
print("=" * 70)

# LISTE DES DEVISES SUPPORTÉES / SUPPORTED CURRENCIES
CURRENCIES = {
    'USD': 'Dollar américain / US Dollar',
    'EUR': 'Euro',
    'GBP': 'Livre sterling / British Pound',
    'JPY': 'Yen japonais / Japanese Yen',
    'CNY': 'Yuan chinois / Chinese Yuan',
    'CAD': 'Dollar canadien / Canadian Dollar',
    'AUD': 'Dollar australien / Australian Dollar',
    'INR': 'Roupie indienne / Indian Rupee',
    'AED': 'Dirham des Émirats / UAE Dirham',
    'SAR': 'Riyal saoudien / Saudi Riyal',
    'MGA': 'Ariary malgache / Malagasy Ariary'
}

# Taux de change par défaut (utilisés si l'API est indisponible)
# Default exchange rates (used if API is unavailable)
DEFAULT_RATES_BASE_EUR = {
    'USD': 1.09, 'GBP': 0.85, 'JPY': 160.0, 'CNY': 7.85,
    'CAD': 1.48, 'AUD': 1.65, 'INR': 89.5, 'AED': 4.00,
    'SAR': 4.08, 'MGA': 5070.0, 'EUR': 1.0
}

# Variables globales pour le cache
EXCHANGE_RATES = {}
last_update = None
cache_duration = timedelta(hours=1)  # Cache valide pendant 1 heure

def build_exchange_matrix(base_rates):
    """
    Construit une matrice complète de taux de change à partir des taux de base
    Build a complete exchange rate matrix from base rates
    """
    matrix = {}

    for from_curr in CURRENCIES.keys():
        matrix[from_curr] = {}
        for to_curr in CURRENCIES.keys():
            if from_curr == to_curr:
                matrix[from_curr][to_curr] = 1.0
            else:
                # Conversion via EUR comme devise de base
                # from_curr -> EUR -> to_curr
                from_to_eur = 1.0 / base_rates.get(from_curr, 1.0)
                eur_to_to = base_rates.get(to_curr, 1.0)
                matrix[from_curr][to_curr] = from_to_eur * eur_to_to

    return matrix

def fetch_live_rates():
    """
    Récupère les taux de change en temps réel depuis plusieurs APIs
    Fetch live exchange rates from multiple APIs
    """
    global EXCHANGE_RATES, last_update

    try:
        print("\n🔄 Récupération des taux en temps réel... / Fetching live rates...")

        # Dictionnaire pour stocker les taux avec EUR comme base
        base_rates = {'EUR': 1.0}

        # API Frankfurter - Gratuite et sans clé API
        # Supporte: USD, GBP, JPY, CNY, CAD, AUD, INR, AED, SAR
        try:
            response_eur = requests.get('https://api.frankfurter.app/latest?from=EUR', timeout=5)
            response_eur.raise_for_status()
            data_eur = response_eur.json()

            # Récupérer tous les taux disponibles
            for currency in ['USD', 'GBP', 'JPY', 'CNY', 'CAD', 'AUD', 'INR', 'AED', 'SAR']:
                if currency in data_eur['rates']:
                    base_rates[currency] = data_eur['rates'][currency]
                else:
                    base_rates[currency] = DEFAULT_RATES_BASE_EUR.get(currency, 1.0)

            print("  ✓ Taux Frankfurter récupérés / Frankfurter rates fetched")

        except Exception as e:
            print(f"  ⚠ Erreur Frankfurter API: {e}")
            # Utiliser les taux par défaut pour ces devises
            for currency in ['USD', 'GBP', 'JPY', 'CNY', 'CAD', 'AUD', 'INR', 'AED', 'SAR']:
                base_rates[currency] = DEFAULT_RATES_BASE_EUR.get(currency, 1.0)

        # API Currency pour MGA, AED, SAR - Gratuite et open source
        # Ces devises ne sont pas disponibles via Frankfurter
        try:
            response_currency_api = requests.get(
                'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/eur.json',
                timeout=5
            )
            response_currency_api.raise_for_status()
            data_currency_api = response_currency_api.json()

            # Récupérer MGA (Ariary)
            if 'mga' in data_currency_api.get('eur', {}):
                base_rates['MGA'] = data_currency_api['eur']['mga']
                print("  ✓ Taux Ariary (MGA) récupérés / Ariary rates fetched")
            else:
                base_rates['MGA'] = DEFAULT_RATES_BASE_EUR.get('MGA', 5070.0)

            # Récupérer AED (Dirham UAE)
            if 'aed' in data_currency_api.get('eur', {}):
                base_rates['AED'] = data_currency_api['eur']['aed']
                print("  ✓ Taux Dirham (AED) récupérés / Dirham rates fetched")
            else:
                base_rates['AED'] = DEFAULT_RATES_BASE_EUR.get('AED', 4.00)

            # Récupérer SAR (Riyal saoudien)
            if 'sar' in data_currency_api.get('eur', {}):
                base_rates['SAR'] = data_currency_api['eur']['sar']
                print("  ✓ Taux Riyal (SAR) récupérés / Riyal rates fetched")
            else:
                base_rates['SAR'] = DEFAULT_RATES_BASE_EUR.get('SAR', 4.08)

        except Exception as e:
            print(f"  ⚠ Erreur Currency API: {e}")
            base_rates['MGA'] = DEFAULT_RATES_BASE_EUR.get('MGA', 5070.0)
            base_rates['AED'] = DEFAULT_RATES_BASE_EUR.get('AED', 4.00)
            base_rates['SAR'] = DEFAULT_RATES_BASE_EUR.get('SAR', 4.08)

        # Construire la matrice complète de conversion
        EXCHANGE_RATES = build_exchange_matrix(base_rates)

        last_update = datetime.now()

        # Afficher quelques taux clés
        print(f"\n✓ Taux mis à jour ({last_update.strftime('%Y-%m-%d %H:%M')})")
        print(f"  1 EUR = {EXCHANGE_RATES['EUR']['USD']:.4f} USD")
        print(f"  1 EUR = {EXCHANGE_RATES['EUR']['GBP']:.4f} GBP")
        print(f"  1 EUR = {EXCHANGE_RATES['EUR']['MGA']:.2f} MGA (Ariary)")
        print(f"  1 USD = {EXCHANGE_RATES['USD']['EUR']:.4f} EUR")
        print("=" * 70)
        return True

    except Exception as e:
        print(f"⚠ Erreur inattendue / Unexpected error: {e}")
        print("→ Utilisation des taux par défaut / Using default rates")
        EXCHANGE_RATES = build_exchange_matrix(DEFAULT_RATES_BASE_EUR)
        return False

def should_update_rates():
    """Vérifie si les taux doivent être mis à jour / Check if rates need updating"""
    if last_update is None:
        return True
    return datetime.now() - last_update > cache_duration

def convert_currency(amount, from_currency, to_currency):
    """
    Convertit un montant d'une devise à une autre
    Convert an amount from one currency to another
    """
    if from_currency not in EXCHANGE_RATES or to_currency not in EXCHANGE_RATES[from_currency]:
        return None

    rate = EXCHANGE_RATES[from_currency][to_currency]
    return amount * rate

def display_menu():
    """Affiche le menu des devises / Display currency menu"""
    print("\n" + "=" * 70)
    print("DEVISES DISPONIBLES / AVAILABLE CURRENCIES:")
    print("=" * 70)

    currency_list = list(CURRENCIES.items())

    for i, (code, name) in enumerate(currency_list, 1):
        print(f"{i:2d}. {code:4s} - {name}")

    print(f"{len(currency_list) + 1:2d}. 🔄 Actualiser les taux / Refresh rates")
    print(f"{len(currency_list) + 2:2d}. ❌ Quitter / Quit")
    print("=" * 70)

def get_currency_choice(prompt):
    """Obtient le choix de devise de l'utilisateur / Get user's currency choice"""
    currency_list = list(CURRENCIES.keys())
    max_choice = len(currency_list)

    while True:
        try:
            choice = int(input(prompt))
            if 1 <= choice <= max_choice:
                return currency_list[choice - 1]
            elif choice == max_choice + 1:
                return 'REFRESH'
            elif choice == max_choice + 2:
                return None
            else:
                print(f"Choix invalide / Invalid choice. Entrez un nombre entre 1 et {max_choice + 2}")
        except ValueError:
            print("Veuillez entrer un nombre / Please enter a number")

def display_conversion_table(amount, from_currency):
    """
    Affiche une table de conversion rapide pour un montant donné
    Display a quick conversion table for a given amount
    """
    print(f"\n📊 Table de conversion pour {amount:,.2f} {from_currency}:")
    print("=" * 70)

    for to_currency in CURRENCIES.keys():
        if to_currency != from_currency:
            result = convert_currency(amount, from_currency, to_currency)
            if result is not None:
                print(f"  → {result:>15,.2f} {to_currency:4s} ({CURRENCIES[to_currency][:30]})")

    print("=" * 70)

def main():
    """Fonction principale du convertisseur / Main converter function"""

    # Récupération des taux en temps réel au démarrage
    fetch_live_rates()

    while True:
        # Vérifier si on doit rafraîchir les taux automatiquement
        if should_update_rates():
            print("\n⏰ Cache expiré, mise à jour des taux... / Cache expired, updating rates...")
            fetch_live_rates()

        display_menu()

        # Devise source / Source currency
        max_choice = len(CURRENCIES)
        from_currency = get_currency_choice(f"\nChoisissez la devise source (1-{max_choice + 2}) / Choose source currency: ")

        if from_currency is None:
            print("\n👋 Merci d'avoir utilisé le convertisseur! / Thank you for using the converter!")
            break
        elif from_currency == 'REFRESH':
            fetch_live_rates()
            continue

        # Montant / Amount
        try:
            amount = float(input(f"\nEntrez le montant en {from_currency} / Enter amount in {from_currency}: "))

            # Demander si l'utilisateur veut voir toutes les conversions
            show_all = input("\nAfficher toutes les conversions? (o/n) / Show all conversions? (y/n): ").lower()

            if show_all in ['o', 'y', 'oui', 'yes']:
                display_conversion_table(amount, from_currency)
            else:
                # Devise cible / Target currency
                to_currency = get_currency_choice(f"Choisissez la devise cible (1-{max_choice + 2}) / Choose target currency: ")

                if to_currency is None:
                    print("\n👋 Merci d'avoir utilisé le convertisseur! / Thank you for using the converter!")
                    break
                elif to_currency == 'REFRESH':
                    fetch_live_rates()
                    continue

                # Conversion
                result = convert_currency(amount, from_currency, to_currency)

                if result is not None:
                    print(f"\n✓ Résultat / Result:")
                    print("=" * 70)
                    print(f"  {amount:,.2f} {from_currency} = {result:,.2f} {to_currency}")
                    print(f"  Taux de change / Exchange rate: 1 {from_currency} = {EXCHANGE_RATES[from_currency][to_currency]:.6f} {to_currency}")
                    print("=" * 70)
                else:
                    print("Erreur de conversion / Conversion error")

        except ValueError:
            print("Montant invalide / Invalid amount")

        # Continuer?
        continue_choice = input("\nAutre conversion? (o/n) / Another conversion? (y/n): ").lower()
        if continue_choice not in ['o', 'y', 'oui', 'yes']:
            print("\n👋 Merci d'avoir utilisé le convertisseur! / Thank you for using the converter!")
            break

# Lancer le convertisseur / Launch converter
if __name__ == "__main__":
    main()
