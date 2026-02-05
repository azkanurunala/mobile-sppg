import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, MapPin, Building2, Calendar, ClipboardCheck, LayoutGrid } from 'lucide-react';
import { getSppgStatusLabel } from '@/lib/constants/sppg-status';

export default async function SPPGDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const sppg = await prisma.sPPG.findUnique({
    where: { id: params.id },
    include: {
      investor: true,
      village: {
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
      },
      checklistProgress: {
        include: {
          masterItem: true
        },
        orderBy: {
            masterItem: {
                key: 'asc'
            }
        }
      }
    }
  });

  if (!sppg) notFound();

  const getStatusColor = (status: number | null | undefined) => {
    switch (status) {
      case 1: return 'bg-yellow-100 text-yellow-800';
      case 2: return 'bg-orange-100 text-orange-800';
      case 3: return 'bg-blue-100 text-blue-800';
      case 4: return 'bg-purple-100 text-purple-800';
      case 5: return 'bg-teal-100 text-teal-800';
      case 6: return 'bg-indigo-100 text-indigo-800';
      case 7: return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <Link 
        href="/admin/sppg" 
        className="flex items-center text-gray-600 hover:text-blue-600 mb-6 transition-colors w-fit"
      >
        <ChevronLeft size={20} />
        <span>Back to SPPG List</span>
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold text-gray-900 uppercase">{sppg.id}</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(sppg.statusId)}`}>
              {getSppgStatusLabel(sppg.statusId)}
            </span>
          </div>
          <p className="text-gray-500 mt-1">Detailed information and progress for this SPPG unit.</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
             <div className="text-right">
                <div className="text-xs text-gray-500 uppercase font-semibold">Total Progress</div>
                <div className="text-2xl font-bold text-blue-600">{sppg.preparationPercent || 0}%</div>
             </div>
             <div className="w-24 bg-gray-100 rounded-full h-2 shadow-inner">
                <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${sppg.preparationPercent || 0}%` }}
                ></div>
             </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: General Info */}
        <div className="lg:col-span-1 space-y-6">
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Info className="mr-2 text-blue-600" size={20} />
              General Info
            </h2>
            <dl className="space-y-4">
              <div>
                <dt className="text-xs font-semibold text-gray-500 uppercase">Investor</dt>
                <dd className="mt-1 text-sm text-gray-900 flex items-center">
                    <Building2 size={14} className="mr-2 text-gray-400" />
                    {sppg.investor?.name || <span className="italic text-gray-400">Not Assigned</span>}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-gray-500 uppercase">CreatedAt</dt>
                <dd className="mt-1 text-sm text-gray-900 flex items-center">
                    <Calendar size={14} className="mr-2 text-gray-400" />
                    {new Date(sppg.createdAt).toLocaleString()}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-gray-500 uppercase">Coordinates</dt>
                <dd className="mt-1 text-sm text-gray-900 font-mono">
                    {sppg.lat ? `${sppg.lat}, ${sppg.long}` : 'N/A'}
                </dd>
              </div>
            </dl>
          </section>

          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <MapPin className="mr-2 text-red-600" size={20} />
              Location Details
            </h2>
            <dl className="space-y-4 text-sm">
              <div className="flex justify-between border-b pb-2">
                <dt className="font-semibold text-gray-500">Province</dt>
                <dd className="text-gray-900 font-medium">{sppg.provinceName || sppg.village?.district?.regency?.province?.name || '-'}</dd>
              </div>
              <div className="flex justify-between border-b pb-2">
                <dt className="font-semibold text-gray-500">Regency</dt>
                <dd className="text-gray-900 font-medium">{sppg.regencyName || sppg.village?.district?.regency?.name || '-'}</dd>
              </div>
              <div className="flex justify-between border-b pb-2">
                <dt className="font-semibold text-gray-500">District</dt>
                <dd className="text-gray-900 font-medium">{sppg.districtName || sppg.village?.district?.name || '-'}</dd>
              </div>
              <div className="flex justify-between border-b pb-2">
                <dt className="font-semibold text-gray-500">Village</dt>
                <dd className="text-gray-900 font-medium">{sppg.villageName || sppg.village?.name || '-'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-semibold text-gray-500">Postal Code</dt>
                <dd className="text-gray-900 font-medium font-mono">{sppg.postalCode || '-'}</dd>
              </div>
            </dl>
          </section>
        </div>

        {/* Right Column: Checklist Progress */}
        <div className="lg:col-span-2">
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-full">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
              <ClipboardCheck className="mr-2 text-green-600" size={20} />
              Installation Checklist Progress
            </h2>
            
            <div className="space-y-4">
              {sppg.checklistProgress.length === 0 ? (
                <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-xl border border-dashed">
                  <LayoutGrid size={40} className="mx-auto mb-2 opacity-20" />
                  <p>No checklist progress records found.</p>
                </div>
              ) : (
                sppg.checklistProgress.map((progress: any) => (
                  <div key={progress.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-transparent hover:border-gray-200 transition-all">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-full ${progress.isCompleted ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-400'}`}>
                        <ClipboardCheck size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{progress.masterItem.name}</div>
                        <div className="text-xs text-gray-500">{progress.masterItem.description}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="text-sm font-semibold text-gray-600 bg-white px-2 py-1 rounded shadow-sm border border-gray-100">
                            {progress.masterItem.weight}%
                        </div>
                        <div className={`text-xs font-bold uppercase px-2 py-1 rounded ${progress.isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                            {progress.isCompleted ? 'Completed' : 'Pending'}
                        </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

// Reuse some icons
function Info({ className, size }: { className?: string, size?: number }) {
    return <LayoutGrid className={className} size={size} />
}
