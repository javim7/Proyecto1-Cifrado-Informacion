import { useState } from 'react';
import { Group, Code } from '@mantine/core';
import {
    IconMessages,
    IconUsersGroup,
    IconKey,
    IconSettings,
    IconDatabaseImport,
    IconUsers,
    IconSwitchHorizontal,
    IconLogout,
} from '@tabler/icons-react';
import classes from './CifradosNavbar.module.css';

const data = [
    { link: '', label: 'Chats', icon: IconMessages },
    { link: '', label: 'Grupos', icon: IconUsersGroup },
    { link: '', label: 'Usuarios', icon: IconUsers },
    { link: '', label: 'Llaves', icon: IconKey },
    { link: '', label: 'Base de datos', icon: IconDatabaseImport },
    { link: '', label: 'Configuracion', icon: IconSettings },
];

export default function CifradosNavbar({ onTabChange }: { onTabChange: (tabName: string) => void; }) {
    const [active, setActive] = useState('');

    const links = data.map((item) => (
        <a
            className={classes.link}
            data-active={item.label === active || undefined}
            href={item.link}
            key={item.label}
            onClick={(event) => {
                event.preventDefault();
                setActive(item.label);
                onTabChange(item.label); // Llama a la función pasada como prop
            }}
        >
            <item.icon className={classes.linkIcon} stroke={1.5} />
            <span>{item.label}</span>
        </a>
    ));

    return (
        <nav className={classes.navbar}>
            <div className={classes.navbarMain}>
                <Group className={classes.header} justify="space-between">
                    <div className='grupo_logo_descripcion'>
                        <Code fw={700} className={classes.version}>
                            Grupo 3
                        </Code>
                    </div>
                </Group>
                {links}
            </div>

            <div className={classes.footer}>
                <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
                    <IconSwitchHorizontal className={classes.linkIcon} stroke={1.5} />
                    <span>Cambiar cuenta</span>
                </a>

                <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
                    <IconLogout className={classes.linkIcon} stroke={1.5} />
                    <span>Cerrar sesión</span>
                </a>
            </div>
        </nav>
    );
}