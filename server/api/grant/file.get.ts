import prisma from "~~/server/utils/prisma";
import { requireSession } from "~~/server/utils/requireSession";
import { readFile } from "node:fs/promises";
import { basename, join } from "node:path";

export default defineEventHandler(async (event) => {
  await requireSession(event, 1);

  const { id } = getQuery(event);
  if (typeof id !== "string" || !id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Grant ID is required",
    });
  }

  const grant = await prisma.grant.findUnique({
    where: { id },
    select: { fileName: true },
  });

  const fileName = grant?.fileName;

  if (basename(fileName) !== fileName) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid filename",
    });
  }

  const uploadDirectory = process.env.UPLOAD_DIRECTORY ?? "uploads";
  const filePath = join(uploadDirectory, fileName);

  let file: Buffer;

  try {
    file = await readFile(filePath);
  } catch {
    throw createError({
      statusCode: 404,
      statusMessage: "File not found",
    });
  }

  const extension = fileName.split(".").pop()?.toLowerCase();
  const mimeTypes: Record<string, string> = {
    pdf: "application/pdf",
    jpg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
  };

  return new Response(new Uint8Array(file), {
    headers: {
      "Content-Type": mimeTypes[extension ?? ""] ?? "application/octet-stream",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
});
