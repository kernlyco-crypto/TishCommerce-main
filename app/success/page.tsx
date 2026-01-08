'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

interface Download {
  productId: string;
  productTitle: string;
  downloadURL: string;
}

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const paymentIntentId = searchParams.get('payment_intent');
  const paypalOrderId = searchParams.get('paypal_order_id');
  const [downloads, setDownloads] = useState<Download[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!paymentIntentId && !paypalOrderId) {
      setError('Invalid access. No payment information provided.');
      setLoading(false);
      return;
    }

    const fetchDownloads = async () => {
      try {
        const params = new URLSearchParams();
        if (paymentIntentId) params.set('payment_intent_id', paymentIntentId);
        if (paypalOrderId) params.set('paypal_order_id', paypalOrderId);

        const response = await fetch(`/api/download?${params}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch downloads');
        }

        setDownloads(data.downloads || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDownloads();
  }, [paymentIntentId, paypalOrderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 bg-gray-50" dir="rtl">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-sm">
        {/* Confirmation & relief block: Reassure the user that payment has completed successfully, providing immediate clarity and relief. */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-600 mb-4">تم الدفع بنجاح</h1>
          <p className="text-gray-600 mb-4">شكراً لك على طلبك. تم استلام دفعك بأمان.</p>
        </div>

        {/* What happens now block: Outline the exact next steps to guide the user clearly. */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">ماذا يحدث الآن؟</h2>
          <p className="text-gray-600 mb-4">ستتلقى تفاصيل الطلب عبر البريد الإلكتروني خلال دقائق قليلة، بما في ذلك روابط التحميل الخاصة بمنتجاتك.</p>
        </div>

        {/* Download access block: Provide clear, unambiguous access to downloads, emphasizing permanence and distinguishing between on-page and email delivery. */}
        {downloads.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">وصول التحميل</h2>
            <p className="text-gray-600 mb-4">يمكنك الوصول إلى منتجاتك إلكترونياً بشكل دائم من خلال الروابط أدناه. ستتلقى أيضاً نسخة من هذه الروابط عبر البريد الإلكتروني لتسهيل الوصول في أي وقت.</p>
            <div className="space-y-4">
              {downloads.map((download) => (
                <div key={download.productId} className="flex items-center justify-between p-4 border rounded-lg">
                  <a
                    href={download.downloadURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                  >
                    تحميل
                  </a>
                  <div>
                    <p className="font-medium">{download.productTitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Support & reassurance block: Offer clear instructions for what to do if something fails, without adding new systems, to build confidence. */}
        <div className="text-center">
          <p className="text-gray-600">
            إذا واجهت أي مشكلة في التحميل، يرجى الاتصال بنا عبر صفحة التواصل للحصول على المساعدة الفورية.
          </p>
        </div>
      </div>
    </div>
  );
}