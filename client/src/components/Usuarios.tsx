import React, { useState, useEffect } from 'react';
import { Table } from 'antd';

export function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [publicKey, setPublicKey] = useState(null);

    // Función para obtener los usuarios
    const getUsuarios = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/users');
            const data = await response.json();
            setUsuarios(data);
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUsuarios();
    }, []);

    const columns = [
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
            width: '45%',
        },
    ];

    const handleRowSelection = (record) => {
        // Aquí se obtiene la public_key del usuario seleccionado
        setPublicKey(record.public_key);
    };

    return (
        <div style={{ textAlign: 'center', maxWidth: "100%"}}>
            <h1>Usuarios</h1>
            <Table
                dataSource={usuarios}
                columns={columns}
                loading={loading}
                scroll={{ y: 400 }}
                onRow={(record) => ({
                    onClick: () => handleRowSelection(record),
                })}
                rowKey="_id"
            />
                {publicKey && (
                    <div style={{ marginTop: '20px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <h2 style={{ marginBottom: '10px' }}>Clave Pública del Usuario Seleccionado:</h2>
                        <textarea
                            style={{
                                width: '80%',
                                height: '200px',
                                fontFamily: 'monospace',
                                resize: 'none',
                                padding: '12px 20px',
                                boxSizing: 'border-box',
                                transition: '0.3s',
                                border: 'none',
                            }}
                            value={publicKey}
                            readOnly
                        />
                    </div>
                )}
        </div>
    );
}
