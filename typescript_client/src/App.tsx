// App.tsx
import { MantineProvider } from '@mantine/core';
import { useState } from 'react';



import '@mantine/core/styles.css';





import CifradosNavbar from "./components/CifradosNavbar";
import { CifradosGrupos } from "./components/CifradosGrupos";




function App() {

  const [activeTab, setActiveTab] = useState('Chats');

  // Función para cambiar el tab activo
  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName);
  };

  // Renderiza el contenido según el tab activo
  const renderContent = () => {
    switch (activeTab) {
      case 'Chats':
        return <div>Contenido de Chats</div>;
      case 'Grupos':
        return <CifradosGrupos />;
      case 'Usuarios':
        return <div>Contenido de Usuarios</div>;
      case 'Llaves':
        return <div>Contenido de Llaves</div>;
      case 'Base de datos':
        return <div>Contenido de Base de datos</div>;
      case 'Configuracion':
        return <div>Contenido de Configuracion</div>;
      default:
        return <div>Contenido de la aplicación</div>;
    }
  };

  return (
    <MantineProvider>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          minHeight: '100vh',
          overflowY: 'hidden',
          overflowX: 'hidden',
        }}
      >
        <CifradosNavbar onTabChange={handleTabChange} />
        {renderContent()}
      </div>
    </MantineProvider>
  );
}

export default App;
