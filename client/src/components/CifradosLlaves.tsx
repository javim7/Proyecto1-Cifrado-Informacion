import { Paper, Text, ThemeIcon, rem } from '@mantine/core';
import { IconLockX, IconLockCheck } from '@tabler/icons-react';
import classes from './CifradosLlaves.module.css';
import { Code } from '@mantine/core';

import { ScrollArea, Button } from '@mantine/core';

import { useState, useEffect } from 'react';

import JSEncrypt from "jsencrypt";

export function CifradosLLaves({ usuarioActual }: { usuarioActual: string }) {

    const [llavePublica, setLlavePublica] = useState('');
    const [llavePrivada, setLlavePrivada] = useState('');

    useEffect(() => {
        console.log('Retrayendo llaves para el usuario:', usuarioActual);

        // Hacemos un fetch hacia: http://localhost:3000/keys/key_pair/:usuario

        fetch(`http://localhost:3000/keys/key_pair/${usuarioActual}`)
            .then(response => response.json())
            .then(data => {
                console.log('Llaves obtenidas:', data);
                setLlavePublica(data.llave_publica);
                setLlavePrivada(data.llave_privada);
            })
            .catch(error => {
                console.error('Error al obtener las llaves:', error);
            });

    }, []);

    return (
        <div
            style={
                {
                    display: 'flex',
                    flexDirection: 'row',
                }
            }
        >
            <div className={classes.Contenedor}>
                <Paper withBorder radius="md" className={classes.card1}>
                    <ThemeIcon
                        size="xl"
                        radius="md"
                        variant="gradient"
                        gradient={{ deg: 0, from: 'blue', to: 'green' }}
                    >
                        <IconLockCheck style={{ width: rem(28), height: rem(28) }} stroke={1.5} />
                    </ThemeIcon>
                    <Text size="xl" fw={500} mt="md">
                        Mi llave pública
                    </Text>
                    <Text size="sm" mt="sm" c="dimmed">
                        Mi llave pública sirve para que otros cifren mensajes destinados a mí, como si depositaran cartas en un buzón seguro al que solo yo tengo la llave.
                    </Text>
                    <Button
                        color="red"

                        style={{ marginTop: '30px', marginBottom: "30px" }}

                        onClick={
                            () => {
                                console.log('Generando nuevo par de llaves');
                                let crypt = new JSEncrypt({ default_key_size: "512" });

                                let privateKey = crypt.getPrivateKey();
                                let publicKey = crypt.getPublicKey();

                                console.log('Public Key:', publicKey);
                                console.log('Private Key:', privateKey);

                                // Encode the keys in base64
                                let base64PublicKey: string = btoa(publicKey);
                                let base64PrivateKey: string = btoa(privateKey);

                                console.log('Base64 Public Key:', base64PublicKey);
                                console.log('Base64 Private Key:', base64PrivateKey);

                                // Hacemos PUT fetch a http://localhost:3500/users/update_user_private_and_public
                                // Body: {
                                //     "username": "username"
                                //                 "base64_public_key": "public_key"
                                //                 "base64_private_key": "private_key"
                                // }

                                fetch('http://localhost:3500/users/update_user_private_and_public_key/', {
                                    method: 'PUT',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        "username": usuarioActual,
                                        "base64_public_key": base64PublicKey,
                                        "base64_private_key": base64PrivateKey
                                    })
                                })
                                    .then(response => response.json())
                                    .then(data => {
                                        console.log('Llaves actualizadas:', data);
                                        setLlavePublica(base64PublicKey);
                                        setLlavePrivada(base64PrivateKey);
                                    })
                                    .catch(error => {
                                        console.error('Error al actualizar las llaves:', error);
                                    });
                            }
                        }
                    >
                        Nuevo par de llaves
                    </Button>
                    <Code
                        style={{ wordWrap: 'break-word' }}
                    >
                        {llavePublica}
                    </Code>

                </Paper>
                <Paper withBorder radius="md" className={classes.card2}>
                    <ThemeIcon
                        size="xl"
                        radius="md"
                        variant="gradient"
                        gradient={{ deg: 0, from: 'pink', to: 'orange' }}
                    >
                        <IconLockX style={{ width: rem(28), height: rem(28) }} stroke={1.5} />
                    </ThemeIcon>
                    <Text size="xl" fw={500} mt="md">
                        Mi llave privada
                    </Text>
                    <Text size="sm" mt="sm" c="dimmed">
                        Mi llave privada sirve para descifrar esos mensajes, y por eso es importante no compartirla, ya que sería como darle a alguien acceso a mi buzón personal.
                    </Text>
                    <Code
                        style={{ wordWrap: 'break-word' }}
                    >
                        {llavePrivada}
                    </Code>
                </Paper>
            </div>

            Hola

        </div>
    );
}