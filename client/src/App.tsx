// App.tsx
import { MantineProvider } from '@mantine/core';
import { useState, useEffect } from 'react';



import '@mantine/core/styles.css';





import CifradosNavbar from "./components/CifradosNavbar";
import { CifradosGrupos } from "./components/CifradosGrupos";
import { Usuarios } from "./components/Usuarios";
import { CifradosSignIn } from "./components/SignIn"
import { CifradosChats } from "./components/CifradosChats";
import { CifradosLLaves } from "./components/CifradosLlaves";




function App() {

  const [activeTab, setActiveTab] = useState('Chats');

  const [usuario_actual, setUsuarioActual] = useState('');

  // Función para cambiar el tab activo
  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName);
  };

  // Renderiza el contenido según el tab activo
  const renderContent = () => {
    switch (activeTab) {
      case 'Chats':
        return <CifradosChats usuarioActual={usuario_actual} />;
      case 'Grupos':
        return <CifradosGrupos usuarioActual={usuario_actual} />;
      case 'Usuarios':
        return <Usuarios />;
      case 'Llaves':
        return <CifradosLLaves usuarioActual={usuario_actual} />;
      case 'Base de datos':
        return <div>Contenido de Base de datos</div>;
      case 'Configuracion':
        return <div>Contenido de Configuracion</div>;
      default:
        return <div>Contenido de la aplicación</div>;
    }
  };

  useEffect(() => {
    console.log('Ha cambiado el usuario actual:', usuario_actual);
  }, [usuario_actual]);


  return (
    <MantineProvider>
      <div>
        {usuario_actual === '' ? <CifradosSignIn setUsuarioActual={setUsuarioActual} /> :
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              minHeight: '100vh',
              overflowY: 'hidden',
              overflowX: 'hidden',
            }}
          >
            <CifradosNavbar onTabChange={handleTabChange} setUsuarioActual={setUsuarioActual} usuarioActual={usuario_actual} />
            {renderContent()}
          </div>
        }
      </div>
    </MantineProvider>
  );
}

export default App;
