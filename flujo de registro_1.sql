CREATE DATABASE seguridad;
USE seguridad;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT,
    correo VARCHAR(255) NOT NULL,
    contraseña VARCHAR(255) NOT NULL,
    tipo_usuario ENUM('provedor', 'negocio', 'cliente') NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE proveedores (
    id INT AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    correo VARCHAR(255) UNIQUE NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE negocios (
    id INT AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    correo VARCHAR(255) UNIQUE NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE clientes (
    id INT AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    correo VARCHAR(255) UNIQUE NOT NULL,
    PRIMARY KEY (id)
);
```

**Crear el archivo PHP para la sección de inicio**

```php
<?php
// Conectar con la base de datos
$conn = mysqli_connect("localhost", "nombre_de_usuario", "senha", "seguridad");

if (!$conn) {
    die("Erro ao conectar: " . mysqli_connect_error());
}

session_start();

if (!isset($_SESSION['tipo_usuario'])) {
    // Redirigir a la página de inicio
    header('Location: inicio.php');
    exit;
}

