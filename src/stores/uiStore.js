import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const CURRENCIES = [
  { code: 'USD', symbol: '$',  label: 'US Dollar'      },
  { code: 'GBP', symbol: '£',  label: 'British Pound'  },
  { code: 'EUR', symbol: '€',  label: 'Euro'           },
  { code: 'NGN', symbol: '₦',  label: 'Nigerian Naira' },
]

const RATES = { USD: 1, GBP: 0.79, EUR: 0.92, NGN: 1620 }

export const LANGUAGES = [
  { code: 'en', label: 'English'    },
  { code: 'fr', label: 'Français'   },
  { code: 'nl', label: 'Nederlands' },
  { code: 'de', label: 'Deutsch'    },
  { code: 'sv', label: 'Svenska'    },
]

const translations = {
  en: {
    welcome: 'Welcome!', lightMode: 'Light mode', darkMode: 'Dark mode',
    language: 'Language', search: 'Search...', filterBy: 'Filter by',
    allCategories: 'All', sortBy: 'Sort by', sortNameAsc: 'Name (A–Z)',
    sortPriceAsc: 'Price: Low to High', sortPriceDesc: 'Price: High to Low',
    sortRatingDesc: 'Top Rated', products: 'Products', noResults: 'No products found.',
    addToCart: 'Add to Cart', addedToCart: 'Added to cart',
    addToFavorites: 'Add to favorites', removeFromFavorites: 'Remove from favorites',
    addedToFavorites: 'Added to favorites', removedFromFavorites: 'Removed from favorites',
    description: 'Description', off: 'off', compare: 'Compare Selected',
    comparisonResult: 'Comparison Result',
    savings: 'If you buy the cheapest product, you would save',
    selectTwo: 'Please select at least 2 products to compare.', close: 'Close',
    cart: 'Cart', emptyCart: 'Your cart is empty.',
    continueShopping: 'Continue Shopping', removeFromCart: 'Remove',
    subtotal: 'Subtotal', total: 'Total', checkout: 'Proceed to Checkout', qty: 'Qty',
    back: 'Back', notFound: 'Product not found.', footerRights: 'All rights reserved.',
    footerBuiltWith: 'Built with', favorites: 'Favorites',
    noFavorites: 'No favorites yet. Heart a product to save it here.',
    landingBadge: 'New arrivals every week',
    landingHeadline: 'Shop smarter at',
    landingSubheadline: 'Discover top-rated products across every category. Compare, favourite, and checkout in seconds.',
    landingCta: 'Shop Now',
    landingSecondary: 'View Favourites',
    landingStatProducts: 'Products', landingStatCurrencies: 'Currencies',
    landingStatLanguages: 'Languages', landingStatRating: 'Top Rating',
    landingCategoriesTitle: 'Shop by Category', landingCategoriesSub: 'Browse our curated collections',
    landingFeaturedTitle: 'Top Picks', landingFeaturedSub: 'Our highest-rated products right now',
    landingViewAll: 'View all',
    landingWhyTitle: 'Why MikunStore?', landingWhySub: 'Everything you need, nothing you don\'t',
    landingBannerTitle: 'Ready to find your next favourite?', landingBannerSub: 'Hundreds of products. Multiple currencies. Your language.',
    featureMultiLang: 'Multi-Language', featureMultiLangDesc: '5 languages supported: English, French, Dutch, German, and Swedish.',
    featureMultiCurrency: 'Multi-Currency', featureMultiCurrencyDesc: 'Pay in USD, GBP, EUR, or NGN. Prices update instantly.',
    featureDarkMode: 'Dark Mode', featureDarkModeDesc: 'Easy on the eyes day or night with a single click.',
    featureReceipt: 'PDF Receipt', featureReceiptDesc: 'Download an instant receipt after every order.',
  },
  fr: {
    welcome: 'Bienvenue !', lightMode: 'Mode clair', darkMode: 'Mode sombre',
    language: 'Langue', search: 'Rechercher...', filterBy: 'Filtrer par',
    allCategories: 'Tout', sortBy: 'Trier par', sortNameAsc: 'Nom (A–Z)',
    sortPriceAsc: 'Prix : croissant', sortPriceDesc: 'Prix : décroissant',
    sortRatingDesc: 'Mieux notés', products: 'Produits', noResults: 'Aucun produit trouvé.',
    addToCart: 'Ajouter au panier', addedToCart: 'Ajouté au panier',
    addToFavorites: 'Ajouter aux favoris', removeFromFavorites: 'Retirer des favoris',
    addedToFavorites: 'Ajouté aux favoris', removedFromFavorites: 'Retiré des favoris',
    description: 'Description', off: 'de réduction', compare: 'Comparer la sélection',
    comparisonResult: 'Résultat de la comparaison',
    savings: 'En achetant le produit le moins cher, vous économiseriez',
    selectTwo: 'Veuillez sélectionner au moins 2 produits à comparer.', close: 'Fermer',
    cart: 'Panier', emptyCart: 'Votre panier est vide.',
    continueShopping: 'Continuer les achats', removeFromCart: 'Retirer',
    subtotal: 'Sous-total', total: 'Total', checkout: 'Passer la commande', qty: 'Qté',
    back: 'Retour', notFound: 'Produit introuvable.', footerRights: 'Tous droits réservés.',
    footerBuiltWith: 'Créé avec', favorites: 'Favoris',
    noFavorites: 'Aucun favori. Cliquez sur le cœur pour sauvegarder des produits.',
    landingBadge: 'Nouveautés chaque semaine',
    landingHeadline: 'Achetez plus intelligemment sur',
    landingSubheadline: 'Découvrez des produits les mieux notés dans chaque catégorie. Comparez, aimez et commandez en quelques secondes.',
    landingCta: 'Acheter maintenant',
    landingSecondary: 'Voir les favoris',
    landingStatProducts: 'Produits', landingStatCurrencies: 'Devises',
    landingStatLanguages: 'Langues', landingStatRating: 'Top note',
    landingCategoriesTitle: 'Acheter par catégorie', landingCategoriesSub: 'Parcourez nos collections',
    landingFeaturedTitle: 'Coups de cœur', landingFeaturedSub: 'Nos produits les mieux notés en ce moment',
    landingViewAll: 'Voir tout',
    landingWhyTitle: 'Pourquoi MikunStore ?', landingWhySub: 'Tout ce dont vous avez besoin',
    landingBannerTitle: 'Prêt à trouver votre prochain favori ?', landingBannerSub: 'Des centaines de produits. Plusieurs devises. Votre langue.',
    featureMultiLang: 'Multilingue', featureMultiLangDesc: '5 langues disponibles.',
    featureMultiCurrency: 'Multi-devises', featureMultiCurrencyDesc: 'USD, GBP, EUR ou NGN. Les prix se mettent à jour instantanément.',
    featureDarkMode: 'Mode sombre', featureDarkModeDesc: 'Confortable de jour comme de nuit.',
    featureReceipt: 'Reçu PDF', featureReceiptDesc: 'Téléchargez un reçu instantané après chaque commande.',
  },
  nl: {
    welcome: 'Welkom!', lightMode: 'Lichte modus', darkMode: 'Donkere modus',
    language: 'Taal', search: 'Zoeken...', filterBy: 'Filteren op',
    allCategories: 'Alles', sortBy: 'Sorteren op', sortNameAsc: 'Naam (A–Z)',
    sortPriceAsc: 'Prijs: laag naar hoog', sortPriceDesc: 'Prijs: hoog naar laag',
    sortRatingDesc: 'Best beoordeeld', products: 'Producten', noResults: 'Geen producten gevonden.',
    addToCart: 'In winkelwagen', addedToCart: 'Toegevoegd aan winkelwagen',
    addToFavorites: 'Toevoegen aan favorieten', removeFromFavorites: 'Verwijderen uit favorieten',
    addedToFavorites: 'Toegevoegd aan favorieten', removedFromFavorites: 'Verwijderd uit favorieten',
    description: 'Beschrijving', off: 'korting', compare: 'Vergelijk selectie',
    comparisonResult: 'Vergelijkingsresultaat',
    savings: 'Als u het goedkoopste product koopt, bespaart u',
    selectTwo: 'Selecteer minimaal 2 producten om te vergelijken.', close: 'Sluiten',
    cart: 'Winkelwagen', emptyCart: 'Uw winkelwagen is leeg.',
    continueShopping: 'Verder winkelen', removeFromCart: 'Verwijderen',
    subtotal: 'Subtotaal', total: 'Totaal', checkout: 'Afrekenen', qty: 'Aant',
    back: 'Terug', notFound: 'Product niet gevonden.',
    footerRights: 'Alle rechten voorbehouden.', footerBuiltWith: 'Gebouwd met',
    favorites: 'Favorieten',
    noFavorites: 'Nog geen favorieten. Klik op het hartje om producten op te slaan.',
    landingBadge: 'Elke week nieuwe producten',
    landingHeadline: 'Shop slimmer bij',
    landingSubheadline: 'Ontdek topproducten in elke categorie. Vergelijk, bewaar en bestel in seconden.',
    landingCta: 'Nu winkelen',
    landingSecondary: 'Favorieten bekijken',
    landingStatProducts: 'Producten', landingStatCurrencies: 'Valuta\'s',
    landingStatLanguages: 'Talen', landingStatRating: 'Top beoordeling',
    landingCategoriesTitle: 'Winkelen per categorie', landingCategoriesSub: 'Blader door onze collecties',
    landingFeaturedTitle: 'Topkeuzes', landingFeaturedSub: 'Onze best beoordeelde producten',
    landingViewAll: 'Alles bekijken',
    landingWhyTitle: 'Waarom MikunStore?', landingWhySub: 'Alles wat u nodig heeft',
    landingBannerTitle: 'Klaar voor uw volgende favoriet?', landingBannerSub: 'Honderden producten. Meerdere valuta\'s. Uw taal.',
    featureMultiLang: 'Meertalig', featureMultiLangDesc: '5 talen beschikbaar.',
    featureMultiCurrency: 'Meerdere valuta\'s', featureMultiCurrencyDesc: 'USD, GBP, EUR of NGN. Prijzen worden direct bijgewerkt.',
    featureDarkMode: 'Donkere modus', featureDarkModeDesc: 'Comfortabel overdag en \'s nachts.',
    featureReceipt: 'PDF-bon', featureReceiptDesc: 'Download direct een bon na elke bestelling.',
  },
  de: {
    welcome: 'Willkommen!', lightMode: 'Heller Modus', darkMode: 'Dunkler Modus',
    language: 'Sprache', search: 'Suchen...', filterBy: 'Filtern nach',
    allCategories: 'Alle', sortBy: 'Sortieren nach', sortNameAsc: 'Name (A–Z)',
    sortPriceAsc: 'Preis: aufsteigend', sortPriceDesc: 'Preis: absteigend',
    sortRatingDesc: 'Bestbewertet', products: 'Produkte', noResults: 'Keine Produkte gefunden.',
    addToCart: 'In den Warenkorb', addedToCart: 'Zum Warenkorb hinzugefügt',
    addToFavorites: 'Zu Favoriten hinzufügen', removeFromFavorites: 'Aus Favoriten entfernen',
    addedToFavorites: 'Zu Favoriten hinzugefügt', removedFromFavorites: 'Aus Favoriten entfernt',
    description: 'Beschreibung', off: 'Rabatt', compare: 'Auswahl vergleichen',
    comparisonResult: 'Vergleichsergebnis',
    savings: 'Wenn Sie das günstigste Produkt kaufen, sparen Sie',
    selectTwo: 'Bitte wählen Sie mindestens 2 Produkte zum Vergleichen.', close: 'Schließen',
    cart: 'Warenkorb', emptyCart: 'Ihr Warenkorb ist leer.',
    continueShopping: 'Weiter einkaufen', removeFromCart: 'Entfernen',
    subtotal: 'Zwischensumme', total: 'Gesamt', checkout: 'Zur Kasse', qty: 'Menge',
    back: 'Zurück', notFound: 'Produkt nicht gefunden.',
    footerRights: 'Alle Rechte vorbehalten.', footerBuiltWith: 'Erstellt mit',
    favorites: 'Favoriten',
    noFavorites: 'Noch keine Favoriten. Klicke auf das Herz, um Produkte zu speichern.',
    landingBadge: 'Jede Woche neue Produkte',
    landingHeadline: 'Klüger einkaufen bei',
    landingSubheadline: 'Entdecke Top-Produkte in jeder Kategorie. Vergleichen, merken und bestellen in Sekunden.',
    landingCta: 'Jetzt einkaufen',
    landingSecondary: 'Favoriten ansehen',
    landingStatProducts: 'Produkte', landingStatCurrencies: 'Währungen',
    landingStatLanguages: 'Sprachen', landingStatRating: 'Top-Bewertung',
    landingCategoriesTitle: 'Nach Kategorie einkaufen', landingCategoriesSub: 'Unsere Kollektionen entdecken',
    landingFeaturedTitle: 'Top-Auswahl', landingFeaturedSub: 'Unsere bestbewerteten Produkte',
    landingViewAll: 'Alle ansehen',
    landingWhyTitle: 'Warum MikunStore?', landingWhySub: 'Alles was du brauchst',
    landingBannerTitle: 'Bereit für deinen nächsten Favoriten?', landingBannerSub: 'Hunderte Produkte. Mehrere Währungen. Deine Sprache.',
    featureMultiLang: 'Mehrsprachig', featureMultiLangDesc: '5 Sprachen verfügbar.',
    featureMultiCurrency: 'Mehrere Währungen', featureMultiCurrencyDesc: 'USD, GBP, EUR oder NGN. Preise werden sofort aktualisiert.',
    featureDarkMode: 'Dunkler Modus', featureDarkModeDesc: 'Tag und Nacht angenehm für die Augen.',
    featureReceipt: 'PDF-Quittung', featureReceiptDesc: 'Lade nach jeder Bestellung sofort eine Quittung herunter.',
  },
  sv: {
    welcome: 'Välkommen!', lightMode: 'Ljust läge', darkMode: 'Mörkt läge',
    language: 'Språk', search: 'Sök...', filterBy: 'Filtrera efter',
    allCategories: 'Alla', sortBy: 'Sortera efter', sortNameAsc: 'Namn (A–Ö)',
    sortPriceAsc: 'Pris: lågt till högt', sortPriceDesc: 'Pris: högt till lågt',
    sortRatingDesc: 'Bäst betyg', products: 'Produkter', noResults: 'Inga produkter hittades.',
    addToCart: 'Lägg i kundvagn', addedToCart: 'Tillagd i kundvagnen',
    addToFavorites: 'Lägg till i favoriter', removeFromFavorites: 'Ta bort från favoriter',
    addedToFavorites: 'Tillagd i favoriter', removedFromFavorites: 'Borttagen från favoriter',
    description: 'Beskrivning', off: 'rabatt', compare: 'Jämför urval',
    comparisonResult: 'Jämförelseresultat',
    savings: 'Om du köper den billigaste produkten sparar du',
    selectTwo: 'Välj minst 2 produkter att jämföra.', close: 'Stäng',
    cart: 'Kundvagn', emptyCart: 'Din kundvagn är tom.',
    continueShopping: 'Fortsätt handla', removeFromCart: 'Ta bort',
    subtotal: 'Delsumma', total: 'Totalt', checkout: 'Till kassan', qty: 'Ant',
    back: 'Tillbaka', notFound: 'Produkten hittades inte.',
    footerRights: 'Alla rättigheter förbehållna.', footerBuiltWith: 'Byggd med',
    favorites: 'Favoriter',
    noFavorites: 'Inga favoriter ännu. Klicka på hjärtat för att spara produkter.',
    landingBadge: 'Nya produkter varje vecka',
    landingHeadline: 'Handla smartare på',
    landingSubheadline: 'Upptäck toppbetygsatta produkter i varje kategori. Jämför, spara och beställ på sekunder.',
    landingCta: 'Handla nu',
    landingSecondary: 'Visa favoriter',
    landingStatProducts: 'Produkter', landingStatCurrencies: 'Valutor',
    landingStatLanguages: 'Språk', landingStatRating: 'Toppbetyg',
    landingCategoriesTitle: 'Handla efter kategori', landingCategoriesSub: 'Bläddra i våra kollektioner',
    landingFeaturedTitle: 'Toppval', landingFeaturedSub: 'Våra mest omtyckta produkter just nu',
    landingViewAll: 'Visa alla',
    landingWhyTitle: 'Varför MikunStore?', landingWhySub: 'Allt du behöver',
    landingBannerTitle: 'Redo att hitta din nästa favorit?', landingBannerSub: 'Hundratals produkter. Flera valutor. Ditt språk.',
    featureMultiLang: 'Flerspråkigt', featureMultiLangDesc: '5 språk tillgängliga.',
    featureMultiCurrency: 'Flera valutor', featureMultiCurrencyDesc: 'USD, GBP, EUR eller NGN. Priser uppdateras direkt.',
    featureDarkMode: 'Mörkt läge', featureDarkModeDesc: 'Bekvämt dag och natt.',
    featureReceipt: 'PDF-kvitto', featureReceiptDesc: 'Ladda ner ett kvitto direkt efter varje beställning.',
  },
}

export const useUiStore = defineStore('ui', () => {
  const isDark = ref(localStorage.getItem('theme') === 'dark')
  const lang = ref(localStorage.getItem('lang') || 'en')
  const currency = ref(localStorage.getItem('currency') || 'USD')

  watch(isDark, (val) => {
    document.documentElement.classList.toggle('dark', val)
    localStorage.setItem('theme', val ? 'dark' : 'light')
  }, { immediate: true })

  watch(lang, (val) => localStorage.setItem('lang', val))
  watch(currency, (val) => localStorage.setItem('currency', val))

  function t(key) {
    return translations[lang.value]?.[key] ?? translations.en[key] ?? key
  }

  function format(usdAmount) {
    const rate = RATES[currency.value] ?? 1
    const converted = usdAmount * rate
    const sym = CURRENCIES.find(c => c.code === currency.value)?.symbol ?? '$'
    if (currency.value === 'NGN') return `${sym}${Math.round(converted).toLocaleString()}`
    return `${sym}${converted.toFixed(2)}`
  }

  return { isDark, lang, currency, CURRENCIES, LANGUAGES, t, format }
})
