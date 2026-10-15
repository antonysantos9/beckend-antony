
import { Request, Response } from "express";
import { prisma } from "../../config/prisma";
import { handleErrors } from "../helpers/hendleErrors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default {

    // Listar usuários sem mostrar as senhas
    list: async (request: Request, response: Response) => {
        try {
            const usuarios = await prisma.usuarios.findMany({
                select: {
                    id: true,
                    nome: true,
                    email: true,
                    cpf: true
                }
            });

            return response.status(200).json(usuarios);
        } catch (error) {
            return handleErrors(error, response);
        }
    },

    // Buscar usuário por ID
    getById: async (request: Request, response: Response) => {
        try {
            const id = Number(request.params.id);

            if (!Number.isInteger(id) || id <= 0) {
                return response.status(400).json({
                    mensagem: "ID inválido"
                });
            }

            const usuario = await prisma.usuarios.findUnique({
                where: { id },
                select: {
                    id: true,
                    nome: true,
                    email: true,
                    cpf: true
                }
            });

            if (!usuario) {
                return response.status(404).json({
                    mensagem: "Usuário não encontrado"
                });
            }

            return response.status(200).json(usuario);
        } catch (error) {
            return handleErrors(error, response);
        }
    },

    // Cadastrar usuário
    create: async (request: Request, response: Response) => {
        try {
            const { nome, email, cpf, senha } = request.body;

            if (!nome || !email || !cpf || !senha) {
                return response.status(400).json({
                    mensagem: "Preencha todos os campos obrigatórios"
                });
            }

            if (
                typeof nome !== "string" ||
                typeof email !== "string" ||
                typeof cpf !== "string" ||
                typeof senha !== "string" ||
                !email.includes("@") ||
                senha.length < 8
            ) {
                return response.status(400).json({
                    mensagem: "Dados inválidos. A senha deve ter pelo menos 8 caracteres"
                });
            }

            const senhaCriptografada = await bcrypt.hash(senha, 10);

            const usuario = await prisma.usuarios.create({
                data: {
                    nome,
                    email,
                    cpf,
                    senha: senhaCriptografada
                },
                select: {
                    id: true,
                    nome: true,
                    email: true,
                    cpf: true
                }
            });

            return response.status(201).json(usuario);
        } catch (error) {
            return handleErrors(error, response);
        }
    },

    // Login com JWT
    login: async (request: Request, response: Response) => {
        try {
            const { email, senha } = request.body;

            if (!email || !senha) {
                return response.status(400).json({
                    mensagem: "Informe o e-mail e a senha"
                });
            }

            const usuario = await prisma.usuarios.findUnique({
                where: { email }
            });

            if (!usuario) {
                return response.status(401).json({
                    mensagem: "E-mail ou senha incorretos"
                });
            }

            const senhaValida = await bcrypt.compare(
                senha,
                usuario.senha
            );

            if (!senhaValida) {
                return response.status(401).json({
                    mensagem: "E-mail ou senha incorretos"
                });
            }

            const segredo = process.env.JWT_SECRET;

            if (!segredo) {
                return response.status(500).json({
                    mensagem: "JWT_SECRET não configurado no servidor"
                });
            }

            const token = jwt.sign(
                { id: usuario.id },
                segredo,
                { expiresIn: "1d" }
            );

            return response.status(200).json({
                mensagem: "Login realizado com sucesso",
                token,
                usuario: {
                    id: usuario.id,
                    nome: usuario.nome,
                    email: usuario.email,
                    cpf: usuario.cpf
                }
            });
        } catch (error) {
            return handleErrors(error, response);
        }
    },

    // Atualizar usuário
    update: async (request: Request, response: Response) => {
        try {
            const id = Number(request.params.id);

            if (!Number.isInteger(id) || id <= 0) {
                return response.status(400).json({
                    mensagem: "ID inválido"
                });
            }

            const existente = await prisma.usuarios.findUnique({
                where: { id }
            });

            if (!existente) {
                return response.status(404).json({
                    mensagem: "Usuário não encontrado"
                });
            }

            const { nome, email, cpf, senha } = request.body;

            if (
                nome === undefined &&
                email === undefined &&
                cpf === undefined &&
                senha === undefined
            ) {
                return response.status(400).json({
                    mensagem: "Informe ao menos um campo para atualizar"
                });
            }

            if (
                (nome !== undefined &&
                    (typeof nome !== "string" || !nome.trim())) ||
                (email !== undefined &&
                    (typeof email !== "string" || !email.includes("@"))) ||
                (cpf !== undefined &&
                    (typeof cpf !== "string" || !cpf.trim())) ||
                (senha !== undefined &&
                    (typeof senha !== "string" || senha.length < 8))
            ) {
                return response.status(400).json({
                    mensagem: "Os dados informados são inválidos"
                });
            }

            const dados: {
                nome?: string;
                email?: string;
                cpf?: string;
                senha?: string;
            } = {};

            if (nome !== undefined) dados.nome = nome;
            if (email !== undefined) dados.email = email;
            if (cpf !== undefined) dados.cpf = cpf;

            if (senha !== undefined) {
                dados.senha = await bcrypt.hash(senha, 10);
            }

            const usuario = await prisma.usuarios.update({
                where: { id },
                data: dados,
                select: {
                    id: true,
                    nome: true,
                    email: true,
                    cpf: true
                }
            });

            return response.status(200).json(usuario);
        } catch (error) {
            return handleErrors(error, response);
        }
    },

    // Excluir usuário
    delete: async (request: Request, response: Response) => {
        try {
            const id = Number(request.params.id);

            if (!Number.isInteger(id) || id <= 0) {
                return response.status(400).json({
                    mensagem: "ID inválido"
                });
            }

            const usuario = await prisma.usuarios.findUnique({
                where: { id }
            });

            if (!usuario) {
                return response.status(404).json({
                    mensagem: "Usuário não encontrado"
                });
            }

            await prisma.usuarios.delete({
                where: { id }
            });

            return response.status(200).json({
                mensagem: "Usuário excluído com sucesso"
            });
        } catch (error) {
            return handleErrors(error, response);
        }
    }
};
