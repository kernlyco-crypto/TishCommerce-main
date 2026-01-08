"use client";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { addToCart } from "../../store/slices/cartSlice";
import { Product } from "../../../types/Product";
import { useRouter } from "next/navigation";

interface Props {
  product: Product;
  buttonText?: string;
}

export default function AddToCartButton({ product, buttonText = "Get Now" }: Props) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isInCart = useAppSelector(state => state.cart.items.some(item => item.ID === product.ID));

  const handleGetNow = () => {
    if (!isInCart) {
      dispatch(addToCart(product));
    }
    router.push('/cart');
  };

  return (
    <button
      onClick={handleGetNow}
      className="mt-4 w-full sm:w-auto bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-md text-sm font-semibold transition"
    >
      {buttonText}
    </button>
  );
}
