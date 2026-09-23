import { useState } from 'react';
import styles from './ProjectItemList.module.css';
import { useProjectItemList } from './useProjectItemList';
import { useProjectVendors } from './useProjectVendors';
import { ProjectItemTable } from '../../organisms/ProjectItemTable/ProjectItemTable';
import { VendorTable } from '../../organisms/VendorTable/VendorTable';
import { Tabs } from '../../molecules/Tabs/Tabs';

export function ProjectItemList() {
  const [activeTab, setActiveTab] = useState('itens');
  const { items, isLoading, addItem, addOrder } = useProjectItemList();
  const { vendors, isLoading: isVendorsLoading, addVendor } = useProjectVendors();

  if (isLoading || isVendorsLoading) return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.section}>
          <p>Carregando...</p>
        </div>
      </main>
    </div>
  );

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.section}>
          <header className={styles.header}>
            <div className={styles.headerLeft}>
              <span className={styles.eyebrow}>PROJETO</span>
              <h1 className={styles.title}>Projeto</h1>
            </div>
          </header>

          <Tabs
            tabs={[
              { id: 'itens', label: 'Itens' },
              { id: 'fornecedores', label: 'Fornecedores' },
            ]}
            active={activeTab}
            onChange={setActiveTab}
          />

          {activeTab === 'itens' && <ProjectItemTable items={items} vendors={vendors} onAdd={addItem} onAddOrder={addOrder} />}
          {activeTab === 'fornecedores' && <VendorTable vendors={vendors} onAdd={addVendor} />}
        </div>
      </main>
    </div>
  );
}
