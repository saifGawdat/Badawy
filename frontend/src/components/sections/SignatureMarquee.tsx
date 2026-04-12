import Image from "next/image";

const COUNT = 10;

function Segment({
  id,
  hideFromA11y,
}: {
  id: string;
  hideFromA11y?: boolean;
}) {
  return (
    <div className="marquee-segment" aria-hidden={hideFromA11y || undefined}>
      {Array.from({ length: COUNT }).map((_, index) => (
        <div key={`${id}-${index}`} className="marquee-item">
          <Image
            src="/signature2.png"
            alt={hideFromA11y ? "" : "Signature"}
            width={140}
            height={48}
            className="opacity-95"
          />
        </div>
      ))}
    </div>
  );
}

export const SignatureMarquee = () => {
  return (
    <section className="bg-black py-12 overflow-hidden" dir="ltr">
      <div className="marquee-wrapper">
        <div className="marquee-track">
          <Segment id="a" />
          <Segment id="b" hideFromA11y />
        </div>
      </div>
    </section>
  );
};
