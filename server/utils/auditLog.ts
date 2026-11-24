import type { Prisma } from "~~/server/utils/generated/prisma/client";

export type AuditAction = "CREATE" | "UPDATE" | "DELETE";

export type AuditSnapshot = Prisma.InputJsonObject;

type AuditLogTransaction = Prisma.TransactionClient;

function normalizeAuditValue(value: unknown): unknown {
  if (value == null || (typeof value === "string" && !value.trim())) {
    return null;
  }

  if (Array.isArray(value)) return value.map(normalizeAuditValue);

  if (typeof value === "object") {
    const objectValue = value as Record<string, unknown>;

    return Object.keys(objectValue)
      .sort()
      .reduce(
        (result, key) => {
          result[key] = normalizeAuditValue(objectValue[key]);
          return result;
        },
        {} as Record<string, unknown>,
      );
  }

  return value;
}

function hasAuditChanges(before: AuditSnapshot, after: AuditSnapshot): boolean {
  return (
    JSON.stringify(normalizeAuditValue(before)) !==
    JSON.stringify(normalizeAuditValue(after))
  );
}

export async function writeAuditLog(
  tx: AuditLogTransaction,
  userId: string | null | undefined,
  action: AuditAction,
  recordType: string,
  recordId: string | null,
  before: AuditSnapshot = {},
  after: AuditSnapshot = {},
  actorName?: string | null,
) {
  if (action === "UPDATE" && !hasAuditChanges(before, after)) return;

  const actor = actorName
    ? { name: actorName }
    : userId
    ? await tx.user.findUnique({
        where: { id: userId },
        select: { name: true },
      })
      : null;

  await tx.auditLog.create({
    data: {
      userId: userId ?? null,
      action,
      recordType,
      recordId,
      snapshot: {
        actorName: actor?.name ?? null,
        before,
        after,
      },
    },
  });
}
