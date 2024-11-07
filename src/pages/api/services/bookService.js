// pages/api/services/bookService.js
import { db } from '../../../../firebaseConfig';
import { collection, doc, setDoc } from 'firebase/firestore';

// Default export function for Next.js API route
export default async function handler(req, res) {
  if (req.method === 'POST') {  // Check if the request is a POST request
    const { userId, formData } = req.body;

    if (!userId || !formData) {
      return res.status(400).json({ error: 'User ID and form data are required.' });
    }

    try {
      const bookingID = `BID_${Date.now()}`; // Generate a unique booking ID
      const bookingsRef = collection(db, 'bookings');

      // Save the booking document
      await setDoc(doc(bookingsRef, bookingID), {
        ...formData,
        bookingID,
        userId,
        createdAt: new Date().toISOString(),
      });

      res.status(200).json({ success: true, bookingID });
    } catch (error) {
      console.error('Error booking service:', error);
      res.status(500).json({ error: 'An error occurred while booking the service.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
