"use client";

import { useState, useMemo } from "react";

import Link from "next/link";

import { ArrowRight, Search, ChevronDown, LayoutGrid, BarChart2, SlidersHorizontal } from "lucide-react";

export function Catalog({ courses = [], categories = [] }: { courses?: any[], categories?: any[] }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [activeLevel, setActiveLevel] = useState("Todos");
  const [sortBy, setSortBy] = useState("recientes");

  const filteredAndSorted = useMemo(() => {
    let result = [...courses];

    if (search.trim()) {
      const q = search.toLowerCase();

      result = result.filter(c =>
        (c.title || "").toLowerCase().includes(q) ||
        (c.desc || "").toLowerCase().includes(q)
      );
    }

    if (activeCategory !== "Todos") {
      result = result.filter(c => c.category === activeCategory);
    }

    if (activeLevel !== "Todos") {
      result = result.filter(c => c.level === activeLevel);
    }

    if (sortBy === "precio-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "precio-desc") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [courses, search, activeCategory, activeLevel, sortBy]);

  return (
    <section id="catalogo" className="py-24 relative" style={{ backgroundColor: "#F7FBF0", backgroundImage: "radial-gradient(#d9f99d 1px, transparent 1px)", backgroundSize: "24px 24px" }}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#F7FBF0]/90 pointer-events-none"></div>
      <div className="relative max-w-7xl mx-auto px-5 lg:px-8">
        <div className="text-center max-w-3xl mx-auto reveal">
          <p
            className="text-[11px] font-semibold mb-4"
            style={{ color: "#5A9020", letterSpacing: "3px" }}
          >
            CATÁLOGO DE CURSOS
          </p>
          <h2
            className="font-display font-bold"
            style={{ color: "#1A3A0A", fontSize: "clamp(30px, 4vw, 46px)", lineHeight: 1.15 }}
          >
            Nuestros Cursos
          </h2>
          <p className="mt-4" style={{ color: "#4A7018", fontSize: "16px", lineHeight: 1.7 }}>
            Aprende de expertos y potencia tu carrera profesional con nuestra selección premium.
          </p>
        </div>

        {/* Top Filters Bar */}
        <div className="mt-10 flex flex-col gap-6 reveal">
          {/* Search */}
          <div className="relative max-w-3xl mx-auto w-full">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por título o descripción..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-6 py-4 rounded-full border border-gray-200 focus:outline-none focus:border-[#5A9020] focus:ring-2 focus:ring-[#A8E060] text-[15px] shadow-sm transition-all bg-white"
            />
          </div>

          {/* Select Filters Container */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-2 bg-white px-3 py-2 rounded-full border border-gray-100 shadow-sm mx-auto w-fit">

            {/* Categorias */}
            <div className="relative group">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-50 cursor-pointer text-[13px] font-medium text-gray-700">
                <LayoutGrid size={15} className="text-gray-400" />
                <select
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value)}
                  className="appearance-none bg-transparent outline-none cursor-pointer pr-4"
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c === "Todos" ? "Todas las Categorías" : c}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="hidden sm:block w-px h-6 bg-gray-200"></div>

            {/* Nivel */}
            <div className="relative group">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-50 cursor-pointer text-[13px] font-medium text-gray-700">
                <BarChart2 size={15} className="text-gray-400" />
                <select
                  value={activeLevel}
                  onChange={(e) => setActiveLevel(e.target.value)}
                  className="appearance-none bg-transparent outline-none cursor-pointer pr-4"
                >
                  <option value="Todos">Todos Niveles</option>
                  <option value="Básico">Básico</option>
                  <option value="Intermedio">Intermedio</option>
                  <option value="Avanzado">Avanzado</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="hidden sm:block w-px h-6 bg-gray-200"></div>

            {/* Ordenar */}
            <div className="relative group">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-[#eef2ff] cursor-pointer text-[13px] font-semibold text-[#4f46e5] bg-[#f8fafc]">
                <SlidersHorizontal size={15} />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-transparent outline-none cursor-pointer pr-4 text-[#4f46e5]"
                >
                  <option value="recientes">Recientes primero</option>
                  <option value="precio-asc">Menor precio</option>
                  <option value="precio-desc">Mayor precio</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 pointer-events-none" />
              </div>
            </div>

          </div>

          <div className="mt-4 text-left w-full">
            <span className="text-xs font-semibold text-gray-500 bg-white border border-gray-200 px-3 py-1 rounded-md shadow-sm">
              {filteredAndSorted.length} cursos disponibles
            </span>
          </div>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filteredAndSorted.map((c, i) => (
            <article
              key={c.id || c.title}
              className="reveal overflow-hidden rounded-[24px] transition-all duration-300"
              style={{
                background: "#FFFFFF",
                border: "1.5px solid #C8E890",
                transitionDelay: `${i * 50}ms`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#A8E060";
                e.currentTarget.style.boxShadow = "0 16px 40px rgba(168,224,96,0.18)";
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#C8E890";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "none";
              }}
            >
              <div className="relative h-[220px]" style={{ background: "#1a1b26" }}>
                {c.image ? (
                  <img
                    src={c.image}
                    alt={c.title}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#1a1b26] flex items-center justify-center text-white/50">
                    <span className="text-sm">Sin imagen</span>
                  </div>
                )}
                <div
                  className="absolute inset-x-0 bottom-0 h-20"
                  style={{ background: "linear-gradient(to top, #00000088, transparent)" }}
                />
                <span
                  className="absolute top-3 left-3 rounded-full px-3 py-1 text-[11px] font-bold text-white shadow-md bg-[#2563eb]"
                >
                  {c.duration || "Asíncrono"}
                </span>
                <span
                  className="absolute top-3 right-3 rounded-full px-3 py-1 text-[11px] font-bold text-white shadow-md bg-[#6366f1]"
                >
                  {c.level || "Básico"}
                </span>
              </div>

              <div className="p-5 flex flex-col gap-3">
                <span className="text-[11px] font-bold uppercase text-[#5A9020] bg-[#EAF7D0] px-2 py-1 rounded w-fit">
                  {c.category}
                </span>
                <h3 className="font-display font-bold leading-tight" style={{ color: "#1A3A0A", fontSize: "19px" }}>
                  {c.title}
                </h3>
                <p
                  className="line-clamp-2 mb-2"
                  style={{ color: "#4A7018", fontSize: "13px", lineHeight: 1.6 }}
                >
                  {c.desc}
                </p>

                <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100">
                  <div className="flex items-baseline gap-2">
                    {c.oldPrice > 0 && (
                      <span className="line-through text-gray-400 text-[13px] font-medium">
                        S/ {c.oldPrice}
                      </span>
                    )}
                    <span className="font-bold font-display" style={{ color: "#2D5010", fontSize: "24px" }}>
                      {c.price === 0 ? "Gratis" : `S/ ${c.price}`}
                    </span>
                  </div>
                  <Link href={`/cursos/${c.slug || c.id}`}
                    className="flex items-center justify-center rounded-full w-10 h-10 transition-colors bg-[#5A9020] text-white hover:bg-[#A8E060] hover:text-[#0A1A04]"
                  >
                    <ArrowRight size={18} />
                  </Link>
                </div>
                <Link href={`/cursos/${c.slug}`}
                  className="mt-4 w-full flex items-center justify-center rounded-full py-3 font-semibold text-[14px] transition-colors"
                  style={{
                    border: "1.5px solid #2D5010",
                    color: "#2D5010",
                    background: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#2D5010";
                    e.currentTarget.style.color = "#FFFFFF";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#2D5010";
                  }}
                >
                  Ver Detalles
                </Link>
              </div>
            </article>
          ))}
          {filteredAndSorted.length === 0 && (
            <div className="col-span-full py-16 text-center text-gray-500">
              No se encontraron cursos que coincidan con tu búsqueda.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

