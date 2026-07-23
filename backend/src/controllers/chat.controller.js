import { Conversation, Message } from '../models/chat.model.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const conversations = asyncHandler(async (req, res) => res.json({ success: true, data: { conversations: await Conversation.find().sort({ updatedAt: -1 }) } }));

export const messages = asyncHandler(async (req, res) => {
  const conv = await Conversation.findById(req.params.id); if (!conv) throw ApiError.notFound('المحادثة غير موجودة.');
  if (conv.unread) { conv.unread = 0; await conv.save(); }
  res.json({ success: true, data: { messages: await Message.find({ conversation: conv._id }).sort({ createdAt: 1 }) } });
});

export const sendMessage = asyncHandler(async (req, res) => {
  const conv = await Conversation.findById(req.params.id); if (!conv) throw ApiError.notFound('المحادثة غير موجودة.');
  const msg = await Message.create({ conversation: conv._id, sender: 'me', text: req.body.text, attachment: req.body.attachment || null });
  conv.lastMessage = req.body.text || '📎 مرفق'; conv.updatedAt = new Date(); await conv.save();
  res.status(201).json({ success: true, data: { message: msg } });
});
