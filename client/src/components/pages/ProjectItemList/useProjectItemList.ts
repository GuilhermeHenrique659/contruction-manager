import { ProjectItem } from '../../../features/projects/model/ProjectItem';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ListProjectItems } from '../../../features/projects/application/ListProjectItems';
import { CreateItem } from '../../../features/projects/application/CreateItem';
import { AddOrderToItem } from '../../../features/projects/application/AddOrderToItem';
import { FetchProjectGateway } from '../../../features/projects/gateway/FetchProjectGateway';

export function useProjectItemList() {
  const { projectId } = useParams<{ projectId: string }>();
  const [items, setItems] = useState<ProjectItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const useCase = new ListProjectItems(new FetchProjectGateway());
    useCase.execute({ projectId: projectId || '' }).then((output) => {
      setItems(output.items);
      setIsLoading(false);
    });
  }, []);

  const addItem = async (input: { description: string; categoryId: string }) => {
    const gateway = new FetchProjectGateway();
    return new CreateItem(gateway).execute({ ...input, projectId: projectId || '' });
  };

  const addOrder = async (input: { itemId: string; quantity: number; price: number; vendorId: string; purchasedAt?: string }) => {
    const gateway = new FetchProjectGateway();
    return new AddOrderToItem(gateway).execute(input);
  };

  return { items, isLoading, addItem, addOrder };
}
