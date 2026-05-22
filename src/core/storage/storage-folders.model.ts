export const StorageFolders = {
  avatars: 'avatars',
} as const;

export type StorageFolder =
  (typeof StorageFolders)[keyof typeof StorageFolders];
