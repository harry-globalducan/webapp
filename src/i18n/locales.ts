export type LocaleCode = 'en' | 'ar' | 'fr' | 'hi'

export interface LocaleOption {
  code: LocaleCode
  label: string
  native: string
  dir: 'ltr' | 'rtl'
}

/** Languages for Global Ducan markets: Gulf Arabic, Mauritius FR, India HI + EN. */
export const locales: LocaleOption[] = [
  { code: 'en', label: 'English', native: 'English', dir: 'ltr' },
  { code: 'ar', label: 'Arabic', native: 'العربية', dir: 'rtl' },
  { code: 'fr', label: 'French', native: 'Français', dir: 'ltr' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी', dir: 'ltr' },
]

type Dict = Record<string, string>

const en: Dict = {
  'nav.home': 'Home',
  'nav.ways': 'Ways to shop',
  'nav.orders': 'Orders',
  'nav.wallet': 'Wallet',
  'nav.account': 'Account',
  'nav.guide': 'New user guide',
  'nav.shipping': 'Shipping fees',
  'nav.app': 'Mobile app',
  'nav.support': 'Support',
  'action.signIn': 'Sign in',
  'action.cart': 'Cart',
  'action.wishlist': 'Wishlist',
  'action.currency': 'Currency',
  'action.language': 'Language',
  'action.theme': 'Toggle theme',
  'action.menu': 'Menu',
  'deliver.to': 'Deliver to',
  'deliver.change': 'Change',
  'deliver.add': 'Add address',
  'footer.shop': 'Shop',
  'footer.company': 'Company',
  'footer.legal': 'Legal',
  'footer.newsletter': 'Drops, deals & duty tips — monthly.',
  'footer.newsletterSub': 'No spam. Just the best of Indian e-commerce, shipped to your inbox.',
  'footer.subscribe': 'Subscribe',
  'footer.tagline':
    "Your gateway to shopping from India's top stores with seamless international shipping, local-currency payments and one global cart.",
  'footer.ships': 'Ships from India · Indian Ocean & Gulf',
  'footer.payments': 'We accept',
  'common.search': 'Paste a product link from Amazon, Myntra, Nykaa…',
}

const ar: Dict = {
  'nav.home': 'الرئيسية',
  'nav.ways': 'طرق التسوق',
  'nav.orders': 'الطلبات',
  'nav.wallet': 'المحفظة',
  'nav.account': 'الحساب',
  'nav.guide': 'دليل المستخدم الجديد',
  'nav.shipping': 'رسوم الشحن',
  'nav.app': 'تطبيق الجوال',
  'nav.support': 'الدعم',
  'action.signIn': 'تسجيل الدخول',
  'action.cart': 'السلة',
  'action.wishlist': 'المفضلة',
  'action.currency': 'العملة',
  'action.language': 'اللغة',
  'action.theme': 'الوضع الداكن',
  'action.menu': 'القائمة',
  'deliver.to': 'التوصيل إلى',
  'deliver.change': 'تغيير',
  'deliver.add': 'أضف عنواناً',
  'footer.shop': 'تسوق',
  'footer.company': 'الشركة',
  'footer.legal': 'قانوني',
  'footer.newsletter': 'عروض ونصائح — شهرياً.',
  'footer.newsletterSub': 'بدون إزعاج. أفضل المتاجر الهندية إلى بريدك.',
  'footer.subscribe': 'اشترك',
  'footer.tagline':
    'بوابتك للتسوق من أفضل المتاجر الهندية مع شحن دولي سلس ودفع بعملتك المحلية وسلة عالمية واحدة.',
  'footer.ships': 'الشحن من الهند · المحيط الهندي والخليج',
  'footer.payments': 'نقبل',
  'common.search': 'الصق رابط منتج من أمازون أو مينترا أو نايكا…',
}

const fr: Dict = {
  'nav.home': 'Accueil',
  'nav.ways': 'Comment acheter',
  'nav.orders': 'Commandes',
  'nav.wallet': 'Portefeuille',
  'nav.account': 'Compte',
  'nav.guide': 'Guide du nouvel utilisateur',
  'nav.shipping': 'Frais de port',
  'nav.app': 'Application mobile',
  'nav.support': 'Assistance',
  'action.signIn': 'Connexion',
  'action.cart': 'Panier',
  'action.wishlist': 'Favoris',
  'action.currency': 'Devise',
  'action.language': 'Langue',
  'action.theme': 'Thème',
  'action.menu': 'Menu',
  'deliver.to': 'Livrer à',
  'deliver.change': 'Modifier',
  'deliver.add': 'Ajouter une adresse',
  'footer.shop': 'Boutique',
  'footer.company': 'Entreprise',
  'footer.legal': 'Légal',
  'footer.newsletter': 'Offres et conseils — chaque mois.',
  'footer.newsletterSub': 'Pas de spam. Le meilleur du e-commerce indien.',
  'footer.subscribe': "S'inscrire",
  'footer.tagline':
    "Votre passerelle vers les meilleures boutiques indiennes, avec livraison internationale et paiement en devise locale.",
  'footer.ships': "Expédié d'Inde · océan Indien & Golfe",
  'footer.payments': 'Nous acceptons',
  'common.search': "Collez un lien produit d'Amazon, Myntra, Nykaa…",
}

const hi: Dict = {
  'nav.home': 'होम',
  'nav.ways': 'खरीदारी के तरीके',
  'nav.orders': 'ऑर्डर',
  'nav.wallet': 'वॉलेट',
  'nav.account': 'अकाउंट',
  'nav.guide': 'नए उपयोगकर्ता गाइड',
  'nav.shipping': 'शिपिंग शुल्क',
  'nav.app': 'मोबाइल ऐप',
  'nav.support': 'सहायता',
  'action.signIn': 'साइन इन',
  'action.cart': 'कार्ट',
  'action.wishlist': 'विशलिस्ट',
  'action.currency': 'मुद्रा',
  'action.language': 'भाषा',
  'action.theme': 'थीम',
  'action.menu': 'मेनू',
  'deliver.to': 'डिलीवर करें',
  'deliver.change': 'बदलें',
  'deliver.add': 'पता जोड़ें',
  'footer.shop': 'शॉप',
  'footer.company': 'कंपनी',
  'footer.legal': 'कानूनी',
  'footer.newsletter': 'ऑफर और टिप्स — हर महीने।',
  'footer.newsletterSub': 'कोई स्पैम नहीं। भारतीय ई-कॉमर्स का बेस्ट।',
  'footer.subscribe': 'सब्सक्राइब',
  'footer.tagline':
    'भारत के टॉप स्टोर से खरीदारी — अंतरराष्ट्रीय शिपिंग और अपनी मुद्रा में भुगतान।',
  'footer.ships': 'भारत से शिप · हिंद महासागर और गल्फ',
  'footer.payments': 'स्वीकृत भुगतान',
  'common.search': 'Amazon, Myntra, Nykaa का प्रोडक्ट लिंक पेस्ट करें…',
}

export const dictionaries: Record<LocaleCode, Dict> = { en, ar, fr, hi }

export function translate(locale: LocaleCode, key: string): string {
  return dictionaries[locale][key] ?? dictionaries.en[key] ?? key
}
