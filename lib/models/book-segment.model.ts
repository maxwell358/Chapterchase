import { Schema, model, models, Types } from 'mongoose';

const BookSegmentSchema = new Schema({
    clerkId: { type: String, required: true },
    bookId: { type: Types.ObjectId, ref: 'Book', required: true },
    content: { type: String, required: true },
    segmentIndex: { type: Number, required: true },
    pageNumber: { type: Number },
    wordCount: { type: Number, required: true },
}, { timestamps: true });

// Index for search
BookSegmentSchema.index({ content: 'text' });
BookSegmentSchema.index({ bookId: 1, segmentIndex: 1 });

const BookSegment = models?.BookSegment || model('BookSegment', BookSegmentSchema);

export default BookSegment;
