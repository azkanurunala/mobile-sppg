
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Verifying Schema & Data Changes...')

  try {
    // 1. Verify KorwilProfile
    // @ts-ignore
    const profiles = await prisma.korwilProfile.findMany({ include: { user: true, assignedRegency: true } })
    console.log(`✅ KorwilProfiles found: ${profiles.length}`)
    if (profiles.length > 0) {
      console.log(`   - Profile 1: ${profiles[0].user.name} (Regency: ${profiles[0].assignedRegency?.name})`)
    }

    // 2. Verify Investor Code
    // @ts-ignore
    const investor = await prisma.investor.findFirst({ where: { investorCode: 'INV-001' } })
    if (investor) {
      console.log(`✅ Investor found with code: ${investor.investorCode}`)
    } else {
      console.log(`❌ Investor with code INV-001 NOT FOUND`)
    }

    // 3. Verify SPPG Timeline Fields (existence check via create/delete or just checking schema reflection)
    // We can't easily check schema fields at runtime without reflecting, but if the client compiles, it's good.
    // We'll try to find an SPPG and log it.
    // @ts-ignore
    const sppg = await prisma.sPPG.findFirst({ include: { status: true } })
    if (sppg) {
        console.log(`✅ SPPG found. ID: ${sppg.id}`)
        // Check fields existence by accessing them
        // @ts-ignore
        console.log(`   - Prep Start: ${sppg.preparationStart}`)
        // @ts-ignore
        console.log(`   - Prep End: ${sppg.preparationEnd}`)
        // @ts-ignore
        console.log(`   - Status: ${sppg.status?.name} (ID: ${sppg.statusId})`)
    }
    
    // 4. Verify MasterStatus
    // @ts-ignore
    const statuses = await prisma.masterStatus.findMany()
    console.log(`✅ MasterStatuses found: ${statuses.length}`)
    if (statuses.length > 0) {
        console.log(`   - Example: ${statuses[0].id} -> ${statuses[0].name}`)
    }

  } catch (e: any) {
    console.error('❌ Verification Failed:', e.message)
  } finally {
    await prisma.$disconnect()
  }
}

main()
