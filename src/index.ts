import http from "http";
import app from "./app";

// Cria as regras HTTP usando as regras do app
const server = http.createServer(app); 

// Define a porta do servidor
const PORT = process.env.PORT || 8080;

// Iniciando o server
server.listen(PORT, () => console.info("Servidor escutando na porta", PORT))