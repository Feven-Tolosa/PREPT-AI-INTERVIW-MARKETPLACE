'use client';

import { createCheckoutSession } from '@/app/actions/stripe';

export default function CheckoutButton({ priceId }: { priceId: string }) {
  return (
    <button
      onClick={async () => await createCheckoutSession(priceId)}
      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
    >
      Buy Now
    </button>
  );
}
