import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true, minlength: 3 },
  password: { type: String, required: true, minlength: 5 },
  email: { type: String, required: true, unique: true },
  chats: [{ type: Schema.Types.ObjectId, ref: 'Chat' }],
});

const ChatSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  messages: { type: Array, required: true },
});

// Prevent model overwrite in dev/hot-reload
export const User = (mongoose.models.User as mongoose.Model<any>) || mongoose.model('User', UserSchema);
export const Chat = (mongoose.models.Chat as mongoose.Model<any>) || mongoose.model('Chat', ChatSchema);
