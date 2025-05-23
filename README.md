# Sistema de Gestión de Restaurante con QR

Este proyecto permite a clientes de un restaurante seleccionar una mesa, realizar pedidos desde un menú digital y solicitar la cuenta mediante una aplicación web escaneando un código QR. Está desarrollado con **React.js** en el frontend, **Node.js + Express** en el backend, y **MongoDB** como base de datos.

---

## Características principales

- Selección de mesa mediante QR
- Menú digital interactivo
- Pedidos con productos categorizados
- Vista para cocina y vista para bar
- Vista para garzón
- Panel de administración
- Solicitud de cuenta y simulación de pago

---

## Tecnologías utilizadas

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- Dotenv (configuración de entorno)
- CORS

### Frontend
- React.js
- Axios
- React Router DOM
- Tailwind CSS

---

## Instalación y configuración
En la terminal
### 1.Clonar el repositorio
```bash
git clone https://github.com/usuario/restaurante-qr.git
```

### 2.Configurar el backend
```bash
cd backend
npm install
```
## Dentro de la carpeta backend
Crear un archivo `.env`:
```
PORT=3001
MONGO_URI=mongodb://localhost:27017/restaurante_db
```

Ejecutar el servidor:
```bash
npm run dev
```

### 3.Configurar el frontend
```bash
cd frontend
npm install
```
## Dentro de la carpeta frontend
Crear un archivo `.env`:
```
REACT_APP_API=http://localhost:3001
```
Ejecutar la aplicación:
```bash
npm start
```

---

## Pruebas

- Pruebas manuales con Postman para rutas API
- Validación visual y funcional en navegadores (Chrome, Microsoft Edge)
- Pruebas funcionales de flujo cliente → cocina/bar → garzón → pago

---

## Estructura del Proyecto

```
/backend
  ├── models/
  ├── controllers/
  ├── routes/
  └── index.js

/frontend
  ├── src/components/
  ├── src/pages/
  ├── src/routes/
  └── src/App.js
```

---

## Créditos

- Proyecto desarrollado por **Juan Soto** como parte de su trabajo de título de Ingeniería en Computación e Informática.

---

## Licencia

Este proyecto es de uso académico. Reutilización sujeta a autorización del autor.
