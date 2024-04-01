import {
    Paper,
    Title,
    Text,
    TextInput,
    Button,
    Container,
    Group,
    Anchor,
    Center,
    Box,
    rem,
} from '@mantine/core';

import { IconArrowLeft } from '@tabler/icons-react';

import classes from './SignIn.module.css';

import { useState, useEffect } from 'react';

import JSEncrypt from "jsencrypt";

export function CifradosSignIn() {

    const [nombre_usuario, setNombreUsuario] = useState('');

    function handleLogin() {
        console.log(nombre_usuario);

        // Instanciando JSEncrypt con tamaño de clave predeterminado
        let crypt = new JSEncrypt({ default_key_size: "512" });

        // Obteniendo las claves pública y privada
        let privateKey = crypt.getPrivateKey();
        let publicKey = crypt.getPublicKey();

        console.log('Public Key:', publicKey);
        console.log('Private Key:', privateKey);

        // Mensaje a encriptar
        const message = "Hello World";

        // Encriptar el mensaje usando la clave pública
        crypt.setPublicKey(publicKey);
        let encrypted = crypt.encrypt(message);

        console.log('Encrypted Message:', encrypted);

        // Desencriptar el mensaje encriptado usando la clave privada
        crypt.setPrivateKey(privateKey);
        let decrypted = crypt.decrypt(encrypted);

        console.log('Decrypted Message:', decrypted);
    }


    return (
        <Container size={460} my={30}>
            <Title className={classes.title} ta="center">
                Quehubo 2
            </Title>
            <Text c="dimmed" fz="sm" ta="center">
                La version mejorada del Grupo 3
            </Text>

            <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
                <TextInput
                    label="Username"
                    placeholder="Coily"
                    required
                    onChange={(event) => setNombreUsuario(event.currentTarget.value)}
                />
                <Group justify="space-between" mt="lg" className={classes.controls}>
                    <Button
                        className={classes.control}
                        onClick={handleLogin}
                    >Login</Button>
                </Group>
            </Paper>
        </Container>
    );
}