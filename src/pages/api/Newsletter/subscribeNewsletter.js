import { db } from '../../../../firebaseConfig';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, source = 'website' } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Generate a unique subscriber ID using uuid
    const subscriberId = uuidv4();
    const collectionName = `subscribers_${source}`;

    try {
      const docRef = doc(collection(db, collectionName), subscriberId);
      await setDoc(docRef, {
        subscriberId: subscriberId,
        email: email,
        subscriptionSource: source,
        timestamp: serverTimestamp(),
      });

      return res.status(200).json({ message: 'Subscribed successfully!' });
    } catch (error) {
      console.error('Error adding subscriber:', error);
      return res.status(500).json({ error: 'Subscription failed. Please try again.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
