import { prisma } from '@/lib/prisma';
import { InvestorClient } from './InvestorClient';

export default async function InvestorsPage() {
  const investors = await prisma.investor.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <InvestorClient investors={investors} />
  );
}
