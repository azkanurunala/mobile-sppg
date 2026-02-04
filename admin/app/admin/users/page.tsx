import { prisma } from '@/lib/prisma';
import { UserClient } from './UserClient';

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    include: {
        korwilProfile: {
            include: {
                assignedRegency: {
                    include: {
                        province: true
                    }
                },
                team: true
            }
        }
    },
    orderBy: { createdAt: 'desc' },
  });

  const provinces = await prisma.province.findMany({
    orderBy: { name: 'asc' }
  });

  const teams = await prisma.team.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <UserClient 
        users={users} 
        provinces={provinces}
        teams={teams}
    />
  );
}
