import Link from "next/link";

import Image from "next/image";

import { ArrowRight } from "lucide-react";

interface ServiceCardProps {
  image: string;
  title: string;
  description: string;
  href: string;
  className?: string;
}

export default function ServiceCard({ image, title, description, href, className = "" }: ServiceCardProps) {
  return (
    <div className={`group bg-white rounded-none overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-[#e0e0e0] hover:border-[#02115C]/30 ${className}`}>
      <div className="h-56 overflow-hidden relative">
        <Image
          src={image}
          alt={title}
          width={400}
          height={224}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 grayscale-[20%] brightness-[0.9] contrast-[1.1]"
        />
        <div className="absolute inset-0 bg-[#02115C]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      <div className="p-8">
        <h3 className="text-xl font-display font-black text-[#02115C] mb-4 group-hover:text-[#02115C] transition-colors duration-300 leading-tight">
          {title}
        </h3>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed font-sans">{description}</p>
        <Link
          href={href}
          className="inline-flex items-center gap-2 text-xs font-sans font-black text-[#02115C] uppercase tracking-widest group-hover:gap-3 transition-all duration-300 border-b-2 border-transparent hover:border-[#02115C] pb-1"
        >
          Ver detalles <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
