'use client';
import React, { useEffect, useState } from 'react';
import ProductCard from "../../components/ProductCard";
import { CiStar } from "react-icons/ci";
import { AiFillHeart, AiFillStar } from "react-icons/ai";
import { AiOutlineHeart } from "react-icons/ai";
import { db } from '../../../firebaseConfig';
import { doc, getDoc, collection, getDocs, query, where, setDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation

const ProductDetail = () => {
  const router = useRouter(); // Initialize the router
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const userId = sessionStorage.getItem("userId"); // Get the user ID from session storage

  useEffect(() => {
    const productId = sessionStorage.getItem("productId");

    const fetchProductDetails = async () => {
      const productRef = doc(db, 'products', productId);
      const productSnap = await getDoc(productRef);

      if (productSnap.exists()) {
        setProduct(productSnap.data());
        fetchRelatedProducts(productSnap.data().category);
      } else {
        console.log("No such product!");
      }
    };

    const fetchRelatedProducts = async (category) => {
      const q = query(collection(db, 'products'), where('category', '==', category));
      const querySnapshot = await getDocs(q);
      const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRelatedProducts(products);
    };

    fetchProductDetails();
  }, []);

  const handleQuantityChange = (type) => {
    setQuantity((prevQuantity) =>
      type === 'increase' ? prevQuantity + 1 : Math.max(1, prevQuantity - 1)
    );
  };

  const handleAddToCart = async () => {
    try {
      if (!product?.id || !userId) throw new Error("Product ID or User ID is undefined");

      const cartRef = doc(db, "users", userId, "cart", product.id);
      await setDoc(cartRef, {
        ...product,
        quantity,
        addedAt: serverTimestamp(),
      });
      console.log("Product added to cart:", product.id);
      router.push('/cart'); // Navigate to the cart page
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleAddToWishlist = async () => {
    try {
      if (!product?.id || !userId) throw new Error("Product ID or User ID is undefined");

      const wishlistRef = doc(db, "users", userId, "wishlist", product.id);
      await setDoc(wishlistRef, {
        ...product,
        addedAt: serverTimestamp(),
      });
      console.log("Product added to wishlist:", product.id);
      setIsFavorite(true); // Set favorite state to true
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  };

  const colors = ['#D3D3D3', '#FF0000'];
  const sizes = ['S', 'M', 'L'];

  if (!product) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6 bg-white text-black font-poppins">
      <div className="flex flex-col lg:flex-row lg:space-x-12">
        <div className="w-full lg:w-1/2 h-auto mb-6 lg:mb-0 bg-gray-200 flex items-center justify-center">
          <img
            className="w-full object-contain"
            src={product.images}
            alt={product.title}
          />
        </div>

        <div className="w-full lg:w-[35%]">
          <h1 className="text-2xl font-bold mb-4">{product.title}</h1>
          <div className="flex items-center mb-2">
            <span className="mr-2 flex items-center">
              {Array.from({ length: 5 }, (_, index) => (
                index < product.rating ? (
                  <AiFillStar key={index} size={20} className="text-[#FFAD33]" />
                ) : (
                  <CiStar key={index} size={20} className="text-[#FFAD33]" />
                )
              ))}
              <span className="text-gray-600 ml-2">({product.reviews} Reviews)</span>
              <span className='text-black mx-4'>|</span>
              <span className="text-green-600">In Stock</span>
            </span>
          </div>
          <p className="text-2xl text-gray-800 font-semibold mb-4">INR {product.price}</p>
          <p className="text-gray-600 mb-4 leading-6 text-justify">
            {product.description}
          </p>

          <hr className="mb-4 border-gray-300" />

          <div className="flex flex-col mb-4">
            <div className='flex'>
              <h3 className="text-lg font-semibold mb-2 mr-5">Colors:</h3>
              <div className="flex space-x-2 mb-4">
                {colors.map((color, index) => (
                  <button
                    key={index}
                    className={`w-8 h-8 rounded-full border-2 ${selectedColor === color ? "border-black" : "border-gray-300"}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </div>
            </div>
            <div className='flex'>
              <h3 className="text-lg font-semibold mr-5 mb-2">Size:</h3>
              <div className="flex space-x-2">
                {sizes.map((size, index) => (
                  <button
                    key={index}
                    className={`px-4 py-2 border rounded-md ${selectedSize === size ? "border-none text-white bg-[#E57A7A]" : "border-gray-300"}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center mb-4 space-x-4">
            <div className="flex items-center border border-gray-300 rounded">
              <button className="px-3 py-1 text-gray-600" onClick={() => handleQuantityChange('decrease')}>-</button>
              <span className="px-4 py-1 border-l border-r">{quantity}</span>
              <button className="px-3 py-1 text-gray-600" onClick={() => handleQuantityChange('increase')}>+</button>
            </div>
            <button className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600" onClick={handleAddToCart}>Buy Now</button>
            {isFavorite ? (
              <AiFillHeart
                size={30}
                className="text-red-500 cursor-pointer"
                onClick={() => {
                  setIsFavorite(false);
                  // Optionally add logic to remove from wishlist
                }}
              />
            ) : (
              <AiOutlineHeart
                size={30}
                className="text-black cursor-pointer"
                onClick={handleAddToWishlist}
              />
            )}
          </div>

          <div className="mt-4 border-t pt-4">
            <div className="border flex py-4 px-2 mb-2 rounded-md">
              <div className="flex items-center space-x-2">
                <img src="/images/products/truck.png" alt="Free Delivery" className="w-8 h-8 mr-2" />
              </div>
              <div>
                <p className="text-black">Free Delivery</p>
                <p className="text-sm text-black underline">Get your order delivered free of charge.</p>
              </div>
            </div>
            <div className="border flex py-4 px-2 mb-2 rounded-md">
              <div className="flex items-center space-x-2">
                <img src="/images/products/truck.png" alt="Return" className="w-8 h-8 mr-2" />
              </div>
              <div>
                <p className="text-black">Return</p>
                <p className="text-sm text-black underline">Free 30 Days Delivery Returns. Details</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <div className="flex items-center">
          <div className="h-10 w-5 mr-5 bg-gray-500" />
          <h2 className="text-2xl font-bold">Related Products</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {relatedProducts.map((relatedProduct) => (
            <ProductCard key={relatedProduct.id} product={relatedProduct} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
