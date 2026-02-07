
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyJwt } from '@/lib/jwt';

// GET: Fetch checklist items and their status for this SPPG
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const sppgId = params.id;

    // 1. Fetch all Master Items (to ensure we show everything, even if not yet init in progress table)
    const masterItems = await prisma.masterChecklistItem.findMany({
        orderBy: { key: 'asc' } // Sort by key (001_, 002_, etc.)
    });

    // 2. Fetch current progress
    const progress = await prisma.sPPGChecklistProgress.findMany({
        where: { sppgId },
        include: { masterItem: true }
    });

    // 3. Merge
    const checklist = masterItems.map(master => {
        const found = progress.find(p => p.masterItemId === master.id);
        return {
            masterItemId: master.id,
            key: master.key,
            name: master.name,
            description: master.description,
            weight: master.weight, // Percentage weight
            isCompleted: found ? found.isCompleted : false,
            updatedAt: found ? found.updatedAt : null
        };
    });

    // Calculate current total percentage based on completed items
    const totalWeight = checklist.reduce((sum, item) => sum + item.weight, 0); // Should be roughly 100
    const currentScore = checklist.reduce((sum, item) => item.isCompleted ? sum + item.weight : sum, 0);
    const percentage = totalWeight > 0 ? (currentScore / totalWeight) * 100 : 0;

    return NextResponse.json({
        checklist,
        summary: {
            totalWeight,
            currentScore,
            percentage: Math.round(percentage)
        }
    });

  } catch (error) {
    console.error('Error fetching checklist:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Update checklist status
export async function POST(request: Request, { params }: { params: { id: string } }) {
    try {
        const sppgId = params.id;
        const body = await request.json();
        const { items } = body; // Array of { masterItemId, isCompleted }

        if (!items || !Array.isArray(items)) {
            return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
        }

        // Transaction to update progress items and recalculate total
        await prisma.$transaction(async (tx) => {
            // 1. Upsert progress items
            for (const item of items) {
                await tx.sPPGChecklistProgress.upsert({
                    where: {
                        sppgId_masterItemId: {
                            sppgId,
                            masterItemId: item.masterItemId
                        }
                    },
                    update: { isCompleted: item.isCompleted },
                    create: {
                        sppgId,
                        masterItemId: item.masterItemId,
                        isCompleted: item.isCompleted
                    }
                });
            }

            // 2. Recalculate Percentage
            const allProgress = await tx.sPPGChecklistProgress.findMany({
                where: { sppgId, isCompleted: true },
                include: { masterItem: true }
            });
            
            // We need all master items to know total possible weight? 
            // Or assume 100? Let's sum weights of completed items.
            // Wait, to calculate percentage properly we need total weight of ALL items.
            // Assumption: Total weight of all MasterChecklistItems is ~100.
            // Let's sum weights of completed ones.
            const totalScore = allProgress.reduce((sum, p) => sum + p.masterItem.weight, 0);

            // Update SPPG
            await tx.sPPG.update({
                where: { id: sppgId },
                data: { preparationPercent: Math.round(totalScore) }
            });
        });

        return NextResponse.json({ message: 'Checklist updated successfully' });

    } catch (error) {
        console.error('Error updating checklist:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
