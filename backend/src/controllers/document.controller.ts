import { Request, Response } from "express";

import { DocumentService } from "../services/document.service.js";

const service = new DocumentService();

export class DocumentController {
  upload = async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.file) {
      res.status(400).json({
        message: "File required",
      });

      return;
    }

    const document = await service.uploadDocument(
      req.user.userId,

      req.file.originalname,

      req.file.buffer,
    );

    res.status(202).json(document);
  };

  getAll = async (req: Request, res: Response): Promise<void> => {
    const docs = await service.getUserDocuments(req.user!.userId);

    res.json(docs);
  };

  deleteDocument = async (req: Request, res: Response): Promise<void> => {
    const documentId = String(req.params.id);

    await service.deleteDocument(documentId, req.user!.userId);

    res.json({
      success: true,
    });
  };
}
