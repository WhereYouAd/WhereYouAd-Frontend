import IosAppDockImage from "@/assets/mockup/iOS app dock.png";
import IpadMockupImage from "@/assets/mockup/iPad Air mockup.png";
import LaptopMockupImage from "@/assets/mockup/laptop_mockup.png";
import Desktop960Avif from "@/assets/mockup/optimized/landing/device-desktop-960.avif";
import Desktop960Webp from "@/assets/mockup/optimized/landing/device-desktop-960.webp";
import Mobile640Avif from "@/assets/mockup/optimized/landing/device-mobile-640.avif";
import Mobile640Webp from "@/assets/mockup/optimized/landing/device-mobile-640.webp";
import Tablet960Avif from "@/assets/mockup/optimized/landing/device-tablet-960.avif";
import Tablet960Webp from "@/assets/mockup/optimized/landing/device-tablet-960.webp";

const MOCKUP_OVERLAY_CLASS =
  "absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent";

export default function LandingMultiDevice() {
  return (
    <section className="bg-surface-100 py-20 md:py-40">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-7 md:mb-10 text-center">
          <p className="font-label text-primary-500">Multi-device support</p>
          <h2 className="mt-3 font-heading2 text-text-title">
            모바일·태블릿·데스크탑에서 모두 사용 가능
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <article className="relative overflow-hidden rounded-3xl bg-surface-500 shadow-card min-h-[360px]">
            <picture>
              <source type="image/avif" srcSet={Mobile640Avif} />
              <source type="image/webp" srcSet={Mobile640Webp} />
              <img
                src={IosAppDockImage}
                alt="모바일에서 WhereYouAd를 사용하는 화면"
                className="absolute inset-0 h-full w-full object-cover object-[80%_100%]"
                loading="lazy"
                decoding="async"
              />
            </picture>
            <div className={MOCKUP_OVERLAY_CLASS} />
            <div className="relative z-10 p-6 flex flex-col justify-end h-full">
              <p className="font-caption text-surface-100/80">Mobile</p>
            </div>
          </article>

          <article className="relative overflow-hidden rounded-3xl bg-surface-500 shadow-card min-h-[360px]">
            <picture>
              <source type="image/avif" srcSet={Tablet960Avif} />
              <source type="image/webp" srcSet={Tablet960Webp} />
              <img
                src={IpadMockupImage}
                alt="태블릿에서 WhereYouAd를 사용하는 화면"
                className="absolute inset-0 h-full w-full scale-[1.8] object-cover object-[58%_20%]"
                loading="lazy"
                decoding="async"
              />
            </picture>
            <div className={MOCKUP_OVERLAY_CLASS} />
            <div className="relative z-10 p-6 flex flex-col justify-end h-full">
              <p className="font-caption text-surface-100/80">Tablet</p>
            </div>
          </article>

          <article className="relative overflow-hidden rounded-3xl bg-surface-500 shadow-card min-h-[360px]">
            <picture>
              <source type="image/avif" srcSet={Desktop960Avif} />
              <source type="image/webp" srcSet={Desktop960Webp} />
              <img
                src={LaptopMockupImage}
                alt="노트북에서 WhereYouAd를 사용하는 화면"
                className="absolute inset-0 h-full w-full scale-[1.1] object-cover object-[58%_30%]"
                loading="lazy"
                decoding="async"
              />
            </picture>
            <div className={MOCKUP_OVERLAY_CLASS} />
            <div className="relative z-10 p-6 flex flex-col justify-end h-full">
              <p className="font-caption text-surface-100/80">Desktop</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
