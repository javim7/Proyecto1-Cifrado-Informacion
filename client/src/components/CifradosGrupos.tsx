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





    // Aqui controlamos todo lo que sucede al cargar el componente, que es retraer todos los grupos a los que pertenece el usuario actual etc

    const [gruposEnLosQueSePresenta, setGruposEnLosQueSePresenta] = useState([]);

    useEffect(() => {

        console.log(' [ 1 ] Cargando grupos en los que se presenta:', usuarioActual);

        // Aqui retraemos todos los grupos en los que se presenta el usuario actual haciendo fetch a http://localhost:3500/groups/get_all_groups_by_user/:username

        fetch(`http://localhost:3500/groups/get_all_groups_by_user/${usuarioActual}`)
            .then(res => res.json())
            .then(data => {
                console.log(' [ 2 ] Grupos en los que se presenta:', data);
                setGruposEnLosQueSePresenta(data);
            });

    }, [usuarioActual]);

    const rowsGruposActuales = gruposEnLosQueSePresenta.map((grupo) => (
        <Table.Tr key={grupo._id}>
            <Table.Td>
                <Group gap="sm">
                    <div>
                        <Text size="sm" weight={500}>
                            {grupo.nombre}
                        </Text>

                    </div>
                </Group>
            </Table.Td>

            <Table.Td>
                {grupo.clave_simetrica}
            </Table.Td>

            <Table.Td>
                {grupo.vector}
            </Table.Td>

            <Table.Td>
                {grupo.contraseña}
            </Table.Td>
            <Table.Td>{new Date(grupo.fecha_creacion).toLocaleDateString()}</Table.Td>

            <Table.Td>
                {grupo.usuarios.map(usuario => (
                    <Text key={usuario._id} size="sm">{usuario.username}</Text>
                ))}
            </Table.Td>
            <Table.Td>
                <div
                    style={{ display: 'flex', gap: 10, flexDirection: 'column' }}
                >
                    <Badge color="green" fullWidth variant="light"
                        onClick={() => { handleOpenGroupChat(); setCurrentlyOpenedGroup(grupo); }}
                    >
                        Abrir
                    </Badge>
                    <Badge color="red" fullWidth variant="light">
                        Eliminar
                    </Badge>
                </div>
            </Table.Td>
        </Table.Tr>
    ));



    // Controla si el modal de nuevo grupo está abierto o cerrado

    const [openedGroupChat, { close: closeOpenedGroupChat, toggle: toggleOpenedGroupChat }] = useDisclosure();

    const [currentlyOpenedGroup, setCurrentlyOpenedGroup] = useState({});

    // Aqui controlamos todo lo que sucede cuando se Abre un chat grupal

    function handleOpenGroupChat() {

        toggleOpenedGroupChat();

    }















    function handleNewGroupClick() {

        toggleNewGroupModal();

    }

    function handleNewGroupSubmit() {
        console.log(' [ 1 ] Creando nuevo grupo:', newGroupName);
        console.log(' [ 2 ] Con contraseña:', newGroupPassword);
        console.log(' [ 3 ] Con los siguientes usuarios:', usuariosAgregar);

        closeNewGroupModal();
    }

    return (

        <div>




            <Modal opened={newGroupModalOpened} onClose={closeNewGroupModal} size="auto" title={`Creando nuevo grupo`} overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}>

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



            <Modal opened={openedGroupChat} onClose={closeOpenedGroupChat} size="auto" title={`Chat grupal`} overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}>

                <div>
                    {currentlyOpenedGroup.nombre}
                </div>

            </Modal>








            <div className={classes.contenedorPrincipal}>

                {gruposEnLosQueSePresenta.length > 0 ? (
                    <div className={classes.contenedorTabla}>
                        <Table>
                            <Table.Thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
                                <Table.Tr>
                                    <Table.Th>Nombre</Table.Th>
                                    <Table.Th>Clave simétrica</Table.Th>
                                    <Table.Th>Vector</Table.Th>
                                    <Table.Th>Contraseña</Table.Th>
                                    <Table.Th>Fecha de creación</Table.Th>
                                    <Table.Th>Integrantes</Table.Th>
                                    <Table.Th>Acciones</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>{rowsGruposActuales}</Table.Tbody>
                        </Table>
                    </div>
                ) : (
                    <Text>No perteneces a ningún grupo actualmente.</Text>
                )}


                <Button
                    rightSection={<IconPlus size={14} />}
                    onClick={handleNewGroupClick}
                >Nuevo grupo</Button>

            </div>

        </div>


    );
}