import React from "react";
import { Plus } from "lucide-react";
import { FALLBACK_IMAGE } from "../../data/libraryData";

export const BookCard = ({ book, onAddToCart, onOpen, isOwned }) => {

  // ✅ FIX: build correct public image URL
  const imageUrl = book?.productImage
    ? `${import.meta.env.VITE_PUBLIC_URL || ""}${book.productImage}`
    : FALLBACK_IMAGE;

  return (
    <div className="group relative flex flex-col h-full">

      {/* Card */}
      <div
        className="relative w-full overflow-hidden rounded-2xl shadow-lg mb-6 bg-white transition-all duration-700 transform-gpu group-hover:-translate-y-1 group-hover:shadow-2xl"
        style={{ aspectRatio: "2/3" }}
      >

        {/* Cover */}
        <img
          src={imageUrl}
          alt={book.productName}
          onError={(e) => (e.target.src = FALLBACK_IMAGE)}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />

        {book.rentable && (
          <span className="absolute top-3 right-3 bg-indigo-600 text-white text-[10px] font-bold tracking-widest px-2 py-1 rounded-full shadow-md">
            RENT
          </span>
        )}

        {/* Type Badge */}
        <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold tracking-widest uppercase text-slate-600 border border-slate-100">
          {book.productType?.typeDesc}
        </span>

        {/* Hover Overlay */}
        <div
          className="absolute inset-0 bg-black/60 
          opacity-0 group-hover:opacity-100 
          transition-opacity flex items-center justify-center 
          pointer-events-none"
        >
          {isOwned ? (
            <div className="bg-white/20 backdrop-blur-md text-white px-6 py-2 rounded-full font-serif font-bold border border-white/30 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Already Owned
            </div>
          ) : (
            onAddToCart && (
              <button
                onClick={() => onAddToCart(book)}
                className="
                pointer-events-auto
                bg-white text-slate-900 px-6 py-3 rounded-full
                font-serif text-sm font-bold flex items-center gap-2 
                hover:bg-[#C5A059] hover:text-white transition-all shadow-xl"
              >
                <Plus size={16} />
                Add to Cart
              </button>
            )
          )}
        </div>
      </div>

      {/* Info */}
      <h3
        onClick={onOpen}
        className="cursor-pointer font-serif text-lg font-bold leading-snug line-clamp-2 min-h-[3rem] hover:text-indigo-600 transition-colors"
      >
        {book.productName}
      </h3>

      <p className="text-slate-500 italic text-sm font-serif">
        {book.author?.name}
      </p>

      {/* Description */}
      {book.productDescriptionShort && (
        <p className="mt-1 text-slate-500 text-sm font-serif leading-snug line-clamp-2">
          {book.productDescriptionShort}
        </p>
      )}

      {/* Pricing - Pushed to bottom (Only show if shopping is enabled) */}
      {onAddToCart && (
        <div className="mt-4 pt-0 flex flex-col gap-1">
          {book.productOfferprice && book.discountPercent > 0 ? (
            <>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-slate-900">
                  ₹{book.productOfferprice.toLocaleString("en-IN")}
                </span>

                <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                  {book.discountPercent}% OFF
                </span>
              </div>

              <span className="text-sm text-slate-500 line-through">
                ₹{book.productBaseprice?.toLocaleString("en-IN")}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-slate-900">
              ₹{book.productBaseprice?.toLocaleString("en-IN")}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
