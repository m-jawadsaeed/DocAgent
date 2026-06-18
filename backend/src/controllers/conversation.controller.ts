import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";

export class ConversationController {
  list = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    const conversations = await prisma.conversation.findMany({
      where: {
        userId: req.user.userId,
      },

      include: {
        messages: {
          take: 1,
          orderBy: {
            createdAt: "desc",
          },
        },
      },

      orderBy: [
        {
          pinned: "desc",
        },
        {
          updatedAt: "desc",
        },
      ],
    });

    res.json(conversations);
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    const conversation = await prisma.conversation.findFirst({
      where: {
        id: String(req.params.id),

        userId: req.user.userId,
      },

      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!conversation) {
      res.status(404).json({
        message: "Conversation not found",
      });

      return;
    }

    res.json(conversation);
  };

  create = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    const conversation = await prisma.conversation.create({
      data: {
        userId: req.user.userId,

        title: "New Chat",
      },
    });

    res.status(201).json(conversation);
  };

  messages = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    const conversationId = String(req.params.id);

    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,

        userId: req.user.userId,
      },
    });

    if (!conversation) {
      res.status(404).json({
        message: "Conversation not found",
      });

      return;
    }

    const messages = await prisma.message.findMany({
      where: {
        conversationId,
      },

      orderBy: {
        createdAt: "asc",
      },
    });

    res.json(messages);
  };

  memory = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      res.status(401).json({
        message: "Unauthorized",
      });

      return;
    }

    const memory = await prisma.conversationMemory.findUnique({
      where: {
        conversationId: String(req.params.id),
      },
    });

    res.json({
      summary: memory?.summary ?? "",

      updatedAt: memory?.updatedAt ?? null,
    });
  };

  rename = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      res.status(401).json({
        message: "Unauthorized",
      });

      return;
    }

    const updated = await prisma.conversation.update({
      where: {
        id: String(req.params.id),
      },

      data: {
        title: String(req.body.title ?? ""),
      },
    });

    res.json(updated);
  };

  pin = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      res.status(401).json({
        message: "Unauthorized",
      });

      return;
    }

    const conversation = await prisma.conversation.findUnique({
      where: {
        id: String(req.params.id),
      },
    });

    if (!conversation) {
      res.status(404).json({
        message: "Conversation not found",
      });

      return;
    }

    const updated = await prisma.conversation.update({
      where: {
        id: conversation.id,
      },

      data: {
        pinned: !conversation.pinned,
      },
    });

    res.json(updated);
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      res.status(401).json({
        message: "Unauthorized",
      });

      return;
    }

    await prisma.conversation.deleteMany({
      where: {
        id: String(req.params.id),

        userId: req.user.userId,
      },
    });

    res.json({
      success: true,
    });
  };
}
