export default function ProductCard({ product }) {
  return (
    <a
      href={product.affiliateLink}
      target="_blank"
      rel="noopener noreferrer"
      // 1. Reduced padding (p-3 sm:p-4) and slightly smaller rounded corners to make the card tighter
      className="group bg-black/[0.02] backdrop-blur-2xl rounded-2xl p-3 sm:p-4 border border-black/10 hover:border-black/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] block"
    >
      {/* 2. Removed the yellowish gray gradient. Replaced with pure transparent glass blur */}
      <div className="aspect-square mb-3 bg-white/40 backdrop-blur-md rounded-xl overflow-hidden p-2 sm:p-3 flex items-center justify-center group-hover:scale-105 transition-transform duration-500 border border-black/5">
        <img
          src={product.image}
          className="w-full h-full object-contain mix-blend-multiply"
          alt={product.title}
        />
      </div>

      {/* 3. Tighter text sizing */}
      <h3 className="text-xs sm:text-sm font-bold text-black line-clamp-2 leading-snug group-hover:text-black/60 transition-colors duration-300">
        {product.title}
      </h3>

      <p className="text-[9px] sm:text-[10px] uppercase tracking-widest font-black text-black/40 mt-1.5 group-hover:text-black/70 transition-colors">
        {product.category}
      </p>
    </a>
  )
}