import Consultation from '../models/consultation.model.js';
import Lawyer from '../models/lawyer.model.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

/** POST /api/consultations — create a booking from the multi-step flow (Screen 6). */
export const createConsultation = asyncHandler(async (req, res) => {
  const { lawyerId, type, scheduledAt, slot, subject, documents = [] } = req.body;
  if (!lawyerId || !scheduledAt || !subject) {
    throw ApiError.badRequest('lawyerId, scheduledAt and subject are required.');
  }
  const lawyer = await Lawyer.findById(lawyerId);
  if (!lawyer) throw ApiError.notFound('Lawyer not found.');

  const consultation = await Consultation.create({
    user: req.userId,
    lawyer: lawyerId,
    type,
    scheduledAt,
    slot,
    subject,
    documents,
    price: lawyer.hourlyRate,
    status: 'pending',
  });
  res.status(201).json({ success: true, data: { consultation } });
});

/** POST /api/consultations/:id/pay — move funds into escrow (Screen 7). */
export const payConsultation = asyncHandler(async (req, res) => {
  const { method = 'card' } = req.body;
  const c = await Consultation.findOne({ _id: req.params.id, user: req.userId });
  if (!c) throw ApiError.notFound('Consultation not found.');
  c.payment = { method, status: 'in_escrow' };
  c.status = 'confirmed';
  await c.save();
  res.json({ success: true, data: { consultation: c } });
});

/** GET /api/consultations — the user's consultations. */
export const myConsultations = asyncHandler(async (req, res) => {
  const consultations = await Consultation.find({ user: req.userId })
    .populate('lawyer', 'name title avatarSeed city')
    .sort({ scheduledAt: -1 });
  res.json({ success: true, data: { consultations } });
});
