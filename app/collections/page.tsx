'use client'

import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { products } from '@/lib/products'

const catalogueCollections = [
  {
    id: 'pijama',
    name: 'Pijama',
    description: 'Pyjamas confortables et élégants pour des nuits douces et reposantes.',
    icon: '🌙',
    image: '/images/product-1.jpg',
    color: 'from-rose-50 to-pink-100',
    borderColor: 'border-pink-200',
    badgeColor: 'bg-pink-100 text-pink-800',
  },
  {
    id: 'lingerie',
    name: 'Lingerie',
    description: 'Lingerie fine et raffinée, pour vous sentir belle et confiante chaque jour.',
    icon: '🌸',
    image: '/images/product-l1.jpg',
    color: 'from-purple-50 to-fuchsia-100',
    borderColor: 'border-fuchsia-200',
    badgeColor: 'bg-fuchsia-100 text-fuchsia-800',
  },
]

export default function CataloguePage() {
  const pijamaCount = products.filter((p) => p.collection === 'pijama').length
  const lingerieCount = products.filter((p) => p.collection === 'lingerie').length
  const counts: Record<string, number> = { pijama: pijamaCount, lingerie: lingerieCount }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">

        {/* Hero */}
        <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-black text-white">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-4">
              Notre Catalogue
            </h1>
            <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto">
              Explorez nos collections soigneusement sélectionnées pour votre confort et votre élégance.
            </p>
          </div>
        </section>

        {/* Collections Cards */}
        <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-background">
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8">
            {catalogueCollections.map((col) => (
              <Link key={col.id} href={`/collections/${col.id}`}>
                <div
                  className={`group relative rounded-2xl overflow-hidden border-2 ${col.borderColor} bg-gradient-to-br ${col.color} shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-1`}
                >
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={col.image}
                      alt={col.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement
                        img.style.display = 'none'
                      }}
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    {/* Icon */}
                    <div className="absolute top-4 left-4 text-4xl">{col.icon}</div>
                    {/* Count badge */}
                    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${col.badgeColor}`}>
                      {counts[col.id]} produits
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                      {col.name}
                    </h2>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                      {col.description}
                    </p>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary group-hover:gap-3 transition-all duration-200">
                      Voir la collection
                      <span className="text-lg">→</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 sm:py-16 bg-background border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
              Besoin de conseils ?
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Contactez-nous sur WhatsApp pour des recommandations personnalisées
            </p>
            <a
              href="https://wa.me/212660435756?text=Bonjour, je souhaite des conseils sur vos collections."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
            >
              Discuter sur WhatsApp
            </a>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
