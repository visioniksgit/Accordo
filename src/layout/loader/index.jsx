"use client";

import dynamic from "next/dynamic";
import accordoLoader from "../../../public/assets/images/loader/accordo-loader.json";

const Lottie = dynamic(
  () => import("lottie-react").then((mod) => mod.Lottie || mod.default),
  { ssr: false }
);

const Loader = () => {
  return (
    <div className="loader-wrapper">
      <Lottie
        src={accordoLoader}
        animationdata={accordoLoader}
        autoplay={true}
        loop={true}
        style={{ width: 200, height: 200 }}
      />
    </div>
  );
};

export default Loader;
