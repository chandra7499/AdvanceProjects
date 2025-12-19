import { useEffect, useState,useContext} from "react";
import { useLocation } from "react-router-dom";
import { selectionData, selectionRandomData } from "../../../api/searchItems";
import { SkeletonLoadingHome } from "../../loading";
import { useSelection } from "../../../functions/searchFunction";
import { useNavigate } from "react-router-dom";
import { RupeeSymbol } from "../../layouts/layouts";
import  Rating  from "../../../components/Rating";
import AddToCart from "../../features/AddToCart";
import AddToWishList from "../../features/AddToWishList";
import { myContext } from "../../GlobalStates/contextHooks";
const SearchSelectionPanal = () => {
  const location = useLocation();
  const {userLogin, userData, wishList} = useContext(myContext);
  const searchName = location.state?.searchName;
  const partialSearch = location.state?.partialSearch;
  const [selection, setSelection] = useState([]);
  const productNavigation = useSelection();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let querySelection;
    setLoading(true);
    const fetch = async () => {
      try {
        if (searchName && partialSearch === false) {
          querySelection = await selectionData(searchName);
          setSelection(querySelection);
        } else if (searchName && partialSearch === true) {
          querySelection = await selectionRandomData(searchName);
          setSelection(querySelection);
        }

        if (!querySelection || querySelection?.length === 0) {
          setSelection([]);
        } else {
          setSelection(querySelection);
        }
      } catch (error) {
        console.log("Error get error:", error);
        setSelection([]);
      } finally {
        setLoading(false);
      }
    };
    if (searchName) fetch();
  }, [searchName]);
  

  function productDetails(id) 
  {
    productNavigation(id, navigate);
  }

  return (
    <>
      <h1 className="text-xl font-bold px-5">
        search results : {loading ? "Loading..." : selection.length === 0 ? `No search results found for "${searchName}"` : `search result for "${searchName}"`}
      </h1>
      <section className="p-4">
        {selection?.length > 0 && !loading ? (
          <ul className="grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] 2xl:grid-cols-[repeat(auto-fit,minmax(260px,1fr))]   md:gap-8 gap-3 *:ring-1 *:ring-slate-200   *:shadow-lg *:rounded-md *:p-2 md:px-7 py-1 px-1 md:py-5 *:cursor-pointer transition ease-linear duration-150">
            {selection.map((item, index) => (
              <li key={index} className="flex flex-col gap-5 justify-between">
                <p className="font-medium">{item.name}</p>
                <img
                  src={
                    Array.isArray(item?.image) ? item?.image[0] : item?.image
                  }
                  onClick={() => productDetails(item.id)}
                  className="cursor-pointer "
                  alt=""
                />
                <div className="flex flex-col gap-3">
                <p className="font-serif text-lg"><RupeeSymbol/>{item.price}</p>
                <span className="flex w-full justify-end"><Rating size="small" value={item.rating} color={"#001D58FF"} /></span>
                <p className="line-clamp-2">{item.description}</p>
                </div>
                <div className="flex justify-end gap-3">
                   <AddToCart
                          userData={userData}
                          product={item}
                          type="plus"
                          userLogin={userLogin}
                        />
                        <AddToWishList
                          userLogin={userLogin}
                          wishList={wishList}
                          userData={userData}
                          product={item}
                        />
                </div>
              </li>
            ))}
          </ul>
        ) : loading && (
          <SkeletonLoadingHome />
        )}
      </section>
    </>
  );
};

export default SearchSelectionPanal;
