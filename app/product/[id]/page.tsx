'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { useCart } from '@/context/cart-context'
import { useParams } from 'next/navigation'
import { ChevronLeft, Star } from 'lucide-react'
import { SingleProductOrderForm } from '@/components/single-product-order-form'
import { products } from '@/lib/products'
import { trackViewContent, trackAddToCart, trackInitiateCheckout } from '@/components/meta-pixel'

type SizeStocks  = Record<string, number>          // { S: 50, M: 30, ... }
type ColorStocks = Record<string, SizeStocks>      // { Rose: {S:50,...}, beige: {S:30,...} }

function ProductContent() {
  const params = useParams()
  const productId = params?.id as string
  const [product, setProduct] = useState<typeof products[0] | null>(null)
  const [mounted, setMounted] = useState(false)
  const { addToCart } = useCart()

  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>('')   // '' = aucune couleur choisie
  const [addedToCart, setAddedToCart] = useState(false)
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  // Per-color stock: { Rose: { S: 50, M: 30, ... }, beige: { S: 10, ... } }
  const [colorStocks, setColorStocks] = useState<ColorStocks | null>(null)

  // Map colors to image suffixes — toutes collections confondues
  const colorImageMap: { [key: string]: string } = {
    // Pijama
    'Rose':         '-rose',
    'beige':        '-beige',
    'vert':         '-vert',
    'bleu':         '-bleu',
    'blanc':        '-blanc',
    'gris':         '-gris',
    // Lingerie
    'Noir':         '-noir',
    'Bordeaux':     '-bordeaux',
    'Crème':        '-creme',
    'Rose poudré':  '-rose-poudre',
    'Blanc':        '-blanc',
    'Blanc ivoire': '-blanc-ivoire',
    'Rouge':        '-rouge',
    'Beige':        '-beige',
    'Champagne':    '-champagne',
    'Vert forêt':   '-vert-foret',
    'Nude':         '-nude',
    'Lilas':        '-lilas',
    'Bleu nuit':    '-bleu-nuit',
  }

  useEffect(() => {
    setMounted(true)
    if (productId) {
      const found = products.find(p => p.id === productId)
      if (found) {
        setProduct(found)
        setSelectedSize(found.sizes[0])
        // Pas de couleur pré-sélectionnée — l'utilisateur choisit d'abord

        trackViewContent({
          value: found.salePrice || found.price,
          currency: 'MAD',
          content_name: found.name,
          content_id: found.id,
          content_type: 'product',
        })
      }

      // Fetch real stock per color+size from Google Sheets
      fetch('/api/stock', { cache: 'no-store' } as RequestInit)
        .then(res => res.json())
        .then(data => {
          if (!data.stock || !Array.isArray(data.stock)) return

          // Build colorStocks map for this product: { color -> { size -> qty } }
          const cStocks: ColorStocks = {}
          const productRows = data.stock.filter(
            (r: Record<string, unknown>) => String(r.ID) === productId
          )
          if (productRows.length === 0) return

          productRows.forEach((row: Record<string, unknown>) => {
            const color = String(row.Couleur ?? '')
            const sizeData: SizeStocks = {}
            ;['S', 'M', 'L', 'XL', 'XXL', '2XL'].forEach(size => {
              sizeData[size] = typeof row[size] === 'number'
                ? (row[size] as number)
                : (parseInt(String(row[size])) || 0)
            })
            cStocks[color] = sizeData
          })

          setColorStocks(cStocks)

          // Auto-select first available size for the default (first) color
          const foundProduct = products.find(p => p.id === productId)
          if (foundProduct) {
            const defaultColor = foundProduct.colors[0]
            const defaultColorKey = Object.keys(cStocks).find(
              k => k.toLowerCase() === defaultColor.toLowerCase()
            ) ?? Object.keys(cStocks)[0]
            const defaultSizeStocks = cStocks[defaultColorKey]
            if (defaultSizeStocks) {
              const firstAvail = foundProduct.sizes.find(s => (defaultSizeStocks[s] ?? 0) > 0)
              if (firstAvail) setSelectedSize(firstAvail)
            }
          }
        })
        .catch(() => {})
    }
  }, [productId])

  // Compute current size stocks for the selected color
  const currentSizeStocks: SizeStocks | null = colorStocks
    ? (colorStocks[selectedColor]
        ?? colorStocks[Object.keys(colorStocks).find(k => k.toLowerCase() === selectedColor.toLowerCase()) ?? '']
        ?? null)
    : null

  if (!mounted || !product) {
    return (
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-serif font-bold text-foreground">
              {mounted ? 'Produit non trouvé' : 'Chargement...'}
            </h1>
            <Link href="/collections">
              <Button className="mt-4">Retour aux produits</Button>
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.salePrice || product.price,
      quantity,
      size: selectedSize,
      color: selectedColor,
      image: `/images/product-${product.id}${colorImageMap[selectedColor] || ''}.jpg`,
    })

    trackAddToCart({
      value: (product.salePrice || product.price) * quantity,
      currency: 'MAD',
      content_name: product.name,
      content_id: product.id,
    })

    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 3000)
  }

  const getImageUrl = () => {
    if (!product) return '/images/placeholder.jpg'
    const colorSuffix = colorImageMap[selectedColor] || ''
    return `/images/product-${product.id}${colorSuffix}.jpg`
  }

  const getGalleryImages = () => {
    if (!product || !selectedColor) return []
    const colorSuffix = colorImageMap[selectedColor] || ''
    const images: { src: string; type: 'color' | 'detail'; color?: string }[] = [
      { src: `/images/product-${product.id}${colorSuffix}.jpg`, type: 'color', color: selectedColor },
    ]
    if (product.details) {
      images.push({ src: product.details.image1, type: 'detail' })
      images.push({ src: product.details.image2, type: 'detail' })
    }
    return images
  }

  const galleryImages = getGalleryImages()

  const handleThumbnailClick = (index: number) => {
    setActiveImageIndex(index)
    const image = galleryImages[index]
    if (image.type === 'color' && image.color) {
      handleColorChange(image.color)
    }
  }

  const handleColorChange = (color: string) => {
    setSelectedColor(color)
    setActiveImageIndex(0)  // reset — 1ère image = image de la couleur choisie
    if (colorStocks) {
      const newSizeStocks = colorStocks[color]
        ?? colorStocks[Object.keys(colorStocks).find(k => k.toLowerCase() === color.toLowerCase()) ?? '']
      if (newSizeStocks) {
        const firstAvail = product.sizes.find(s => (newSizeStocks[s] ?? 0) > 0)
        if (firstAvail) setSelectedSize(firstAvail)
      }
    }
  }

  const isSelectedSizeOut = currentSizeStocks ? (currentSizeStocks[selectedSize] ?? 0) === 0 : false
  const isCurrentColorFullyOut = currentSizeStocks !== null
    && product.sizes.every(s => (currentSizeStocks[s] ?? 0) === 0)

  return (
    <main className="flex-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/collections" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-6">
          <ChevronLeft className="w-4 h-4" />
          Retour aux produits
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="flex flex-col items-center justify-center space-y-4">
            {/* Main Image — visible seulement après sélection couleur */}
            {!selectedColor ? (
              <div className="w-full aspect-square rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center gap-4">
                <div className="flex gap-3">
                  {product.colors.map(c => {
                    const colorHex: { [k: string]: string } = {
                      'Rose':'#f9a8d4','beige':'#f5f5dc','vert':'#4ade80','bleu':'#60a5fa',
                      'blanc':'#ffffff','gris':'#9ca3af','Noir':'#111827','Bordeaux':'#7f1d1d',
                      'Crème':'#fffdd0','Rose poudré':'#d4a5b5','Blanc':'#ffffff','Blanc ivoire':'#fffff0',
                      'Rouge':'#ef4444','Beige':'#f5f5dc','Champagne':'#f7e7ce','Vert forêt':'#166534',
                      'Nude':'#e8c9a0','Lilas':'#c8a2c8','Bleu nuit':'#1e1b4b',
                    }
                    return (
                      <div key={c} style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: colorHex[c] || '#ccc', border: '2px solid #d1d5db' }} />
                    )
                  })}
                </div>
                <p className="text-gray-400 font-medium text-base">Sélectionnez une couleur<br/>pour voir le produit</p>
                <span className="text-3xl">👆</span>
              </div>
            ) : (
              <>
                <div className="w-full aspect-square bg-gradient-to-br from-muted to-muted-foreground rounded-lg flex items-center justify-center text-muted-foreground overflow-hidden">
                  <img
                    key={`${selectedColor}-${activeImageIndex}`}
                    src={galleryImages[activeImageIndex]?.src || getImageUrl()}
                    alt={`${product.name} - ${selectedColor}`}
                    className="w-full h-full object-cover transition-opacity duration-300"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement
                      img.style.display = 'none'
                    }}
                  />
                </div>

                {/* Thumbnails — image couleur + détails */}
                {galleryImages.length > 1 && (
                  <div className="w-full overflow-x-auto pb-2">
                    <div className="flex gap-2 min-w-max">
                      {galleryImages.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => handleThumbnailClick(index)}
                          className={`w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all duration-200 ${
                            activeImageIndex === index
                              ? 'border-primary ring-2 ring-primary/30'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <img
                            src={image.src}
                            alt={image.type === 'color' ? `Couleur ${image.color}` : `Détail ${index}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-serif font-bold text-foreground mb-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {Array(5).fill(0).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.round(product.rating) ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-muted-foreground">
                  {product.rating} ({product.reviews} avis)
                </span>
              </div>
              <div className="flex items-baseline gap-3">
                <p className="text-3xl font-bold text-primary">
                  {(product.salePrice || product.price).toFixed(2)} DH
                </p>
                {product.salePrice && (
                  <p className="text-xl line-through text-muted-foreground">
                    {product.price.toFixed(2)} DH
                  </p>
                )}
              </div>
            </div>

            <p className="text-muted-foreground text-lg">
              {product.description}
            </p>

            {/* ── Couleur ── */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Couleur
                {isCurrentColorFullyOut && (
                  <span style={{ marginLeft: 8, fontSize: 12, color: '#ef4444', fontWeight: 400 }}>
                    — Épuisée, choisissez une autre couleur
                  </span>
                )}
              </label>
              <div className="flex flex-wrap gap-3">
                {product.colors.map(color => {
                  // Get stock for this specific color
                  const cs = colorStocks
                    ? (colorStocks[color]
                        ?? colorStocks[Object.keys(colorStocks).find(k => k.toLowerCase() === color.toLowerCase()) ?? '']
                        ?? null)
                    : null
                  const isColorOut = cs !== null && product.sizes.every(s => (cs[s] ?? 0) === 0)
                  const isSelected = selectedColor === color

                  // Couleurs réelles pour tous les produits (pijama + lingerie)
                  const colorHexMap: { [key: string]: { bg: string; border: string } } = {
                    // Pijama
                    'Rose':         { bg: '#f9a8d4', border: '#ec4899' },
                    'beige':        { bg: '#f0e6d3', border: '#c9a87c' },
                    'vert':         { bg: '#4ade80', border: '#16a34a' },
                    'bleu':         { bg: '#60a5fa', border: '#2563eb' },
                    'blanc':        { bg: '#ffffff', border: '#d1d5db' },
                    'gris':         { bg: '#9ca3af', border: '#4b5563' },
                    // Lingerie
                    'Noir':         { bg: '#111827', border: '#000000' },
                    'Bordeaux':     { bg: '#881337', border: '#4c0519' },
                    'Crème':        { bg: '#fef9ef', border: '#d4b896' },
                    'Rose poudré':  { bg: '#dba8b0', border: '#be8090' },
                    'Blanc':        { bg: '#ffffff', border: '#d1d5db' },
                    'Blanc ivoire': { bg: '#fefce8', border: '#d4c886' },
                    'Rouge':        { bg: '#ef4444', border: '#b91c1c' },
                    'Beige':        { bg: '#f0e6d3', border: '#c9a87c' },
                    'Champagne':    { bg: '#f7e7ce', border: '#c9a87c' },
                    'Vert forêt':   { bg: '#166534', border: '#14532d' },
                    'Nude':         { bg: '#e8c9a0', border: '#c4a070' },
                    'Lilas':        { bg: '#c4b5fd', border: '#7c3aed' },
                    'Bleu nuit':    { bg: '#1e1b4b', border: '#312e81' },
                  }
                  const hex = colorHexMap[color] || { bg: '#9ca3af', border: '#6b7280' }

                  return (
                    <button
                      key={color}
                      onClick={() => handleColorChange(color)}
                      title={isColorOut ? `${color} — Épuisé` : color}
                      style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                        transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                        transition: 'transform 0.15s',
                        background: 'none', border: 'none', cursor: 'pointer', padding: 4,
                      }}
                    >
                      <div style={{
                        position: 'relative',
                        width: 40, height: 40, borderRadius: '50%',
                        backgroundColor: hex.bg,
                        border: `4px solid ${isSelected ? '#000' : hex.border}`,
                        boxShadow: isSelected ? '0 0 0 3px rgba(0,0,0,0.25)' : 'none',
                        opacity: isColorOut ? 0.45 : 1,
                      }}>
                        {isColorOut && (
                          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden' }}>
                            <line x1="15%" y1="15%" x2="85%" y2="85%" stroke="#ef4444" strokeWidth="2.5" />
                          </svg>
                        )}
                      </div>
                      <span style={{
                        fontSize: 12, fontWeight: isSelected ? 700 : 500,
                        color: isSelected ? '#000' : isColorOut ? '#ef4444' : '#374151',
                        textDecoration: isColorOut ? 'line-through' : 'none',
                      }}>
                        {color}
                      </span>
                      {isColorOut && (
                        <span style={{ fontSize: 9, color: '#ef4444', marginTop: -4, fontWeight: 700 }}>Épuisé</span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* ── Taille ── */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Taille
                {selectedSize && currentSizeStocks && (() => {
                  const qty = currentSizeStocks[selectedSize] ?? 0
                  if (qty === 0) return (
                    <span style={{ marginLeft: 8, fontSize: 12, color: '#ef4444', fontWeight: 400 }}>
                      — Rupture ({selectedColor})
                    </span>
                  )
                  if (qty <= 5) return (
                    <span style={{ marginLeft: 8, fontSize: 12, color: '#f59e0b', fontWeight: 400 }}>
                      — {qty} restant{qty > 1 ? 's' : ''} ({selectedColor})
                    </span>
                  )
                  return null
                })()}
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => {
                  const qty = currentSizeStocks ? (currentSizeStocks[size] ?? 0) : null
                  const isOut = qty !== null && qty === 0
                  const isLow = qty !== null && qty > 0 && qty <= 5
                  const isSelected = selectedSize === size

                  return (
                    <button
                      key={size}
                      onClick={() => { if (!isOut) setSelectedSize(size) }}
                      disabled={!!isOut}
                      title={qty !== null ? (isOut ? `Rupture — ${selectedColor}` : `${qty} en stock — ${selectedColor}`) : ''}
                      style={{
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: '8px 14px',
                        minWidth: '56px',
                        borderRadius: '10px',
                        border: isSelected ? '2px solid #000' : isOut ? '2px solid #fca5a5' : '2px solid #e5e7eb',
                        backgroundColor: isSelected ? '#000' : isOut ? '#fef2f2' : '#fff',
                        color: isSelected ? '#fff' : isOut ? '#d1d5db' : '#374151',
                        cursor: isOut ? 'not-allowed' : 'pointer',
                        opacity: isOut ? 0.6 : 1,
                        transition: 'all 0.15s',
                      }}
                    >
                      <span style={{ fontSize: '14px', fontWeight: '600', textDecoration: isOut ? 'line-through' : 'none' }}>
                        {size}
                      </span>
                      {qty !== null && (
                        <span style={{
                          fontSize: '10px',
                          fontWeight: '600',
                          marginTop: '2px',
                          color: isSelected
                            ? 'rgba(255,255,255,0.75)'
                            : isOut ? '#ef4444'
                            : isLow ? '#f59e0b'
                            : '#10b981',
                        }}>
                          {isOut ? '✕' : isLow ? `${qty} rest.` : '✓'}
                        </span>
                      )}
                      {isOut && (
                        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', borderRadius: '8px', overflow: 'hidden', pointerEvents: 'none' }}>
                          <line x1="0" y1="0" x2="100%" y2="100%" stroke="#ef4444" strokeWidth="1.5" strokeOpacity="0.4" />
                        </svg>
                      )}
                    </button>
                  )
                })}
              </div>
              {currentSizeStocks && (
                <p style={{ marginTop: 6, fontSize: 11, color: '#9ca3af' }}>
                  Stock pour couleur : <strong>{selectedColor}</strong>
                </p>
              )}
            </div>

            {/* ── Quantité ── */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Quantité
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-border rounded-md flex items-center justify-center hover:bg-accent"
                >
                  −
                </button>
                <span className="w-8 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border border-border rounded-md flex items-center justify-center hover:bg-accent"
                >
                  +
                </button>
              </div>
            </div>

            {/* ── Indicateur de stock dynamique ── */}
            {currentSizeStocks ? (() => {
              const selectedQty = currentSizeStocks[selectedSize] ?? 0
              const isSelectedOut = selectedQty === 0
              const isSelectedLow = selectedQty > 0 && selectedQty <= 5
              const outOfStockSizes = product.sizes.filter(s => (currentSizeStocks[s] ?? 0) === 0)
              const allOut = outOfStockSizes.length === product.sizes.length

              if (allOut) {
                return (
                  <div style={{ padding: '12px 16px', backgroundColor: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#ef4444', flexShrink: 0 }} />
                    <span style={{ color: '#b91c1c', fontSize: 14, fontWeight: 600 }}>
                      Rupture de stock — Toutes les tailles épuisées pour «{selectedColor}»
                    </span>
                  </div>
                )
              }
              if (isSelectedOut) {
                return (
                  <div style={{ padding: '12px 16px', backgroundColor: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#ef4444', flexShrink: 0 }} />
                      <span style={{ color: '#b91c1c', fontSize: 14, fontWeight: 600 }}>
                        Taille {selectedSize} — Rupture pour «{selectedColor}»
                      </span>
                    </div>
                    <span style={{ fontSize: 12, color: '#b91c1c' }}>
                      ⚠️ Choisissez une autre taille ou une autre couleur
                    </span>
                  </div>
                )
              }
              if (isSelectedLow) {
                return (
                  <div style={{ padding: '12px 16px', backgroundColor: '#fffbeb', border: '1px solid #fcd34d', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#f59e0b', flexShrink: 0 }} />
                    <span style={{ color: '#92400e', fontSize: 14, fontWeight: 600 }}>
                      ⚡ Plus que {selectedQty} en stock — {selectedSize} / {selectedColor}
                    </span>
                  </div>
                )
              }
              return (
                <div style={{ padding: '10px 14px', backgroundColor: '#f0fdf4', border: '1px solid #86efac', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#22c55e', flexShrink: 0 }} />
                  <span style={{ color: '#15803d', fontSize: 14, fontWeight: 600 }}>
                    En stock — {selectedSize} / {selectedColor}
                    {outOfStockSizes.length > 0 && (
                      <span style={{ fontWeight: 400, color: '#ef4444', marginLeft: 8 }}>
                        (Rupture : {outOfStockSizes.join(', ')})
                      </span>
                    )}
                  </span>
                </div>
              )
            })() : (
              <div className="flex items-center gap-2 text-sm">
                <div className={`w-3 h-3 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-foreground">
                  {product.inStock ? 'En stock' : 'Rupture de stock'}
                </span>
              </div>
            )}

            <div className="space-y-3 pt-4">
              <Button
                onClick={handleAddToCart}
                className="w-full h-12 text-lg"
                disabled={currentSizeStocks ? isSelectedSizeOut : !product.inStock}
              >
                {addedToCart ? '✓ Ajouté au panier' : 'Ajouter au Panier'}
              </Button>
              <Button
                onClick={() => {
                  if (!showOrderForm) {
                    trackInitiateCheckout({
                      value: (product.salePrice || product.price) * quantity,
                      currency: 'MAD',
                      content_ids: [product.id],
                      num_items: quantity,
                    })
                  }
                  setShowOrderForm(!showOrderForm)
                }}
                variant="outline"
                className="w-full h-12 text-lg"
                disabled={currentSizeStocks ? isSelectedSizeOut : !product.inStock}
              >
                {showOrderForm ? 'Fermer le formulaire' : 'Acheter Directement'}
              </Button>
            </div>
          </div>
        </div>

        {showOrderForm && (
          <div className="mb-16">
            <SingleProductOrderForm
              selectedModel={product.name}
              selectedSize={selectedSize}
              selectedColor={selectedColor}
              quantity={quantity}
              unitPrice={product.salePrice || product.price}
            />
          </div>
        )}

        <div className="border-t pt-12">
          <h2 className="text-2xl font-serif font-bold text-foreground mb-6">
            Caractéristiques
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.features.map((feature, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-sm flex-shrink-0">
                  ✓
                </div>
                <span className="text-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  )
}

export default function ProductPage() {
  return (
    <>
      <Header />
      <ProductContent />
      <Footer />
    </>
  )
}
