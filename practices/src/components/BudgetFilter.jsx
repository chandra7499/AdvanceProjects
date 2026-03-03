import { useState, useRef, useCallback } from "react";
import { useInfiniteProducts } from "../hooks/useInfiniteProducts";
import { DiscountTag } from "../components/layouts/layouts";
import { useNavigate } from "react-router-dom";
import { useSelection } from "../functions/searchFunction";

export default function ModernProductFilter() {
  const [price, setPrice] = useState(2000);
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("asc");
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteProducts({ maxPrice: price, category, sort });

    const navigate = useNavigate();
      const productSelection = useSelection();

  function Navigation(id) {
    productSelection(id, navigate);
  }

  const rangeMemorize = useRef(100);

  const observer = useRef();

  const lastProductRef = useCallback(
    (node) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (node) observer.current.observe(node);
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage],
  );
  console.log(data);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-xl shadow flex flex-wrap gap-4 items-center justify-between">
        {/* Price Slider */}
        <div>
          <p className="text-sm font-semibold mb-1">Max Price ₹{price}</p>
          <input
            ref={rangeMemorize}
            type="range"
            min="100"
            max="100000"
            step="100"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-48 accent-sky-950 cursor-pointer"
          />
        </div>

        {/* Category */}
        <select
          className="border p-2 rounded-lg"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">All</option>
          {/* <option value="Electronics">Electronics</option>
          <option value="Fashion">Fashion</option>
          <option value="Home">Home</option> */}
        </select>

        {/* Sorting */}
        <select
          className="border p-2 rounded-lg"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="asc">Price: Low → High</option>
          <option value="desc">Price: High → Low</option>
        </select>
      </div>

      {/* PRODUCT GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
        {isLoading &&
          Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-white p-4 rounded-xl shadow"
            >
              <div className="bg-gray-200 h-40 mb-3 rounded"></div>
              <div className="bg-gray-200 h-4 mb-2 rounded"></div>
              <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
            </div>
          ))}

        {data?.pages.map((page, pageIndex) =>
          page.products.map((product, index) => {
            const isLast =
              pageIndex === data.pages.length - 1 &&
              index === page.products.length - 1;

            return (
              <div
                ref={isLast ? lastProductRef : null}
                key={product.id}
                className="bg-white flex flex-col  p-4 rounded-xl shadow hover:shadow-lg transition"
              >
                <div className="flex text-2xl">
                {product?.discount && product?.discount?.percentage > 0 && <DiscountTag discount={product?.discount?.percentage} />}
                </div>
                <div className="flex flex-grow w-full">
                  <img
                    src={
                      Array.isArray(product?.images)
                        ? product.images[0]
                        : product.image
                    }
                    className="w-full object-contain object-center cursor-pointer rounded mb-3"
                    onClick={() => Navigation(product.id)}
                  />
                </div>
                <h3 className="font-semibold line-clamp-2">{product.name}</h3>
                <p className="text-sky-950  font-bold mt-1">₹{product.price}</p>
              </div>
            );
          }),
        )}
      </div>

      {isFetchingNextPage && (
        <p className="text-center mt-4">Loading more...</p>
      )}
    </div>
  );
}
