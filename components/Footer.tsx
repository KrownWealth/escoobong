import Link from "next/link";

const socials = [
  { label: "Medium", href: "https://escobyte.medium.com" },
  { label: "GitHub", href: "https://github.com/escoo" },
  { label: "LinkedIn", href: "https://linkedin.com/in/escoo" },
  { label: "Twitter / X", href: "https://twitter.com/escobyte" },
];

export default function Footer() {
  return (
    <footer className="text-white bg-[#080808] flex justify-between p-8 my-10"

    >
      <h2 className="font-extrabold text-4xl">
        ESCO OBONG
      </h2>

      <div className="flex gap-6 flex-wrap justify-center" >
        {socials.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noreferrer"
            className="text-white text-lg"
          >
            {s.label}
          </Link>
        ))}
      </div>
    </footer>
  );
}