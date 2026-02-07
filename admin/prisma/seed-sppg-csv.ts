import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

const STATUS_MAP: Record<string, number> = {
  'Assign Investor': 1,
  'Dokumen Pendaftaran': 2,
  'Proses Persiapan': 3,
  'Validasi Data Persiapan': 4,
  'Appraisal Biaya Sewa': 5,
  'Validasi Data Pendaftaran': 6,
  'Perjanjian Sewa': 7,
};

function parseCSVLine(line: string): string[] {
  return line.split(';');
}

async function main() {
  const filePath = path.join(process.cwd(), 'sppg.csv');
  console.log(`📂 Checking file at: ${filePath}`);
  
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    process.exit(1);
  }

  // 0. Ensure Master Status
  console.log('📊 Seeding Master Status...');
  const masterStatuses = [
    { id: 1, name: 'Assign Investor' },
    { id: 2, name: 'Dokumen Pendaftaran' },
    { id: 3, name: 'Proses Persiapan' },
    { id: 4, name: 'Validasi Data Persiapan' },
    { id: 5, name: 'Appraisal Biaya Sewa' },
    { id: 6, name: 'Validasi Data Pendaftaran' },
    { id: 7, name: 'Perjanjian Sewa' },
  ];

  for (const status of masterStatuses) {
    process.stdout.write(`   - Upserting status ${status.id} (${status.name})... `);
    await prisma.masterStatus.upsert({
      where: { id: status.id },
      update: { name: status.name },
      create: { id: status.id, name: status.name }
    });
    console.log('OK');
  }

  // Read file synchronously
  console.log('📖 Reading CSV file...');
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const lines = fileContent.split(/\r?\n/);
  console.log(`ℹ️ Total lines found: ${lines.length}`);

  let lineCount = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (i === 0) continue; // Skip header
    if (!line.trim()) continue; // Skip empty

    const cols = parseCSVLine(line);
    if (cols.length < 5) continue; 

    // Extract Data
    const sppgId = cols[0]?.trim();
    if (!sppgId) continue;

    const statusName = cols[1]?.trim();
    const preparationPercent = parseFloat(cols[2]?.trim()) || 0;
    const investorName = cols[4]?.trim();
    const investorEmail = cols[5]?.trim();
    const investorCode = cols[6]?.trim();
    
    // Check if investor info matches "Belum *"
    // If "Belum Terhubung", we treat it as no investor linked.
    
    const provName = cols[8]?.trim();
    const regName = cols[9]?.trim();
    const distName = cols[10]?.trim();
    const villName = cols[11]?.trim();
    const postalCode = cols[12]?.trim() === '-' ? null : cols[12]?.trim();
    
    let lat = parseFloat(cols[13]?.trim());
    let long = parseFloat(cols[14]?.trim());

    if (isNaN(lat)) lat = 0;
    if (isNaN(long)) long = 0;

    let finalInvestorId: string | null = null;

    // 1. Investor Upsert
    if (investorCode && 
        investorCode !== 'Belum Terhubung' && 
        investorCode !== 'Belum diisi' && 
        investorCode !== '-') {
      
      finalInvestorId = investorCode;
      const validEmail = (investorEmail && investorEmail !== '-' && investorEmail.includes('@')) ? investorEmail : null;

      try {
        await prisma.investor.upsert({
            where: { id: investorCode },
            update: {
                name: investorName,
                email: validEmail,
            },
            create: {
                id: investorCode,
                name: investorName,
                email: validEmail,
                type: 'Individu', 
                investorCode: investorCode 
            }
        });
      } catch (err) {
        console.error(`\n⚠️ Failed to upsert investor ${investorCode}:`, err);
      }
    }

    // 2. SPPG Status ID
    let statusId = 1; 
    if (STATUS_MAP[statusName]) {
        statusId = STATUS_MAP[statusName];
    }

    // 3. SPPG Upsert
    try {
        await prisma.sPPG.upsert({
            where: { id: sppgId },
            update: {
                statusId: statusId,
                preparationPercent: preparationPercent,
                lat: lat,
                long: long,
                postalCode: postalCode,
                investorId: finalInvestorId,
                provinceName: provName,
                regencyName: regName,
                districtName: distName,
                villageName: villName,
            },
            create: {
                id: sppgId,
                statusId: statusId,
                preparationPercent: preparationPercent,
                lat: lat,
                long: long,
                postalCode: postalCode,
                investorId: finalInvestorId,
                provinceName: provName,
                regencyName: regName,
                districtName: distName,
                villageName: villName,
            }
        });

    } catch (err) {
        console.error(`\n❌ Failed to upsert SPPG ${sppgId}:`, err);
    }
    
    lineCount++;
    if (lineCount % 200 === 0) {
        process.stdout.write(`\r✅ Processed ${lineCount} rows...`);
    }
  }

  console.log(`\n🎉 SPPG Import Completed. Scanned ${lineCount} meaningful rows.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

