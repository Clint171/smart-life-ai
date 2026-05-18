import { NextResponse, NextRequest } from 'next/server';
import { connect } from '@/lib/mongo';
import { User } from '@/lib/models';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  if (!code) return NextResponse.json({ error: 'Missing code' }, { status: 400 });

  const tokenEndpoint = 'https://oauth2.googleapis.com/token';
  const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT || `http://localhost:3000/api/auth/google/callback`;

  try {
    // Exchange code for tokens
    const params = new URLSearchParams();
    params.append('code', code);
    params.append('client_id', process.env.GOOGLE_OAUTH_CLIENT_ID || '');
    params.append('client_secret', process.env.GOOGLE_OAUTH_CLIENT_SECRET || '');
    params.append('redirect_uri', redirectUri);
    params.append('grant_type', 'authorization_code');

    const tokenRes = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });
    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;
    if (!accessToken) throw new Error('No access_token from Google');

    const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const profile = await userInfoRes.json();

    await connect();

    let user = await User.findOne({ email: profile.email }).exec();
    if (!user) {
      const randomPassword = Math.random().toString(36).slice(2);
      const saltRounds = Number(process.env.SALT) || 10;
      const hashed = await bcrypt.hash(randomPassword, saltRounds);
      user = new User({ username: profile.email.split('@')[0], email: profile.email, password: hashed });
      await user.save();
    }

    const token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

    const res = NextResponse.redirect('/');
    res.cookies.set('token', token, { httpOnly: true, path: '/' });
    return res;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
