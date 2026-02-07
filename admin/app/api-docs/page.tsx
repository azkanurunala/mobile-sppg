
import { getApiDocs } from '@/lib/swagger';
import ReactSwagger from './react-swagger';

export default async function IndexPage() {
  const spec = await getApiDocs();
  return (
    <div className="p-4 bg-white min-h-screen">
      <ReactSwagger spec={spec} />
    </div>
  );
}
