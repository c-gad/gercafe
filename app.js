// ════════════════════════════════════════════════════════════
//  FIREBASE CONFIG — REMPLACEZ PAR VOS VALEURS
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

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ════════════════════════════════════════════════════════════
//  TRADUCTIONS FR / AR
// ════════════════════════════════════════════════════════════
const TRAD = {
  fr: {
    bienvenue:           (n) => `Table ${n} — Bienvenue !`,
    chargement:          'Chargement du menu…',
    menu:                'MENU',
    commander:           'COMMANDER',
    appeler_serveur:     '🔔 APPELER LE SERVEUR',
    notre_menu:          'Notre Menu',
    retour:              '← Retour',
    nb_personnes:        'Combien de personnes ?',
    suivant:             'Suivant →',
    votre_commande:      'Votre commande',
    recapitulatif:       'Récapitulatif',
    confirmer:           '✅ CONFIRMER',
    en_preparation:      'Votre commande est\nen préparation…',
    reference:           'Référence',
    attente_sous:        'Le serveur s\'occupe de vous très bientôt ☕',
    bonne_degustation:   'Bonne dégustation !',
    commande_servie:     'Votre commande a été servie.',
    payer:               '💳 PAYER',
    nouvelle_cmd:        '📋 Nouvelle commande',
    paiement_cours:      'Paiement en cours…',
    paiement_sous:       'Le serveur va confirmer votre paiement.',
    merci:               'Merci pour votre visite !',
    a_bientot:           'À bientôt au GerCafe.',
    nouvelle_session:    'Nouvelle session',
    total:               'Total :',
    table_label:         'Table',
    table_reservee:      'Table réservée',
    table_occupee:       'Cette table est actuellement occupée par un autre client.',
    verification:        'Vérification automatique toutes les 10 secondes…',
    dh:                  'Dh',
    selectionner:        'Veuillez sélectionner au moins un produit',
    erreur:              'Erreur : ',
    // Popup appel serveur
    popup_titre:         'Besoin d\'aide ?',
    popup_sous:          'Choisissez ce dont vous avez besoin.\nLe serveur arrive rapidement.',
    opt_serveur_titre:   'Appeler le serveur',
    opt_serveur_desc:    'Le serveur vient à votre table',
    opt_addition_titre:  'Demander l\'addition',
    opt_addition_desc:   'Préparer le paiement',
    opt_eau_titre:       'Demander de l\'eau',
    opt_eau_desc:        'Carafe ou bouteille',
    popup_fermer:        'Annuler',
    toast_serveur:       '✅ Le serveur arrive !',
    toast_addition:      '💳 L\'addition est en route !',
    toast_eau:           '💧 De l\'eau arrive !',
    toast_erreur:        '❌ Erreur, réessayez',
    langue_btn:          '🇲🇦 ع',
  },
  ar: {
    bienvenue:           (n) => `طاولة ${n} — أهلاً بك !`,
    chargement:          'جارٍ تحميل القائمة…',
    menu:                'القائمة',
    commander:           'اطلب الآن',
    appeler_serveur:     '🔔 استدعاء النادل',
    notre_menu:          'قائمتنا',
    retour:              'رجوع →',
    nb_personnes:        'كم عدد الأشخاص ؟',
    suivant:             '← التالي',
    votre_commande:      'طلبك',
    recapitulatif:       'ملخص الطلب',
    confirmer:           '✅ تأكيد الطلب',
    en_preparation:      'طلبك قيد\nالتحضير…',
    reference:           'المرجع',
    attente_sous:        'النادل في طريقه إليك ☕',
    bonne_degustation:   'بالهناء والشفاء !',
    commande_servie:     'تم تقديم طلبك.',
    payer:               '💳 الدفع',
    nouvelle_cmd:        '📋 طلب جديد',
    paiement_cours:      'جارٍ الدفع…',
    paiement_sous:       'سيقوم النادل بتأكيد الدفع.',
    merci:               'شكراً لزيارتكم !',
    a_bientot:           'إلى اللقاء في GerCafe.',
    nouvelle_session:    'جلسة جديدة',
    total:               ': المجموع',
    table_label:         'طاولة',
    table_reservee:      'الطاولة محجوزة',
    table_occupee:       'هذه الطاولة مشغولة حالياً من طرف زبون آخر.',
    verification:        'فحص تلقائي كل 10 ثوانٍ…',
    dh:                  'درهم',
    selectionner:        'الرجاء اختيار منتج واحد على الأقل',
    erreur:              'خطأ : ',
    // Popup
    popup_titre:         'هل تحتاج مساعدة ؟',
    popup_sous:          'اختر ما تحتاجه،\nالنادل سيصل بسرعة.',
    opt_serveur_titre:   'استدعاء النادل',
    opt_serveur_desc:    'النادل يأتي إلى طاولتك',
    opt_addition_titre:  'طلب الحساب',
    opt_addition_desc:   'التحضير للدفع',
    opt_eau_titre:       'طلب الماء',
    opt_eau_desc:        'إبريق أو زجاجة',
    popup_fermer:        'إلغاء',
    toast_serveur:       '✅ النادل في الطريق !',
    toast_addition:      '💳 الحساب في الطريق !',
    toast_eau:           '💧 الماء في الطريق !',
    toast_erreur:        '❌ خطأ، حاول مجدداً',
    langue_btn:          '🇫🇷 FR',
  }
};

// ════════════════════════════════════════════════════════════
//  VARIABLES
// ════════════════════════════════════════════════════════════
let langue           = localStorage.getItem('gercafe_langue') || 'fr';
let numeroTable      = 0;
let nbPersonnes      = 1;
let produits         = {};
let panier           = {};
let commandeRef      = null;
let ecouteurCommande = null;
let sessionId        = null;

const t = (key, ...args) => {
  const val = TRAD[langue][key];
  return typeof val === 'function' ? val(...args) : (val ?? TRAD['fr'][key] ?? key);
};

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
//  APPLIQUER LA LANGUE — TOUS LES TEXTES DE LA PAGE
// ════════════════════════════════════════════════════════════
function appliquerLangue() {
  const isAr = langue === 'ar';
  document.documentElement.dir  = isAr ? 'rtl' : 'ltr';
  document.documentElement.lang = isAr ? 'ar'  : 'fr';
  document.body.style.fontFamily = isAr
    ? "'Noto Naskh Arabic', 'Segoe UI', sans-serif"
    : "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

  // Bouton langue
  const bl = document.getElementById('btn-langue');
  if (bl) bl.textContent = t('langue_btn');

  // Map id → clé traduction
  const map = {
    'txt-chargement':      'chargement',
    'txt-menu-btn':        'menu',
    'txt-commander-btn':   'commander',
    'txt-appel-btn':       'appeler_serveur',
    'titre-menu':          'notre_menu',
    'titre-personnes':     'nb_personnes',
    'btn-suivant':         'suivant',
    'titre-commande':      'votre_commande',
    'titre-recap':         'recapitulatif',
    'btn-confirmer':       'confirmer',
    'txt-reference':       'reference',
    'txt-attente-sous':    'attente_sous',
    'txt-bonne-deg':       'bonne_degustation',
    'txt-servie-sous':     'commande_servie',
    'btn-payer':           'payer',
    'btn-nouvelle-cmd':    'nouvelle_cmd',
    'txt-paiement':        'paiement_cours',
    'txt-paiement-sous':   'paiement_sous',
    'txt-merci':           'merci',
    'txt-abientot':        'a_bientot',
    'btn-session':         'nouvelle_session',
    'txt-reserve-titre':   'table_reservee',
    'txt-table-label':     'table_label',
    'txt-reserve-texte':   'table_occupee',
    'txt-reserve-verif':   'verification',
    // Popup
    'popup-titre':         'popup_titre',
    'popup-sous':          'popup_sous',
    'opt-serveur-titre':   'opt_serveur_titre',
    'opt-serveur-desc':    'opt_serveur_desc',
    'opt-addition-titre':  'opt_addition_titre',
    'opt-addition-desc':   'opt_addition_desc',
    'opt-eau-titre':       'opt_eau_titre',
    'opt-eau-desc':        'opt_eau_desc',
    'popup-btn-fermer':    'popup_fermer',
  };

  Object.entries(map).forEach(([id, key]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = t(key);
  });

  // Labels avec classe
  document.querySelectorAll('.btn-retour').forEach(el => {
    el.textContent = t('retour');
  });
  document.querySelectorAll('.label-total').forEach(el => {
    el.textContent = t('total');
  });
  document.querySelectorAll('.txt-appel-inline').forEach(el => {
    el.textContent = t('appeler_serveur');
  });

  // Bienvenue table
  if (numeroTable > 0) {
    const bv = document.getElementById('bienvenue-table');
    if (bv) bv.textContent = t('bienvenue', numeroTable);
    const it = document.getElementById('info-table-commande');
    if (it) it.textContent = `${t('table_label')} ${numeroTable}`;
    const ir = document.getElementById('info-table-recap');
    if (ir) ir.textContent = `${t('table_label')} ${numeroTable}`;
    const ta = document.getElementById('table-affichee');
    if (ta) ta.textContent = `${t('table_label')} ${numeroTable}`;
  }

  // Reconstruire les listes
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
//  POPUP APPEL SERVEUR
// ════════════════════════════════════════════════════════════
function ouvrirPopupAppel() {
  document.getElementById('popup-appel').classList.add('ouvert');
}

function fermerPopupAppel(event) {
  // Fermer seulement si clic sur l'overlay (pas sur la sheet)
  if (!event || event.target === document.getElementById('popup-appel')) {
    document.getElementById('popup-appel').classList.remove('ouvert');
  }
}

function envoyerAppel(type) {
  document.getElementById('popup-appel').classList.remove('ouvert');

  const updates = { appel_serveur: true };
  let toastMsg = '';

  if (type === 'serveur') {
    updates.statut      = 'appel_serveur';
    updates.type_appel  = 'serveur';
    toastMsg = t('toast_serveur');
  } else if (type === 'addition') {
    updates.statut          = 'demande_paiement';
    updates.type_appel      = 'addition';
    updates.demande_paiement = true;
    toastMsg = t('toast_addition');
    if (commandeRef) {
      db.ref(`commandes/${commandeRef}`).update({
        statut: 'demande_paiement', demande_paiement: true,
      });
    }
  } else if (type === 'eau') {
    updates.statut     = 'appel_serveur';
    updates.type_appel = 'eau';
    toastMsg = t('toast_eau');
  }

  db.ref(`tables/${numeroTable}`)
    .update(updates)
    .then(() => afficherToast(toastMsg, '#2E7D4F'))
    .catch(() => afficherToast(t('toast_erreur'), '#C0392B'));
}

// ════════════════════════════════════════════════════════════
//  TOAST NOTIFICATION
// ════════════════════════════════════════════════════════════
function afficherToast(message, couleur = '#2E7D4F') {
  const toast = document.getElementById('toast');
  toast.textContent  = message;
  toast.style.background = couleur;
  toast.style.display    = 'block';
  setTimeout(() => { toast.style.display = 'none'; }, 3000);
}

// ════════════════════════════════════════════════════════════
//  DÉMARRAGE
// ════════════════════════════════════════════════════════════
window.onload = function () {
  const urlParams = new URLSearchParams(window.location.search);
  numeroTable = parseInt(urlParams.get('table')) || 0;
  sessionId   = genererSessionId();
  appliquerLangue();

  if (numeroTable === 0) {
    document.getElementById('bienvenue-table').textContent =
      langue === 'ar' ? 'قم بمسح رمز QR الخاص بطاولتك'
                      : 'Scannez le QR code de votre table';
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
  db.ref(`tables/${numeroTable}/session_web`).once('value', (snap) => {
    const s = snap.val();
    (!s || s === sessionId) ? prendreTable() : afficherEcranReserve();
  });
}

function prendreTable() {
  db.ref(`tables/${numeroTable}/session_web`).set(sessionId)
    .then(() => {
      db.ref(`tables/${numeroTable}/session_web`).onDisconnect().remove();
      chargerProduits();
    })
    .catch(() => chargerProduits());
}

function afficherEcranReserve() {
  document.querySelectorAll('.ecran').forEach(e => e.classList.remove('actif'));
  const ecran = document.getElementById('ecran-reserve');
  if (ecran) {
    ecran.classList.add('actif');
    document.getElementById('reserve-table-num').textContent = numeroTable;
  }
  setTimeout(() => {
    db.ref(`tables/${numeroTable}/session_web`).once('value', (snap) => {
      const s = snap.val();
      (!s || s === sessionId) ? prendreTable() : afficherEcranReserve();
    });
  }, 10000);
}

function libererTable() {
  if (!numeroTable || !sessionId) return;
  db.ref(`tables/${numeroTable}/session_web`).once('value', (snap) => {
    if (snap.val() === sessionId)
      db.ref(`tables/${numeroTable}/session_web`).remove();
  });
}

window.addEventListener('beforeunload', libererTable);

// ════════════════════════════════════════════════════════════
//  PRODUITS
// ════════════════════════════════════════════════════════════
function chargerProduits() {
  db.ref('produits').once('value', (snap) => {
    produits = snap.val() || {};
    appliquerLangue();
    afficherEcran('ecran-accueil');
    construireMenu();
    construireListeCommande();
  });
}

function nomProduit(p) {
  return langue === 'ar' ? (p.nom_ar || p.nom) : p.nom;
}

function construireMenu() {
  const container = document.getElementById('liste-menu');
  if (!container) return;
  container.innerHTML = '';
  const cats = {};
  Object.entries(produits).forEach(([id, p]) => {
    const cat = langue === 'ar' ? (p.categorie_ar || p.categorie || 'أخرى')
                                : (p.categorie || 'Autre');
    if (!cats[cat]) cats[cat] = [];
    cats[cat].push({ id, ...p });
  });
  Object.entries(cats).forEach(([cat, items]) => {
    const h = document.createElement('div');
    h.className = 'categorie-titre';
    h.textContent = cat;
    container.appendChild(h);
    items.forEach(item => {
      const el = document.createElement('div');
      el.className = 'produit-item';
      el.innerHTML = `
        <span class="produit-icone">${item.icone || '☕'}</span>
        <div class="produit-info">
          <div class="produit-nom">${nomProduit(item)}</div>
          <div class="produit-prix">${parseFloat(item.prix||0).toFixed(2)} ${t('dh')}</div>
        </div>`;
      container.appendChild(el);
    });
  });
}

function construireListeCommande() {
  const container = document.getElementById('liste-commande');
  if (!container) return;
  container.innerHTML = '';
  panier = {};
  const cats = {};
  Object.entries(produits).forEach(([id, p]) => {
    const cat = langue === 'ar' ? (p.categorie_ar || p.categorie || 'أخرى')
                                : (p.categorie || 'Autre');
    if (!cats[cat]) cats[cat] = [];
    cats[cat].push({ id, ...p });
  });
  Object.entries(cats).forEach(([cat, items]) => {
    const h = document.createElement('div');
    h.className = 'categorie-titre';
    h.textContent = cat;
    container.appendChild(h);
    items.forEach(item => {
      panier[item.id] = 0;
      const el = document.createElement('div');
      el.className = 'produit-item';
      el.id = `item-${item.id}`;
      el.innerHTML = `
        <span class="produit-icone">${item.icone || '☕'}</span>
        <div class="produit-info">
          <div class="produit-nom">${nomProduit(item)}</div>
          <div class="produit-prix">${parseFloat(item.prix||0).toFixed(2)} ${t('dh')}</div>
        </div>
        <div class="produit-compteur">
          <button class="btn-compteur" onclick="modifierQte('${item.id}',-1)">−</button>
          <span class="qte-affichage" id="qte-${item.id}">0</span>
          <button class="btn-compteur" onclick="modifierQte('${item.id}',1)">+</button>
        </div>`;
      container.appendChild(el);
    });
  });
}

// ════════════════════════════════════════════════════════════
//  PANIER
// ════════════════════════════════════════════════════════════
function modifierQte(id, delta) {
  panier[id] = Math.max(0, (panier[id]||0) + delta);
  const q = document.getElementById(`qte-${id}`);
  const c = document.getElementById(`item-${id}`);
  if (q) q.textContent = panier[id];
  if (c) c.classList.toggle('selectionne', panier[id] > 0);
  mettreAJourTotal();
}

function mettreAJourTotal() {
  let total = 0;
  Object.entries(panier).forEach(([id, qte]) => {
    if (qte > 0 && produits[id])
      total += parseFloat(produits[id].prix||0) * qte;
  });
  document.querySelectorAll('.valeur-total').forEach(el => {
    el.textContent = total.toFixed(2) + ' ' + t('dh');
  });
  return total;
}

function modifierPersonnes(delta) {
  nbPersonnes = Math.max(1, Math.min(20, nbPersonnes + delta));
  document.getElementById('nb-personnes').textContent = nbPersonnes;
  let ic = '';
  for (let i = 0; i < Math.min(nbPersonnes,10); i++) ic += '👤';
  if (nbPersonnes > 10) ic += ` +${nbPersonnes-10}`;
  document.getElementById('icones-personnes').textContent = ic;
}

// ════════════════════════════════════════════════════════════
//  RÉCAP
// ════════════════════════════════════════════════════════════
function afficherRecap() {
  const hasItems = Object.values(panier).some(q => q > 0);
  if (!hasItems) { afficherToast(t('selectionner'), '#C0392B'); return; }
  const container = document.getElementById('liste-recap');
  container.innerHTML = '';
  let total = 0;
  Object.entries(panier).forEach(([id, qte]) => {
    if (qte > 0 && produits[id]) {
      const p = produits[id];
      const prix = parseFloat(p.prix||0);
      const st   = prix * qte;
      total += st;
      const el = document.createElement('div');
      el.className = 'recap-item';
      el.innerHTML = `
        <div>
          <div class="recap-nom">${p.icone||'☕'} ${nomProduit(p)}</div>
          <div class="recap-detail">x${qte} × ${prix.toFixed(2)} ${t('dh')}</div>
        </div>
        <div class="recap-prix">${st.toFixed(2)} ${t('dh')}</div>`;
      container.appendChild(el);
    }
  });
  document.querySelectorAll('.valeur-total').forEach(el => {
    el.textContent = total.toFixed(2) + ' ' + t('dh');
  });
  afficherEcran('ecran-recap');
}

// ════════════════════════════════════════════════════════════
//  COMMANDE → FIREBASE
// ════════════════════════════════════════════════════════════
function confirmerCommande() {
  commandeRef = Math.floor(100000 + Math.random()*900000).toString();
  let total = 0;
  const pc  = {};
  Object.entries(panier).forEach(([id, qte]) => {
    if (qte > 0 && produits[id]) {
      const p = produits[id];
      const prix = parseFloat(p.prix||0);
      total += prix * qte;
      pc[id] = { nom: p.nom, qte, prix };
    }
  });
  const now   = new Date();
  const heure = now.toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' });
  const date  = now.toLocaleDateString('fr-FR');

  db.ref(`commandes/${commandeRef}`)
    .set({ ref:commandeRef, table:numeroTable, nb_personnes:nbPersonnes,
           produits:pc, total:parseFloat(total.toFixed(2)),
           heure, date, statut:'en_attente', appel_serveur:false })
    .then(() => db.ref(`tables/${numeroTable}/statut`).set('en_attente'))
    .then(() => {
      document.getElementById('ref-affichee').textContent = commandeRef;
      afficherEcran('ecran-attente');
      ecouterStatutCommande();
    })
    .catch(err => afficherToast(t('erreur') + err.message, '#C0392B'));
}

// ════════════════════════════════════════════════════════════
//  ÉCOUTER STATUT
// ════════════════════════════════════════════════════════════
function ecouterStatutCommande() {
  if (ecouteurCommande)
    db.ref(`commandes/${commandeRef}/statut`).off('value', ecouteurCommande);
  ecouteurCommande = db.ref(`commandes/${commandeRef}/statut`)
    .on('value', (snap) => {
      const s = snap.val();
      if      (s === 'servie')           afficherEcran('ecran-servie');
      else if (s === 'demande_paiement') afficherEcran('ecran-paiement');
      else if (s === 'payee') {
        libererTable();
        afficherEcran('ecran-merci');
        setTimeout(recommencer, 5000);
      }
    });
}

function demanderPaiement() {
  db.ref(`commandes/${commandeRef}`)
    .update({ statut:'demande_paiement', demande_paiement:true })
    .then(() => db.ref(`tables/${numeroTable}/statut`).set('demande_paiement'))
    .then(() => afficherEcran('ecran-paiement'))
    .catch(err => afficherToast(t('erreur') + err.message, '#C0392B'));
}

function nouvelleCommande() {
  commandeRef = null; nbPersonnes = 1; panier = {};
  document.getElementById('nb-personnes').textContent     = '1';
  document.getElementById('icones-personnes').textContent = '👤';
  construireListeCommande(); mettreAJourTotal();
  afficherEcran('ecran-personnes');
}

function recommencer() {
  commandeRef = null; nbPersonnes = 1; panier = {};
  document.getElementById('nb-personnes').textContent     = '1';
  document.getElementById('icones-personnes').textContent = '👤';
  construireListeCommande(); mettreAJourTotal();
  afficherEcran('ecran-accueil');
}

function afficherEcran(id) {
  document.querySelectorAll('.ecran').forEach(e => e.classList.remove('actif'));
  const el = document.getElementById(id);
  if (el) el.classList.add('actif');
}
