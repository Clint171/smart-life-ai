import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/lib/mongo';
import { User, Chat } from '@/lib/models';
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: chatId } = await params;
    
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

    const chat = await Chat.findById(chatId).exec();
    if (!chat || !user.chats.includes(new mongoose.Types.ObjectId(chatId))) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }

    return NextResponse.json(
      { id: chat._id?.toString(), title: chat.title, messages: chat.messages },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: chatId } = await params;
    
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

    const chat = await Chat.findById(chatId).exec();
    if (!chat || !user.chats.includes(new mongoose.Types.ObjectId(chatId))) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }

    // Remove chat from user's chats array
    user.chats = user.chats.filter((id: mongoose.Types.ObjectId) => !id.equals(new mongoose.Types.ObjectId(chatId)));
    await user.save();

    // Delete the chat
    await Chat.findByIdAndDelete(chatId);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
