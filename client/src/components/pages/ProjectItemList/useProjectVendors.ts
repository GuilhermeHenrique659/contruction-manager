import { Vendor } from '../../../features/projects/model/Vendor';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ListVendors } from '../../../features/projects/application/ListVendors';
import { CreateVendor } from '../../../features/projects/application/CreateVendor';
import { FetchProjectGateway } from '../../../features/projects/gateway/FetchProjectGateway';

export function useProjectVendors() {
  const { projectId } = useParams<{ projectId: string }>();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    const useCase = new ListVendors(new FetchProjectGateway());
    const output = await useCase.execute({ projectId: projectId || '' });
    setVendors(output.vendors);
  };

  useEffect(() => {
    load().finally(() => setIsLoading(false));
  }, []);

  const addVendor = async (input: { name: string; paymentDay: number | null }) => {
    const gateway = new FetchProjectGateway();
    await new CreateVendor(gateway).execute({ ...input, projectId: projectId || '' });
    await load();
  };

  return { vendors, isLoading, addVendor };
}
