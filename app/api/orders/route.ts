'use server'

import { type NextRequest, NextResponse } from 'next/server'

interface Product {
  modele: string
  taille: string
  couleur: string
  quantite: number
  prixUnitaire?: number
  prixTotal?: number
}

interface OrderPayload {
  nom: string
  telephone: string
  ville: string
  adresse: string
  prix: number
  paiement?: string
  produits?: Product[]
  // Legacy single product format
  modele?: string
  taille?: string
  couleur?: string
  quantite?: number
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as OrderPayload

    // Validate required fields
    if (!body.nom || !body.telephone || !body.ville || !body.adresse) {
      return NextResponse.json(
        { error: 'Champs obligatoires manquants' },
        { status: 400 }
      )
    }

    // Validate products
    const produits = body.produits || []
    
    if (produits.length === 0) {
      return NextResponse.json(
        { error: 'Au moins un produit est requis' },
        { status: 400 }
      )
    }

    for (const produit of produits) {
      if (!produit.modele || !produit.taille || !produit.couleur) {
        return NextResponse.json(
          { error: 'Tous les champs du produit sont requis' },
          { status: 400 }
        )
      }
    }

    // Google Sheets App Script webhook URL
    const googleSheetsUrl = 'https://script.google.com/macros/s/AKfycbzUEc8Blxv2e1xoPW9vl1227djulbFazFoIQw6z5fSSWSrT9u4AH6Hh7SGRl9wHLV8u/exec'

    // Build payload with products array for Google Apps Script
    const orderData = {
      nom: body.nom.trim(),
      telephone: body.telephone.trim(),
      ville: body.ville.trim(),
      adresse: body.adresse.trim(),
      prix: Math.round(body.prix * 100) / 100,
      paiement: body.paiement || 'Paiement à la livraison',
      produits: produits.map(p => ({
        modele: p.modele.trim(),
        taille: p.taille.trim(),
        couleur: p.couleur.trim(),
        quantite: p.quantite || 1,
        prixUnitaire: Math.round((p as any).prixUnitaire * 100) / 100 || 0,
        prixTotal: Math.round((p as any).prixTotal * 100) / 100 || 0,
      })),
    }

    // ✅ Envoyer vers Google Sheets en arrière-plan (fire & forget)
    // On ne bloque plus la réponse client - Google Apps Script peut être lent (5-15s)
    fetch(googleSheetsUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(orderData),
    }).catch((err) => {
      console.error('[Orders] Erreur Google Sheets (background):', err)
    })

    // Répondre immédiatement au client sans attendre Google Sheets
    return NextResponse.json(
      { success: true, message: 'Commande reçue avec succès' },
      { status: 200 }
    )
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Erreur serveur interne: ' + errorMsg },
      { status: 500 }
    )
  }
}
