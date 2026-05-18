import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { connect } from '@/lib/mongo';
import { User, Chat } from '@/lib/models';
import jwt from 'jsonwebtoken';

const DEFAULT_MODEL = process.env.GOOGLE_MODEL || 'gemini-2.5-flash';

async function callGemini(prompt: string) {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) {
    return `Assistant (mock): ${prompt}`;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: prompt,
    });
    return response.text || 'No response from model';
  } catch (error: any) {
    console.error('Gemini SDK error:', error?.message || error);
    throw error;
  }
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
