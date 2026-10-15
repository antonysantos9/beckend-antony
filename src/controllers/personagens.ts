
import { Request, Response } from "express";
import { prisma } from "../../config/prisma";
import { handleErrors } from "../helpers/hendleErrors";

export default {

    // Listar todos os personagens
    list: async (request: Request, response: Response) => {
        try {
            const personagens = await prisma.personagens.findMany();

            return response.status(200).json(personagens);
        } catch (error) {
            return handleErrors(error, response);
        }
    },

    // Buscar personagem pelo ID
    getById: async (request: Request, response: Response) => {
        try {
            const id = Number(request.params.id);

            if (!Number.isInteger(id) || id <= 0) {
                return response.status(400).json({
                    mensagem: "ID inválido"
                });
            }

            const personagem = await prisma.personagens.findUnique({
                where: { id }
            });

            if (!personagem) {
                return response.status(404).json({
                    mensagem: "Personagem não encontrado"
                });
            }

            return response.status(200).json(personagem);
        } catch (error) {
            return handleErrors(error, response);
        }
    },

    // Cadastrar personagem
    create: async (request: Request, response: Response) => {
        try {
            const {
                nome,
                sexo,
                TipoGrimorio,
                folhasGrimorio,
                idade,
                esquadrao
            } = request.body;

            if (
                !nome ||
                !sexo ||
                !TipoGrimorio ||
                folhasGrimorio == null ||
                idade == null ||
                !esquadrao
            ) {
                return response.status(400).json({
                    mensagem: "Preencha todos os campos obrigatórios"
                });
            }

            const folhas = Number(folhasGrimorio);
            const idadeNumero = Number(idade);

            if (
                !Number.isInteger(folhas) ||
                folhas <= 0 ||
                !Number.isInteger(idadeNumero) ||
                idadeNumero <= 0
            ) {
                return response.status(400).json({
                    mensagem: "Folhas do grimório e idade devem ser números inteiros positivos"
                });
            }

            const personagem = await prisma.personagens.create({
                data: {
                    nome,
                    sexo,
                    TipoGrimorio,
                    folhasGrimorio: folhas,
                    idade: idadeNumero,
                    esquadrao
                }
            });

            return response.status(201).json(personagem);
        } catch (error) {
            return handleErrors(error, response);
        }
    },

    // Atualizar personagem
    update: async (request: Request, response: Response) => {
        try {
            const id = Number(request.params.id);

            if (!Number.isInteger(id) || id <= 0) {
                return response.status(400).json({
                    mensagem: "ID inválido"
                });
            }

            const existente = await prisma.personagens.findUnique({
                where: { id }
            });

            if (!existente) {
                return response.status(404).json({
                    mensagem: "Personagem não encontrado"
                });
            }

            const {
                nome,
                sexo,
                TipoGrimorio,
                folhasGrimorio,
                idade,
                esquadrao
            } = request.body;

            const dados: {
                nome?: string;
                sexo?: string;
                TipoGrimorio?: string;
                folhasGrimorio?: number;
                idade?: number;
                esquadrao?: string;
            } = {};

            if (nome !== undefined) dados.nome = nome;
            if (sexo !== undefined) dados.sexo = sexo;
            if (TipoGrimorio !== undefined) {
                dados.TipoGrimorio = TipoGrimorio;
            }
            if (esquadrao !== undefined) dados.esquadrao = esquadrao;

            if (folhasGrimorio !== undefined) {
                const folhas = Number(folhasGrimorio);

                if (!Number.isInteger(folhas) || folhas <= 0) {
                    return response.status(400).json({
                        mensagem: "Folhas do grimório deve ser um inteiro positivo"
                    });
                }

                dados.folhasGrimorio = folhas;
            }

            if (idade !== undefined) {
                const idadeNumero = Number(idade);

                if (!Number.isInteger(idadeNumero) || idadeNumero <= 0) {
                    return response.status(400).json({
                        mensagem: "Idade deve ser um inteiro positivo"
                    });
                }

                dados.idade = idadeNumero;
            }

            const personagem = await prisma.personagens.update({
                where: { id },
                data: dados
            });

            return response.status(200).json(personagem);
        } catch (error) {
            return handleErrors(error, response);
        }
    },

    // Excluir personagem
    delete: async (request: Request, response: Response) => {
        try {
            const id = Number(request.params.id);

            if (!Number.isInteger(id) || id <= 0) {
                return response.status(400).json({
                    mensagem: "ID inválido"
                });
            }

            const personagem = await prisma.personagens.findUnique({
                where: { id }
            });

            if (!personagem) {
                return response.status(404).json({
                    mensagem: "Personagem não encontrado"
                });
            }

            await prisma.personagens.delete({
                where: { id }
            });

            return response.status(200).json({
                mensagem: "Personagem excluído com sucesso"
            });
        } catch (error) {
            return handleErrors(error, response);
        }
    }
};
