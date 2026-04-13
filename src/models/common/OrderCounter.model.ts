import mongoose, {HydratedDocument, InferSchemaType} from 'mongoose';

const orderCounterModel = new mongoose.Schema({
    _id: { type: String, required: true }, // The name of the sequence (e.g., 'orderNumber')
    seq: { type: Number, default: 0 }
});

export type OrderCounterRaw = InferSchemaType<typeof orderCounterModel>;
export type OrderCounterDocument = HydratedDocument<OrderCounterRaw>;

export default mongoose.model<OrderCounterDocument>('OrderCounter', orderCounterModel);