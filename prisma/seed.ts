import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning existing data...');
  // Xóa dữ liệu cũ theo đúng thứ tự để không dính lỗi khóa ngoại (Foreign Key)
  await prisma.carSpecification.deleteMany();
  await prisma.carModel.deleteMany();
  await prisma.brand.deleteMany();

  console.log('Reading cars_data.json...');
  // Trỏ đúng ra thư mục gốc để lấy file JSON
  const dataPath = path.join(process.cwd(), 'cars_data.json');
  const carsData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  console.log('Seeding data...');
  for (const item of carsData) {
    // 1. Kiểm tra và Tạo Thương hiệu (Brand)
    const brand = await prisma.brand.upsert({
      where: { name: item.brandName },
      update: {},
      create: {
        name: item.brandName,
        country: item.country,
      },
    });

    // 2. Tạo Mẫu xe (CarModel)
    const carModel = await prisma.carModel.create({
      data: {
        brandId: brand.id,
        name: item.modelName,
        bodyType: item.bodyType,
        imageUrl: item.imageUrl,
        startingPrice: item.startingPrice,
      },
    });

    // 3. Tạo Các phiên bản (CarSpecification)
    if (item.specifications && item.specifications.length > 0) {
      for (const spec of item.specifications) {
        await prisma.carSpecification.create({
          data: {
            carModelId: carModel.id,
            versionName: spec.versionName,
            engine: spec.engine,
            seatingCapacity: spec.seatingCapacity,
            price: spec.price,
          },
        });
      }
    }
  }

  console.log('Seeding complete. Database is ready!');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });