import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelection } from "../../functions/searchFunction";
import { myContext } from "../../components/GlobalStates/contextHooks";
import SlideOverflow from "../features/SlideOverflow";
import { RecentlyView } from "../../api/getItems";
import { toast } from "react-toastify";
import { RecentlyViewedSkeleton } from "../loading";
const RecentlyViewed = () => {
  const [items, setItems] = useState([]);
  const ProductsView = useSelection();
  const navigate = useNavigate();
  const { userLogin, userData } = useContext(myContext);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const storeItems = await RecentlyView(userData?.uid);
        if (storeItems) {
          setItems(storeItems);
        }
        // console.log(storeItems);
      } catch (e) {
        toast.error(e.message.split(":")[1]);
      } finally {
        setLoading(false);
      }
    }
    if (userData?.uid) {
      fetchData();
    }
  }, [userData?.uid]);

  function navigateFn(id) {
    ProductsView(id, navigate);
  }

  if (loading) {
    return (
      <div className="flex flex-col overflow-hidden w-full">
        <h1 className="flex font-semibold px-5 text-xl">Recently Viewed</h1>
        <section className="flex w-full xs:w-full mr-auto ml-auto  lg:max-w-[75rem] justify-self-center  overflow-x-scroll  mb-10 mt-5 justify-center items-center">
          <SlideOverflow len={items.length} usage="recently">
            {<RecentlyViewedSkeleton countArr={[1, 2, 3, 4, 5, 6, 7, 8]} />}
          </SlideOverflow>
        </section>
      </div>
    );
  }

  return (
    items.length > 0 &&
    userLogin && (
      <>
        <h1 className="flex font-semibold px-5 text-xl">Recently Viewed</h1>
        <section className="flex w-full xs:w-full  lg:max-w-[75rem] justify-self-center  overflow-x-scroll  mb-10 mt-5 justify-center items-center">
          <div className="flex h-full relative  gap-10 py-2 px-10  w-full  text-wrap  items-center">
            <SlideOverflow len={items.length} usage="recently">
              {items
                ?.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-shrink-0 justify-center items-center border-2 p-2 w-[12rem] h-[15rem]   gap-2 flex-col cursor-pointer"
                    onClick={() => navigateFn(item.id)}
                  >
                    <img
                      src={item.image}
                      alt=""
                      className=" w-full ascpect-auto  flex flex-grow object-contain object-center"
                    />
                    <p className="line-clamp-1">{item?.name}</p>
                  </div>
                ))
                .reverse()}
            </SlideOverflow>
          </div>
        </section>
      </>
    )
  );
};

export default RecentlyViewed;
