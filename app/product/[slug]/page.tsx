import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug } from "../../utils/getProducts";
import { getCurrencySymbol } from "../../utils/getCurrencySymbol";
import ProductLightbox from "../../components/products/ProductLightbox";
import { getLocalization } from "../../utils/getLocalization";
import AddToCartButtonWrapper from "../../components/products/AddToCartButtonWrapper";
import TrustBlock from "../../components/products/TrustBlock";

// Define a type for route params as a Promise
type AsyncParams = Promise<{ slug?: string }>;

// read localization
const localeData = getLocalization();

/**
 * Note: `generateMetadata` must also treat `params` as a Promise.
 * Then "await params" to get the real slug value.
 */
export async function generateMetadata({
  params,
}: {
  params: AsyncParams;
}): Promise<Metadata> {
  const { slug } = await params; // MUST await

  if (!slug) {
    return {
      title: "Product Not Found",
      description: "No product slug provided.",
    };
  }

  // Local file read is now allowed, as we properly awaited the param
  const product = getProductBySlug(slug);
  if (!product) {
    return {
      title: "Product Not Found",
      description: `Product with slug "${slug}" does not exist.`,
    };
  }

  return {
    title: `${product.Title} - ${localeData.siteName}`,
    description: product.ShortDescription,
  };
}

/**
 * The route itself must also treat `params` as a Promise.
 */
export default async function ProductPage({
  params,
}: {
  params: AsyncParams;
}) {
  // First await for the real param
  const { slug } = await params;
  if (!slug) {
    return notFound();
  }

  // Now do local file read
  const product = getProductBySlug(slug);
  if (!product) {
    return notFound();
  }

  // Check if product is free
  const effectivePrice = parseFloat(product.SalePrice || product.RegularPrice);
  const isFree = effectivePrice === 0;

  // Check if there's a valid sale price different from regular price
  const hasSalePrice = product.SalePrice &&
                       product.SalePrice.trim() !== "" &&
                       parseFloat(product.SalePrice) !== parseFloat(product.RegularPrice);

  // Build SSR UI
  const priceBlock = isFree ? (
    <p className="text-2xl font-bold text-green-600">
      FREE
    </p>
  ) : hasSalePrice ? (
    <p className="text-xl font-bold text-red-600">
      {getCurrencySymbol(product.Currency)}
      {product.SalePrice}
      <span className="ml-2 text-gray-500 line-through">
        {getCurrencySymbol(product.Currency)}
        {product.RegularPrice}
      </span>
    </p>
  ) : (
    <p className="text-xl font-bold text-gray-900">
      {getCurrencySymbol(product.Currency)}
      {product.RegularPrice}
    </p>
  );

  return (
    <div className="bg-stone-100">
      {/* Hero / Value Proposition (above the fold) */}
      <section className="py-12 bg-gradient-to-b from-white to-stone-100">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{product.Title}</h1>
          <p className="text-xl text-gray-700 mb-6">احصل على هذا المنتج واستمتع بفوائد كبيرة تجعل حياتك أسهل وأكثر أمانًا.</p>
          <div className="mb-4">{priceBlock}</div>
        </div>
      </section>

      {/* Problem → Solution framing */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">هل تواجه مشكلة في إدارة المهام اليومية؟</h2>
          <p className="text-gray-700 mb-4">معظم الناس يفقدون الوقت في المهام المتكررة التي يمكن أتمتتها.</p>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">الحل البسيط والفعال</h3>
          <p className="text-gray-700">هذا المنتج يوفر لك أدوات متقدمة لأتمتة المهام وتوفير الوقت، مما يتيح لك التركيز على ما يهم حقًا.</p>
        </div>
      </section>

      {/* What the user gets (deliverables / features) */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">ماذا تحصل عليه؟</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>دليل شامل للبدء السريع</li>
            <li>أدوات أتمتة جاهزة للاستخدام</li>
            <li>دعم فني على مدار 24 ساعة</li>
            <li>تحديثات مجانية مدى الحياة</li>
          </ul>
        </div>
      </section>

      {/* Trust & reassurance block (non-testimonial, logical trust) */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <TrustBlock />
        </div>
      </section>

      {/* Primary CTA section */}
      <section className="py-12 bg-gray-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-semibold mb-4">لا تفوت الفرصة!</h2>
          <p className="mb-6">ابدأ اليوم وشاهد الفرق بنفسك.</p>
          <AddToCartButtonWrapper product={product} buttonText="اشترِ الآن بثقة" />
        </div>
      </section>

      {/* Secondary reassurance (FAQ-style, max 3 items) */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">أسئلة شائعة</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-800">هل المنتج آمن تمامًا؟</h3>
              <p className="text-gray-700">نعم، نحن نستخدم تشفيرًا متقدمًا لحماية بياناتك.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">هل يمكنني الحصول على استرداد إذا لم أعجبني؟</h3>
              <p className="text-gray-700">بالتأكيد، لدينا سياسة استرداد خلال 30 يومًا.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">كيف أحصل على الدعم؟</h3>
              <p className="text-gray-700">تواصل معنا عبر البريد الإلكتروني أو الدردشة الحية.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
