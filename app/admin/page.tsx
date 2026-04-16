'use client'

import { useState, useEffect, useCallback } from 'react'
import { products } from '@/lib/products'

const ALL_SIZES = ['S', 'M', 'L', 'XL', 'XXL', '2XL']
const LS_KEY = 'admin_pw'

// stockMap[productId][color] = { S: 50, M: 50, ... }
type SizeStocks  = Record<string, number>
type ColorStocks = Record<string, SizeStocks>
type StockMap    = Record<string, ColorStocks>

// Clé d'édition = "productId||color"
function variantKey(id: string, color: string) { return `${id}||${color}` }

export default function AdminStockPage() {
  const [isAuth, setIsAuth]           = useState(false)
  const [password, setPassword]       = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const [loginError, setLoginError]   = useState('')

  const [stockMap, setStockMap]             = useState<StockMap>({})
  const [isLoadingStock, setIsLoadingStock] = useState(false)
  const [loadError, setLoadError]           = useState('')

  const [editingKey, setEditingKey]     = useState<string | null>(null) // "id||color"
  const [editValues, setEditValues]     = useState<SizeStocks>({})
  const [savingKey, setSavingKey]       = useState<string | null>(null)
  const [isInitializing, setIsInitializing] = useState(false)
  const [initProgress, setInitProgress] = useState(0)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType]       = useState<'success' | 'error'>('success')

  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY)
    if (saved) { setPassword(saved); setIsAuth(true) }
  }, [])

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(msg); setToastType(type)
    setTimeout(() => setToastMessage(''), 4000)
  }

  const loadStock = useCallback(async () => {
    setIsLoadingStock(true); setLoadError('')
    try {
      const res  = await fetch('/api/stock')
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur de lecture')

      // Construire stockMap[productId][color] = { S, M, L, XL, XXL, 2XL }
      const map: StockMap = {}
      if (data.stock && Array.isArray(data.stock)) {
        data.stock.forEach((row: Record<string, unknown>) => {
          if (!row.ID) return
          const id    = String(row.ID)
          const color = String(row.Couleur ?? '')
          if (!map[id]) map[id] = {}
          const sizes: SizeStocks = {}
          ALL_SIZES.forEach(size => {
            sizes[size] = typeof row[size] === 'number'
              ? (row[size] as number)
              : (parseInt(String(row[size])) || 0)
          })
          map[id][color] = sizes
        })
      }
      setStockMap(map)
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setIsLoadingStock(false)
    }
  }, [])

  useEffect(() => { if (isAuth) loadStock() }, [isAuth, loadStock])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!passwordInput.trim()) { setLoginError('Entrez le mot de passe.'); return }
    localStorage.setItem(LS_KEY, passwordInput)
    setPassword(passwordInput); setIsAuth(true)
  }

  // Initialise toutes les variantes (Produit × Couleur) à defaultQty par taille
  const initializeAllStock = async (defaultQty = 50) => {
    if (!confirm(`Initialiser TOUTES les variantes (Produit × Couleur) à ${defaultQty} par taille ?`)) return
    setIsInitializing(true); setInitProgress(0)
    const defaultSizes: SizeStocks = {}
    ALL_SIZES.forEach(s => { defaultSizes[s] = defaultQty })

    // Construire la liste de toutes les variantes
    const variants: { id: string; name: string; collection: string; color: string }[] = []
    products.forEach(p => {
      p.colors.forEach(color => {
        variants.push({ id: p.id, name: p.name, collection: p.collection, color })
      })
    })

    let done = 0
    for (const v of variants) {
      try {
        await fetch('/api/stock', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-admin-token': password },
          body: JSON.stringify({ id: v.id, name: v.name, collection: v.collection, color: v.color, sizeStocks: defaultSizes }),
        })
      } catch { /* continue */ }
      done++
      setInitProgress(Math.round((done / variants.length) * 100))
    }

    await loadStock()
    setIsInitializing(false); setInitProgress(0)
    showToast(`✅ ${variants.length} variantes initialisées à ${defaultQty} unités par taille`)
  }

  const handleLogout = () => {
    localStorage.removeItem(LS_KEY); setIsAuth(false)
    setPassword(''); setPasswordInput(''); setStockMap({})
  }

  const startEdit = (id: string, color: string) => {
    const current = (stockMap[id] ?? {})[color] ?? {}
    const vals: SizeStocks = {}
    ALL_SIZES.forEach(s => { vals[s] = current[s] ?? 0 })
    setEditValues(vals); setEditingKey(variantKey(id, color))
  }

  const cancelEdit = () => { setEditingKey(null); setEditValues({}) }

  const saveStock = async (id: string, color: string) => {
    for (const size of ALL_SIZES) {
      if (isNaN(editValues[size]) || editValues[size] < 0) {
        showToast(`Valeur invalide pour ${size}. Entrez un nombre ≥ 0.`, 'error'); return
      }
    }
    const key = variantKey(id, color)
    setSavingKey(key)
    const product = products.find(p => p.id === id)
    try {
      const res = await fetch('/api/stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-token': password },
        body: JSON.stringify({ id, name: product?.name || id, collection: product?.collection || '', color, sizeStocks: editValues }),
      })
      const data = await res.json()
      if (res.status === 401) { showToast('Mot de passe incorrect.', 'error'); handleLogout(); return }
      if (!res.ok) throw new Error(data.error || 'Erreur serveur')

      setStockMap(prev => ({
        ...prev,
        [id]: { ...(prev[id] ?? {}), [color]: { ...editValues } },
      }))
      setEditingKey(null)
      showToast(`✅ "${product?.name}" / ${color} sauvegardé`)
    } catch (err) {
      showToast('❌ ' + (err instanceof Error ? err.message : 'Erreur'), 'error')
    } finally {
      setSavingKey(null)
    }
  }

  // Stats globales
  const totalStock = Object.values(stockMap).reduce((sum, colorMap) =>
    sum + Object.values(colorMap).reduce((s2, sizes) =>
      s2 + Object.values(sizes).reduce((a, b) => a + b, 0), 0), 0)

  // Nombre de variantes en rupture totale
  let totalVariants = 0, outVariants = 0, lowVariants = 0
  products.forEach(p => {
    p.colors.forEach(color => {
      totalVariants++
      const sizes = (stockMap[p.id] ?? {})[color] ?? {}
      const hasData = Object.keys(sizes).length > 0
      if (hasData && Object.values(sizes).every(v => v === 0)) outVariants++
      if (hasData && Object.values(sizes).some(v => v > 0 && v <= 5)) lowVariants++
    })
  })

  // ── Login ──────────────────────────────────────────────────────────────────
  if (!isAuth) {
    return (
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', backgroundColor:'#f8f9fa', fontFamily:'system-ui,sans-serif' }}>
        <div style={{ backgroundColor:'#fff', borderRadius:'16px', padding:'48px 40px', boxShadow:'0 4px 24px rgba(0,0,0,0.1)', width:'100%', maxWidth:'400px' }}>
          <div style={{ textAlign:'center', marginBottom:'32px' }}>
            <div style={{ fontSize:'48px', marginBottom:'12px' }}>🔒</div>
            <h1 style={{ fontSize:'24px', fontWeight:'700', color:'#1a1a1a', margin:0 }}>Admin — Stock</h1>
            <p style={{ color:'#666', marginTop:'8px', fontSize:'14px' }}>Entrez le mot de passe pour accéder</p>
          </div>
          <form onSubmit={handleLogin}>
            <input type="password" value={passwordInput} onChange={e => setPasswordInput(e.target.value)}
              placeholder="Mot de passe admin" autoFocus
              style={{ width:'100%', padding:'12px 16px', border: loginError ? '2px solid #ef4444' : '2px solid #e5e7eb', borderRadius:'8px', fontSize:'16px', outline:'none', boxSizing:'border-box', marginBottom:'12px' }} />
            {loginError && <p style={{ color:'#ef4444', fontSize:'13px', marginBottom:'12px' }}>{loginError}</p>}
            <button type="submit" style={{ width:'100%', padding:'13px', backgroundColor:'#1a1a1a', color:'#fff', border:'none', borderRadius:'8px', fontSize:'15px', fontWeight:'600', cursor:'pointer' }}>
              Accéder
            </button>
          </form>
          <p style={{ color:'#999', fontSize:'12px', textAlign:'center', marginTop:'20px' }}>Mot de passe par défaut : <strong>admin2024</strong></p>
        </div>
      </div>
    )
  }

  // ── Dashboard ──────────────────────────────────────────────────────────────
  const pijamaProducts   = products.filter(p => p.collection === 'pijama')
  const lingerieProducts = products.filter(p => p.collection === 'lingerie')

  return (
    <div style={{ minHeight:'100vh', backgroundColor:'#f8f9fa', fontFamily:'system-ui,sans-serif' }}>

      {/* Toast */}
      {toastMessage && (
        <div style={{ position:'fixed', top:'20px', right:'20px', zIndex:9999, backgroundColor: toastType==='success' ? '#166534' : '#991b1b', color:'#fff', padding:'12px 20px', borderRadius:'10px', boxShadow:'0 4px 16px rgba(0,0,0,0.2)', fontSize:'14px', fontWeight:'500', maxWidth:'400px' }}>
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div style={{ backgroundColor:'#fff', borderBottom:'1px solid #e5e7eb', padding:'16px 24px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'12px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          <span style={{ fontSize:'28px' }}>📦</span>
          <div>
            <h1 style={{ margin:0, fontSize:'20px', fontWeight:'700', color:'#1a1a1a' }}>Gestion du Stock</h1>
            <p style={{ margin:0, fontSize:'13px', color:'#666' }}>
              {products.length} produits · {totalVariants} variantes · {totalStock} unités
              {outVariants > 0 && <span style={{ color:'#ef4444', marginLeft:'8px' }}>⚠ {outVariants} variantes en rupture</span>}
              {lowVariants > 0 && <span style={{ color:'#f59e0b', marginLeft:'8px' }}>⚡ {lowVariants} variantes stock faible</span>}
            </p>
          </div>
        </div>
        <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
          <button onClick={() => initializeAllStock(50)} disabled={isInitializing}
            style={{ padding:'8px 16px', backgroundColor: isInitializing ? '#e0e7ff' : '#eef2ff', border:'1px solid #a5b4fc', borderRadius:'8px', fontSize:'13px', cursor:'pointer', color:'#3730a3', fontWeight:'600' }}
            title="Met toutes les variantes (Produit × Couleur) à 50 par taille">
            {isInitializing ? `⏳ ${initProgress}%` : '✨ Initialiser stock (50)'}
          </button>
          <button onClick={loadStock} disabled={isLoadingStock}
            style={{ padding:'8px 16px', backgroundColor:'#f3f4f6', border:'1px solid #d1d5db', borderRadius:'8px', fontSize:'13px', cursor:'pointer', color:'#374151' }}>
            {isLoadingStock ? '⏳ Chargement...' : '🔄 Actualiser'}
          </button>
          <button onClick={handleLogout}
            style={{ padding:'8px 16px', backgroundColor:'#fff', border:'1px solid #d1d5db', borderRadius:'8px', fontSize:'13px', cursor:'pointer', color:'#374151' }}>
            Déconnexion
          </button>
        </div>
      </div>

      {loadError && (
        <div style={{ margin:'16px 24px 0', padding:'14px 18px', backgroundColor:'#fef2f2', border:'1px solid #fca5a5', borderRadius:'10px', color:'#b91c1c', fontSize:'14px' }}>
          ⚠️ {loadError}
        </div>
      )}

      <div style={{ padding:'24px' }}>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(150px, 1fr))', gap:'16px', marginBottom:'28px' }}>
          {[
            { label:'Total produits',       value: products.length, icon:'🛍️', color:'#3b82f6' },
            { label:'Unités totales',        value: totalStock,      icon:'📊', color:'#10b981' },
            { label:'Ruptures (variantes)',  value: outVariants,     icon:'🔴', color: outVariants > 0 ? '#ef4444' : '#10b981' },
            { label:'Stock faible (≤5)',     value: lowVariants,     icon:'⚡', color: lowVariants > 0 ? '#f59e0b' : '#10b981' },
          ].map(card => (
            <div key={card.label} style={{ backgroundColor:'#fff', borderRadius:'12px', padding:'18px 20px', border:'1px solid #e5e7eb' }}>
              <div style={{ fontSize:'24px', marginBottom:'6px' }}>{card.icon}</div>
              <div style={{ fontSize:'26px', fontWeight:'700', color: card.color }}>{card.value}</div>
              <div style={{ fontSize:'12px', color:'#6b7280', marginTop:'2px' }}>{card.label}</div>
            </div>
          ))}
        </div>

        {/* Légende */}
        <div style={{ display:'flex', gap:'16px', marginBottom:'16px', fontSize:'12px', color:'#6b7280', flexWrap:'wrap' }}>
          <span><span style={{ color:'#10b981', fontWeight:'700' }}>■</span> Stock OK</span>
          <span><span style={{ color:'#f59e0b', fontWeight:'700' }}>■</span> Faible (≤5)</span>
          <span><span style={{ color:'#ef4444', fontWeight:'700' }}>■</span> Rupture (0)</span>
          <span style={{ color:'#9ca3af' }}>— = pas encore chargé</span>
        </div>

        <StockTable title="🌙 Collection Pijama"   collectionProducts={pijamaProducts}   stockMap={stockMap} editingKey={editingKey} editValues={editValues} savingKey={savingKey} onStartEdit={startEdit} onCancelEdit={cancelEdit} onEditValueChange={(sz, val) => setEditValues(prev => ({ ...prev, [sz]: Number(val) }))} onSave={saveStock} />
        <div style={{ height:'24px' }} />
        <StockTable title="🌸 Collection Lingerie" collectionProducts={lingerieProducts} stockMap={stockMap} editingKey={editingKey} editValues={editValues} savingKey={savingKey} onStartEdit={startEdit} onCancelEdit={cancelEdit} onEditValueChange={(sz, val) => setEditValues(prev => ({ ...prev, [sz]: Number(val) }))} onSave={saveStock} />
      </div>
    </div>
  )
}

// ── Tableau par collection ─────────────────────────────────────────────────
interface StockTableProps {
  title: string
  collectionProducts: typeof products
  stockMap: StockMap
  editingKey: string | null
  editValues: SizeStocks
  savingKey: string | null
  onStartEdit: (id: string, color: string) => void
  onCancelEdit: () => void
  onEditValueChange: (size: string, val: string) => void
  onSave: (id: string, color: string) => void
}

function StockTable({ title, collectionProducts, stockMap, editingKey, editValues, savingKey, onStartEdit, onCancelEdit, onEditValueChange, onSave }: StockTableProps) {
  return (
    <div style={{ backgroundColor:'#fff', borderRadius:'12px', border:'1px solid #e5e7eb', overflow:'auto' }}>
      <div style={{ padding:'14px 20px', borderBottom:'1px solid #f3f4f6', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <h2 style={{ margin:0, fontSize:'15px', fontWeight:'600', color:'#1a1a1a' }}>{title}</h2>
        <span style={{ fontSize:'13px', color:'#6b7280' }}>{collectionProducts.length} produits</span>
      </div>

      <table style={{ width:'100%', borderCollapse:'collapse', minWidth:'820px' }}>
        <thead>
          <tr style={{ backgroundColor:'#f9fafb' }}>
            <th style={thStyle}>Produit / Couleur</th>
            {ALL_SIZES.map(s => <th key={s} style={{ ...thStyle, textAlign:'center', width:'72px' }}>{s}</th>)}
            <th style={{ ...thStyle, textAlign:'center', width:'76px' }}>Total</th>
            <th style={{ ...thStyle, width:'120px' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {collectionProducts.map((product, pi) => {
            const colorMap = stockMap[product.id] ?? {}

            return product.colors.map((color, ci) => {
              const sizes    = colorMap[color] ?? {}
              const hasData  = Object.keys(sizes).length > 0
              const key      = `${product.id}||${color}`
              const isEditing = editingKey === key
              const isSaving  = savingKey  === key
              const rowTotal  = ALL_SIZES.reduce((s, sz) => s + (sizes[sz] ?? 0), 0)
              const isAllOut  = hasData && ALL_SIZES.every(sz => (sizes[sz] ?? 0) === 0)

              // Couleur de fond : première couleur du produit = ligne un peu plus sombre pour grouper
              const bgBase = pi % 2 === 0 ? '#fff' : '#fafafa'
              const bgColor = isAllOut ? '#fff5f5' : bgBase

              return (
                <tr key={key} style={{ backgroundColor: isEditing ? '#eff6ff' : bgColor, borderBottom: ci === product.colors.length - 1 ? '2px solid #e5e7eb' : '1px solid #f3f4f6' }}>

                  {/* Produit / Couleur */}
                  <td style={{ padding:'10px 16px' }}>
                    {ci === 0 && (
                      <div style={{ fontWeight:'600', color:'#1a1a1a', fontSize:'13px', marginBottom:'2px' }}>
                        {product.name}
                        {product.badge && (
                          <span style={{ marginLeft:'6px', padding:'1px 5px', borderRadius:'4px', fontSize:'10px', backgroundColor: product.badge==='bestseller' ? '#fef3c7' : product.badge==='new' ? '#d1fae5' : '#fee2e2', color: product.badge==='bestseller' ? '#92400e' : product.badge==='new' ? '#065f46' : '#991b1b' }}>
                            {product.badge}
                          </span>
                        )}
                      </div>
                    )}
                    <div style={{ display:'flex', alignItems:'center', gap:'6px', paddingLeft: ci > 0 ? '12px' : '0' }}>
                      <span style={{ fontSize:'11px', color:'#9ca3af' }}>{ci > 0 ? '└' : ' '}</span>
                      <span style={{ display:'inline-block', width:'10px', height:'10px', borderRadius:'50%', backgroundColor: colorDot(color), border:'1px solid rgba(0,0,0,0.15)', flexShrink:0 }} />
                      <span style={{ fontSize:'12px', color: isAllOut ? '#ef4444' : '#374151', fontWeight: isAllOut ? '700' : '500' }}>
                        {color}
                        {isAllOut && <span style={{ marginLeft:'6px', fontSize:'10px', color:'#ef4444' }}>⚠ Rupture totale</span>}
                      </span>
                    </div>
                  </td>

                  {/* Cellules taille */}
                  {ALL_SIZES.map(size => {
                    const qty   = isEditing ? (editValues[size] ?? 0) : (sizes[size] ?? 0)
                    const clr   = !hasData ? '#d1d5db' : qty === 0 ? '#ef4444' : qty <= 5 ? '#f59e0b' : '#10b981'
                    return (
                      <td key={size} style={{ padding:'6px 4px', textAlign:'center' }}>
                        {isEditing ? (
                          <input type="number" min="0" value={editValues[size] ?? 0}
                            onChange={e => onEditValueChange(size, e.target.value)}
                            style={{ width:'58px', padding:'4px 4px', border:'2px solid #3b82f6', borderRadius:'6px', fontSize:'13px', fontWeight:'600', textAlign:'center', outline:'none' }} />
                        ) : (
                          <span style={{ fontWeight:'700', fontSize:'14px', color: clr }}>
                            {hasData ? qty : '—'}
                          </span>
                        )}
                      </td>
                    )
                  })}

                  {/* Total */}
                  <td style={{ padding:'6px 12px', textAlign:'center' }}>
                    <span style={{ fontWeight:'700', fontSize:'13px', color: !hasData ? '#d1d5db' : rowTotal === 0 ? '#ef4444' : '#374151' }}>
                      {hasData ? rowTotal : '—'}
                    </span>
                  </td>

                  {/* Action */}
                  <td style={{ padding:'6px 12px', whiteSpace:'nowrap' }}>
                    {isEditing ? (
                      <div style={{ display:'flex', gap:'6px' }}>
                        <button onClick={() => onSave(product.id, color)} disabled={isSaving}
                          style={{ padding:'4px 10px', backgroundColor:'#10b981', color:'#fff', border:'none', borderRadius:'6px', fontSize:'12px', fontWeight:'600', cursor:'pointer' }}>
                          {isSaving ? '⏳' : '✓ Sauver'}
                        </button>
                        <button onClick={onCancelEdit}
                          style={{ padding:'4px 8px', backgroundColor:'#f3f4f6', color:'#374151', border:'none', borderRadius:'6px', fontSize:'12px', cursor:'pointer' }}>
                          ✕
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => onStartEdit(product.id, color)}
                        style={{ padding:'4px 10px', backgroundColor:'#1a1a1a', color:'#fff', border:'none', borderRadius:'6px', fontSize:'12px', fontWeight:'500', cursor:'pointer' }}>
                        Modifier
                      </button>
                    )}
                  </td>
                </tr>
              )
            })
          })}
        </tbody>
      </table>
    </div>
  )
}

// Retourne une couleur CSS approximative pour un point coloré selon le nom de la couleur
function colorDot(name: string): string {
  const n = name.toLowerCase()
  if (n.includes('rose') || n.includes('pink'))  return '#f9a8d4'
  if (n.includes('rouge') || n.includes('red'))  return '#f87171'
  if (n.includes('bordeaux'))                    return '#9f1239'
  if (n.includes('noir') || n.includes('black')) return '#1a1a1a'
  if (n.includes('blanc') || n.includes('white') || n.includes('ivoire') || n.includes('crème')) return '#f5f5f4'
  if (n.includes('beige') || n.includes('nude') || n.includes('champagne')) return '#e5d3b3'
  if (n.includes('vert') || n.includes('green')) return '#4ade80'
  if (n.includes('bleu') || n.includes('blue'))  return '#60a5fa'
  if (n.includes('gris') || n.includes('grey'))  return '#9ca3af'
  if (n.includes('lilas') || n.includes('lila')) return '#c4b5fd'
  return '#d1d5db'
}

const thStyle: React.CSSProperties = {
  padding: '10px 8px',
  textAlign: 'left',
  fontSize: '11px',
  fontWeight: '600',
  color: '#6b7280',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  borderBottom: '1px solid #e5e7eb',
}
