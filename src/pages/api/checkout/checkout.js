import { db } from '../../../../firebaseConfig';
import { doc, setDoc, writeBatch } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const {
        userId,
        cartItems,
        paymentMethod,
        shippingAddress: {
          firstName,
          lastName,
          address,
          apartment,
          state,
          city,
          postalCode,
        },
        email,
        notification,
        totalAmount
      } = req.body;

      if (!userId || !cartItems || !paymentMethod || !email || !firstName || !lastName || !address || !city || !state || !postalCode) {
        return res.status(400).json({ error: 'Required fields are missing' });
      }

      const orderId = 'OID' + Math.floor(Date.now() / 1000);
      const order = {
        userId,
        items: cartItems,
        totalAmount,
        paymentMethod,
        shippingAddress: {
          firstName,
          lastName,
          address,
          apartment,
          state,
          city,
          postalCode,
          email
        },
        notification,
        status: 'initialized',
        createdAt: new Date(),
      };

      const batch = writeBatch(db);

      const orderRef = doc(db, 'orders', orderId);
      batch.set(orderRef, order);

      const checkoutRef = doc(db, 'checkout', orderId);
      batch.set(checkoutRef, {
        ...order,
        createdAt: new Date(),
        status: 'Initialized',
      });

      await batch.commit();

      return res.status(201).json({
        message: 'Checkout successful',
        orderId,
        order,
      });
    } catch (error) {
      console.error('Error during checkout:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
