
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const items = [
      { key: '001_proof_ownership', name: 'Bukti Kepemilikan', weight: 10.0, description: 'Bukti beli / sewa tersedia dan valid' },
      { key: '002_foundation', name: 'Pondasi', weight: 10.0, description: 'Pondasi bangunan selesai dan terdokumentasi' },
      { key: '003_walls', name: 'Dinding', weight: 10.0, description: 'Dinding bangunan selesai dan terdokumentasi' },
      { key: '004_roof', name: 'Atap', weight: 10.0, description: 'Atap bangunan selesai dan terdokumentasi' },
      { key: '005_floor_ceiling', name: 'Lantai & Plafon', weight: 10.0, description: 'Lantai & plafon selesai dan terdokumentasi' },
      { key: '006_finishing', name: 'Finishing', weight: 10.0, description: 'Finishing bangunan selesai dan terdokumentasi' },
      { key: '007_kitchen_tools_proof', name: 'Bukti Alat Dapur', weight: 10.0, description: 'Bukti beli alat dapur / masak / makan tersedia' },
      { key: '008_kitchen_tools_complete', name: 'Kelengkapan Alat Dapur', weight: 10.0, description: 'Alat dapur, alat masak, dan alat makan tersedia dan lengkap' },
      { key: '009_utilities', name: 'Utilitas', weight: 10.0, description: 'Instalasi listrik, cadangan listrik, air dan gas tersedia dan berfungsi' },
      { key: '010_personnel', name: 'Tenaga Ahli', weight: 10.0, description: 'Data tenaga ahli gizi, akuntan, dan tenaga relawan tersedia' },
    ];

    let count = 0;
    for (const item of items) {
      await prisma.masterChecklistItem.upsert({
        where: { key: item.key },
        update: {
            name: item.name,
            weight: item.weight,
            description: item.description
        },
        create: {
            key: item.key,
            name: item.name,
            weight: item.weight,
            description: item.description
        }
      });
      count++;
    }

    return NextResponse.json({
      success: true,
      message: `Seeded ${count} Master Checklist Items.`
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
