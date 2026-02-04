import { prisma } from '@/lib/prisma';
import { ChecklistClient } from './ChecklistClient';

export default async function ChecklistPage() {
  const items = await prisma.masterChecklistItem.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return <ChecklistClient items={items} />;
}
