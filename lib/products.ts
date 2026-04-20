export interface Product {
  id: string
  name: string
  price: number
  salePrice?: number
  image: string
  collection: 'pijama' | 'lingerie'
  colors: string[]
  sizes: string[]
  rating: number
  reviews: number
  description: string
  features: string[]
  inStock: boolean
  badge?: 'bestseller' | 'new' | 'sale'
  details?: {
    image1: string
    image2?: string
  }

}

export const products: Product[] = [

  // ─── Collection Pijama ───────────────────────────────────────────────────────
  {
    id: '1',
    name: 'Ensemble Arc-en-ciel',
    price: 350,
    salePrice: 240,
    image: 'summer-light',
    collection: 'pijama',
    colors: ['Rose', 'beige'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '2XL'],
    rating: 4.6,
    reviews: 187,
    description: 'Pyjama Femme , Automne-Printemps, hiver',
    features: ['Tissu aéré', 'Séchage rapide', 'Léger', 'Respirant'],
    inStock: true,
    badge: 'sale',
    details: {
      image1: '/images/details/product-1-detail-1.jpg',
      image2: '/images/details/product-1-detail-2.jpg',
    },
  },
  {
    id: '2',
    name: 'Ensemble Cœur Élégant',
    price: 240,
    image: 'linen-breeze',
    collection: 'pijama',
    colors: ['Rose', 'gris'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '2XL'],
    rating: 4.5,
    reviews: 143,
    description: 'Pyjama Femme , Automne-Printemps, hiver',
    features: ['Lin 100%', 'Très léger', 'Froisse naturellement', 'Écologique'],
    inStock: true,
    details: {
      image1: '/images/details/product-2-detail-1.jpg',
      image2: '/images/details/product-2-detail-2.jpg',
    },
  },
  {
    id: '3',
    name: 'Ensemble Mini Moon',
    price: 250,
    image: 'winter-cozy',
    collection: 'pijama',
    colors: ['blanc', 'beige', 'vert'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '2XL'],
    rating: 4.7,
    reviews: 312,
    description: 'Pyjama Femme , Automne-Printemps, hiver',
    features: ['Intérieur molletonné', 'Très chaud', 'Confortable', 'Respirant'],
    inStock: true,
    details: {
      image1: '/images/details/product-3-detail-1.jpg',
      image2: '/images/details/product-3-detail-2.jpg',
    },
  },
  {
    id: '4',
    name: 'Ensemble Motif Tressé',
    price: 220,
    image: 'cashmere-winter',
    collection: 'pijama',
    colors: ['vert', 'beige'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '2XL'],
    rating: 4.9,
    reviews: 145,
    description: 'Pyjama Femme , Automne-Printemps, hiver',
    features: ['Cachemire véritable', 'Extrêmement chaud', 'Luxueux', 'Durable'],
    inStock: true,
    details: {
      image1: '/images/details/product-4-detail-1.jpg',
      image2: '/images/details/product-4-detail-2.jpg',
    },
  },
  {
    id: '5',
    name: 'Ensemble Chic Rayé',
    price: 230,
    image: 'silk-luxury',
    collection: 'pijama',
    colors: ['Rose', 'bleu'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '2XL'],
    rating: 4.9,
    reviews: 234,
    description: 'Pyjama Femme , Automne-Printemps, hiver',
    features: ['Soie naturelle 100%', 'Anti-transpiration', 'Thermorégulation', 'Boutons nacre'],
    inStock: true,
    badge: 'bestseller',
    details: {
      image1: '/images/details/product-5-detail-1.jpg',
      image2: '/images/details/product-5-detail-2.jpg',
    },
  },
  {
    id: '6',
    name: 'Ensemble Petit Ourson',
    price: 240,
    image: 'cotton-premium',
    collection: 'pijama',
    colors: ['Rose', 'beige'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '2XL'],
    rating: 4.8,
    reviews: 456,
    description: 'Pyjama Femme , Automne-Printemps, hiver',
    features: ['Coton égyptien', 'Très durable', 'Hypoallergénique', 'Anti-boulochage'],
    inStock: true,
    badge: 'bestseller',
    details: {
      image1: '/images/details/product-6-detail-1.jpg',
      image2: '/images/details/product-6-detail-2.jpg',
    },
  },
  {
    id: '7',
    name: 'Ensemble Signature Douceur',
    price: 240,
    image: 'bamboo-eco',
    collection: 'pijama',
    colors: ['Rose', 'beige'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '2XL'],
    rating: 4.8,
    reviews: 289,
    description: 'Pyjama Femme , Automne-Printemps, hiver',
    features: ['Bambou durable', 'Écologique', 'Ultra doux', 'Thermorégulation'],
    inStock: true,
    badge: 'new',
    details: {
      image1: '/images/details/product-7-detail-1.jpg',
      image2: '/images/details/product-7-detail-2.jpg',
    },
  },

  // ─── Collection Lingerie (source : Excel GESTION_DE_STOCK) ──────────────────
  {
    id: 'l1',
    name: 'Ensemble Élégance',
    price: 100,
    image: 'lingerie-1',
    collection: 'lingerie',
    colors: ['NOIR/VERT', 'NOIR/ROUGE', 'NOIR/ROSE', 'BLEU/ROSE', 'NOIR/MARRON', 'ROSE/ROSE'],
    sizes: ['75', '80', '85', '90'],
    rating: 4.7,
    reviews: 89,
    description: 'Ensemble lingerie bicolore — soutien-gorge & culotte assortis, modèle A130',
    features: ['Bicolore raffiné', 'Matière douce', 'Maintien optimal', 'Ensemble assorti'],
    inStock: true,
    badge: 'new',
    details: {
      image1: '/images/details/product-l1-detail-1.jpg',
    },
  },
  {
    id: 'l2',
    name: 'Ensemble Passion',
    price: 120,
    image: 'lingerie-2',
    collection: 'lingerie',
    colors: ['ROUGE/NOIR', 'NOIR/ROUGE', 'JAUNE'],
    sizes: ['75', '80', '85', '90'],
    rating: 4.6,
    reviews: 74,
    description: 'Ensemble lingerie audacieux — coloris vifs et contrastés, modèle A133',
    features: ['Coloris intenses', 'Dentelle fine', 'Confort toute journée', 'Coupe flatteuse'],
    inStock: true,
    details: {
      image1: '/images/details/product-l2-detail-1.jpg',
    },
  },
  {
    id: 'l3',
    name: 'Ensemble Classique',
    price: 120,
    image: 'lingerie-3',
    collection: 'lingerie',
    colors: ['NOIR', 'BLEU'],
    sizes: ['90', '95', '100'],
    rating: 4.5,
    reviews: 61,
    description: 'Ensemble lingerie grandes tailles — élégance intemporelle, modèle A136',
    features: ['Grandes tailles', 'Maintien renforcé', 'Tissu confortable', 'Coupe adaptée'],
    inStock: true,
    details: {
      image1: '/images/details/product-l3-detail-1.jpg',
    },
  },
  {
    id: 'l4',
    name: 'Ensemble Séduction',
    price: 130,
    image: 'lingerie-4',
    collection: 'lingerie',
    colors: ['NOIR/ROUGE', 'BLEU/VERT', 'BLANC/ROSE', 'BLANC/BLEU'],
    sizes: ['90', '95', '100'],
    rating: 4.8,
    reviews: 103,
    description: 'Ensemble lingerie séduisant grandes tailles — bicolore élégant, modèle A137',
    features: ['Bicolore élégant', 'Grandes tailles', 'Dentelle brodée', 'Finitions premium'],
    inStock: true,
    badge: 'bestseller',
    details: {
      image1: '/images/details/product-l4-detail-1.jpg',
    },
  },
  {
    id: 'l5',
    name: 'Ensemble Romance',
    price: 140,
    image: 'lingerie-5',
    collection: 'lingerie',
    colors: ['BLEU/VERT', 'BLEU/BLANC', 'ROSE/VERT'],
    sizes: ['75', '80', '85', '90'],
    rating: 4.7,
    reviews: 88,
    description: 'Ensemble lingerie romantique — teintes douces et naturelles, modèle A170',
    features: ['Teintes naturelles', 'Ultra doux', 'Respirant', 'Confort premium'],
    inStock: true,
    badge: 'new',
    details: {
      image1: '/images/details/product-l5-detail-1.jpg',
    },
  },
  {
    id: 'l6',
    name: 'Ensemble Rosée',
    price: 120,
    image: 'lingerie-6',
    collection: 'lingerie',
    colors: ['ROSE/ROUGE'],
    sizes: ['75', '80', '85', '90'],
    rating: 4.5,
    reviews: 47,
    description: 'Ensemble lingerie délicat — rosé et rouge, féminité assurée, modèle A230',
    features: ['Féminin et délicat', 'Matière soyeuse', 'Coupe ajustée', 'Bretelles réglables'],
    inStock: true,
  },
  {
    id: 'l7',
    name: 'Ensemble Intense',
    price: 120,
    image: 'lingerie-7',
    collection: 'lingerie',
    colors: ['ROUGE', 'NOIR'],
    sizes: ['80', '85', '90', '95'],
    rating: 4.6,
    reviews: 92,
    description: 'Ensemble lingerie intense — coloris forts et audacieux, modèle A240',
    features: ['Coloris intenses', 'Maintien renforcé', 'Élastique doux', 'Tissu résistant'],
    inStock: true,
    details: {
      image1: '/images/details/product-l7-detail-1.jpg',
    },
  },
  {
    id: 'l8',
    name: 'Ensemble Flora',
    price: 130,
    image: 'lingerie-8',
    collection: 'lingerie',
    colors: ['ROSE/VERT', 'BLEU/VERT'],
    sizes: ['75', '80', '85', '90'],
    rating: 4.8,
    reviews: 76,
    description: 'Ensemble lingerie floral — inspiré de la nature, fraîcheur garantie, modèle G281',
    features: ['Inspiré nature', 'Bicolore frais', 'Confort léger', 'Coupe flatteuse'],
    inStock: true,
    badge: 'new',
    details: {
      image1: '/images/details/product-l8-detail-1.jpg',
    },
  },
  {
    id: 'l9',
    name: 'Ensemble Signature',
    price: 180,
    image: 'lingerie-9',
    collection: 'lingerie',
    colors: ['NOIR/ROUGE', 'BLANC'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    rating: 4.9,
    reviews: 54,
    description: 'Robe de chambre Gown premium — élégance signature, modèle A400',
    features: ['Tissu fluide', 'Coupe longue', 'Finitions luxe', 'Idéal cadeau'],
    inStock: true,
    badge: 'bestseller',
    details: {
      image1: '/images/details/product-l9-detail-1.jpg',
    },
  },
]

export const getProductById = (id: string): Product | undefined => {
  return products.find((p) => p.id === id)
}

export const getProductsByCollection = (collection: Product['collection']): Product[] => {
  return products.filter((p) => p.collection === collection)
}

export const getBestSellers = (): Product[] => {
  return products.filter((p) => p.badge === 'bestseller').slice(0, 6)
}

export const getNewProducts = (): Product[] => {
  return products.filter((p) => p.badge === 'new')
}

export const getSaleProducts = (): Product[] => {
  return products.filter((p) => p.salePrice)
}
