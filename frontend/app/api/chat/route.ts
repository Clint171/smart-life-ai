import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/lib/mongo';
import { User, Chat } from '@/lib/models';
import jwt from 'jsonwebtoken';

const DEFAULT_MODEL = process.env.GOOGLE_MODEL || 'models/gemini-2.5-flash';

async function callGemini(prompt: string) {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) {
    // Fallback to a simple echo response when API key is missing
    return `Assistant (mock): ${prompt}`;
  }

  // Build endpoint and headers. If the provided key looks like an OAuth access token (starts with 'ya29.'),
  // send it as a Bearer token. Otherwise send the API key as a query param (`?key=`).
  let endpoint = `https://generative.googleapis.com/v1beta/models/${DEFAULT_MODEL}:generateText`;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (apiKey.startsWith('ya29.')) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  } else {
    endpoint += `?key=${encodeURIComponent(apiKey)}`;
  }

  const body = {
    prompt: { text: prompt },
    temperature: 0.7,
    maxOutputTokens: 512,
  };

  const res = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('Gemini error', res.status, text);
    throw new Error('Model request failed');
  }

  const data = await res.json();
  // Support multiple possible response shapes
  const outputCandidates =
    data?.candidates?.[0]?.content ||
    data?.candidates?.[0]?.output ||
    data?.output?.[0]?.content ||
    data?.result?.candidates?.[0]?.content ||
    data?.text ||
    data?.generatedText ||
    data?.content ||
    null;

  if (!outputCandidates) return JSON.stringify(data);
  if (typeof outputCandidates === 'string') return outputCandidates;
  // If it's an array/object, try to extract text
  if (Array.isArray(outputCandidates)) return outputCandidates.join('\n');
  if (typeof outputCandidates === 'object') return JSON.stringify(outputCandidates);
  return String(outputCandidates);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const message = body?.message;
    if (!message) return NextResponse.json({ error: 'Missing message' }, { status: 400 });

    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    let payload: any;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    } catch (err) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    await connect();
    const user = await User.findById(payload.id).exec();
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    let chat = await Chat.findOne({ owner: user._id }).exec();
    if (!chat) {
      chat = new Chat({ owner: user._id, messages: [] });
    }

    const userMessage = { role: 'user', content: message };
    chat.messages.push(userMessage);

    const prompt = chat.messages.map((m: any) => `${m.role}: ${m.content}`).join('\n');
    let assistantText = '';
    try {
      assistantText = await callGemini(prompt);
    } catch (e) {
      assistantText = `Assistant (fallback): I couldn't contact the model.`;
    }

    const assistantMessage = { role: 'assistant', content: assistantText };
    chat.messages.push(assistantMessage);

    if (!user.chats.includes(chat._id)) {
      user.chats.push(chat._id);
      await user.save();
    }

    await chat.save();

    return NextResponse.json({ message: assistantMessage }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
