import { z } from "zod";

export default defineEventHandler(async (event) => {
  await requireSession(event, 1);
  const grantId = getRouterParam(event, "id");
  const extensions: Record<string, string> = {
    "application/pdf": "pdf",
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };

  if (!grantId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Grant ID is required",
    });
  }

  const grant = await prisma.grant.findUnique({
    where: {
      id: grantId,
    },
  });

  if (!grant) {
    throw createError({
      statusCode: 404,
      statusMessage: "Grant does not exist",
    });
  }

  const formData = await readFormData(event);

  const file = formData.get("file");
  if (!(file instanceof File)) {
    throw createError({
      statusCode: 400,
      statusMessage: "File is required",
    });
  }

  const fileSchema = z
    .file()
    .min(1, "File cannot be empty")
    .mime(["application/pdf", "image/jpeg", "image/png", "image/webp"]);

  const result = fileSchema.safeParse(file);
  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid file",
    });
  }

  const extension = extensions[file.type];
  if (!extension) {
    throw createError({
      statusCode: 400,
      statusMessage: "Unsupported file type",
    });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const savedFileName = await uploadGrantFile(buffer, extension);
  
  try{
    await prisma.grant.update({
    where: {
        id: grantId
    },
    data: {
        fileName: savedFileName
    }
  })
  } catch (error) {
    await deleteGrantFile(savedFileName)
    throw error;
  }

  if (grant.fileName) {
    await deleteGrantFile(grant.fileName)
  }
  
  return {
    success: true,
    message: "Grant file uploaded",
    fileName: savedFileName
  }
});
