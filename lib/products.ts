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
    image2: string
  }
}

export const products: Product[] = [

  // ─── Collection Pijama ───────────────────────────────────────────────────────
  {
    id: '1',
    name: 'Ensemble Arc-en-ciel',
    price: 350,
    salePrice: 290,
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
    price: 290,
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
    price: 300,
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
    price: 270,
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
    price: 280,
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
    price: 290,
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
    price: 290,
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

  // ─── Collection Lingerie ─────────────────────────────────────────────────────
  {
    id: 'l1',
    name: 'Body Dentelle Élégance',
    price: 220,
    image: 'lingerie-1',
    collection: 'lingerie',
    colors: ['Noir', 'Bordeaux'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '2XL'],
    rating: 4.8,
    reviews: 98,
    description: 'Lingerie Femme , Dentelle Premium',
    features: ['Dentelle fine', 'Bretelles réglables', 'Confortable', 'Élégant'],
    inStock: true,
    badge: 'new',
    details: {
      image1: '/images/details/product-l1-detail-1.jpg',
      image2: '/images/details/product-l1-detail-2.jpg',
    },
  },
  {
    id: 'l2',
    name: 'Ensemble Satin Douceur',
    price: 250,
    image: 'lingerie-2',
    collection: 'lingerie',
    colors: ['Rose', 'Crème', 'Noir'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '2XL'],
    rating: 4.7,
    reviews: 74,
    description: 'Lingerie Femme , Satin de luxe',
    features: ['Satin 100%', 'Ultra doux', 'Brillance naturelle', 'Confort premium'],
    inStock: true,
    details: {
      image1: '/images/details/product-l2-detail-1.jpg',
      image2: '/images/details/product-l2-detail-2.jpg',
    },
  },
  {
    id: 'l3',
    name: 'Nuisette Romantique',
    price: 180,
    image: 'lingerie-3',
    collection: 'lingerie',
    colors: ['Rose poudré', 'Noir'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '2XL'],
    rating: 4.6,
    reviews: 112,
    description: 'Lingerie Femme , Nuisette courte',
    features: ['Légèreté absolue', 'Dentelle aux bordures', 'Coupe flatteuse', 'Respirant'],
    inStock: true,
    badge: 'bestseller',
    details: {
      image1: '/images/details/product-l3-detail-1.jpg',
      image2: '/images/details/product-l3-detail-2.jpg',
    },
  },
  {
    id: 'l4',
    name: 'Shorty Dentelle Chic',
    price: 150,
    image: 'lingerie-4',
    collection: 'lingerie',
    colors: ['Noir', 'Blanc', 'Rouge'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '2XL'],
    rating: 4.5,
    reviews: 88,
    description: 'Lingerie Femme , Shorty dentelle',
    features: ['Dentelle premium', 'Élastique doux', 'Coupe confortable', 'Anti-allergique'],
    inStock: true,
    details: {
      image1: '/images/details/product-l4-detail-1.jpg',
      image2: '/images/details/product-l4-detail-2.jpg',
    },
  },
  {
    id: 'l5',
    name: 'Soutien-gorge Brodé',
    price: 170,
    image: 'lingerie-5',
    collection: 'lingerie',
    colors: ['Beige', 'Noir', 'Rose'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '2XL'],
    rating: 4.7,
    reviews: 65,
    description: 'Lingerie Femme , Soutien-gorge brodé',
    features: ['Broderie fine', 'Armatures confortables', 'Bretelles larges', 'Maintien optimal'],
    inStock: true,
    details: {
      image1: '/images/details/product-l5-detail-1.jpg',
      image2: '/images/details/product-l5-detail-2.jpg',
    },
  },
  {
    id: 'l6',
    name: 'Ensemble 2 Pièces Soie',
    price: 320,
    salePrice: 270,
    image: 'lingerie-6',
    collection: 'lingerie',
    colors: ['Champagne', 'Noir', 'Bordeaux'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '2XL'],
    rating: 4.9,
    reviews: 143,
    description: 'Lingerie Femme , Soie naturelle',
    features: ['Soie naturelle', 'Ensemble complet', 'Finitions soignées', 'Luxe abordable'],
    inStock: true,
    badge: 'sale',
    details: {
      image1: '/images/details/product-l6-detail-1.jpg',
      image2: '/images/details/product-l6-detail-2.jpg',
    },
  },
  {
    id: 'l7',
    name: 'Corset Romantique',
    price: 280,
    image: 'lingerie-7',
    collection: 'lingerie',
    colors: ['Noir', 'Rouge', 'Blanc'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '2XL'],
    rating: 4.6,
    reviews: 57,
    description: 'Lingerie Femme , Corset élégant',
    features: ['Baleines souples', 'Laçage ajustable', 'Dentelle brodée', 'Taille affinée'],
    inStock: true,
    details: {
      image1: '/images/details/product-l7-detail-1.jpg',
      image2: '/images/details/product-l7-detail-2.jpg',
    },
  },
  {
    id: 'l8',
    name: 'Culotte Taille Haute',
    price: 130,
    image: 'lingerie-8',
    collection: 'lingerie',
    colors: ['Nude', 'Noir', 'Blanc'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '2XL'],
    rating: 4.4,
    reviews: 201,
    description: 'Lingerie Femme , Culotte taille haute',
    features: ['Coton doux', 'Taille haute gainante', 'Bord dentelle', 'Respirant'],
    inStock: true,
    badge: 'bestseller',
    details: {
      image1: '/images/details/product-l8-detail-1.jpg',
      image2: '/images/details/product-l8-detail-2.jpg',
    },
  },
  {
    id: 'l9',
    name: 'Bralette Velours',
    price: 160,
    image: 'lingerie-9',
    collection: 'lingerie',
    colors: ['Bordeaux', 'Vert forêt', 'Noir'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '2XL'],
    rating: 4.7,
    reviews: 83,
    description: 'Lingerie Femme , Bralette velours',
    features: ['Velours premium', 'Sans armature', 'Bretelles croisées', 'Maintien doux'],
    inStock: true,
    badge: 'new',
    details: {
      image1: '/images/details/product-l9-detail-1.jpg',
      image2: '/images/details/product-l9-detail-2.jpg',
    },
  },
  {
    id: 'l10',
    name: 'Déshabillé Plumes',
    price: 340,
    image: 'lingerie-10',
    collection: 'lingerie',
    colors: ['Rose', 'Noir', 'Blanc'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '2XL'],
    rating: 4.8,
    reviews: 49,
    description: 'Lingerie Femme , Déshabillé luxe',
    features: ['Plumes douces', 'Satin doublure', 'Élégance maximale', 'Idéal cadeau'],
    inStock: true,
    details: {
      image1: '/images/details/product-l10-detail-1.jpg',
      image2: '/images/details/product-l10-detail-2.jpg',
    },
  },
  {
    id: 'l11',
    name: 'Guêpière Dentelle Fine',
    price: 290,
    image: 'lingerie-11',
    collection: 'lingerie',
    colors: ['Noir', 'Blanc ivoire'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '2XL'],
    rating: 4.5,
    reviews: 62,
    description: 'Lingerie Femme , Guêpière dentelle',
    features: ['Dentelle française', 'Lacets satinés', 'Baleines légères', 'Galbe parfait'],
    inStock: true,
    details: {
      image1: '/images/details/product-l11-detail-1.jpg',
      image2: '/images/details/product-l11-detail-2.jpg',
    },
  },
  {
    id: 'l12',
    name: 'Ensemble Brodé Fleuri',
    price: 240,
    image: 'lingerie-12',
    collection: 'lingerie',
    colors: ['Blanc', 'Rose', 'Lilas'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '2XL'],
    rating: 4.6,
    reviews: 91,
    description: 'Lingerie Femme , Broderie florale',
    features: ['Broderie florale', 'Ensemble assorti', 'Coton mélange', 'Doux et léger'],
    inStock: true,
    badge: 'new',
    details: {
      image1: '/images/details/product-l12-detail-1.jpg',
      image2: '/images/details/product-l12-detail-2.jpg',
    },
  },
  {
    id: 'l13',
    name: 'Caraco Satiné',
    price: 140,
    image: 'lingerie-13',
    collection: 'lingerie',
    colors: ['Nude', 'Noir', 'Bleu nuit'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '2XL'],
    rating: 4.4,
    reviews: 118,
    description: 'Lingerie Femme , Caraco satiné',
    features: ['Satiné brillant', 'Bretelles fines', 'Coupe ajustée', 'Polyvalent'],
    inStock: true,
    details: {
      image1: '/images/details/product-l13-detail-1.jpg',
      image2: '/images/details/product-l13-detail-2.jpg',
    },
  },
  {
    id: 'l14',
    name: 'String Dentelle Luxe',
    price: 110,
    image: 'lingerie-14',
    collection: 'lingerie',
    colors: ['Noir', 'Rouge', 'Beige'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '2XL'],
    rating: 4.3,
    reviews: 175,
    description: 'Lingerie Femme , String dentelle',
    features: ['Dentelle italienne', 'Microfibre doux', 'Invisible sous vêtements', 'Confort toute journée'],
    inStock: true,
    details: {
      image1: '/images/details/product-l14-detail-1.jpg',
      image2: '/images/details/product-l14-detail-2.jpg',
    },
  },
  {
    id: 'l15',
    name: 'Nuisette Longue Glamour',
    price: 260,
    salePrice: 210,
    image: 'lingerie-15',
    collection: 'lingerie',
    colors: ['Noir', 'Bordeaux', 'Champagne'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '2XL'],
    rating: 4.9,
    reviews: 134,
    description: 'Lingerie Femme , Nuisette longue',
    features: ['Longueur midi', 'Fentes latérales', 'Satin fluide', 'Coupe silhouette'],
    inStock: true,
    badge: 'bestseller',
    details: {
      image1: '/images/details/product-l15-detail-1.jpg',
      image2: '/images/details/product-l15-detail-2.jpg',
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
