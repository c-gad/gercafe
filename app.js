// ════════════════════════════════════════════════════════════
//  ⚠️  ÉTAPE 1 OBLIGATOIRE : REMPLACEZ LES 7 VALEURS CI-DESSOUS
//  Trouvez-les dans Firebase Console → ⚙️ Paramètres → Vos apps → Web
// ════════════════════════════════════════════════════════════
const firebaseConfig = {
  apiKey: "AIzaSyCW7p8-mXaAcMBkXTTEFKHbay_lzI8tL18",
  authDomain: "gercafe-hmfr.firebaseapp.com",
  databaseURL: "https://gercafe-hmfr-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "gercafe-hmfr",
  storageBucket: "gercafe-hmfr.firebasestorage.app",
  messagingSenderId: "791896470488",
  appId: "1:791896470488:web:6442b5a16ffbefe7b1b8ad"
};

// ════════════════════════════════════════════════════════════
//  INIT FIREBASE
// ════════════════════════════════════════════════════════════
try {
  firebase.initializeApp(firebaseConfig);
} catch(e) {
  console.error('Firebase init error:', e);
}
const db = firebase.database();

// ════════════════════════════════════════════════════════════
//  SONNERIE (Web Audio API)
// ════════════════════════════════════════════════════════════
let audioCtx = null;
function jouerSonnerie(type) {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const configs = {
      appel:    [{ f:880,  d:0.15, t:0.0 }, { f:880,  d:0.15, t:0.2 }, { f:1100, d:0.3, t:0.4 }],
      servie:   [{ f:523,  d:0.2,  t:0.0 }, { f:659,  d:0.2,  t:0.25 }, { f:784, d:0.4, t:0.5 }],
      paiement: [{ f:440,  d:0.15, t:0.0 }, { f:554,  d:0.15, t:0.2 }, { f:659, d:0.15, t:0.4 }, { f:880, d:0.35, t:0.6 }],
    };
    const notes = configs[type] || configs.appel;
    const now = audioCtx.currentTime;
    notes.forEach(({ f, d, t }) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain); gain.connect(audioCtx.destination);
      osc.frequency.setValueAtTime(f, now + t);
      gain.gain.setValueAtTime(0.4, now + t);
      gain.gain.exponentialRampToValueAtTime(0.001, now + t + d);
      osc.start(now + t); osc.stop(now + t + d + 0.05);
    });
  } catch(e) { console.log('Audio:', e); }
}

// ════════════════════════════════════════════════════════════
//  TRADUCTIONS FR / AR
// ════════════════════════════════════════════════════════════
const TRAD = {
  fr: {
    bienvenue:          (n) => `Table ${n} — Bienvenue !`,
    chargement:         'Chargement du menu…',
    menu:               'MENU',
    commander:          'COMMANDER',
    appeler_serveur:    'APPELER LE SERVEUR',
    notre_menu:         'Notre Menu',
    retour:             '← Retour',
    nb_personnes:       'Combien de personnes ?',
    suivant:            'Suivant →',
    votre_commande:     'Votre commande',
    recapitulatif:      'Récapitulatif',
    confirmer:          '✅ CONFIRMER',
    en_preparation:     'Votre commande est en préparation…',
    reference:          'Référence',
    attente_sous:       "Le serveur s'occupe de vous très bientôt ☕",
    bonne_degustation:  'Bonne dégustation !',
    commande_servie:    'Votre commande a été servie.',
    payer:              '💳 PAYER',
    nouvelle_cmd:       '📋 Nouvelle commande',
    paiement_cours:     'Paiement en cours…',
    paiement_sous:      'Le serveur va confirmer votre paiement.',
    merci:              'Merci pour votre visite !',
    a_bientot:          'À bientôt au GerCafe.',
    nouvelle_session:   'Nouvelle session',
    total:              'Total :',
    table_label:        'Table',
    table_reservee:     'Table réservée',
    table_occupee:      'Cette table est occupée par un autre client.',
    verification:       'Vérification toutes les 10 secondes…',
    dh:                 'Dh',
    selectionner:       'Veuillez sélectionner au moins un produit',
    erreur:             'Erreur : ',
    popup_titre:        "Besoin d'aide ?",
    popup_sous:         'Choisissez ce dont vous avez besoin.',
    opt_serveur_titre:  'Appeler le serveur',
    opt_serveur_desc:   'Le serveur vient à votre table',
    opt_addition_titre: "Demander l'addition",
    opt_addition_desc:  'Préparer le paiement',
    opt_eau_titre:      "Demander de l'eau",
    opt_eau_desc:       'Carafe ou bouteille',
    popup_fermer:       'Annuler',
    toast_serveur:      '✅ Le serveur arrive !',
    toast_addition:     '💳 L\'addition est en route !',
    toast_eau:          '💧 De l\'eau arrive !',
    toast_erreur:       '❌ Erreur, réessayez',
    langue_btn:         '🇲🇦 ع',
    // Options boisson
    opt_bois_titre:     'Personnalisez votre boisson',
    opt_sucre:          '🍬 Sucre',
    opt_sans_sucre:     'Sans sucre',
    opt_avec_sucre:     'Avec sucre',
    opt_saccharine:     'Saccharine 💊',
    opt_qte_sucre:      'Quantité',
    opt_sirop:          '🍹 Sirop',
    opt_sans_sirop:     'Sans sirop',
    opt_grenadine:      'Grenadine 🍓',
    opt_menthe:         'Menthe 🌿',
    opt_ajouter:        'Ajouter ✓',
    opt_annuler:        'Annuler',
  },
  ar: {
    bienvenue:          (n) => `طاولة ${n} — أهلاً بك !`,
    chargement:         'جارٍ تحميل القائمة…',
    menu:               'القائمة',
    commander:          'اطلب الآن',
    appeler_serveur:    'استدعاء النادل',
    notre_menu:         'قائمتنا',
    retour:             'رجوع',
    nb_personnes:       'كم عدد الأشخاص ؟',
    suivant:            'التالي',
    votre_commande:     'طلبك',
    recapitulatif:      'ملخص الطلب',
    confirmer:          '✅ تأكيد الطلب',
    en_preparation:     'طلبك قيد التحضير…',
    reference:          'المرجع',
    attente_sous:       'النادل في طريقه إليك ☕',
    bonne_degustation:  'بالهناء والشفاء !',
    commande_servie:    'تم تقديم طلبك.',
    payer:              '💳 الدفع',
    nouvelle_cmd:       '📋 طلب جديد',
    paiement_cours:     'جارٍ الدفع…',
    paiement_sous:      'سيقوم النادل بتأكيد الدفع.',
    merci:              'شكراً لزيارتكم !',
    a_bientot:          'إلى اللقاء في GerCafe.',
    nouvelle_session:   'جلسة جديدة',
    total:              ': المجموع',
    table_label:        'طاولة',
    table_reservee:     'الطاولة محجوزة',
    table_occupee:      'هذه الطاولة مشغولة حالياً.',
    verification:       'فحص كل 10 ثوانٍ…',
    dh:                 'درهم',
    selectionner:       'الرجاء اختيار منتج واحد على الأقل',
    erreur:             'خطأ : ',
    popup_titre:        'هل تحتاج مساعدة ؟',
    popup_sous:         'اختر ما تحتاجه.',
    opt_serveur_titre:  'استدعاء النادل',
    opt_serveur_desc:   'النادل يأتي إلى طاولتك',
    opt_addition_titre: 'طلب الحساب',
    opt_addition_desc:  'التحضير للدفع',
    opt_eau_titre:      'طلب الماء',
    opt_eau_desc:       'إبريق أو زجاجة',
    popup_fermer:       'إلغاء',
    toast_serveur:      '✅ النادل في الطريق !',
    toast_addition:     '💳 الحساب في الطريق !',
    toast_eau:          '💧 الماء في الطريق !',
    toast_erreur:       '❌ خطأ، حاول مجدداً',
    langue_btn:         '🇫🇷 FR',
    opt_bois_titre:     'خصص مشروبك',
    opt_sucre:          '🍬 السكر',
    opt_sans_sucre:     'بدون سكر',
    opt_avec_sucre:     'مع سكر',
    opt_saccharine:     'سكرين 💊',
    opt_qte_sucre:      'الكمية',
    opt_sirop:          '🍹 شراب',
    opt_sans_sirop:     'بدون شراب',
    opt_grenadine:      'رمان 🍓',
    opt_menthe:         'نعنع 🌿',
    opt_ajouter:        'إضافة ✓',
    opt_annuler:        'إلغاء',
  }
};

// ════════════════════════════════════════════════════════════
//  VARIABLES GLOBALES
// ════════════════════════════════════════════════════════════
let langue           = localStorage.getItem('gercafe_langue') || 'fr';
let numeroTable      = 0;
let nbPersonnes      = 1;
let produits         = {};
let panier           = {};
let optionsPanier    = {};   // options boisson par produit
let commandeRef      = null;
let ecouteurCommande = null;
let sessionId        = null;

const t = (key, ...args) => {
  const val = TRAD[langue][key];
  return typeof val === 'function' ? val(...args) : (val ?? TRAD['fr'][key] ?? key);
};

// ════════════════════════════════════════════════════════════
//  CATÉGORIES BOISSON — détection flexible
// ════════════════════════════════════════════════════════════
function norm(s) {
  return (s || '').toLowerCase()
    .replace(/[éèêë]/g, 'e').replace(/[àâä]/g, 'a')
    .replace(/[ùûü]/g, 'u').replace(/[îï]/g, 'i')
    .replace(/[ôö]/g, 'o').replace(/ç/g, 'c').trim();
}

const MOTS_BOIS = ['cafe', 'the', 'infus', 'tisane', 'cappuccino',
  'latte', 'expresso', 'noisette', 'chocolat', 'choco', 'chai',
  'قهوة', 'شاي', 'حليب', 'مشروب'];

function estBoisson(cat) {
  const c = norm(cat);
  return MOTS_BOIS.some(m => c.includes(m));
}

// ════════════════════════════════════════════════════════════
//  SESSION
// ════════════════════════════════════════════════════════════
function genererSessionId() {
  let sid = sessionStorage.getItem('gercafe_session');
  if (!sid) {
    sid = Date.now().toString(36) + Math.random().toString(36).substr(2, 8);
    sessionStorage.setItem('gercafe_session', sid);
  }
  return sid;
}

// ════════════════════════════════════════════════════════════
//  APPLIQUER LANGUE
// ════════════════════════════════════════════════════════════
function appliquerLangue() {
  const isAr = langue === 'ar';
  document.documentElement.dir  = isAr ? 'rtl' : 'ltr';
  document.documentElement.lang = isAr ? 'ar'  : 'fr';

  const el = (id) => document.getElementById(id);
  const tx = (id, key) => { const e = el(id); if (e) e.textContent = t(key); };

  tx('btn-langue',          'langue_btn');
  tx('txt-chargement',      'chargement');
  tx('txt-menu-btn',        'menu');
  tx('txt-commander-btn',   'commander');
  tx('txt-appel-btn',       'appeler_serveur');
  tx('titre-menu',          'notre_menu');
  tx('titre-personnes',     'nb_personnes');
  tx('btn-suivant',         'suivant');
  tx('titre-commande',      'votre_commande');
  tx('titre-recap',         'recapitulatif');
  tx('btn-confirmer',       'confirmer');
  tx('txt-reference',       'reference');
  tx('txt-attente-sous',    'attente_sous');
  tx('txt-bonne-deg',       'bonne_degustation');
  tx('txt-servie-sous',     'commande_servie');
  tx('btn-payer',           'payer');
  tx('btn-nouvelle-cmd',    'nouvelle_cmd');
  tx('txt-paiement',        'paiement_cours');
  tx('txt-paiement-sous',   'paiement_sous');
  tx('txt-merci',           'merci');
  tx('txt-abientot',        'a_bientot');
  tx('btn-session',         'nouvelle_session');
  tx('txt-reserve-titre',   'table_reservee');
  tx('txt-table-label',     'table_label');
  tx('txt-reserve-texte',   'table_occupee');
  tx('txt-reserve-verif',   'verification');
  tx('popup-titre',         'popup_titre');
  tx('popup-sous',          'popup_sous');
  tx('opt-serveur-titre',   'opt_serveur_titre');
  tx('opt-serveur-desc',    'opt_serveur_desc');
  tx('opt-addition-titre',  'opt_addition_titre');
  tx('opt-addition-desc',   'opt_addition_desc');
  tx('opt-eau-titre',       'opt_eau_titre');
  tx('opt-eau-desc',        'opt_eau_desc');
  tx('popup-btn-fermer',    'popup_fermer');
  // Options boisson
  tx('lbl-opt-sucre',       'opt_sucre');
  tx('lbl-sans-sucre',      'opt_sans_sucre');
  tx('lbl-avec-sucre',      'opt_avec_sucre');
  tx('lbl-saccharine',      'opt_saccharine');
  tx('lbl-qte-sucre',       'opt_qte_sucre');
  tx('lbl-opt-sirop',       'opt_sirop');
  tx('lbl-sans-sirop',      'opt_sans_sirop');
  tx('lbl-grenadine',       'opt_grenadine');
  tx('lbl-menthe',          'opt_menthe');
  tx('btn-opt-confirmer',   'opt_ajouter');
  tx('btn-opt-annuler',     'opt_annuler');

  document.querySelectorAll('.btn-retour').forEach(e => e.textContent = t('retour'));
  document.querySelectorAll('.label-total').forEach(e => e.textContent = t('total'));
  document.querySelectorAll('.txt-appel-inline').forEach(e => e.textContent = t('appeler_serveur'));

  if (numeroTable > 0) {
    const bv = el('bienvenue-table');
    if (bv) bv.textContent = t('bienvenue', numeroTable);
    ['info-table-commande','info-table-recap','table-affichee'].forEach(id => {
      const e = el(id);
      if (e) e.textContent = t('table_label') + ' ' + numeroTable;
    });
  }

  if (Object.keys(produits).length > 0) {
    construireMenu();
    construireListeCommande();
  }
}

function changerLangue() {
  langue = langue === 'fr' ? 'ar' : 'fr';
  localStorage.setItem('gercafe_langue', langue);
  appliquerLangue();
}

// ════════════════════════════════════════════════════════════
//  SYNC IDENTITÉ CAFÉ (nom/langue/logo depuis Firebase)
// ════════════════════════════════════════════════════════════
function ecouterIdentiteCafe() {
  try {
    db.ref('config/cafe').on('value', (snap) => {
      if (!snap.exists()) return;
      const cfg = snap.val();
      if (cfg.nom) {
        document.querySelectorAll('.nom-cafe, .nom-cafe-header').forEach(e => {
          e.textContent = cfg.nom.toUpperCase();
        });
        document.title = cfg.nom + ' — Commander';
      }
      if (cfg.logoUrl) {
        document.querySelectorAll('.logo-cercle').forEach(e => {
          e.innerHTML = `<img src="${cfg.logoUrl}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`;
        });
      }
      if (cfg.langue && cfg.langue !== langue) {
        langue = cfg.langue;
        localStorage.setItem('gercafe_langue', langue);
        appliquerLangue();
      }
    });
  } catch(e) { console.warn('config/cafe:', e); }
}

// ════════════════════════════════════════════════════════════
//  POPUP APPEL SERVEUR
// ════════════════════════════════════════════════════════════
function ouvrirPopupAppel() {
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  const p = document.getElementById('popup-appel');
  if (p) p.classList.add('ouvert');
}
function fermerPopupAppel(e) {
  if (!e || e.target === document.getElementById('popup-appel')) {
    const p = document.getElementById('popup-appel');
    if (p) p.classList.remove('ouvert');
  }
}
function envoyerAppel(type) {
  const p = document.getElementById('popup-appel');
  if (p) p.classList.remove('ouvert');
  const u = { appel_serveur: true };
  let msg = '', son = 'appel';
  if (type === 'serveur')   { u.statut = 'appel_serveur'; u.type_appel = 'serveur'; msg = t('toast_serveur'); }
  if (type === 'addition')  { u.statut = 'demande_paiement'; u.type_appel = 'addition'; u.demande_paiement = true; msg = t('toast_addition'); son = 'paiement';
    if (commandeRef) db.ref('commandes/' + commandeRef).update({ statut: 'demande_paiement', demande_paiement: true }); }
  if (type === 'eau')       { u.statut = 'appel_serveur'; u.type_appel = 'eau'; msg = t('toast_eau'); }
  jouerSonnerie(son);
  db.ref('tables/' + numeroTable).update(u)
    .then(() => toast(msg, '#2E7D4F'))
    .catch(() => toast(t('toast_erreur'), '#C0392B'));
}

// ════════════════════════════════════════════════════════════
//  POPUP OPTIONS BOISSON
// ════════════════════════════════════════════════════════════
function ouvrirPopupOptions(produitId, produit) {
  const popup = document.getElementById('popup-options-boisson');
  if (!popup) {
    // Popup absent → ajouter directement sans options
    _confirmerAjoutSansOptions(produitId);
    return;
  }

  const nomEl = document.getElementById('opt-boisson-nom');
  if (nomEl) nomEl.textContent = nomProduit(produit);

  let choix = { sucre: null, qteSucre: null, sirop: null, typeSirop: null, saccharine: false };

  function maj() {
    const actif = (id, cond) => {
      const el = document.getElementById(id);
      if (el) el.classList.toggle('actif', !!cond);
    };
    actif('opt-btn-sans-sucre', choix.sucre === 'non');
    actif('opt-btn-avec-sucre', choix.sucre === 'oui');
    actif('opt-btn-saccharine', !!choix.saccharine);

    const show = choix.sucre === 'oui';
    ['zone-qte-sucre', 'zone-sirop'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = show ? 'block' : 'none';
    });

    ['05','1','2','3'].forEach(v => actif('opt-cube-' + v, false));
    if (choix.qteSucre) actif('opt-cube-' + choix.qteSucre.replace('.',''), choix.qteSucre);

    actif('opt-sirop-non',       choix.sirop === 'non' && !choix.typeSirop);
    actif('opt-sirop-grenadine', choix.typeSirop === 'grenadine');
    actif('opt-sirop-menthe',    choix.typeSirop === 'menthe');
  }

  function btn(id, fn) {
    const el = document.getElementById(id);
    if (!el) return;
    const clone = el.cloneNode(true);
    el.parentNode.replaceChild(clone, el);
    document.getElementById(id).addEventListener('click', fn);
  }

  btn('opt-btn-sans-sucre', () => { choix = { sucre:'non', qteSucre:null, sirop:null, typeSirop:null, saccharine:false }; maj(); });
  btn('opt-btn-avec-sucre', () => { choix.sucre = 'oui'; choix.saccharine = false; if (!choix.qteSucre) choix.qteSucre = '1'; if (!choix.sirop) choix.sirop = 'non'; maj(); });
  btn('opt-btn-saccharine', () => { choix = { sucre:'saccharine', qteSucre:null, sirop:null, typeSirop:null, saccharine:true }; maj(); });
  btn('opt-cube-05', () => { choix.qteSucre = '0.5'; maj(); });
  btn('opt-cube-1',  () => { choix.qteSucre = '1';   maj(); });
  btn('opt-cube-2',  () => { choix.qteSucre = '2';   maj(); });
  btn('opt-cube-3',  () => { choix.qteSucre = '3';   maj(); });
  btn('opt-sirop-non',       () => { choix.sirop = 'non'; choix.typeSirop = null;         maj(); });
  btn('opt-sirop-grenadine', () => { choix.sirop = 'oui'; choix.typeSirop = 'grenadine'; maj(); });
  btn('opt-sirop-menthe',    () => { choix.sirop = 'oui'; choix.typeSirop = 'menthe';    maj(); });

  btn('btn-opt-annuler', () => popup.classList.remove('ouvert'));

  btn('btn-opt-confirmer', () => {
    optionsPanier[produitId] = { ...choix };
    _confirmerAjoutSansOptions(produitId);
    afficherBadgeOptions(produitId, choix);
    popup.classList.remove('ouvert');
  });

  maj();
  popup.classList.add('ouvert');
}

function _confirmerAjoutSansOptions(produitId) {
  panier[produitId] = (panier[produitId] || 0) + 1;
  const q = document.getElementById('qte-' + produitId);
  const c = document.getElementById('item-' + produitId);
  if (q) q.textContent = panier[produitId];
  if (c) c.classList.add('selectionne');
  mettreAJourTotal();
}

function afficherBadgeOptions(id, choix) {
  const card = document.getElementById('item-' + id);
  if (!card) return;
  let badge = card.querySelector('.badge-options');
  if (!badge) {
    badge = document.createElement('div');
    badge.className = 'badge-options';
    const info = card.querySelector('.produit-info');
    if (info) info.appendChild(badge);
  }
  const parts = [];
  if (choix.sucre === 'non')           parts.push(langue === 'ar' ? 'بدون سكر' : 'Sans sucre');
  if (choix.sucre === 'oui' && choix.qteSucre) parts.push(choix.qteSucre + ' cube' + (choix.qteSucre > 1 ? 's' : ''));
  if (choix.saccharine)                parts.push(langue === 'ar' ? 'سكرين' : 'Saccharine');
  if (choix.typeSirop === 'grenadine') parts.push('Grenadine');
  if (choix.typeSirop === 'menthe')    parts.push('Menthe');
  badge.textContent = parts.join(' · ');
}

// ════════════════════════════════════════════════════════════
//  TOAST
// ════════════════════════════════════════════════════════════
function toast(msg, couleur) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.style.background = couleur || '#2E7D4F';
  el.style.display = 'block';
  setTimeout(() => { el.style.display = 'none'; }, 3000);
}

// ════════════════════════════════════════════════════════════
//  DÉMARRAGE
// ════════════════════════════════════════════════════════════
window.onload = function () {
  const urlParams = new URLSearchParams(window.location.search);
  numeroTable = parseInt(urlParams.get('table')) || 0;
  sessionId   = genererSessionId();
  appliquerLangue();
  ecouterIdentiteCafe();

  if (numeroTable === 0) {
    const bv = document.getElementById('bienvenue-table');
    if (bv) bv.textContent = langue === 'ar' ? 'قم بمسح رمز QR الخاص بطاولتك' : 'Scannez le QR code de votre table';
    afficherEcran('ecran-accueil');
    return;
  }
  verifierSessionTable();
};

// ════════════════════════════════════════════════════════════
//  SESSION TABLE
// ════════════════════════════════════════════════════════════
function verifierSessionTable() {
  afficherEcran('ecran-chargement');

  const fallback = setTimeout(() => {
    console.warn('Firebase timeout → chargement direct');
    chargerProduits();
  }, 6000);

  db.ref('tables/' + numeroTable + '/session_web').once('value', (snap) => {
    clearTimeout(fallback);
    const s = snap.val();
    (!s || s === sessionId) ? prendreTable() : afficherEcranReserve();
  }, (err) => {
    clearTimeout(fallback);
    console.warn('Session error:', err);
    chargerProduits();
  });
}

function prendreTable() {
  db.ref('tables/' + numeroTable + '/session_web').set(sessionId)
    .then(() => {
      try { db.ref('tables/' + numeroTable + '/session_web').onDisconnect().remove(); } catch(e) {}
      chargerProduits();
    })
    .catch(() => chargerProduits());
}

function afficherEcranReserve() {
  document.querySelectorAll('.ecran').forEach(e => e.classList.remove('actif'));
  const ecran = document.getElementById('ecran-reserve');
  if (ecran) ecran.classList.add('actif');
  const n = document.getElementById('reserve-table-num');
  if (n) n.textContent = numeroTable;
  setTimeout(() => {
    db.ref('tables/' + numeroTable + '/session_web').once('value', (snap) => {
      const s = snap.val();
      (!s || s === sessionId) ? prendreTable() : afficherEcranReserve();
    });
  }, 10000);
}

function libererTable() {
  if (!numeroTable || !sessionId) return;
  try {
    db.ref('tables/' + numeroTable + '/session_web').once('value', (snap) => {
      if (snap.val() === sessionId)
        db.ref('tables/' + numeroTable + '/session_web').remove();
    });
  } catch(e) {}
}
window.addEventListener('beforeunload', libererTable);

// ════════════════════════════════════════════════════════════
//  CHARGER PRODUITS
// ════════════════════════════════════════════════════════════
function chargerProduits() {
  const fallback = setTimeout(() => {
    console.warn('Produits timeout → accueil vide');
    appliquerLangue();
    afficherEcran('ecran-accueil');
  }, 8000);

  db.ref('produits').once('value', (snap) => {
    clearTimeout(fallback);
    produits = {};
    if (snap.exists()) {
      snap.forEach(child => {
        const p = child.val();
        if (p && p.disponible !== false) produits[child.key] = p;
      });
    }
    appliquerLangue();
    afficherEcran('ecran-accueil');
    construireMenu();
    construireListeCommande();
  }, (err) => {
    clearTimeout(fallback);
    console.warn('Produits error:', err);
    appliquerLangue();
    afficherEcran('ecran-accueil');
  });
}

function nomProduit(p) {
  return langue === 'ar' ? (p.nom_ar || p.nom) : p.nom;
}

// ════════════════════════════════════════════════════════════
//  CONSTRUIRE MENU (lecture seule)
// ════════════════════════════════════════════════════════════
function construireMenu() {
  const c = document.getElementById('liste-menu');
  if (!c) return;
  c.innerHTML = '';
  const cats = {};
  Object.entries(produits).forEach(([id, p]) => {
    const cat = langue === 'ar' ? (p.categorie_ar || p.categorie || 'أخرى') : (p.categorie || 'Autre');
    if (!cats[cat]) cats[cat] = [];
    cats[cat].push({ id, ...p });
  });
  Object.entries(cats).forEach(([cat, items]) => {
    const h = document.createElement('div');
    h.className = 'categorie-titre'; h.textContent = cat;
    c.appendChild(h);
    items.forEach(item => {
      const el = document.createElement('div');
      el.className = 'produit-item';
      el.innerHTML = `<span class="produit-icone">${item.icone || '☕'}</span>
        <div class="produit-info">
          <div class="produit-nom">${nomProduit(item)}</div>
          <div class="produit-prix">${parseFloat(item.prix||0).toFixed(2)} ${t('dh')}</div>
        </div>`;
      c.appendChild(el);
    });
  });
}

// ════════════════════════════════════════════════════════════
//  CONSTRUIRE LISTE COMMANDE (avec +/−)
// ════════════════════════════════════════════════════════════
function construireListeCommande() {
  const c = document.getElementById('liste-commande');
  if (!c) return;
  c.innerHTML = '';
  panier = {};
  const cats = {};
  Object.entries(produits).forEach(([id, p]) => {
    const cat = langue === 'ar' ? (p.categorie_ar || p.categorie || 'أخرى') : (p.categorie || 'Autre');
    if (!cats[cat]) cats[cat] = [];
    cats[cat].push({ id, ...p });
  });
  Object.entries(cats).forEach(([cat, items]) => {
    const h = document.createElement('div');
    h.className = 'categorie-titre'; h.textContent = cat;
    c.appendChild(h);
    items.forEach(item => {
      panier[item.id] = 0;
      const el = document.createElement('div');
      el.className = 'produit-item';
      el.id = 'item-' + item.id;
      el.innerHTML = `<span class="produit-icone">${item.icone || '☕'}</span>
        <div class="produit-info">
          <div class="produit-nom">${nomProduit(item)}</div>
          <div class="produit-prix">${parseFloat(item.prix||0).toFixed(2)} ${t('dh')}</div>
        </div>
        <div class="produit-compteur">
          <button class="btn-compteur" onclick="modifierQte('${item.id}',-1)">−</button>
          <span class="qte-affichage" id="qte-${item.id}">0</span>
          <button class="btn-compteur" onclick="modifierQte('${item.id}',1)">+</button>
        </div>`;
      c.appendChild(el);
    });
  });
}

// ════════════════════════════════════════════════════════════
//  PANIER
// ════════════════════════════════════════════════════════════
function modifierQte(id, delta) {
  const ancQte  = panier[id] || 0;
  const nvQte   = Math.max(0, ancQte + delta);

  if (delta > 0) {
    const p = produits[id];
    if (p && estBoisson(p.categorie)) {
      ouvrirPopupOptions(id, p);
      return; // ajout géré par le popup
    }
  }

  panier[id] = nvQte;
  if (nvQte === 0) delete optionsPanier[id];
  const q = document.getElementById('qte-' + id);
  const c = document.getElementById('item-' + id);
  if (q) q.textContent = nvQte;
  if (c) c.classList.toggle('selectionne', nvQte > 0);
  mettreAJourTotal();
}

function mettreAJourTotal() {
  let total = 0;
  Object.entries(panier).forEach(([id, qte]) => {
    if (qte > 0 && produits[id]) total += parseFloat(produits[id].prix||0) * qte;
  });
  document.querySelectorAll('.valeur-total').forEach(e => {
    e.textContent = total.toFixed(2) + ' ' + t('dh');
  });
  return total;
}

function modifierPersonnes(delta) {
  nbPersonnes = Math.max(1, Math.min(20, nbPersonnes + delta));
  document.getElementById('nb-personnes').textContent = nbPersonnes;
  let ic = '';
  for (let i = 0; i < Math.min(nbPersonnes,10); i++) ic += '👤';
  if (nbPersonnes > 10) ic += ' +' + (nbPersonnes-10);
  document.getElementById('icones-personnes').textContent = ic;
}

// ════════════════════════════════════════════════════════════
//  RÉCAP
// ════════════════════════════════════════════════════════════
function afficherRecap() {
  const hasItems = Object.values(panier).some(q => q > 0);
  if (!hasItems) { toast(t('selectionner'), '#C0392B'); return; }
  const c = document.getElementById('liste-recap');
  c.innerHTML = '';
  let total = 0;
  Object.entries(panier).forEach(([id, qte]) => {
    if (qte > 0 && produits[id]) {
      const p = produits[id];
      const prix = parseFloat(p.prix||0);
      const st = prix * qte;
      total += st;
      const opts = optionsPanier[id];
      const optsStr = opts ? resumerOptions(opts) : '';
      const el = document.createElement('div');
      el.className = 'recap-item';
      el.innerHTML = `
        <div>
          <div class="recap-nom">${p.icone||'☕'} ${nomProduit(p)}</div>
          ${optsStr ? '<div class="recap-options">' + optsStr + '</div>' : ''}
          <div class="recap-detail">x${qte} × ${prix.toFixed(2)} ${t('dh')}</div>
        </div>
        <div class="recap-prix">${st.toFixed(2)} ${t('dh')}</div>`;
      c.appendChild(el);
    }
  });
  document.querySelectorAll('.valeur-total').forEach(e => {
    e.textContent = total.toFixed(2) + ' ' + t('dh');
  });
  afficherEcran('ecran-recap');
}

function resumerOptions(o) {
  if (!o) return '';
  const p = [];
  if (o.sucre === 'non')           p.push(langue==='ar' ? 'بدون سكر' : 'Sans sucre');
  if (o.sucre === 'oui' && o.qteSucre) p.push(o.qteSucre + ' cube' + (o.qteSucre > 1 ? 's' : ''));
  if (o.saccharine)                p.push('Saccharine');
  if (o.typeSirop === 'grenadine') p.push('Grenadine 🍓');
  if (o.typeSirop === 'menthe')    p.push('Menthe 🌿');
  return p.join(' · ');
}

// ════════════════════════════════════════════════════════════
//  CONFIRMER COMMANDE → FIREBASE
// ════════════════════════════════════════════════════════════
function confirmerCommande() {
  commandeRef = Math.floor(100000 + Math.random()*900000).toString();
  let total = 0;
  const pc = {};
  Object.entries(panier).forEach(([id, qte]) => {
    if (qte > 0 && produits[id]) {
      const p = produits[id];
      const prix = parseFloat(p.prix||0);
      total += prix * qte;
      pc[id] = { nom: p.nom, qte, prix, ...(optionsPanier[id] ? { options: optionsPanier[id] } : {}) };
    }
  });
  const now   = new Date();
  const heure = now.toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' });
  const date  = now.toLocaleDateString('fr-FR');
  db.ref('commandes/' + commandeRef)
    .set({ ref:commandeRef, table:numeroTable, nb_personnes:nbPersonnes,
           produits:pc, total:parseFloat(total.toFixed(2)), heure, date,
           statut:'en_attente', appel_serveur:false })
    .then(() => db.ref('tables/' + numeroTable + '/statut').set('en_attente'))
    .then(() => {
      const r = document.getElementById('ref-affichee');
      if (r) r.textContent = commandeRef;
      afficherEcran('ecran-attente');
      ecouterStatutCommande();
    })
    .catch(err => toast(t('erreur') + err.message, '#C0392B'));
}

// ════════════════════════════════════════════════════════════
//  ÉCOUTER STATUT
// ════════════════════════════════════════════════════════════
function ecouterStatutCommande() {
  if (ecouteurCommande)
    db.ref('commandes/' + commandeRef + '/statut').off('value', ecouteurCommande);
  ecouteurCommande = db.ref('commandes/' + commandeRef + '/statut')
    .on('value', (snap) => {
      const s = snap.val();
      if (s === 'servie')           { jouerSonnerie('servie');   afficherEcran('ecran-servie'); }
      else if (s === 'demande_paiement')               { afficherEcran('ecran-paiement'); }
      else if (s === 'payee')       { jouerSonnerie('paiement'); libererTable(); afficherEcran('ecran-merci'); setTimeout(recommencer, 5000); }
    });
}

function demanderPaiement() {
  jouerSonnerie('paiement');
  db.ref('commandes/' + commandeRef).update({ statut:'demande_paiement', demande_paiement:true })
    .then(() => db.ref('tables/' + numeroTable + '/statut').set('demande_paiement'))
    .then(() => afficherEcran('ecran-paiement'))
    .catch(err => toast(t('erreur') + err.message, '#C0392B'));
}

// ════════════════════════════════════════════════════════════
//  RESET
// ════════════════════════════════════════════════════════════
function nouvelleCommande() {
  commandeRef = null; nbPersonnes = 1; panier = {}; optionsPanier = {};
  const n = document.getElementById('nb-personnes'); if (n) n.textContent = '1';
  const i = document.getElementById('icones-personnes'); if (i) i.textContent = '👤';
  construireListeCommande(); mettreAJourTotal();
  afficherEcran('ecran-personnes');
}

function recommencer() {
  commandeRef = null; nbPersonnes = 1; panier = {}; optionsPanier = {};
  const n = document.getElementById('nb-personnes'); if (n) n.textContent = '1';
  const i = document.getElementById('icones-personnes'); if (i) i.textContent = '👤';
  construireListeCommande(); mettreAJourTotal();
  afficherEcran('ecran-accueil');
}

// ════════════════════════════════════════════════════════════
//  NAVIGATION
// ════════════════════════════════════════════════════════════
function afficherEcran(id) {
  document.querySelectorAll('.ecran').forEach(e => e.classList.remove('actif'));
  const el = document.getElementById(id);
  if (el) el.classList.add('actif');
}
