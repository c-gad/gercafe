// ════════════════════════════════════════════════════════════
//  CONFIGURATION FIREBASE
//  ⚠️ REMPLACEZ LES VALEURS CI-DESSOUS PAR LES VÔTRES
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

// Initialiser Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ════════════════════════════════════════════════════════════
//  VARIABLES GLOBALES
// ════════════════════════════════════════════════════════════
let numeroTable   = 0;
let nbPersonnes   = 1;
let produits      = {};
let panier        = {};
let commandeRef   = null;
let ecouteurCommande = null;

// ════════════════════════════════════════════════════════════
//  DÉMARRAGE : lecture de ?table=X dans l'URL
// ════════════════════════════════════════════════════════════
window.onload = function () {
  const urlParams = new URLSearchParams(window.location.search);
  numeroTable = parseInt(urlParams.get('table')) || 0;

  if (numeroTable === 0) {
    document.getElementById('bienvenue-table').textContent =
      'Scannez le QR code de votre table';
    afficherEcran('ecran-accueil');
    return;
  }

  chargerProduits();
};

// ════════════════════════════════════════════════════════════
//  CHARGER LES PRODUITS DEPUIS FIREBASE
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
//  CONSTRUIRE LE MENU (lecture seule, sans compteurs)
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
//  CONSTRUIRE LA LISTE DE COMMANDE (avec compteurs +/−)
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
//  MODIFIER QUANTITÉ D'UN PRODUIT
// ════════════════════════════════════════════════════════════
function modifierQte(produitId, delta) {
  panier[produitId] = Math.max(0, (panier[produitId] || 0) + delta);

  const qteEl = document.getElementById(`qte-${produitId}`);
  if (qteEl) qteEl.textContent = panier[produitId];

  const itemEl = document.getElementById(`item-${produitId}`);
  if (itemEl) {
    itemEl.classList.toggle('selectionne', panier[produitId] > 0);
  }

  mettreAJourTotal();
}

function mettreAJourTotal() {
  let total = 0;
  Object.entries(panier).forEach(([id, qte]) => {
    if (qte > 0 && produits[id]) {
      total += parseFloat(produits[id].prix || 0) * qte;
    }
  });
  document.getElementById('total-commande').textContent =
    total.toFixed(2) + ' Dh';
  return total;
}

// ════════════════════════════════════════════════════════════
//  MODIFIER LE NOMBRE DE PERSONNES
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
//  AFFICHER LE RÉCAPITULATIF
// ════════════════════════════════════════════════════════════
function afficherRecap() {
  const hasItems = Object.values(panier).some((qte) => qte > 0);
  if (!hasItems) {
    alert('Veuillez sélectionner au moins un produit');
    return;
  }

  const container = document.getElementById('liste-recap');
  container.innerHTML = '';
  let total = 0;

  Object.entries(panier).forEach(([id, qte]) => {
    if (qte > 0 && produits[id]) {
      const produit = produits[id];
      const prix = parseFloat(produit.prix || 0);
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

  document.getElementById('total-recap').textContent =
    total.toFixed(2) + ' Dh';
  afficherEcran('ecran-recap');
}

// ════════════════════════════════════════════════════════════
//  CONFIRMER LA COMMANDE → ÉCRITURE DANS FIREBASE
// ════════════════════════════════════════════════════════════
function confirmerCommande() {
  // Générer une référence à 6 chiffres
  commandeRef = Math.floor(100000 + Math.random() * 900000).toString();

  let total = 0;
  const produitsCommande = {};

  Object.entries(panier).forEach(([id, qte]) => {
    if (qte > 0 && produits[id]) {
      const produit = produits[id];
      const prix = parseFloat(produit.prix || 0);
      total += prix * qte;
      produitsCommande[id] = {
        nom:  produit.nom,
        qte:  qte,
        prix: prix,
      };
    }
  });

  const maintenant = new Date();
  const heure = maintenant.toLocaleTimeString('fr-FR', {
    hour: '2-digit', minute: '2-digit',
  });
  const date = maintenant.toLocaleDateString('fr-FR');

  const commande = {
    ref:          commandeRef,
    table:        numeroTable,
    nb_personnes: nbPersonnes,
    produits:     produitsCommande,
    total:        parseFloat(total.toFixed(2)),
    heure:        heure,
    date:         date,
    statut:       'en_attente',
    appel_serveur: false,
  };

  // 1. Écrire la commande
  db.ref(`commandes/${commandeRef}`)
    .set(commande)
    .then(() => {
      // 2. Mettre à jour le statut de la table
      return db.ref(`tables/${numeroTable}/statut`).set('en_attente');
    })
    .then(() => {
      // 3. Afficher l'écran d'attente
      document.getElementById('ref-affichee').textContent = commandeRef;
      afficherEcran('ecran-attente');
      // 4. Écouter le changement de statut en temps réel
      ecouterStatutCommande();
    })
    .catch((error) => {
      alert('Erreur lors de la commande : ' + error.message);
    });
}

// ════════════════════════════════════════════════════════════
//  ÉCOUTER LE STATUT DE LA COMMANDE EN TEMPS RÉEL
//  → réagit aux actions du serveur/admin dans l'app Flutter
// ════════════════════════════════════════════════════════════
function ecouterStatutCommande() {
  // Nettoyer l'écouteur précédent s'il existe
  if (ecouteurCommande) {
    db.ref(`commandes/${commandeRef}/statut`).off('value', ecouteurCommande);
  }

  ecouteurCommande = db
    .ref(`commandes/${commandeRef}/statut`)
    .on('value', (snapshot) => {
      const statut = snapshot.val();
      console.log(`Statut commande ${commandeRef} : ${statut}`);

      if (statut === 'servie') {
        // Le serveur a marqué la commande comme servie → afficher écran servie
        afficherEcran('ecran-servie');

      } else if (statut === 'demande_paiement') {
        // Le serveur a vu la demande de paiement → rester sur écran paiement
        afficherEcran('ecran-paiement');

      } else if (statut === 'payee') {
        // L'admin/serveur a confirmé le paiement → merci + reset après 5s
        afficherEcran('ecran-merci');
        setTimeout(recommencer, 5000);
      }
    });
}

// ════════════════════════════════════════════════════════════
//  APPELER LE SERVEUR (depuis l'écran accueil)
// ════════════════════════════════════════════════════════════
function appelServeur() {
  db.ref(`tables/${numeroTable}`)
    .update({
      statut:        'appel_serveur',
      appel_serveur: true,
    })
    .then(() => {
      alert('✅ Le serveur a été appelé !');
    })
    .catch((error) => {
      alert('Erreur : ' + error.message);
    });
}

// ════════════════════════════════════════════════════════════
//  DEMANDER LE PAIEMENT (depuis l'écran servie)
// ════════════════════════════════════════════════════════════
function demanderPaiement() {
  db.ref(`commandes/${commandeRef}`)
    .update({
      statut:           'demande_paiement',
      demande_paiement: true,
    })
    .then(() => {
      return db.ref(`tables/${numeroTable}/statut`).set('demande_paiement');
    })
    .then(() => {
      afficherEcran('ecran-paiement');
    })
    .catch((error) => {
      alert('Erreur : ' + error.message);
    });
}

// ════════════════════════════════════════════════════════════
//  NOUVELLE COMMANDE (depuis écran servie)
// ════════════════════════════════════════════════════════════
function nouvelleCommande() {
  commandeRef  = null;
  nbPersonnes  = 1;
  panier       = {};

  document.getElementById('nb-personnes').textContent  = '1';
  document.getElementById('icones-personnes').textContent = '👤';

  construireListeCommande();
  mettreAJourTotal();
  afficherEcran('ecran-personnes');
}

// ════════════════════════════════════════════════════════════
//  RECOMMENCER (nouvelle session complète)
// ════════════════════════════════════════════════════════════
function recommencer() {
  commandeRef  = null;
  nbPersonnes  = 1;
  panier       = {};

  document.getElementById('nb-personnes').textContent  = '1';
  document.getElementById('icones-personnes').textContent = '👤';

  construireListeCommande();
  mettreAJourTotal();
  afficherEcran('ecran-accueil');
}

// ════════════════════════════════════════════════════════════
//  NAVIGATION ENTRE ÉCRANS
// ════════════════════════════════════════════════════════════
function afficherEcran(idEcran) {
  document.querySelectorAll('.ecran').forEach((ecran) => {
    ecran.classList.remove('actif');
  });
  const cible = document.getElementById(idEcran);
  if (cible) cible.classList.add('actif');
}
