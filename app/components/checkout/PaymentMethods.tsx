"use client";

import StripeClientSecretLoader from "./StripeClientSecretLoader";

export default function PaymentMethods() {
  return (
    <div className="mt-8">
      {/* Payment Action Block - Contains the primary CTA for completing payment */}
      <h2 className="text-lg font-semibold text-gray-800 mb-2">
        طريقة الدفع
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        المنتجات الرقمية توفر وصولاً مدى الحياة.
      </p>

      <div className="bg-white rounded p-5">
        <StripeClientSecretLoader />
      </div>
    </div>
  );
}
