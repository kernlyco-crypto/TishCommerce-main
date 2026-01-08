"use client";

import { Provider } from "react-redux";
import { store } from "../store/store";
import { useAppSelector } from "../store/hooks";
import { useLocalization } from "../context/LocalizationContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function CartContent() {
  const { labels } = useLocalization();
  const items = useAppSelector((state) => state.cart.items);
  const router = useRouter();

  useEffect(() => {
    if (items.length === 0) {
      router.push('/');
    }
  }, [items.length, router]);

  const total = items.reduce(
    (sum, item) => sum + parseFloat(item.SalePrice || item.RegularPrice),
    0
  );

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">{labels.yourCart || "Your Cart"}</h1>

        <div className="space-y-6">
          {items.map((item) => {
            const price = parseFloat(item.SalePrice || item.RegularPrice);

            return (
              <div key={item.ID} className="flex gap-4 items-center border-b pb-4">
                <Image
                  src={item.FeatureImageURL}
                  alt={item.Title}
                  width={80}
                  height={100}
                  className="object-cover rounded"
                />
                <div className="flex-1">
                  <Link
                    href={`/product/${item.Slug}`}
                    className="text-lg font-semibold text-gray-800 hover:text-gray-600"
                  >
                    {item.Title}
                  </Link>
                  <p className="text-sm text-gray-600">
                    {labels.price || "Price"}: ${price.toFixed(2)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-right space-y-4">
          <p className="text-xl font-semibold text-gray-800">
            {labels.total || "Total"}: ${total.toFixed(2)}
          </p>

          <Link
            href="/checkout"
            className="inline-block bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-md text-sm font-semibold transition"
          >
            {labels.proceedToCheckout || "Proceed to Checkout"}
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function CartPage() {
  return (
    <Provider store={store}>
      <CartContent />
    </Provider>
  );
}
