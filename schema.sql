CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    public_key VARCHAR(255)
); 

CREATE TABLE IF NOT EXISTS mensajes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username_origen VARCHAR(100) NOT NULL,
    username_destino VARCHAR(100) NOT NULL,
    content VARCHAR(255)
); 