import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/lib/mongo';
import { User, Chat } from '@/lib/models';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    let payload: any;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    } catch (err) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    await connect();
    const user = await User.findById(payload.id).populate('chats').exec();
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const chats = (user.chats || []).map((chat: any) => ({
      id: chat._id?.toString(),
      title: chat.title || 'Untitled Chat',
      messages: chat.messages,
    }));

    return NextResponse.json({ chats }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
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

    const newChat = new Chat({ owner: user._id, title: 'New Chat', messages: [] });
    await newChat.save();

    user.chats.push(newChat._id);
    await user.save();

    return NextResponse.json(
      { id: newChat._id?.toString(), title: newChat.title, messages: [] },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
