import { prisma } from '@/lib/prisma';
import { ChecklistClient } from './ChecklistClient';

export default async function ChecklistPage() {
  const items = await prisma.masterChecklistItem.findMany({
    orderBy: { key: 'asc' },
  });

  // Calculate next key prefix
  let nextKey = '001_';
  if (items.length > 0) {
      // Find max key starting with number
      const keys = items.map(i => i.key).filter(k => /^\d{3}_/.test(k));
      if (keys.length > 0) {
          const maxKey = keys.sort().pop()!;
          const prefix = parseInt(maxKey.substring(0, 3));
          if (!isNaN(prefix)) {
              nextKey = `${String(prefix + 1).padStart(3, '0')}_`;
          }
      }
  }

  return <ChecklistClient items={items} nextKey={nextKey} />;
}
