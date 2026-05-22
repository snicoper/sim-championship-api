import { type StorageFolder } from './storage-folders.model';
import { type StoredFile } from './stored-file.model';

export interface SaveFileParams {
  folder: StorageFolder;
  filename: string;
  buffer: Buffer;
  mimeType: string;
  originalName?: string;
}

export interface FileStorage {
  save(params: SaveFileParams): Promise<StoredFile>;

  delete(key: string): Promise<void>;
}
