import express from "express";
import morgan from "morgan";
const bodyParser = require('body-parser');
const cors = require('cors'); // Importa el paquete cors





// Routes

import EstatusRoutes from "./routes/estatus.routes";
import AuthRoutes  from "./routes/auth.routes";
import DocumentosRoutes  from "./routes/documentos.routes";
import OrganigramaRoutes  from "./routes/organigrama.route";
import TipoDocumentosRoutes  from "./routes/tipo_documentos.routes";
import DocumentosPublicosRoutes  from "./routes/documentos_publicos.route";

const app = express();

// Configura CORS
app.use(cors({
    origin: 'http://localhost:5173', // Cambia esto al dominio de tu aplicación Vue.js
    optionsSuccessStatus: 200, // Algunas versiones de CORS pueden requerir esto
  }));

// Settings
app.set("port", 4000);

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(bodyParser.json());

// Configurar middleware para servir archivos estáticos desde la carpeta 'uploads'
app.use('/uploads', express.static('uploads'));



// Routes

app.use("/api/estatus", EstatusRoutes);
app.use('/auth', AuthRoutes);
app.use("/api/documentos", DocumentosRoutes);
app.use("/api/organigrama", OrganigramaRoutes);
app.use("/api/tipodocumentos", TipoDocumentosRoutes);
app.use("/api/documentos/publicos", DocumentosPublicosRoutes);


export default app;
