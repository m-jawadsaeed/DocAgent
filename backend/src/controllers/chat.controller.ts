import { Request, Response } from "express";

import { ChatService } from "../services/chat.service.js";

const chatService = new ChatService();

export async function streamChat(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        error: "Unauthorized",
      });

      return;
    }

    const { conversationId, question } = req.body;

    if (!conversationId || !question) {
      res.status(400).json({
        error: "conversationId and question required",
      });

      return;
    }

    res.setHeader("Content-Type", "text/event-stream");

    res.setHeader("Cache-Control", "no-cache");

    res.setHeader("Connection", "keep-alive");

    res.flushHeaders();

    const stream = chatService.streamAnswer(userId, conversationId, question);

    for await (const chunk of stream) {
      res.write(
        `data: ${JSON.stringify({
          token: chunk,
        })}\n\n`,
      );
    }

    res.write("data: [DONE]\n\n");

    res.end();
  } catch (error) {
    console.error(error);

    res.write(
      `data: ${JSON.stringify({
        error: "Streaming failed",
      })}\n\n`,
    );

    res.end();
  }
}

export async function regenerateChat(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        error: "Unauthorized",
      });

      return;
    }

    const { conversationId } = req.body;

    const answer = await chatService.regenerate(userId, conversationId);

    res.json({
      answer,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Regenerate failed",
    });
  }
}
