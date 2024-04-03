import cx from 'clsx';

import { useState, useEffect } from 'react';

import { Table, ScrollArea, Modal, Group, Button, Input, Badge, Avatar, Text } from '@mantine/core';

import classes from './CifradosGrupos.module.css';

import { IconPlus } from '@tabler/icons-react';

import { useDisclosure } from '@mantine/hooks';




const data = [
    {
        name: 'Athena Weissnat',
        company: 'Little - Rippin',
        email: 'Elouise.Prohaska@yahoo.com',
    },
    {
        name: 'Deangelo Runolfsson',
        company: 'Greenfelder - Krajcik',
        email: 'Kadin_Trantow87@yahoo.com',
    }
];

export function CifradosGrupos({ usuarioActual }) {

    const [scrolled, setScrolled] = useState(false);


    // Variables que controlan la creacion de un nuevo grupo

    // Controla si el modal de nuevo grupo está abierto o cerrado

    const [newGroupModalOpened, { close: closeNewGroupModal, toggle: toggleNewGroupModal }] = useDisclosure();

    // Controla el nombre del nuevo grupo

    const [newGroupName, setNewGroupName] = useState('');

    // Controla la contraseña del nuevo grupo

    const [newGroupPassword, setNewGroupPassword] = useState('');

    // Retraemos todos los posibles usuarios que pueden agregar al grupo

    const [posiblesUsuariosAgregar, setPosiblesUsuariosAgregar] = useState([]);

    // Tenemos una lista de todos los usuarios que la persona quiere agregar al grupo

    const [usuariosAgregar, setUsuariosAgregar] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:3000/users/`)
            .then((response) => response.json())
            .then((data) => {
                // Transforma los datos si es necesario antes de establecer el estado
                const formattedData = data.map(user => ({
                    ...user,
                    avatar: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-9.png', // Imagen predeterminada
                    role: 'Estudiante', // Ejemplo de cómo asignar roles, ajusta según necesidad
                    memberSince: user.date_created, // Asume que quieres mostrar la fecha de creación como última actividad
                    active: true, // Decide cómo determinar si el usuario está activo
                }));

                console.log('Usuarios retraidos:', formattedData);

                setPosiblesUsuariosAgregar(formattedData);

                // Agregamos el usuario actual a la lista de usuarios a agregar

                setUsuariosAgregar([usuarioActual]);

                // Lo quitamos de la lista de posibles usuarios a agregar

                setPosiblesUsuariosAgregar(posiblesUsuariosAgregar.filter((item) => item.username !== usuarioActual));

                console.log('Usuarios a agregar:', usuariosAgregar);
            })
            .catch((error) => {
                console.error('Error al obtener los chats del usuario actual:', error);
            });
    }, [usuarioActual]); // Asegúrate de incluir las dependencias correctas aquí

    const rowsUsuariosParaAgregar = posiblesUsuariosAgregar.map((item) => (
        <Table.Tr key={item._id}>
            <Table.Td>
                <Group gap="sm">
                    <Avatar size={40} src={item.avatar} radius={40} />
                    <div>
                        <Text size="sm" weight={500}>
                            {item.username}
                        </Text>
                    </div>
                </Group>
            </Table.Td>

            <Table.Td>

                <Badge
                    fullWidth variant="light"
                    onClick={() => {
                        console.log('Agregando usuario:', item.username);
                        // setUsuariosAgregar([...usuariosAgregar, item]);
                        // Agregamos solamente el nombre de usuario
                        setUsuariosAgregar([...usuariosAgregar, item.username]);
                    }}
                    style={{ cursor: 'pointer' }}
                >
                    Agregar
                </Badge>

            </Table.Td>
        </Table.Tr>
    ));



    const rowsGrupos = data.map((row) => (
        <Table.Tr key={row.name}>
            <Table.Td>{row.name}</Table.Td>
            <Table.Td>{row.email}</Table.Td>
            <Table.Td>{row.company}</Table.Td>
        </Table.Tr>
    ));

    function handleNewGroupClick() {

        toggleNewGroupModal();

    }

    function handleNewGroupSubmit() {
        console.log('*Creando nuevo grupo:', newGroupName);
        console.log('*Con contraseña:', newGroupPassword);
        console.log('*Con los siguientes usuarios:', usuariosAgregar);

        closeNewGroupModal();
    }

    return (

        <div>

            <Modal opened={newGroupModalOpened} onClose={closeNewGroupModal} size="auto" title={`Creando nuevo grupo`} >

                <Input
                    value={newGroupName}
                    onChange={(event) => setNewGroupName(event.currentTarget.value)}
                    placeholder="Nombre del grupo"
                />

                <Input
                    value={newGroupPassword}
                    onChange={(event) => setNewGroupPassword(event.currentTarget.value)}
                    placeholder="Contraseña del grupo"
                />

                <div>

                    <ScrollArea h={300} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
                        <Table miw={700}>
                            <Table.Thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
                                <Table.Tr>
                                    <Table.Th>Name</Table.Th>
                                    <Table.Th>Agregar</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>{rowsUsuariosParaAgregar}</Table.Tbody>
                        </Table>
                    </ScrollArea>


                </div>

                <Button onClick={handleNewGroupSubmit}>Crear grupo</Button>


            </Modal>



            <Button
                rightSection={<IconPlus size={14} />}
                onClick={handleNewGroupClick}
            >Nuevo grupo</Button>

        </div>


    );
}