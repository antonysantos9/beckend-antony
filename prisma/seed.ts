
import bcrypt from "bcrypt";

import { prisma } from "../config/prisma";

async function main() {
    const senhaCriptografada = await bcrypt.hash("12345678", 10);

    const usuario = await prisma.usuarios.create({
        data: {
            nome: "Antony",
            email: "antony@email.com",
            cpf: "12345678900",
            senha: senhaCriptografada
        }
    });

    console.log("Usuário criado ou já existente:", usuario.email);
}

main()
    .catch((error) => {
        console.error("Erro ao executar o seed:", error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
