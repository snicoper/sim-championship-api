import { Injectable } from '@nestjs/common';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { AppConfig } from '../config/app.config';
import { FileStorage, SaveFileParams } from './file-storage.interface';
import { StoredFile } from './stored-file.model';

@Injectable()
export class LocalFileStorageService implements FileStorage {
  async save(params: SaveFileParams): Promise<StoredFile> {
    const key = `${params.folder}/${params.filename}`;
    const filePath = join(AppConfig.uploadsPath, key);

    await mkdir(dirname(filePath), { recursive: true });
    await writeFile(filePath, params.buffer);

    return {
      key,
      url: `/uploads/${key}`,
      mimeType: params.mimeType,
      size: params.buffer.length,
      originalName: params.originalName,
    };
  }

  async delete(key: string): Promise<void> {
    const filePath = join(AppConfig.uploadsPath, key);

    try {
      await unlink(filePath);
    } catch {
      // ignore missing file for now.
    }
  }
}
