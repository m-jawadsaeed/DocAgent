import { Request, Response } from "express";

import { ChatService } from "../services/chat.service.js";

const service = new ChatService();

export class ChatController {
  public ask = async (req: Request, res: Response): Promise<void> => {
    try {
      const { conversationId, question } = req.body;

      const userId = req.user!.userId;

      const answer = await service.ask(userId, conversationId, question);

      res.json({
        answer,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  };

  public regenerate = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user!.userId;

      const conversationId = req.body.conversationId;

      const answer = await service.regenerate(userId, conversationId);

      res.json({
        answer,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  };

  public stream = async (req: Request, res: Response): Promise<void> => {
    try {
      const { conversationId, question } = req.body;

      const userId = req.user!.userId;

      res.setHeader("Content-Type", "text/event-stream");

      res.setHeader("Cache-Control", "no-cache");

      res.setHeader("Connection", "keep-alive");

      const stream = service.streamAnswer(userId, conversationId, question);

      for await (const token of stream) {
        res.write(
          `data:${JSON.stringify({
            content: token,
          })}\n\n`,
        );
      }

      res.write(
        `data:${JSON.stringify({
          done: true,
        })}\n\n`,
      );

      res.end();
    } catch (error) {
      console.error(error);

      res.write(
        `data:${JSON.stringify({
          error: error instanceof Error ? error.message : "Streaming failed",
        })}\n\n`,
      );

      res.end();
    }
  };
}
