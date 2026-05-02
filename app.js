// ════════════════════════════════════════════════════════════
//  CONFIGURATION FIREBASE — REMPLACEZ PAR VOS VALEURS
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
    bienvenue:        (n) => `Table ${n} — Bienvenue !`,
    menu:             'MENU',
    commander:        'COMMANDER',
    appeler_serveur:  'APPELER LE SERVEUR',
    notre_menu:       'Notre Menu',
    retour:           '← Retour',
    nb_personnes:     'Combien de personnes ?',
    suivant:          'Suivant →',
    votre_commande:   'Votre commande',
    recapitulatif:    'Récapitulatif',
    confirmer:        '✅ CONFIRMER LA COMMANDE',
    en_preparation:   'Votre commande est\nen préparation…',
    reference:        'Référence',
    attente_sous:     'Le serveur s\'occupe de vous très bientôt ☕',
    bonne_degustation:'Bonne dégustation !',
    commande_servie:  'Votre commande a été servie.',
    payer:            '💳 PAYER',
    nouvelle_cmd:     '📋 Nouvelle commande',
    paiement_cours:   'Paiement en cours…',
    paiement_sous:    'Le serveur va confirmer votre paiement.',
    merci:            'Merci pour votre visite !',
    a_bientot:        'À bientôt au GerCafe.',
    nouvelle_session: 'Nouvelle session',
    total:            'Total :',
    table_reservee:   'Table réservée',
    table_occupee:    'Cette table est actuellement occupée par un autre client. Veuillez scanner le QR code de votre propre table.',
    verification:     'Vérification automatique toutes les 10 secondes…',
    appele:           '✅ Le serveur a été appelé !',
    chargement:       'Chargement du menu…',
    selectionner:     'Veuillez sélectionner au moins un produit',
    erreur:           'Erreur : ',
    dh:               'Dh',
    table:            'Table',
    langue:           '🇫🇷 FR',
  },
  ar: {
    bienvenue:        (n) => `طاولة ${n} — أهلاً بك !`,
    menu:             'القائمة',
    commander:        'اطلب الآن',
    appeler_serveur:  'استدعاء النادل',
    notre_menu:       'قائمتنا',
    retour:           'رجوع →',
    nb_personnes:     'كم عدد الأشخاص ؟',
    suivant:          '← التالي',
    votre_commande:   'طلبك',
    recapitulatif:    'ملخص الطلب',
    confirmer:        '✅ تأكيد الطلب',
    en_preparation:   'طلبك قيد\nالتحضير…',
    reference:        'المرجع',
    attente_sous:     'النادل في طريقه إليك ☕',
    bonne_degustation:'بالهناء والشفاء !',
    commande_servie:  'تم تقديم طلبك.',
    payer:            '💳 الدفع',
    nouvelle_cmd:     '📋 طلب جديد',
    paiement_cours:   'جارٍ الدفع…',
    paiement_sous:    'سيقوم النادل بتأكيد الدفع.',
    merci:            'شكراً لزيارتكم !',
    a_bientot:        'إلى اللقاء في GerCafe.',
    nouvelle_session: 'جلسة جديدة',
    total:            ': المجموع',
    table_reservee:   'الطاولة محجوزة',
    table_occupee:    'هذه الطاولة مشغولة حالياً من طرف زبون آخر. يرجى مسح رمز QR الخاص بطاولتك.',
    verification:     'فحص تلقائي كل 10 ثوانٍ…',
    appele:           '✅ تم استدعاء النادل !',
    chargement:       'جارٍ تحميل القائمة…',
    selectionner:     'الرجاء اختيار منتج واحد على الأقل',
    erreur:           'خطأ : ',
    dh:               'درهم',
    table:            'طاولة',
    langue:           '🇲🇦 ع',
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
let commandeRef      = null;
let ecouteurCommande = null;
let sessionId        = null;

// Raccourci traduction
const t = (key, ...args) => {
  const val = TRAD[langue][key];
  return typeof val === 'function' ? val(...args) : (val ?? key);
};

// ════════════════════════════════════════════════════════════
//  SESSION ID UNIQUE PAR ONGLET
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
//  APPLIQUER LA LANGUE (RTL/LTR + traductions)
// ════════════════════════════════════════════════════════════
function appliquerLangue() {
  const isAr = langue === 'ar';
  document.documentElement.dir  = isAr ? 'rtl' : 'ltr';
  document.documentElement.lang = isAr ? 'ar'  : 'fr';
  document.body.style.fontFamily = isAr
    ? "'Noto Naskh Arabic', 'Segoe UI', sans-serif"
    : "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

  // Bouton de langue
  const btnLangue = document.getElementById('btn-langue');
  if (btnLangue) btnLangue.textContent = isAr ? '🇫🇷 FR' : '🇲🇦 ع';

  // Textes statiques
  const map = {
    'txt-chargement':    t('chargement'),
    'txt-menu-btn':      t('menu'),
    'txt-commander-btn': t('commander'),
    'txt-appel-btn':     t('appeler_serveur'),
    'titre-menu':        t('notre_menu'),
    'titre-personnes':   t('nb_personnes'),
    'btn-suivant':       t('suivant'),
    'titre-commande':    t('votre_commande'),
    'titre-recap':       t('recapitulatif'),
    'btn-confirmer':     t('confirmer'),
    'txt-attente-sous':  t('attente_sous'),
    'txt-reference':     t('reference'),
    'txt-bonne-deg':     t('bonne_degustation'),
    'txt-servie-sous':   t('commande_servie'),
    'btn-payer':         t('payer'),
    'btn-nouvelle-cmd':  t('nouvelle_cmd'),
    'txt-paiement':      t('paiement_cours'),
    'txt-paiement-sous': t('paiement_sous'),
    'txt-merci':         t('merci'),
    'txt-abientot':      t('a_bientot'),
    'btn-session':       t('nouvelle_session'),
    'txt-reserve-titre': t('table_reservee'),
    'txt-reserve-texte': t('table_occupee'),
    'txt-reserve-verif': t('verification'),
  };

  Object.entries(map).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  });

  // Retours
  document.querySelectorAll('.btn-retour').forEach(btn => {
    btn.textContent = t('retour');
  });

  // Total
  document.querySelectorAll('.label-total').forEach(el => {
    el.textContent = t('total');
  });

  // Bienvenue table
  if (numeroTable > 0) {
    const bv = document.getElementById('bienvenue-table');
    if (bv) bv.textContent = t('bienvenue', numeroTable);
    const it = document.getElementById('info-table-commande');
    if (it) it.textContent = `${t('table')} ${numeroTable}`;
    const ir = document.getElementById('info-table-recap');
    if (ir) ir.textContent = `${t('table')} ${numeroTable}`;
    const ta = document.getElementById('table-affichee');
    if (ta) ta.textContent = `${t('table')} ${numeroTable}`;
  }

  // Reconstruire listes si produits chargés
  if (Object.keys(produits).length > 0) {
    construireMenu();
    construireListeCommande();
    mettreAJourTotal();
  }
}

// Changer la langue (bouton dans l'UI)
function changerLangue() {
  langue = langue === 'fr' ? 'ar' : 'fr';
  localStorage.setItem('gercafe_langue', langue);
  appliquerLangue();
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
    const bv = document.getElementById('bienvenue-table');
    if (bv) bv.textContent = langue === 'ar'
      ? 'قم بمسح رمز QR الخاص بطاولتك'
      : 'Scannez le QR code de votre table';
    afficherEcran('ecran-accueil');
    return;
  }

  verifierSessionTable();
};

// ════════════════════════════════════════════════════════════
//  SESSION TABLE (verrouillage)
// ════════════════════════════════════════════════════════════
function verifierSessionTable() {
  afficherEcran('ecran-chargement');
  db.ref(`tables/${numeroTable}/session_web`).once('value', (snapshot) => {
    const sessionExistante = snapshot.val();
    if (!sessionExistante || sessionExistante === sessionId) {
      prendreTable();
    } else {
      afficherEcranReserve();
    }
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
      if (!s || s === sessionId) prendreTable();
      else afficherEcranReserve();
    });
  }, 10000);
}

function libererTable() {
  if (numeroTable && sessionId) {
    db.ref(`tables/${numeroTable}/session_web`).once('value', (snap) => {
      if (snap.val() === sessionId)
        db.ref(`tables/${numeroTable}/session_web`).remove();
    });
  }
}

window.addEventListener('beforeunload', libererTable);

// ════════════════════════════════════════════════════════════
//  CHARGER PRODUITS
// ════════════════════════════════════════════════════════════
function chargerProduits() {
  db.ref('produits').once('value', (snapshot) => {
    produits = snapshot.val() || {};
    appliquerLangue();
    afficherEcran('ecran-accueil');
    construireMenu();
    construireListeCommande();
  });
}

// ════════════════════════════════════════════════════════════
//  CONSTRUIRE MENU (lecture seule)
// ════════════════════════════════════════════════════════════
function construireMenu() {
  const container = document.getElementById('liste-menu');
  if (!container) return;
  container.innerHTML = '';

  const categories = {};
  Object.entries(produits).forEach(([id, produit]) => {
    const cat = langue === 'ar'
      ? (produit.categorie_ar || produit.categorie || 'أخرى')
      : (produit.categorie || 'Autre');
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push({ id, ...produit });
  });

  Object.entries(categories).forEach(([cat, items]) => {
    const titreEl = document.createElement('div');
    titreEl.className = 'categorie-titre';
    titreEl.textContent = cat;
    container.appendChild(titreEl);

    items.forEach((item) => {
      const nomAffiche = langue === 'ar'
        ? (item.nom_ar || item.nom)
        : item.nom;
      const el = document.createElement('div');
      el.className = 'produit-item';
      el.innerHTML = `
        <span class="produit-icone">${item.icone || '☕'}</span>
        <div class="produit-info">
          <div class="produit-nom">${nomAffiche}</div>
          <div class="produit-prix">${parseFloat(item.prix || 0).toFixed(2)} ${t('dh')}</div>
        </div>
      `;
      container.appendChild(el);
    });
  });
}

// ════════════════════════════════════════════════════════════
//  CONSTRUIRE LISTE COMMANDE (avec +/−)
// ════════════════════════════════════════════════════════════
function construireListeCommande() {
  const container = document.getElementById('liste-commande');
  if (!container) return;
  container.innerHTML = '';
  panier = {};

  const categories = {};
  Object.entries(produits).forEach(([id, produit]) => {
    const cat = langue === 'ar'
      ? (produit.categorie_ar || produit.categorie || 'أخرى')
      : (produit.categorie || 'Autre');
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push({ id, ...produit });
  });

  Object.entries(categories).forEach(([cat, items]) => {
    const titreEl = document.createElement('div');
    titreEl.className = 'categorie-titre';
    titreEl.textContent = cat;
    container.appendChild(titreEl);

    items.forEach((item) => {
      panier[item.id] = 0;
      const nomAffiche = langue === 'ar'
        ? (item.nom_ar || item.nom)
        : item.nom;
      const el = document.createElement('div');
      el.className = 'produit-item';
      el.id = `item-${item.id}`;
      el.innerHTML = `
        <span class="produit-icone">${item.icone || '☕'}</span>
        <div class="produit-info">
          <div class="produit-nom">${nomAffiche}</div>
          <div class="produit-prix">${parseFloat(item.prix || 0).toFixed(2)} ${t('dh')}</div>
        </div>
        <div class="produit-compteur">
          <button class="btn-compteur" onclick="modifierQte('${item.id}', -1)">−</button>
          <span class="qte-affichage" id="qte-${item.id}">0</span>
          <button class="btn-compteur" onclick="modifierQte('${item.id}', 1)">+</button>
        </div>
      `;
      container.appendChild(el);
    });
  });
}

// ════════════════════════════════════════════════════════════
//  MODIFIER QUANTITÉ
// ════════════════════════════════════════════════════════════
function modifierQte(produitId, delta) {
  panier[produitId] = Math.max(0, (panier[produitId] || 0) + delta);
  const qteEl  = document.getElementById(`qte-${produitId}`);
  const itemEl = document.getElementById(`item-${produitId}`);
  if (qteEl)  qteEl.textContent = panier[produitId];
  if (itemEl) itemEl.classList.toggle('selectionne', panier[produitId] > 0);
  mettreAJourTotal();
}

function mettreAJourTotal() {
  let total = 0;
  Object.entries(panier).forEach(([id, qte]) => {
    if (qte > 0 && produits[id])
      total += parseFloat(produits[id].prix || 0) * qte;
  });
  document.querySelectorAll('.valeur-total').forEach(el => {
    el.textContent = total.toFixed(2) + ' ' + t('dh');
  });
  return total;
}

// ════════════════════════════════════════════════════════════
//  MODIFIER NOMBRE DE PERSONNES
// ════════════════════════════════════════════════════════════
function modifierPersonnes(delta) {
  nbPersonnes = Math.max(1, Math.min(20, nbPersonnes + delta));
  document.getElementById('nb-personnes').textContent = nbPersonnes;
  let icones = '';
  for (let i = 0; i < Math.min(nbPersonnes, 10); i++) icones += '👤';
  if (nbPersonnes > 10) icones += ` +${nbPersonnes - 10}`;
  document.getElementById('icones-personnes').textContent = icones;
}

// ════════════════════════════════════════════════════════════
//  RÉCAPITULATIF
// ════════════════════════════════════════════════════════════
function afficherRecap() {
  const hasItems = Object.values(panier).some(qte => qte > 0);
  if (!hasItems) { alert(t('selectionner')); return; }

  const container = document.getElementById('liste-recap');
  container.innerHTML = '';
  let total = 0;

  Object.entries(panier).forEach(([id, qte]) => {
    if (qte > 0 && produits[id]) {
      const produit   = produits[id];
      const prix      = parseFloat(produit.prix || 0);
      const sousTotal = prix * qte;
      total += sousTotal;
      const nomAffiche = langue === 'ar'
        ? (produit.nom_ar || produit.nom) : produit.nom;

      const el = document.createElement('div');
      el.className = 'recap-item';
      el.innerHTML = `
        <div>
          <div class="recap-nom">${produit.icone || '☕'} ${nomAffiche}</div>
          <div class="recap-detail">x${qte} × ${prix.toFixed(2)} ${t('dh')}</div>
        </div>
        <div class="recap-prix">${sousTotal.toFixed(2)} ${t('dh')}</div>
      `;
      container.appendChild(el);
    }
  });

  document.querySelectorAll('.valeur-total').forEach(el => {
    el.textContent = total.toFixed(2) + ' ' + t('dh');
  });
  afficherEcran('ecran-recap');
}

// ════════════════════════════════════════════════════════════
//  CONFIRMER COMMANDE → FIREBASE
// ════════════════════════════════════════════════════════════
function confirmerCommande() {
  commandeRef = Math.floor(100000 + Math.random() * 900000).toString();
  let total = 0;
  const produitsCommande = {};

  Object.entries(panier).forEach(([id, qte]) => {
    if (qte > 0 && produits[id]) {
      const produit = produits[id];
      const prix    = parseFloat(produit.prix || 0);
      total += prix * qte;
      produitsCommande[id] = { nom: produit.nom, qte, prix };
    }
  });

  const now   = new Date();
  const heure = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  const date  = now.toLocaleDateString('fr-FR');

  db.ref(`commandes/${commandeRef}`)
    .set({
      ref: commandeRef, table: numeroTable, nb_personnes: nbPersonnes,
      produits: produitsCommande, total: parseFloat(total.toFixed(2)),
      heure, date, statut: 'en_attente', appel_serveur: false,
    })
    .then(() => db.ref(`tables/${numeroTable}/statut`).set('en_attente'))
    .then(() => {
      document.getElementById('ref-affichee').textContent = commandeRef;
      afficherEcran('ecran-attente');
      ecouterStatutCommande();
    })
    .catch(err => alert(t('erreur') + err.message));
}

// ════════════════════════════════════════════════════════════
//  ÉCOUTER STATUT EN TEMPS RÉEL
// ════════════════════════════════════════════════════════════
function ecouterStatutCommande() {
  if (ecouteurCommande)
    db.ref(`commandes/${commandeRef}/statut`).off('value', ecouteurCommande);

  ecouteurCommande = db
    .ref(`commandes/${commandeRef}/statut`)
    .on('value', (snapshot) => {
      const statut = snapshot.val();
      if      (statut === 'servie')           afficherEcran('ecran-servie');
      else if (statut === 'demande_paiement') afficherEcran('ecran-paiement');
      else if (statut === 'payee') {
        libererTable();
        afficherEcran('ecran-merci');
        setTimeout(recommencer, 5000);
      }
    });
}

// ════════════════════════════════════════════════════════════
//  APPELER SERVEUR
// ════════════════════════════════════════════════════════════
function appelServeur() {
  db.ref(`tables/${numeroTable}`)
    .update({ statut: 'appel_serveur', appel_serveur: true })
    .then(() => alert(t('appele')))
    .catch(err => alert(t('erreur') + err.message));
}

// ════════════════════════════════════════════════════════════
//  DEMANDER PAIEMENT
// ════════════════════════════════════════════════════════════
function demanderPaiement() {
  db.ref(`commandes/${commandeRef}`)
    .update({ statut: 'demande_paiement', demande_paiement: true })
    .then(() => db.ref(`tables/${numeroTable}/statut`).set('demande_paiement'))
    .then(() => afficherEcran('ecran-paiement'))
    .catch(err => alert(t('erreur') + err.message));
}

// ════════════════════════════════════════════════════════════
//  NOUVELLE COMMANDE / RECOMMENCER
// ════════════════════════════════════════════════════════════
function nouvelleCommande() {
  commandeRef = null; nbPersonnes = 1; panier = {};
  document.getElementById('nb-personnes').textContent    = '1';
  document.getElementById('icones-personnes').textContent = '👤';
  construireListeCommande();
  mettreAJourTotal();
  afficherEcran('ecran-personnes');
}

function recommencer() {
  commandeRef = null; nbPersonnes = 1; panier = {};
  document.getElementById('nb-personnes').textContent    = '1';
  document.getElementById('icones-personnes').textContent = '👤';
  construireListeCommande();
  mettreAJourTotal();
  afficherEcran('ecran-accueil');
}

// ════════════════════════════════════════════════════════════
//  NAVIGATION
// ════════════════════════════════════════════════════════════
function afficherEcran(idEcran) {
  document.querySelectorAll('.ecran').forEach(e => e.classList.remove('actif'));
  const cible = document.getElementById(idEcran);
  if (cible) cible.classList.add('actif');
}
