import Link from 'next/link';
import { Map, MapPin, ClipboardList, Building2 } from 'lucide-react';

const categories = [
  {
    name: 'Administrative Regions',
    description: 'Manage Provinces, Regencies, Districts, and Villages',
    items: [
      { name: 'Provinces', href: '/admin/master/provinces', icon: Map },
      { name: 'Regencies', href: '/admin/master/regencies', icon: Building2 },
      { name: 'Districts', href: '/admin/master/districts', icon: MapPin },
      { name: 'Villages', href: '/admin/master/villages', icon: MapPin },
    ],
  },
  {
    name: 'SPPG Configuration',
    description: 'Manage checklist templates and other configurations',
    items: [
      { name: 'Checklist Items', href: '/admin/master/checklist', icon: ClipboardList },
    ],
  },
];

export default function MasterDataPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Master Data Hub</h1>
      
      <div className="space-y-12">
        {categories.map((category) => (
          <div key={category.name}>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">{category.name}</h2>
              <p className="text-sm text-gray-500">{category.description}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.items.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow flex items-center space-x-4 border border-gray-100"
                >
                  <div className="bg-blue-50 p-3 rounded-full text-blue-600">
                    <item.icon size={24} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500 italic">Manage {item.name.toLowerCase()}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
