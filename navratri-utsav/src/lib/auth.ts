import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { prisma } from "./db";

const JWT_SECRET = process.env.JWT_SECRET;
const SESSION_COOKIE = "navratri_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 hours

if (!JWT_SECRET) {
  // Fail fast in any environment that forgot to set it — never fall back to a
  // hard-coded default secret.
  console.warn(
    "JWT_SECRET is not set. Admin authentication will not work until it is configured."
  );
}

export type SessionPayload = {
  adminId: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN";
};

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export function signSession(payload: SessionPayload): string {
  if (!JWT_SECRET) throw new Error("JWT_SECRET not configured");
  return jwt.sign(payload, JWT_SECRET, { expiresIn: SESSION_TTL_SECONDS });
}

export function verifySession(token: string): SessionPayload | null {
  if (!JWT_SECRET) return null;
  try {
    return jwt.verify(token, JWT_SECRET) as SessionPayload;
  } catch {
    return null;
  }
}

/** Set the httpOnly session cookie on login. Called from a Route Handler. */
export function setSessionCookie(token: string) {
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS
  });
}

export function clearSessionCookie() {
  cookies().set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
}

/** Read + verify the session from a Route Handler or Server Component. */
export function getSessionFromCookies(): SessionPayload | null {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySession(token);
}

/** Read + verify the session inside middleware, where `cookies()` from
 * next/headers isn't available the same way — use the request object. */
export function getSessionFromRequest(req: NextRequest): SessionPayload | null {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySession(token);
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE;

/** Look up the full, current admin record for a verified session — confirms
 * the account is still ACTIVE (a disabled admin's existing token stops
 * working immediately server-side, not just at the next login). */
export async function requireActiveAdmin(session: SessionPayload | null) {
  if (!session) return null;
  const admin = await prisma.admin.findUnique({ where: { id: session.adminId } });
  if (!admin || admin.status !== "ACTIVE") return null;
  return admin;
}
