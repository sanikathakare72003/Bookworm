import React, { useState, useEffect } from "react";
import { BookCard } from "../Library/BookCard";
import { ProductModal } from "../Library/ProductModal";
import { useLocation } from "react-router-dom";
import { LanguageFilter } from "../Filters/LanguageFilter";

export const ProductView = ({ onAddToCart }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchText, setSearchText] = useState("");
  const location = useLocation();
  const [generes, setGeneres] = useState([]);
  const [selectedGenere, setSelectedGenere] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [ownedBookIds, setOwnedBookIds] = useState(new Set());

  useEffect(() => {
    fetchAllProducts();
    fetchAllGeneres();
    fetchUserLibrary();
  }, []);

  const fetchUserLibrary = () => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user?.userId) return;

    fetch(`http://localhost:8080/api/my-library/user/${user.userId}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // data -> [{ product: { productId: 1, ... } }]
        const ids = new Set(data.map((item) => Number(item.product.productId)));
        setOwnedBookIds(ids);
      })
      .catch((err) => console.error("Failed to fetch library", err));
  };

  const fetchAllGeneres = () => {
    fetch("http://localhost:8080/api/generes")
      .then((res) => res.json())
      .then((data) => setGeneres(data))
      .catch((err) => console.error("Failed to load generes", err));
  };

  const fetchAllProducts = () => {
    setLoading(true);
    fetch("http://localhost:8080/api/products")
      .then((res) => res.json())
      .then((data) => {
        setBooks(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    if (location.state?.reset) {
      setSearchText(""); // 🔴 reset search box
      setSelectedBook(null); // 🔴 close modal
      fetchAllProducts(); // 🔴 reload all products

      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  /* ============================
     ✅ SEARCH ONLY ON BUTTON CLICK
     ============================ */
  const handleSearch = () => {
    const query = searchText.trim();

    if (query.length === 0) {
      fetchAllProducts(); // reset to all products
      return;
    }

    setLoading(true);
    fetch(
      `http://localhost:8080/api/products/search?name=${encodeURIComponent(
        query,
      )}`,
    )
      .then((res) => res.json())
      .then((data) => {
        setBooks(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleGenereChange = (e) => {
    const genere = e.target.value;
    setSelectedGenere(genere);
    setSelectedLanguage("");
    setSearchText("");

    setBooks([]); // 🔥 FORCE CLEAR
    setLoading(true);
    if (genere === "") {
      fetchAllProducts();
      return;
    }

    fetch(
      `http://localhost:8080/api/products/by-genere/${encodeURIComponent(genere)}`,
    )
      .then((res) => res.json())
      .then((data) => {
        setBooks(Array.isArray(data) ? data : []); // 🔥 SAFE ASSIGN
        setLoading(false);
      })
      .catch(() => {
        setBooks([]); // 🔥 CLEAR ON ERROR
        setLoading(false);
      });
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    setSelectedGenere("");
    setSearchText("");

    setBooks([]); // 🔥 FORCE CLEAR
    setLoading(true);

    if (language === "") {
      fetchAllProducts();
      return;
    }

    fetch(
      `http://localhost:8080/api/products/by-language/${encodeURIComponent(language)}`,
    )
      .then((res) => res.json())
      .then((data) => {
        setBooks(Array.isArray(data) ? data : []); // 🔥 SAFE
        setLoading(false);
      })
      .catch(() => {
        setBooks([]); // 🔥 CLEAR
        setLoading(false);
      });
  };

  //     useEffect(() => {
  //     setLoading(true);

  //     fetch("http://localhost:8080/api/products")
  //       .then((res) => res.json())
  //       .then((data) => {
  //         setBooks(data);
  //         setLoading(false);
  //       })
  //       .catch(() => setLoading(false));
  //   }, []);

  // useEffect(() => {
  //   const query = searchText.trim();

  //   if (query.length === 0) {
  //     // setBooks([]);
  //     // setLoading(false);
  //     return;
  //   }

  //   setLoading(true);

  // const url = `http://localhost:8080/api/products/search?name=${encodeURIComponent(query)}`;

  //     fetch(url)
  //       .then((res) => res.json())
  //       .then((data) => {
  //         setBooks(data);
  //         setLoading(false);
  //       })
  //       .catch((err) => {
  //         console.error("Failed to fetch products", err);
  //         setLoading(false);
  //       });
  //   }, [searchText]);

  if (loading) {
    return <p className="text-center mt-20 text-slate-500">Loading books...</p>;
  }

  return (
    <>
      <div className="animate-in fade-in duration-700 max-w-7xl mx-auto px-8">
        <div className="mb-10">
          <h1 className="text-4xl font-serif font-bold text-slate-900 mb-2 italic">
            The Stacks
          </h1>
          <p className="text-slate-500 font-serif text-lg">
            Discover your next obsession.
          </p>
        </div>

        {/* 🎯 FILTER ROW */}
        <div className="mb-10 flex items-center gap-4 flex-nowrap">
          {/* 📚 GENRE */}
          <select
            value={selectedGenere}
            onChange={handleGenereChange}
            className="w-48 px-4 py-3 rounded-xl bg-white text-black
               border border-black focus:outline-none focus:ring-2
               focus:ring-[#C5A059] font-serif cursor-pointer"
          >
            <option value="">All Genres</option>
            {generes.map((g) => (
              <option key={g.genereId} value={g.genereDesc}>
                {g.genereDesc}
              </option>
            ))}
          </select>

          {/* 🌍 LANGUAGE */}
          <div className="w-48 ">
            <LanguageFilter
              selectedLanguage={selectedLanguage}
              onLanguageChange={handleLanguageChange}
            />
          </div>

          {/* 🔍 SEARCH BAR + BUTTON */}
          {/* <div className="mb-8 flex gap-4"> */}
          <input
            type="text"
            placeholder="Search by book name, author, ISBN..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl border border-slate-400 
            focus:outline-none focus:ring-2 focus:ring-[#C5A059]
            font-serif text-slate-700"
          />


          <button
            onClick={handleSearch}
            className="px-6 py-3 rounded-xl bg-black text-white font-serif
                       hover:bg-[#C5A059] transition-colors whitespace-nowrap"
          >
            Search
          </button>
        </div>

        <div className="max-w-7xl mx-auto">
          {!loading && books.length === 0 ? (
            <div className="text-center mt-32 py-16">
              <p className="text-4xl font-serif font-semibold text-slate-300 mb-3">
                No books found
              </p>

              <button
                onClick={() => {
                  setSelectedGenere("");
                  setSelectedLanguage("");
                  setSearchText("");
                  fetchAllProducts();
                }}
                className="mt-8 text-slate-600 hover:text-[#C5A059]
                 font-serif text-lg transition-colors"
              >
                ← Back to all books
              </button>
            </div>
          ) : (
            <div
              className="grid 
    grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5
    gap-12
  "
            >
              {books.map((b) => (
                <BookCard
                  key={b.productId}
                  book={b}
                  onAddToCart={onAddToCart}
                  onOpen={() => setSelectedBook(b)}
                  isOwned={ownedBookIds.has(Number(b.productId))}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedBook && (
        <ProductModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
        />
      )}
    </>
  );
};

/*export const LibraryView = ({ books, onAddToCart }) => (
  <div className="animate-in fade-in duration-700">
    <div className="mb-10">
      <h1 className="text-4xl font-serif font-bold text-slate-900 mb-2 italic">The Stacks</h1>
      <p className="text-slate-500 font-serif text-lg">Discover your next obsession.</p>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
      {books.map((b) => (
        <BookCard key={b.id} book={b} onAddToCart={onAddToCart} />
      ))}
    </div>
  </div>
);*/
