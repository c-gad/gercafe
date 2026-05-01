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
//  VARIABLES GLOBALES
// ════════════════════════════════════════════════════════════
let numeroTable      = 0;
let nbPersonnes      = 1;
let produits         = {};
let panier           = {};
let commandeRef      = null;
let ecouteurCommande = null;
let sessionId        = null;

// ════════════════════════════════════════════════════════════
//  ID DE SESSION UNIQUE PAR ONGLET/NAVIGATEUR
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
//  DÉMARRAGE
// ════════════════════════════════════════════════════════════
window.onload = function () {
  const urlParams = new URLSearchParams(window.location.search);
  numeroTable = parseInt(urlParams.get('table')) || 0;
  sessionId   = genererSessionId();

  if (numeroTable === 0) {
    document.getElementById('bienvenue-table').textContent =
      'Scannez le QR code de votre table';
    afficherEcran('ecran-accueil');
    return;
  }

  verifierSessionTable();
};

// ════════════════════════════════════════════════════════════
//  VÉRIFIER SI LA TABLE EST LIBRE OU PRISE
// ════════════════════════════════════════════════════════════
function verifierSessionTable() {
  afficherEcran('ecran-chargement');

  db.ref(`tables/${numeroTable}/session_web`).once('value', (snapshot) => {
    const sessionExistante = snapshot.val();

    if (!sessionExistante || sessionExistante === sessionId) {
      // Libre ou déjà notre session → on entre
      prendreTable();
    } else {
      // Une autre session active → bloquer
      afficherEcranReserve();
    }
  });
}

// ════════════════════════════════════════════════════════════
//  PRENDRE LA TABLE
// ════════════════════════════════════════════════════════════
function prendreTable() {
  db.ref(`tables/${numeroTable}/session_web`).set(sessionId)
    .then(() => {
      // Auto-libérer si l'onglet se ferme (Firebase onDisconnect)
      db.ref(`tables/${numeroTable}/session_web`).onDisconnect().remove();
      chargerProduits();
    })
    .catch(() => chargerProduits());
}

// ════════════════════════════════════════════════════════════
//  AFFICHER L'ÉCRAN TABLE RÉSERVÉE
// ════════════════════════════════════════════════════════════
function afficherEcranReserve() {
  document.querySelectorAll('.ecran').forEach(e => e.classList.remove('actif'));
  const ecran = document.getElementById('ecran-reserve');
  if (ecran) {
    ecran.classList.add('actif');
    document.getElementById('reserve-table-num').textContent = numeroTable;
  }

  // Réécouter toutes les 10 secondes si la table se libère
  setTimeout(() => {
    db.ref(`tables/${numeroTable}/session_web`).once('value', (snap) => {
      const session = snap.val();
      if (!session || session === sessionId) {
        prendreTable();
      } else {
        afficherEcranReserve();
      }
    });
  }, 10000);
}

// ════════════════════════════════════════════════════════════
//  LIBÉRER LA TABLE (fermeture onglet ou fin de session)
// ════════════════════════════════════════════════════════════
function libererTable() {
  if (numeroTable && sessionId) {
    db.ref(`tables/${numeroTable}/session_web`).once('value', (snap) => {
      if (snap.val() === sessionId) {
        db.ref(`tables/${numeroTable}/session_web`).remove();
      }
    });
  }
}

window.addEventListener('beforeunload', libererTable);

// ════════════════════════════════════════════════════════════
//  CHARGER LES PRODUITS
// ════════════════════════════════════════════════════════════
function chargerProduits() {
  db.ref('produits').once('value', (snapshot) => {
    produits = snapshot.val() || {};

    document.getElementById('bienvenue-table').textContent =
      `Table ${numeroTable} — Bienvenue !`;
    document.getElementById('info-table-commande').textContent =
      `Table ${numeroTable}`;
    document.getElementById('info-table-recap').textContent =
      `Table ${numeroTable}`;
    document.getElementById('table-affichee').textContent =
      `Table ${numeroTable}`;

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
  container.innerHTML = '';

  const categories = {};
  Object.entries(produits).forEach(([id, produit]) => {
    const cat = produit.categorie || 'Autre';
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push({ id, ...produit });
  });

  Object.entries(categories).forEach(([cat, items]) => {
    const titreEl = document.createElement('div');
    titreEl.className = 'categorie-titre';
    titreEl.textContent = cat;
    container.appendChild(titreEl);

    items.forEach((item) => {
      const el = document.createElement('div');
      el.className = 'produit-item';
      el.innerHTML = `
        <span class="produit-icone">${item.icone || '☕'}</span>
        <div class="produit-info">
          <div class="produit-nom">${item.nom}</div>
          <div class="produit-prix">${parseFloat(item.prix || 0).toFixed(2)} Dh</div>
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
  container.innerHTML = '';
  panier = {};

  const categories = {};
  Object.entries(produits).forEach(([id, produit]) => {
    const cat = produit.categorie || 'Autre';
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
      const el = document.createElement('div');
      el.className = 'produit-item';
      el.id = `item-${item.id}`;
      el.innerHTML = `
        <span class="produit-icone">${item.icone || '☕'}</span>
        <div class="produit-info">
          <div class="produit-nom">${item.nom}</div>
          <div class="produit-prix">${parseFloat(item.prix || 0).toFixed(2)} Dh</div>
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
  document.getElementById('total-commande').textContent =
    total.toFixed(2) + ' Dh';
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
  if (!hasItems) { alert('Veuillez sélectionner au moins un produit'); return; }

  const container = document.getElementById('liste-recap');
  container.innerHTML = '';
  let total = 0;

  Object.entries(panier).forEach(([id, qte]) => {
    if (qte > 0 && produits[id]) {
      const produit   = produits[id];
      const prix      = parseFloat(produit.prix || 0);
      const sousTotal = prix * qte;
      total += sousTotal;

      const el = document.createElement('div');
      el.className = 'recap-item';
      el.innerHTML = `
        <div>
          <div class="recap-nom">${produit.icone || '☕'} ${produit.nom}</div>
          <div class="recap-detail">x${qte} × ${prix.toFixed(2)} Dh</div>
        </div>
        <div class="recap-prix">${sousTotal.toFixed(2)} Dh</div>
      `;
      container.appendChild(el);
    }
  });

  document.getElementById('total-recap').textContent = total.toFixed(2) + ' Dh';
  afficherEcran('ecran-recap');
}

// ════════════════════════════════════════════════════════════
//  CONFIRMER LA COMMANDE → FIREBASE
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

  const maintenant = new Date();
  const heure = maintenant.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  const date  = maintenant.toLocaleDateString('fr-FR');

  const commande = {
    ref: commandeRef, table: numeroTable, nb_personnes: nbPersonnes,
    produits: produitsCommande, total: parseFloat(total.toFixed(2)),
    heure, date, statut: 'en_attente', appel_serveur: false,
  };

  db.ref(`commandes/${commandeRef}`).set(commande)
    .then(() => db.ref(`tables/${numeroTable}/statut`).set('en_attente'))
    .then(() => {
      document.getElementById('ref-affichee').textContent = commandeRef;
      afficherEcran('ecran-attente');
      ecouterStatutCommande();
    })
    .catch(error => alert('Erreur : ' + error.message));
}

// ════════════════════════════════════════════════════════════
//  ÉCOUTER LE STATUT EN TEMPS RÉEL (réactions app Flutter)
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
//  APPELER LE SERVEUR
// ════════════════════════════════════════════════════════════
function appelServeur() {
  db.ref(`tables/${numeroTable}`)
    .update({ statut: 'appel_serveur', appel_serveur: true })
    .then(() => alert('✅ Le serveur a été appelé !'))
    .catch(error => alert('Erreur : ' + error.message));
}

// ════════════════════════════════════════════════════════════
//  DEMANDER LE PAIEMENT
// ════════════════════════════════════════════════════════════
function demanderPaiement() {
  db.ref(`commandes/${commandeRef}`)
    .update({ statut: 'demande_paiement', demande_paiement: true })
    .then(() => db.ref(`tables/${numeroTable}/statut`).set('demande_paiement'))
    .then(() => afficherEcran('ecran-paiement'))
    .catch(error => alert('Erreur : ' + error.message));
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
//  NAVIGATION ÉCRANS
// ════════════════════════════════════════════════════════════
function afficherEcran(idEcran) {
  document.querySelectorAll('.ecran').forEach(e => e.classList.remove('actif'));
  const cible = document.getElementById(idEcran);
  if (cible) cible.classList.add('actif');
}
