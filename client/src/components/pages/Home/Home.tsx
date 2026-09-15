import styles from './Home.module.css';
import { Navbar } from '../../organisms/Navbar';
import { Card, CardHeader, CardBody } from '../../atoms/Card';
import { Button } from '../../atoms/Button';
import { useHomePage } from './useHomePage';

export function Home() {
  const { data, isLoading, error } = useHomePage();

  if (isLoading) {
    return (
      <div className={styles.page}>
        <Navbar brand="Constructor Manager" links={[
          { label: 'Obras', href: '/obras' },
          { label: 'Compras', href: '/compras' },
          { label: 'Gastos', href: '/gastos' },
          { label: 'Fornecedores', href: '/fornecedores' },
          { label: 'Relatórios', href: '/relatorios' },
        ]} />
        <main className={styles.main}>
          <div className={styles.loading}>Carregando...</div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <Navbar brand="Constructor Manager" links={[
          { label: 'Obras', href: '/obras' },
          { label: 'Compras', href: '/compras' },
          { label: 'Gastos', href: '/gastos' },
          { label: 'Fornecedores', href: '/fornecedores' },
          { label: 'Relatórios', href: '/relatorios' },
        ]} />
        <main className={styles.main}>
          <div className={styles.error}>{error}</div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Navbar 
        brand="Constructor Manager" 
        links={[
          { label: 'Obras', href: '/obras' },
          { label: 'Compras', href: '/compras' },
          { label: 'Gastos', href: '/gastos' },
          { label: 'Fornecedores', href: '/fornecedores' },
          { label: 'Relatórios', href: '/relatorios' },
        ]}
        user={{ name: 'João Silva' }}
        onLogout={() => console.log('Logout')}
      />
      
      <main className={styles.main}>
        <section className={styles.hero}>
          <div>
            <h1 className={styles.title}>Bem-vindo ao Constructor Manager</h1>
            <p className={styles.subtitle}>
              Gerencie suas obras, controle gastos e compras em um só lugar.
            </p>
          </div>
          <div className={styles.heroActions}>
            <Button variant="primary" size="lg">Nova Obra</Button>
            <Button variant="outline" size="lg">Nova Compra</Button>
          </div>
        </section>

        <section className={styles.statsSection} aria-label="Estatísticas principais">
          {data?.stats.map((stat, index) => (
            <Card key={index} className={styles.statCard} padding="lg">
              <div className={styles.statContent}>
                <div className={styles.statIcon}>{stat.icon}</div>
                <div>
                  <p className={styles.statLabel}>{stat.label}</p>
                  <p className={styles.statValue}>{stat.value}</p>
                  {stat.trend && (
                    <span className={`${styles.statTrend} ${stat.trend.isPositive ? styles.positive : styles.negative}`}>
                      {stat.trend.value}
                    </span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </section>

        <section className={styles.activitySection} aria-label="Atividade recente">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Atividade Recente</h2>
            <Button variant="outline" size="sm">Ver tudo</Button>
          </div>
          
          <Card padding="none" className={styles.activityCard}>
            <CardHeader className={styles.activityHeader}>
              <h3>Últimas movimentações</h3>
            </CardHeader>
            <CardBody className={styles.activityBody}>
              {data?.recentActivity.map((activity) => (
                <div key={activity.id} className={styles.activityItem}>
                  <div className={styles.activityIcon}>
                    {activity.type === 'compra' && '📦'}
                    {activity.type === 'gasto' && '💸'}
                    {activity.type === 'obra' && '🏗️'}
                    {activity.type === 'fornecedor' && '🚚'}
                  </div>
                  <div className={styles.activityInfo}>
                    <p className={styles.activityDescription}>{activity.description}</p>
                    <span className={styles.activityTime}>{activity.timestamp}</span>
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>
        </section>

        <section className={styles.quickActions} aria-label="Ações rápidas">
          <h2 className={styles.sectionTitle}>Ações Rápidas</h2>
          <div className={styles.actionsGrid}>
            <Card className={styles.actionCard} hoverable onClick={() => console.log('Nova obra')}>
              <CardBody>
                <div className={styles.actionIcon}>🏗️</div>
                <h3>Criar Obra</h3>
                <p>Cadastre uma nova obra no sistema</p>
              </CardBody>
            </Card>
            <Card className={styles.actionCard} hoverable onClick={() => console.log('Nova compra')}>
              <CardBody>
                <div className={styles.actionIcon}>📦</div>
                <h3>Registrar Compra</h3>
                <p>Adicione uma nova compra de materiais</p>
              </CardBody>
            </Card>
            <Card className={styles.actionCard} hoverable onClick={() => console.log('Novo gasto')}>
              <CardBody>
                <div className={styles.actionIcon}>💸</div>
                <h3>Lançar Gasto</h3>
                <p>Registre um gasto em uma obra</p>
              </CardBody>
            </Card>
            <Card className={styles.actionCard} hoverable onClick={() => console.log('Novo fornecedor')}>
              <CardBody>
                <div className={styles.actionIcon}>🚚</div>
                <h3>Adicionar Fornecedor</h3>
                <p>Cadastre um novo fornecedor</p>
              </CardBody>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}