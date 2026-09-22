import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ListProjectItems } from '../../../features/projects/application/ListProjectItems';
import { FetchProjectGateway } from '../../../features/projects/gateway/FetchProjectGateway';

export function useProjectItemList() {
  const { projectId } = useParams<{ projectId: string }>();
  const [items, setItems] = useState<{ id: string; nome: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const useCase = new ListProjectItems(new FetchProjectGateway());
    useCase.execute({ projectId: projectId || '' }).then((output) => {
      setItems(output.items);
      setIsLoading(false);
    });
  }, []);

  return { items, isLoading };
}
