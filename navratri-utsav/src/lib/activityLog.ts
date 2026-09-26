import { prisma } from "./db";

export async function logActivity(params: {
  adminId: string | null;
  action: string;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
}) {
  try {
    await prisma.activityLog.create({
      data: {
        adminId: params.adminId,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        metadata: params.metadata as any
      }
    });
  } catch (err) {
    // Logging must never break the primary action it's recording.
    console.error("Failed to write activity log", err);
  }
}
