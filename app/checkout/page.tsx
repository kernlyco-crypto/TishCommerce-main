import OrderInfoInitializer from "../components/checkout/OrderInfoInitializer";
import BillingForm from "../components/checkout/BillingForm";
import OrderSummary from "../components/checkout/OrderSummary";
import PaymentMethods from "../components/checkout/PaymentMethods";
import TrustBlock from "../components/checkout/TrustBlock";
import { CheckoutProvider } from "../context/CheckoutContext";
import { ReduxProvider } from "../providers";

export default function CheckoutPage() {
  return (
    <ReduxProvider>
      <CheckoutProvider>
        <section className="py-10 px-4 md:px-8 bg-gray-50">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Order Clarity Block - Concise summary of what the user is buying */}
            <OrderInfoInitializer />
            <OrderSummary />

            {/* Trust Reinforcement Block - Security, instant access, reassurance */}
            <TrustBlock />

            {/* Payment Action Block - Billing form and primary CTA for payment */}
            <BillingForm />
            <PaymentMethods />
          </div>
        </section>
      </CheckoutProvider>
    </ReduxProvider>
  );
}
