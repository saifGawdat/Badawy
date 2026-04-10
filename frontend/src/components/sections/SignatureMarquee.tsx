import Image from "next/image";

export const SignatureMarquee = () => {
  return (
    <section className="bg-black py-12 overflow-hidden">
      <div className="marquee-track">
        {Array.from({ length: 20 }).map((_, index) => (
          <div key={index} className="marquee-item">
            <Image
              src="/signature2.png"
              alt="Signature"
              width={140}
              height={48}
              className="opacity-95"
            />
          </div>
        ))}
      </div>
    </section>
  );
};
