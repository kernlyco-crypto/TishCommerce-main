"use client";

import { Provider } from "react-redux";
import { store } from "../../store/store";
import AddToCartButton from "./AddToCartButton";
import { Product } from "../../../types/Product";

interface WrapperProps {
  product: Product;
  buttonText?: string;
}

export default function AddToCartButtonWrapper({ product, buttonText }: WrapperProps) {
  return (
    <Provider store={store}>
      <AddToCartButton product={product} buttonText={buttonText} />
    </Provider>
  );
}
