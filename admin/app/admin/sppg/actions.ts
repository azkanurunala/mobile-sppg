'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function deleteSPPG(id: string) {
  try {
    await prisma.sPPG.delete({ where: { id } });
    revalidatePath('/admin/sppg');
    return { success: true };
  } catch (error) {
    return { error: 'Failed to delete SPPG' };
  }
}

export async function getLocationChildren(parentId: string, type: 'regencies' | 'districts' | 'villages') {
    if (type === 'regencies') {
        return prisma.regency.findMany({ where: { provinceId: parentId }, orderBy: { name: 'asc' } });
    } else if (type === 'districts') {
        return prisma.district.findMany({ where: { regencyId: parentId }, orderBy: { name: 'asc' } });
    } else if (type === 'villages') {
        return prisma.village.findMany({ where: { districtId: parentId }, orderBy: { name: 'asc' } });
    }
    return [];
}

export async function createSPPG(formData: FormData) {
  const id = formData.get('id') as string;
  const statusRaw = formData.get('status');
  const status = statusRaw ? parseInt(statusRaw as string) : 1; // Default to 1 (Assign Investor)
  const investorId = formData.get('investorId') as string || null;
  const villageId = formData.get('villageId') as string || null;
  const lat = formData.get('lat') ? parseFloat(formData.get('lat') as string) : null;
  const long = formData.get('long') ? parseFloat(formData.get('long') as string) : null;
  const postalCode = formData.get('postalCode') as string || null;

  try {
    let locationData = {};
    if (villageId) {
        const village = await prisma.village.findUnique({
            where: { id: villageId },
            include: {
                district: {
                    include: {
                        regency: {
                            include: {
                                province: true
                            }
                        }
                    }
                }
            }
        });

        if (village) {
            locationData = {
                villageName: village.name,
                districtId: village.districtId,
                districtName: village.district.name,
                regencyId: village.district.regencyId,
                regencyName: village.district.regency.name,
                provinceId: village.district.regency.provinceId,
                provinceName: village.district.regency.province.name,
            };
        }
    }

    await prisma.sPPG.create({
      data: { 
        id, 
        statusId: status, 
        investorId: investorId === '' ? null : investorId,
        villageId: villageId === '' ? null : villageId,
        lat,
        long,
        postalCode,
        ...locationData
      },
    });
    revalidatePath('/admin/sppg');
    return { success: true };
  } catch (error: any) {
    console.error('Create SPPG Error:', error);
    return { error: error.message || 'Failed to create SPPG' };
  }
}

export async function updateSPPG(id: string, formData: FormData) {
  const statusRaw = formData.get('status');
  const status = statusRaw ? parseInt(statusRaw as string) : undefined;
  const investorId = formData.get('investorId') as string || null;
  const villageId = formData.get('villageId') as string || null;
  const lat = formData.get('lat') ? parseFloat(formData.get('lat') as string) : null;
  const long = formData.get('long') ? parseFloat(formData.get('long') as string) : null;
  const postalCode = formData.get('postalCode') as string || null;

  try {
    let locationData = {};
    if (villageId) {
        const village = await prisma.village.findUnique({
            where: { id: villageId },
            include: {
                district: {
                    include: {
                        regency: {
                            include: {
                                province: true
                            }
                        }
                    }
                }
            }
        });

        if (village) {
            locationData = {
                villageName: village.name,
                districtId: village.districtId,
                districtName: village.district.name,
                regencyId: village.district.regencyId,
                regencyName: village.district.regency.name,
                provinceId: village.district.regency.provinceId,
                provinceName: village.district.regency.province.name,
            };
        }
    }

    await prisma.sPPG.update({
      where: { id },
      data: { 
        statusId: status, 
        investorId: investorId === '' ? null : investorId,
        villageId: villageId === '' ? null : villageId,
        lat,
        long,
        postalCode,
        ...locationData
      },
    });
    revalidatePath('/admin/sppg');
    return { success: true };
  } catch (error: any) {
    console.error('Update SPPG Error:', error);
    return { error: error.message || 'Failed to update SPPG' };
  }
}
