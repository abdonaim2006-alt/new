// ═══════════════════════════════════════════════════════════════
//  LILYNOVA — Google Apps Script v4.0
//  Collections : pyjama · pyjama-atach · lingerie · miss-rose
//  Tailles : S/M/L/XL/XXL + S-M/L-XL (lingerie) + 75→100 (bonnets)
// ═══════════════════════════════════════════════════════════════

const ORDERS_SHEET = 'Commandes'
const STOCK_SHEET  = 'Stock'

const ALL_SIZES = ['S', 'M', 'L', 'XL', 'XXL', 'S-M', 'L-XL', '75', '80', '85', '90', '95', '100']

// ── Routeur principal ──────────────────────────────────────────
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents)

    if (data.action === 'updateStock') {
      return updateStock(data)
    }

    // Pas d'action → c'est une commande
    return saveOrder(data)

  } catch (err) {
    return json({ result: 'error', message: err.toString() })
  }
}

function doGet(e) {
  try {
    const action = e.parameter.action
    if (action === 'getStock') return getStock()
    return json({ result: 'error', message: 'Action inconnue: ' + action })
  } catch (err) {
    return json({ result: 'error', message: err.toString() })
  }
}

// ── Enregistrer une commande ───────────────────────────────────
function saveOrder(data) {
  const ss    = SpreadsheetApp.getActiveSpreadsheet()
  let sheet   = ss.getSheetByName(ORDERS_SHEET)

  // Colonnes du sheet (ne pas modifier l'ordre — correspond exactement à la structure du Google Sheet) :
  // date | nom complet | telephone | ville | adress | ensemble | taille | couleur | quantite | total | Sous-total | Livraison | Total | note | type payment | statue

  const produits = data.produits || []

  if (produits.length === 0) {
    return json({ result: 'error', message: 'Aucun produit dans la commande' })
  }

  const date = new Date()

  // Une ligne par produit — mapping exact sur les colonnes du sheet
  produits.forEach(p => {
    sheet.appendRow([
      date,                                    // date
      data.nom        || '',                   // nom complet
      data.telephone  || '',                   // telephone
      data.ville      || '',                   // ville
      data.adresse    || '',                   // adress
      p.modele        || '',                   // ensemble
      p.taille        || '',                   // taille
      p.couleur       || '',                   // couleur
      p.quantite      || 1,                    // quantite
      p.prixUnitaire  || 0,                    // total (prix unitaire)
      data.sousTotal  || data.prix || 0,       // Sous-total
      data.livraison  || 0,                    // Livraison
      data.prix       || 0,                    // Total
      '',                                      // note (vide)
      data.paiement   || 'Paiement à la livraison', // type payment
      '',                                      // statue (à remplir manuellement)
    ])
  })

  // Décrémenter le stock
  produits.forEach(p => {
    decrementStock(p.modele, p.couleur, p.taille, p.quantite || 1)
  })

  return json({ result: 'success' })
}

// ── Lire le stock ──────────────────────────────────────────────
function getStock() {
  const ss    = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = ss.getSheetByName(STOCK_SHEET)

  if (!sheet) {
    return json({ stock: [] })
  }

  const data    = sheet.getDataRange().getValues()
  const headers = data[0]
  const rows    = []

  for (let i = 1; i < data.length; i++) {
    const row = {}
    headers.forEach((h, j) => { row[h] = data[i][j] })
    if (row['ID']) rows.push(row)
  }

  return json({ stock: rows })
}

// ── Mettre à jour le stock d'une variante ─────────────────────
function updateStock(data) {
  const ss    = SpreadsheetApp.getActiveSpreadsheet()
  let sheet   = ss.getSheetByName(STOCK_SHEET)

  // Créer l'onglet Stock si absent
  if (!sheet) {
    sheet = ss.insertSheet(STOCK_SHEET)
    const headers = ['ID', 'Produit', 'Collection', 'Couleur', ...ALL_SIZES]
    sheet.appendRow(headers)
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#1a1a1a').setFontColor('#ffffff')
    sheet.setFrozenRows(1)
  }

  const allData = sheet.getDataRange().getValues()
  const headers = allData[0]

  const idCol    = headers.indexOf('ID')
  const colorCol = headers.indexOf('Couleur')

  // Chercher ligne existante
  let targetRow = -1
  for (let i = 1; i < allData.length; i++) {
    if (String(allData[i][idCol]) === String(data.id) &&
        String(allData[i][colorCol]) === String(data.color)) {
      targetRow = i + 1 // 1-indexed pour Sheets
      break
    }
  }

  if (targetRow === -1) {
    // Créer nouvelle ligne
    const newRow = new Array(headers.length).fill(0)
    newRow[idCol]                         = data.id
    newRow[headers.indexOf('Produit')]    = data.name       || ''
    newRow[headers.indexOf('Collection')] = data.collection || ''
    newRow[colorCol]                      = data.color      || ''

    ALL_SIZES.forEach(size => {
      const ci = headers.indexOf(size)
      if (ci !== -1) newRow[ci] = (data.sizeStocks && data.sizeStocks[size] != null)
        ? Number(data.sizeStocks[size]) : 0
    })

    sheet.appendRow(newRow)
    return json({ success: true, created: true })
  }

  // Mettre à jour ligne existante
  ALL_SIZES.forEach(size => {
    const ci = headers.indexOf(size)
    if (ci !== -1 && data.sizeStocks && data.sizeStocks[size] != null) {
      sheet.getRange(targetRow, ci + 1).setValue(Number(data.sizeStocks[size]))
    }
  })

  return json({ success: true, updated: true })
}

// ── Décrémenter le stock après commande ───────────────────────
function decrementStock(modele, couleur, taille, quantite) {
  try {
    const ss    = SpreadsheetApp.getActiveSpreadsheet()
    const sheet = ss.getSheetByName(STOCK_SHEET)
    if (!sheet) return

    const allData = sheet.getDataRange().getValues()
    const headers = allData[0]

    const produitCol = headers.indexOf('Produit')
    const colorCol   = headers.indexOf('Couleur')
    const sizeCol    = headers.indexOf(taille)

    if (sizeCol === -1) return

    for (let i = 1; i < allData.length; i++) {
      if (String(allData[i][produitCol]).toLowerCase() === String(modele).toLowerCase() &&
          String(allData[i][colorCol]).toLowerCase()   === String(couleur).toLowerCase()) {
        const current = Number(allData[i][sizeCol]) || 0
        const newVal  = Math.max(0, current - quantite)
        sheet.getRange(i + 1, sizeCol + 1).setValue(newVal)
        break
      }
    }
  } catch (e) {
    // Silencieux — ne pas bloquer la commande si stock échoue
  }
}

// ── Helper JSON ────────────────────────────────────────────────
function json(obj) {
  return ContentService
    .cr