export function copyDir(sourceDirectory: string, targetDirectory: string): void
export function copyDirAsync(sourceDirectory: string, targetDirectory: string, callback?: (err: NodeJS.ErrnoException) => void): void
export function copyDirContent(sourceDirectory: string, targetDirectory: string, ignoreExtensions?: string[]): void
export function copyFile(filepath: string, targetDirectory: string): void