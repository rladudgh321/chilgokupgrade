import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  const filePath = path.join(__dirname, 'build-seed-data.json');

  if (!fs.existsSync(filePath)) {
    throw new Error(`❌ 파일을 찾을 수 없습니다: ${filePath}`);
  }

  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  for (const item of data) {
    await prisma.build.create({
      data: {
        ...item,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        constructionYear: new Date(item.constructionYear),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        permitDate: new Date(item.permitDate),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        approvalDate: new Date(item.approvalDate),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        moveInDate: new Date(item.moveInDate),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        contractEndDate: new Date(item.contractEndDate),
      },
    });
  }
}

main()
  .then(() => {
    console.log('🌱 Seed completed.');
    return prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed failed.', e);
    await prisma.$disconnect();
    process.exit(1);
  });
