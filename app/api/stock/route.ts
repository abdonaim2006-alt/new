import { type NextRequest, NextResponse } from 'next/server'

const GOOGLE_SHEETS_URL =
  'https://script.google.com/macros/s/AKfycbzUEc8Blxv2e1xoPW9vl1227djulbFazFoIQw6z5fSSWSrT9u4AH6Hh7SGRl9wHLV8u/exec'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin2024'
const ALL_SIZES = ['S', 'M', 'L', 'XL', 'XXL', '2XL']

/**
 * GET — Retourne le stock de toutes les variantes (Produit × Couleur)
 *
 * Format de réponse :
 * {
 *   success: true,
 *   format: 'per-variant',
 *   stock: [
 *     { ID: '1', Produit: '...', Collection: 'pijama', Couleur: 'Rose', S: 50, M: 50, ... },
 *     { ID: '1', Produit: '...', Collection: 'pijama', Couleur: 'beige', S: 50, M: 50, ... },
 *     ...
 *   ]
 * }
 */
export async function GET() {
  try {
    const response = await fetch(`${GOOGLE_SHEETS_URL}?action=getStock`, {
      cache: 'no-store',
    })

    if (!response.ok) throw new Error(`Google Sheets HTTP ${response.status}`)

    const text = await response.text()

    if (text.trim() === 'OK' || !text.startsWith('{')) {
      return NextResponse.json(
        { error: 'Apps Script pas encore mis à jour.' },
        { status: 503 }
      )
    }

    const data = JSON.parse(text)
    if (!data.stock || !Array.isArray(data.stock)) {
      return NextResponse.json({ stock: [] })
    }

    const firstRow = data.stock[0] || {}
    const hasColorColumn  = firstRow['Couleur'] !== undefined
    const hasPerSizeCols  = ALL_SIZES.some(s => firstRow[s] !== undefined && firstRow[s] !== '')

    // Normalise chaque ligne en { ID, Produit, Collection, Couleur, S, M, L, XL, XXL, 2XL }
    const normalizedStock = data.stock.map((row: Record<string, unknown>) => {
      const normalized: Record<string, unknown> = {
        ID:         row.ID,
        Produit:    row.Produit,
        Collection: row.Collection,
        Couleur:    hasColorColumn ? (row.Couleur ?? '') : '',
      }

      if (hasPerSizeCols) {
        ALL_SIZES.forEach(size => {
          normalized[size] = typeof row[size] === 'number'
            ? row[size]
            : (parseInt(String(row[size])) || 0)
        })
      } else {
        // Ancien format colonne "Stock" unique — distribue à toutes les tailles
        const total = typeof row['Stock'] === 'number'
          ? (row['Stock'] as number)
          : (parseInt(String(row['Stock'])) || 0)
        ALL_SIZES.forEach(size => { normalized[size] = total })
      }

      return normalized
    })

    const format = hasColorColumn ? 'per-variant' : hasPerSizeCols ? 'per-size' : 'legacy'
    return NextResponse.json({ success: true, stock: normalizedStock, format })

  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: 'Erreur lecture stock: ' + msg }, { status: 502 })
  }
}

/**
 * POST — Met à jour le stock d'une variante (Produit + Couleur)
 *
 * Body attendu :
 * {
 *   id: '1',
 *   name: 'Ensemble Arc-en-ciel',
 *   collection: 'pijama',
 *   color: 'Rose',                          ← NOUVEAU champ obligatoire
 *   sizeStocks: { S:50, M:50, L:50, XL:50, XXL:50, '2XL':50 }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const adminToken = request.headers.get('x-admin-token')
    if (!adminToken || adminToken !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Mot de passe admin incorrect' }, { status: 401 })
    }

    const body = await request.json()
    if (!body.id || !body.sizeStocks || !body.color) {
      return NextResponse.json({ error: 'Champs requis: id, color, sizeStocks' }, { status: 400 })
    }

    const sheetsResponse = await fetch(GOOGLE_SHEETS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        action:     'updateStock',
        id:         body.id,
        name:       body.name || '',
        collection: body.collection || '',
        color:      body.color,           // ← couleur de la variante
        sizeStocks: body.sizeStocks,
      }),
    })

    const sheetsText = await sheetsResponse.text()
    let sheetsData: Record<string, unknown> = {}
    try { sheetsData = JSON.parse(sheetsText) } catch { /* ok */ }

    if (sheetsData.error) throw new Error(String(sheetsData.error))

    return NextResponse.json({ success: true })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: 'Erreur sauvegarde: ' + msg }, { status: 500 })
  }
}
