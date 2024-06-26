import cx from 'clsx';

import { useState, useEffect } from 'react';

import { Table, ScrollArea, Modal, Group, Button, Input, Badge, Avatar, Text, TextInput, ActionIcon, rem } from '@mantine/core';

import classes from './CifradosGrupos.module.css';

import { IconPlus } from '@tabler/icons-react';

import { useDisclosure } from '@mantine/hooks';

import { IconSearch, IconArrowRight } from '@tabler/icons-react';





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
                    <Badge color="red" fullWidth variant="light"
                        onClick={() => { toggleDeleteGroupModal(); setCurrentlyGroupWantingToDelete(grupo.nombre); }}
                    >
                        Eliminar
                    </Badge>
                </div>
            </Table.Td>
        </Table.Tr>
    ));



    // Controla si el modal de nuevo grupo está abierto o cerrado

    const [openedGroupChat, { close: closeOpenedGroupChat, toggle: toggleOpenedGroupChat }] = useDisclosure();

    const [currentlyOpenedGroup, setCurrentlyOpenedGroup] = useState({});

    // Controlamos todos los mensajes del grupo abierto actualmente

    const [mensajesRetraidosGrupoActual, setMensajesRetraidosGrupoActual] = useState([]);

    const [mensajeEscrito, setMensajeEscrito] = useState('')

    // Hacemos un fetch a http://localhost:3500/groups/get_group_by_name/:nombre_grupo para obtener el id del grupo, luego de
    // obtener el id del grupo, hacemos otro fetch a http://localhost:3500/groups/get_all_messages_by_group/ con body {"valid_group_id": id_del_grupo_obtenido_previamente}
    // para obtener todos los mensajes del grupo y guardarlos en mensajesRetraidosGrupoActual
    // todo esto se tiene que hacer cuando handleOpenGroupChat


    // Aqui controlamos todo lo que sucede cuando se Abre un chat grupal

    function handleOpenGroupChat() {

        toggleOpenedGroupChat();

        console.log(' [ 1 ] Abriendo chat grupal:', currentlyOpenedGroup);

        // Aqui retraemos todos los mensajes del grupo actual

        fetch(`http://localhost:3500/groups/get_group_by_name/${currentlyOpenedGroup.nombre}`)
            .then(res => res.json())
            .then(data => {
                console.log(' [ 2 ] Grupo actual:', data);

                fetch('http://localhost:3500/groups/get_all_messages_by_group/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ valid_group_id: currentlyOpenedGroup._id.toString() })
                })
                    .then(res => res.json())
                    .then(data => {
                        console.log(' [ 3 ] Mensajes del grupo actual:', data);
                        setMensajesRetraidosGrupoActual(data);
                    });

            });

    }













    function handleNewGroupClick() {

        toggleNewGroupModal();

        // Retraemos y almacenamos en la variable posiblesUsuariosAgregar todos los usuarios 
        // retraemos del endpoint http://localhost:3500/list_all_entries_in_collection/users

        fetch('http://localhost:3500/list_all_entries_in_collection/users')
            .then(res => res.json())
            .then(data => {
                console.log(' [ 2 ] Posibles usuarios para agregar:', data);
                setPosiblesUsuariosAgregar(data);
            });

    }

    function handleNewGroupSubmit() {
        console.log(' [ 1 ] Creando nuevo grupo:', newGroupName);
        console.log(' [ 2 ] Con contraseña:', newGroupPassword);
        console.log(' [ 3 ] Con los siguientes usuarios:', usuariosAgregar);

        // Enviamos a http://localhost:3500/groups/create_new_group/ para crear un nuevo grupo
        // Body: {
        //     "nombre": "group_name",
        //         "usuarios": ["user1", "user2", "user3"],
        //             "contraseña": "designated password"
        // }

        fetch('http://localhost:3500/groups/create_new_group/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre: newGroupName,
                usuarios: usuariosAgregar,
                contraseña: newGroupPassword
            })
        })
            .then(res => res.json())
            .then(data => {
                console.log(' [ 4 ] Nuevo grupo creado:', data);
            });

        closeNewGroupModal();
    }










    // Aqui se hara la logica para enviar un mensaje a un grupo

    function handleSendMessage() {

        console.log(' [ 1 ] Enviando mensaje:', mensajeEscrito);

        // Aqui se hara el fetch a http://localhost:3500/groups/insert_message_to_group/ con body {
        //  "valid_group_id": "660cdbe924e20fa74a59b785", "autor": "mombius", "mensaje_cifrado": "ojala esto se cifre"}

        fetch('http://localhost:3500/groups/insert_message_to_group/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                valid_group_id: currentlyOpenedGroup._id.toString(),
                autor: usuarioActual,
                mensaje_cifrado: mensajeEscrito
            })
        })
            .then(res => res.json())
            .then(data => {
                console.log(' [ 2 ] Mensaje enviado:', data);
                setMensajeEscrito('');
            });

    }





    // TODA LA LOGICA PARA ELIMINAR UN GRUPO --------------------------------------------

    const [deleteGroupModal, { close: closeDeleteGroupModal, toggle: toggleDeleteGroupModal }] = useDisclosure();

    const [currentlyGroupWantingToDelete, setCurrentlyGroupWantingToDelete] = useState("");

    const [contrasenaIngresadaParaEliminarGrupo, setContrasenaIngresadaParaEliminarGrupo] = useState('');

    function handleDeleteGroup() {

        console.log(' [ 1 ] Eliminando grupo:', currentlyGroupWantingToDelete);

        // Aqui se hara el fetch a http://localhost:3500/groups/delete_group/ con body {
        //  "nombre": "group_name", "contraseña": "designated password"}

        fetch('http://localhost:3500/groups/delete_group_by_name/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre: currentlyGroupWantingToDelete,
                contraseña: contrasenaIngresadaParaEliminarGrupo
            })
        })
            .then(res => res.json())
            .then(data => {
                console.log(' [ 2 ] Grupo eliminado:', data);
                alert("Repuesta del servidor: " + data.error || "Grupo eliminado correctamente.");
            });

        closeDeleteGroupModal();
    }

    return (

        <div>

            <Modal opened={deleteGroupModal} onClose={closeDeleteGroupModal} size="auto" title={`Eliminando grupo ${currentlyGroupWantingToDelete}`}
                overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 3,
                }}>

                <Input
                    value={contrasenaIngresadaParaEliminarGrupo}
                    onChange={(event) => setContrasenaIngresadaParaEliminarGrupo(event.currentTarget.value)}
                    placeholder="Contraseña para eliminar el grupo"
                />


                <Button
                    onClick={
                        handleDeleteGroup
                    }
                    color='red'
                >Eliminar grupo</Button>


            </Modal>

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



            <Modal
                opened={openedGroupChat}
                transitionProps={{ transition: 'fade', duration: 400, timingFunction: 'linear' }}
                onClose={closeOpenedGroupChat}
                size="auto"
                overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 3,
                }}
                withCloseButton={false}
            >

                <div>
                    {currentlyOpenedGroup.nombre}
                </div>

                <div>
                    <ScrollArea h={600} offsetScrollbars scrollbarSize={2} className={classes.scrollAreaChats}>
                        {mensajesRetraidosGrupoActual.map((chat: any) => (
                            <div key={chat._id}
                                className={chat.autor === usuarioActual ? classes.mensajePropio : classes.mensajeExterno}
                            >
                                <Text c="dimmed" size="xs">{chat.autor === usuarioActual ? 'Tu' : chat.autor}</Text>
                                <Text>{chat.mensaje_descifrado}</Text>
                                <Text c="dimmed" size="xs">{chat.mensaje}</Text>
                                <Text c="dimmed" size="xs">{chat.fecha_envio}</Text>
                            </div>
                        ))}
                    </ScrollArea>
                    <TextInput
                        radius="xl"
                        size="md"
                        placeholder="Mensaje para el grupo"
                        rightSectionWidth={42}
                        rightSection={
                            <ActionIcon
                                size={32}
                                radius="xl"
                                variant="filled"
                                onClick={() => { handleSendMessage(); }}
                            >
                                <IconArrowRight style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
                            </ActionIcon>
                        }
                        onChange={(event) => setMensajeEscrito(event.currentTarget.value)}
                        value={mensajeEscrito}
                    />
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
                    color='green'
                >Nuevo grupo</Button>

            </div>

        </div>


    );
}