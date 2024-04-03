import { Avatar, Badge, Table, Group, Text, Select } from '@mantine/core';

import { Modal } from '@mantine/core';

import { useState, useEffect, } from 'react';

import { useDisclosure } from '@mantine/hooks';

import { TextInput, TextInputProps, ActionIcon, useMantineTheme, rem } from '@mantine/core';
import { IconSearch, IconArrowRight } from '@tabler/icons-react';

import { ScrollArea } from '@mantine/core';

import classes from './CifradosChats.module.css';

import JSEncrypt from "jsencrypt";


export function CifradosChats({ usuarioActual }) {

    const [usuariosConChats, setUsuariosConChats] = useState([]);

    const [opened, { close, open }] = useDisclosure(false);

    const [chatDestino, setChatDestino] = useState('');

    const [todos_los_chats_con_usuario, setTodosLosChatsConUsuario] = useState([])

    const [mensajeEscrito, setMensajeEscrito] = useState('')

    function handleSendMessage() {

        console.log('[ 1 ] Enviando mensaje:', mensajeEscrito);

        // [ 2 ] Recuperar la clave pública del usuario destino
        fetch(`http://localhost:3000/keys/public_key/${chatDestino}`)
            .then((response) => response.json())
            .then((data) => {
                console.log('[ 2 ] Clave pública del usuario destino:', data);

                // [ 4 ] Convertir la clave pública de Base64 a un formato que JSEncrypt pueda utilizar
                let publicKey = atob(data); // Utiliza atob para decodificar de Base64
                console.log('[ 3 ] Clave pública decodificada:', publicKey);

                // [ 6 ] Inicializar JSEncrypt con la clave pública decodificada
                let crypt = new JSEncrypt({ default_key_size: "512" });
                crypt.setPublicKey(publicKey);

                // [ 7 ] Cifrar el mensaje con la clave pública
                let mensajeCifrado = crypt.encrypt(mensajeEscrito);
                console.log('[ 4 ] Mensaje cifrado:', mensajeCifrado);

                // Aquí iría el código para enviar el mensaje cifrado al servidor o al usuario destino
                // Por ejemplo: enviarMensajeCifrado(mensajeCifrado);

                fetch(`http://localhost:3000/messages/${chatDestino}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        message: mensajeCifrado,
                        username_origen: usuarioActual
                    })
                })
                    .then((response) => response.json())
                    .then((data) => {
                        console.log('Mensaje enviado:', data);
                        setTodosLosChatsConUsuario([...todos_los_chats_con_usuario, data]);
                    })
                    .catch((error) => {
                        console.error('Error al enviar el mensaje:', error);
                    });

                setMensajeEscrito('')
            })
            .catch((error) => {
                console.error('[ 5 ] Error al recuperar la clave pública:', error);
            });




    }

    function handleChatOpen(username_chat_destino: any) {

        console.log('Abriendo chat con:', username_chat_destino);

        setChatDestino(username_chat_destino);

        open();

        // Tenemos que poblar todos_los_chats_con_usuario haciendo un fetch hacia http://localhost:3000/messages/users/:usuarioActual/:username_chat_destino

        fetch(`http://localhost:3000/messages/users/${usuarioActual}/${username_chat_destino}`)
            .then((response) => response.json())
            .then((data) => {
                console.log('Chats con el usuario actual:', data);

                // Descifrar todos los mensajes con la clave privada del usuario actual desde la ruta http://localhost:3000/keys/private_key/:usuarioActual

                fetch(`http://localhost:3000/keys/private_key/${usuarioActual}`)
                    .then((response) => response.json())
                    .then((data2) => {
                        console.log('Clave privada del usuario actual:', data);

                        // Convertir la clave privada de Base64 a un formato que JSEncrypt pueda utilizar
                        let privateKey = atob(data2); // Utiliza atob para decodificar de Base64
                        console.log('Clave privada decodificada:', privateKey);

                        // Inicializar JSEncrypt con la clave privada decodificada
                        let crypt = new JSEncrypt({ default_key_size: "512" });
                        crypt.setPrivateKey(privateKey);

                        // Mejor intentamos 1 por 1 debido a que ciertos mensajes pueden dar error o estar corruptos al ser descifrados

                        let mensajesDescifrados = [];

                        for (let i = 0; i < data.length; i++) {
                            try {

                                console.log(" * Tratando de descifrar el mensaje:", data[i].message)

                                let mensajeDescifrado = crypt.decrypt(data[i].message);

                                console.log(' * Mensaje descifrado:', mensajeDescifrado);

                                if (mensajeDescifrado === null || mensajeDescifrado === undefined) {

                                    mensajesDescifrados.push({ ...data[i], message: 'ERROR CON: ' + data[i].message });

                                } else {

                                    mensajesDescifrados.push({ ...data[i], message: mensajeDescifrado });

                                }

                            } catch (error) {
                                console.error('Error al descifrar el mensaje:', error);
                            }
                        }

                        console.log('Mensajes descifrados:', mensajesDescifrados);

                        setTodosLosChatsConUsuario(mensajesDescifrados);
                    })
                    .catch((error) => {
                        console.error('Error al obtener la clave privada:', error);
                    });
            })
            .catch((error) => {
                console.error('Error al obtener los chats del usuario actual:', error);
            });

    }

    useEffect(() => {
        fetch(`http://localhost:3000/messages/all_chats/${usuarioActual}`)
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
                setUsuariosConChats(formattedData);
            })
            .catch((error) => {
                console.error('Error al obtener los chats del usuario actual:', error);
            });
    }, [usuarioActual]); // Asegúrate de incluir las dependencias correctas aquí

    const rows = usuariosConChats.map((item) => (
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
                {item.role}
            </Table.Td>
            <Table.Td>{new Date(item.memberSince).toLocaleDateString()}</Table.Td>
            <Table.Td>
                {item.active ? (
                    <Badge
                        fullWidth variant="light"
                        onClick={() => handleChatOpen(item.username)}
                        style={{ cursor: 'pointer' }}
                    >
                        Abrir
                    </Badge>
                ) : (
                    <Badge color="gray" fullWidth variant="light">
                        Disabled
                    </Badge>
                )}
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <div className={classes.contenedorGeneral}>
            <Modal opened={opened} onClose={close} size="auto" title={`Chat con ${chatDestino}`} >
                <div className={classes.contenedorModal}>
                    <div>Contenido del chat con {chatDestino}</div>
                    <div>
                        <ScrollArea h={600} offsetScrollbars scrollbarSize={2} className={classes.scrollAreaChats}>
                            {todos_los_chats_con_usuario.map((chat: any) => (
                                <div key={chat._id}
                                    className={chat.username_origen === usuarioActual ? classes.mensajePropio : classes.mensajeExterno}
                                >
                                    <Text>{chat.message}</Text>
                                    <Text c="dimmed" size="xs">{chat.createdAt}</Text>
                                </div>
                            ))}
                        </ScrollArea>
                    </div>
                    <TextInput
                        radius="xl"
                        size="md"
                        placeholder="Mensaje"
                        rightSectionWidth={42}
                        rightSection={
                            <ActionIcon
                                size={32}
                                radius="xl"
                                variant="filled"
                                onClick={handleSendMessage}
                            >
                                <IconArrowRight style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
                            </ActionIcon>
                        }
                        onChange={(event) => setMensajeEscrito(event.currentTarget.value)}
                        value={mensajeEscrito}
                    />
                </div>
            </Modal>
            <div
                className={classes.contenedorTabla}
            >
                <Table.ScrollContainer minWidth={800}>
                    <Table verticalSpacing="sm">
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Usuario</Table.Th>
                                <Table.Th>Profesion</Table.Th>
                                <Table.Th>Miembro desde</Table.Th>
                                <Table.Th>Chats</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{rows}</Table.Tbody>
                    </Table>
                </Table.ScrollContainer>
            </div>
        </div>
    );
}
