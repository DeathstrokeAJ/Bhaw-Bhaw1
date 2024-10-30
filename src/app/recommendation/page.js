"use client";
import React, { useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard";
import { FaArrowRightLong, FaArrowLeftLong } from "react-icons/fa6"; 
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

const productsPerPage = 3;

const Recommendation = () => {
  const [userId, setUserId] = useState(null);
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentForYouPage, setCurrentForYouPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch userId from sessionStorage only on the client side
  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userId");
    setUserId(storedUserId);
  }, []);

  const fetchWishlistProducts = async () => {
    if (!userId) return; // Wait until userId is available
    setLoading(true);
    try {
      const wishlistRef = collection(db, "users", userId, "wishlist");
      const snapshot = await getDocs(wishlistRef);
      const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setWishlistProducts(products);
    } catch (error) {
      setError("Error fetching wishlist products");
      console.error("Error fetching wishlist products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlistProducts();
  }, [userId]); // Add userId as a dependency

  // Pagination logic remains unchanged...
  const totalWishlistPages = Math.ceil(wishlistProducts.length / productsPerPage);
  const indexOfLastWishlistProduct = currentPage * productsPerPage;
  const indexOfFirstWishlistProduct = indexOfLastWishlistProduct - productsPerPage;
  const currentWishlistProducts = wishlistProducts.slice(indexOfFirstWishlistProduct, indexOfLastWishlistProduct);
  
  const categories = [...new Set(wishlistProducts.map(product => product.category))];
  const forYouProducts = wishlistProducts.filter(product => categories.includes(product.category));
  const totalForYouPages = Math.ceil(forYouProducts.length / productsPerPage);
  const indexOfLastForYouProduct = currentForYouPage * productsPerPage;
  const indexOfFirstForYouProduct = indexOfLastForYouProduct - productsPerPage;
  const currentForYouProducts = forYouProducts.slice(indexOfFirstForYouProduct, indexOfLastForYouProduct);

  // Function to get pagination numbers remains unchanged...
  const getPaginationNumbers = (currentPage, totalPages) => {
    const paginationNumbers = [];
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, currentPage + 1);

    if (totalPages <= 3) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage === 1) {
        endPage = 3;
      } else if (currentPage === totalPages) {
        startPage = totalPages - 2;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      paginationNumbers.push(i);
    }

    return paginationNumbers;
  };

  const wishlistPaginationNumbers = getPaginationNumbers(currentPage, totalWishlistPages);
  const forYouPaginationNumbers = getPaginationNumbers(currentForYouPage, totalForYouPages);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;


  return (
    <div className="lg:px-12 bg-white text-black p-6 font-poppins">
      <div className="mb-6">
        <h2 className="text-xl font-medium mb-4">Wishlist ({wishlistProducts.length})</h2>
        {currentWishlistProducts.length === 0 ? (
          <p>No products in your wishlist.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentWishlistProducts.map((product) => (
              <ProductCard key={product.id} product={product} isRecommendation={true} />

            ))}
          </div>
        )}
        
        <div className="flex justify-center mt-4 font-kiwi items-center">
          <div
            className={`cursor-pointer mr-12 ${currentPage === 1 ? "text-[#C4B0A9]" : "text-[#85716B]"}`}
            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
            aria-label="Previous page"
          >
            <FaArrowLeftLong size={24} />
          </div>
          
          {wishlistPaginationNumbers.map((pageNumber) => (
            <button
              key={pageNumber}
              className={`w-8 h-8 ${currentPage === pageNumber ? "bg-[#85716B] text-white" : "bg-[#C4B0A9] text-white"} rounded-full mx-2`}
              onClick={() => setCurrentPage(pageNumber)}
              aria-label={`Page ${pageNumber}`}
            >
              {pageNumber}
            </button>
          ))}
          
          <div
            className={`cursor-pointer ml-12 ${currentPage === totalWishlistPages ? "text-[#C4B0A9]" : "text-[#85716B]"}`}
            onClick={() => currentPage < totalWishlistPages && setCurrentPage(currentPage + 1)}
            aria-label="Next page"
          >
            <FaArrowRightLong size={24} />
          </div>
        </div>
      </div>

      <div className="flex items-center mb-6">
        <div className="h-10 w-5 mr-5 bg-[#E57373] rounded-3xl"></div>
        <h2 className="text-xl font-medium">For You ({forYouProducts.length})</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentForYouProducts.length === 0 ? (
          <p>No recommendations available.</p>
        ) : (
          currentForYouProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>

      <div className="flex justify-center mt-4 font-kiwi items-center">
        <div
          className={`cursor-pointer mr-12 ${currentForYouPage === 1 ? "text-[#C4B0A9]" : "text-[#85716B]"}`}
          onClick={() => currentForYouPage > 1 && setCurrentForYouPage(currentForYouPage - 1)}
          aria-label="Previous page for recommendations"
        >
          <FaArrowLeftLong size={24} />
        </div>

        {forYouPaginationNumbers.map((pageNumber) => (
          <button
            key={pageNumber}
            className={`w-8 h-8 ${currentForYouPage === pageNumber ? "bg-[#85716B] text-white" : "bg-[#C4B0A9] text-white"} rounded-full mx-2`}
            onClick={() => setCurrentForYouPage(pageNumber)}
            aria-label={`Page ${pageNumber} for recommendations`}
          >
            {pageNumber}
          </button>
        ))}

        <div
          className={`cursor-pointer ml-12 ${currentForYouPage === totalForYouPages ? "text-[#C4B0A9]" : "text-[#85716B]"}`}
          onClick={() => currentForYouPage < totalForYouPages && setCurrentForYouPage(currentForYouPage + 1)}
          aria-label="Next page for recommendations"
        >
          <FaArrowRightLong size={24} />
        </div>
      </div>
    </div>
  );
};

export default Recommendation;
