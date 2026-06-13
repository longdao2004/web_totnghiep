import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

const segmentMap: Record<string, string> = {
  'Veloz Cross': 'B',
  'Camry': 'D',
  'CR-V': 'C',
  'Xforce': 'B',
  'Santa Fe': 'D',
  'Accent': 'B',
  'Carnival': 'E',
  'Seltos': 'B',
  'Everest': 'D',
  'Ranger': 'Pickup',
  'Territory': 'C',
  'GLC 300': 'D',
  'C 300': 'D',
  '320i': 'D',
  'Macan': 'D',
  'VF 8': 'D',
  'VF 9': 'E',
  'VF 5': 'A',
  'VF 3': 'A',
  'VF 7': 'C',
};

const logoMap: Record<string, string> = {
  'Toyota': '/images/logos/toyota.jpg',
  'Honda': '/images/logos/honda.jpg',
  'Mitsubishi': '/images/logos/mitsubishi.jpg',
  'Hyundai': '/images/logos/hyundai.jpg',
  'Kia': '/images/logos/kia.jpg',
  'Ford': '/images/logos/ford.jpg',
  'Mercedes-Benz': '/images/logos/mec.jpg',
  'BMW': '/images/logos/BMW.jpg',
  'Porsche': '/images/logos/por.jpg',
  'VinFast': '/images/logos/vin.jpg',
};

async function main() {
  console.log('Reading cars_data.json...');
  const dataPath = path.join(process.cwd(), 'cars_data.json');
  const carsData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  console.log('Upserting data...');
  for (const item of carsData) {
    // 1. Upsert Brand
    const brand = await prisma.brand.upsert({
      where: { name: item.brandName },
      update: {
        country: item.country,
        logoUrl: logoMap[item.brandName] || null,
      },
      create: {
        name: item.brandName,
        country: item.country,
        logoUrl: logoMap[item.brandName] || null,
      },
    });

    // 2. Upsert CarModel
    const segment = segmentMap[item.modelName] || null;
    const carModel = await prisma.carModel.upsert({
      where: {
        brandId_name: {
          brandId: brand.id,
          name: item.modelName,
        },
      },
      update: {
        bodyType: item.bodyType,
        imageUrl: item.imageUrl,
        startingPrice: item.startingPrice,
        segment: segment,
      },
      create: {
        brandId: brand.id,
        name: item.modelName,
        bodyType: item.bodyType,
        imageUrl: item.imageUrl,
        startingPrice: item.startingPrice,
        segment: segment,
      },
    });

    // 3. Upsert CarSpecifications
    if (item.specifications && item.specifications.length > 0) {
      for (const spec of item.specifications) {
        await prisma.carSpecification.upsert({
          where: {
            carModelId_versionName: {
              carModelId: carModel.id,
              versionName: spec.versionName,
            },
          },
          update: {
            modelYear: spec.modelYear,
            engine: spec.engine,
            power: spec.power,
            torque: spec.torque,
            transmission: spec.transmission,
            drivetrain: spec.drivetrain,
            fuelType: spec.fuelType,
            fuelConsumption: spec.fuelConsumption,
            seatingCapacity: spec.seatingCapacity,
            dimensions: spec.dimensions,
            groundClearance: spec.groundClearance,
            safetyFeatures: spec.safetyFeatures,
            technologyFeatures: spec.technologyFeatures,
            price: spec.price,
          },
          create: {
            carModelId: carModel.id,
            versionName: spec.versionName,
            modelYear: spec.modelYear,
            engine: spec.engine,
            power: spec.power,
            torque: spec.torque,
            transmission: spec.transmission,
            drivetrain: spec.drivetrain,
            fuelType: spec.fuelType,
            fuelConsumption: spec.fuelConsumption,
            seatingCapacity: spec.seatingCapacity,
            dimensions: spec.dimensions,
            groundClearance: spec.groundClearance,
            safetyFeatures: spec.safetyFeatures,
            technologyFeatures: spec.technologyFeatures,
            price: spec.price,
          },
        });
      }
    }

    console.log(`✓ Upserted: ${item.brandName} ${item.modelName}`);
  }

  console.log('✓ Seeding complete!');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });