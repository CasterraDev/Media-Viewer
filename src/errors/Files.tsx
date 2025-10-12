export class FileError extends Error {
  constructor(public code: string, public file: string, public cause: string) {
    super(code);
    this.name = "FileError";
  }
}
