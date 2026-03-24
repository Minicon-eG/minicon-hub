import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

// Hardcoded credentials — replace with DB lookup later
const USERS = [
  {
    email: 'admin@minicon.eu',
    // bcrypt hash of "Minicon2026!"
    passwordHash: '$2b$12$e9cnxQm7q0TJ28/4REyaF.IZjtwnblCeaY6wpxe00lYAaHuqpZnTK',
  },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body as { email: string; password: string };

    if (!email || !password) {
      return NextResponse.json({ error: 'Email und Passwort erforderlich.' }, { status: 400 });
    }

    const user = USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return NextResponse.json({ error: 'Ungültige Anmeldedaten.' }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: 'Ungültige Anmeldedaten.' }, { status: 401 });
    }

    // Session token: simple opaque value (replace with DB-backed token later)
    const sessionToken = Buffer.from(
      JSON.stringify({ email: user.email, ts: Date.now() })
    ).toString('base64');

    const response = NextResponse.json({ ok: true });
    response.cookies.set('hub_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 h
      path: '/',
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Serverfehler.' }, { status: 500 });
  }
}
