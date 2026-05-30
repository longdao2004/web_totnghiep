// cào dữ liệu xe từ trang web và lưu vào cơ sở dữ liệu oto.com.vn
import axios from "axios";
import * as cheerio from "cheerio";
import { PrismaClient } from "@prisma/client";
import fs from 'fs';

const prisma = new PrismaClient();

type ScrapedCar = {
  name: string;
  priceText: string;
  imageUrl: string | null;
  brandName: string;
};

const TARGET_URL = "https://oto.com.vn/mua-ban-xe";

function parsePriceToNumber(priceText: string): number | null {
  const normalizedText = priceText.toLowerCase().trim();

  if (!normalizedText) {
    return null;
  }

  const numericText = normalizedText
    .replace(/[^\d.,]/g, "")
    .replace(/\.(?=\d{3}(\D|$))/g, "")
    .replace(",", ".");

  const value = Number.parseFloat(numericText);

  if (Number.isNaN(value)) {
    return null;
  }

  if (normalizedText.includes("tỷ") || normalizedText.includes("ty")) {
    return value * 1_000_000_000;
  }

  if (
    normalizedText.includes("triệu") ||
    normalizedText.includes("trieu") ||
    normalizedText.includes("million")
  ) {
    return value * 1_000_000;
  }

  return value;
}

async function scrapeCars() {
  try {
    console.log(`Starting car scraping from: ${TARGET_URL}`);

    const { data: html } = await axios.get(TARGET_URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    console.log("HTML downloaded successfully.");

    // Tuyệt chiêu debug: Lưu HTML tải được ra file để kiểm tra
    fs.writeFileSync('debug.html', html);
    console.log('Đã lưu mã HTML thực tế vào file debug.html để kiểm tra.');
    const $ = cheerio.load(html);
    // Dùng '.item-car' để chộp lấy tất cả các thẻ chứa xe
    const cars = $('.item-car').map((i, el) => {
      // 1. Lấy tên xe
      const name = $(el).find('.car-name').text().trim();

      // 2. Lấy giá xe
      const priceText = $(el).find('.price').text().trim();

      // 3. Lấy hình ảnh (Ưu tiên lấy từ data-src vì web dùng lazy load)
      const imageUrl = $(el).find('.photo img').attr('data-src') || $(el).find('.photo img').attr('src');

      // 4. Lấy Hãng xe từ thuộc tính data-tinrao (Ví dụ: "Mercedes-Benz.S450...")
      const tinRao = $(el).attr('data-tinrao') || '';
      const brandName = tinRao.split('.')[0] || 'Unknown';

      return { name, priceText, imageUrl, brandName };
    }).get();

    console.log(`Found ${cars.length} car(s) from the page.`);

    for (const car of cars) {
      console.log(`Saving car: ${car.name}`);

      const brand = await prisma.brand.upsert({
        where: {
          name: car.brandName,
        },
        update: {},
        create: {
          name: car.brandName,
        },
      });

      const startingPrice = parsePriceToNumber(car.priceText);

      const carModel = await prisma.carModel.create({
        data: {
          name: car.name,
          brandId: brand.id,
          imageUrl: car.imageUrl,
          startingPrice,
        },
      });

      await prisma.carSpecification.create({
        data: {
          carModelId: carModel.id,
          versionName: "Tiêu chuẩn",
          engine: "Động cơ mẫu",
          seatingCapacity: 5,
          price: startingPrice,
        },
      });

      console.log(`Saved car model and sample specification: ${car.name}`);
    }

    console.log("Car scraping completed.");
  } catch (error) {
    console.error("Car scraping failed:", error);
  } finally {
    await prisma.$disconnect();
    console.log("Prisma disconnected.");
  }
}

scrapeCars();
