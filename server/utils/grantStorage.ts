import { unlink, mkdir, writeFile } from "node:fs/promises";
import { nanoid } from "nanoid";
import { join } from "node:path";

const uploadDirectory = process.env.UPLOAD_DIRECTORY ?? "uploads";

export const deleteGrantFile = async (fileName: string) => {
	await unlink(`${uploadDirectory}/${fileName}`).catch((error) => {
    console.log("Filed to delete file:", error)
  })
}

export const uploadGrantFile = async (buffer: Buffer, extension: string) => {
  const newFileName = `${nanoid()}.${extension}`;
  const newPath = join(uploadDirectory, newFileName);
  await mkdir(uploadDirectory, { recursive: true });
  await writeFile(newPath, buffer, { flag: "wx" });
  return newFileName;
};
