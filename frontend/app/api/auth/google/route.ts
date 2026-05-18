import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT || `http://localhost:3000/api/auth/google/callback`;
  const scope = ['openid', 'email', 'profile'].join(' ');
  if (!clientId) return NextResponse.json({ error: 'Missing GOOGLE_OAUTH_CLIENT_ID' }, { status: 500 });

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
    clientId
  )}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(
    scope
  )}&access_type=offline&prompt=consent`;

  return NextResponse.redirect(authUrl);
}
