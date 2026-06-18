import { minio } from "../config/minio.js";

export class StorageService {
  private readonly bucket = "documents";

  public async upload(filename: string, buffer: Buffer) {
    const objectName = `${Date.now()}-${filename}`;

    await minio.putObject(this.bucket, objectName, buffer);

    return objectName;
  }

  public async download(objectName: string) {
    return minio.getObject(this.bucket, objectName);
  }
}
