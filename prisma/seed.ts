import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 1. Categorías en Español
  const electronica = await prisma.category.upsert({
    where: { name: 'Electrónica' },
    update: {},
    create: { name: 'Electrónica' },
  })

  const ropa = await prisma.category.upsert({
    where: { name: 'Ropa' },
    update: {},
    create: { name: 'Ropa' },
  })

  // 2. Productos en Español
  await prisma.product.upsert({
    where: { slug: 'audifonos-pro-inalambricos' },
    update: {},
    create: {
      name: 'Audífonos Pro Inalámbricos',
      slug: 'audifonos-pro-inalambricos',
      description: 'Audio de alta fidelidad con cancelación activa de ruido. 20h de batería.',
      price: 199.99,
      stock: 50,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
      categoryId: electronica.id,
    },
  })

  await prisma.product.upsert({
    where: { slug: 'teclado-mecanico' },
    update: {},
    create: {
      name: 'Teclado Mecánico RGB',
      slug: 'teclado-mecanico',
      description: 'Switches táctiles para la mejor experiencia de escritura. Retroiluminado.',
      price: 129.50,
      stock: 15,
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b91a603?w=800&q=80',
      categoryId: electronica.id,
    },
  })

  await prisma.product.upsert({
    where: { slug: 'sudadera-minimalista' },
    update: {},
    create: {
      name: 'Sudadera Minimalista',
      slug: 'sudadera-minimalista',
      description: '100% algodón orgánico. Comodidad pesada para días fríos.',
      price: 59.00,
      stock: 100,
      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80',
      categoryId: ropa.id,
    },
  })

  console.log('Base de datos sembrada en Español!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })