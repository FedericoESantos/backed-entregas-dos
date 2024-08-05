import usuariosController from "../controllers/usuariosController.js";
import { Router } from "express";

export const router = Router();

// ENDPOINT
router.get("/", usuariosController.getUsers);
router.get("/:id", usuariosController.getUserById);
router.get("/email/:email", usuariosController.getUserByEmail);
router.post("/", usuariosController.postUser);