import crypto from 'crypto';
import ContractTemplate from '../models/template.model.js';
import Transaction from '../models/transaction.model.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

/** [D1] Marketplace list + categories. */
export const listTemplates = asyncHandler(async (req, res) => {
  const { q, category } = req.query; const f = {};
  if (category && category !== 'الكل') f.category = category;
  if (q) { const rx = new RegExp(q, 'i'); f.$or = [{ title: rx }, { description: rx }]; }
  const templates = await ContractTemplate.find(f).sort({ downloads: -1 });
  const categories = await ContractTemplate.distinct('category');
  res.json({ success: true, data: { templates, categories: categories.filter(Boolean) } });
});

/** [D2] Single template (for editor). */
export const getTemplate = asyncHandler(async (req, res) => {
  const t = await ContractTemplate.findById(req.params.id);
  if (!t) throw ApiError.notFound('القالب غير موجود.');
  res.json({ success: true, data: { template: t } });
});

/** [D2] Create a purchase transaction (checkout). */
export const purchase = asyncHandler(async (req, res) => {
  const { templateId, filledData = {}, method = 'card' } = req.body;
  const t = await ContractTemplate.findById(templateId);
  if (!t) throw ApiError.notFound('القالب غير موجود.');
  const ref = 'TXN-' + Date.now().toString(36).toUpperCase();
  const tx = await Transaction.create({ ref, user: req.userId, template: t._id, templateTitle: t.title, amount: t.price, currency: t.currency, method, status: 'paid', filledData });
  t.downloads += 1; await t.save();
  res.status(201).json({ success: true, data: { transaction: tx } });
});

/** [D6] Sign a purchased contract (blockchain-verified e-signature). */
export const signContract = asyncHandler(async (req, res) => {
  const { type = 'draw', value = '' } = req.body;
  const tx = await Transaction.findOne({ _id: req.params.id, user: req.userId });
  if (!tx) throw ApiError.notFound('المعاملة غير موجودة.');
  const hash = crypto.createHash('sha256').update(`${tx.ref}:${value}:${Date.now()}`).digest('hex');
  const blockchainTx = '0x' + crypto.randomBytes(20).toString('hex'); // simulated on-chain anchor
  tx.signature = { type, value, hash, blockchainTx, signedAt: new Date() };
  tx.status = 'signed'; await tx.save();
  res.json({ success: true, data: { transaction: tx } });
});

/** [D7] Receipt / transaction details. */
export const getTransaction = asyncHandler(async (req, res) => {
  const id = req.params.id; const isOid = /^[0-9a-f]{24}$/.test(id);
  const tx = await Transaction.findOne(isOid ? { $or: [{ _id: id }, { ref: id }], user: req.userId } : { ref: id, user: req.userId });
  if (!tx) throw ApiError.notFound('المعاملة غير موجودة.');
  res.json({ success: true, data: { transaction: tx } });
});

export const myTransactions = asyncHandler(async (req, res) =>
  res.json({ success: true, data: { transactions: await Transaction.find({ user: req.userId }).sort({ createdAt: -1 }) } })
);
