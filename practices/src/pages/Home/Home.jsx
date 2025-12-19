import { lazy, Suspense, useContext } from "react";
import { myContext } from "../../components/GlobalStates/contextHooks";
const HomeContent = lazy(() =>
  import("../../components/AppContent/AppContent.jsx")
);
const PopularCat = lazy(() =>
  import("../../components/PopularCategories/PopularCat")
);
import Footer from "../../components/Footer.jsx";
import { SkeletonLoadingHome } from "../../components/loading";
import { CategoryBar } from "../../components/categorysBar/CategoryBar";
import MainCarosels from "../../components/carosels/MainCarosels.jsx";
import { useTrendingBanners } from "../../api/getItems.js";
import RecentlyViewed from "../../components/recentlyViewed/RecentlyViewed.jsx";
import { Main } from "../../components/layouts/layouts";
import BrandNew from "../../components/recentlyViewed/BrandNew.jsx";
const Home = () => {
  const trendingBanners = useTrendingBanners();
  const {
    popularCategories,
    popularCategoryLoading,
    displayProduct,
    productsPending,
    wishList,
    userLogin,
    userData,
  } = useContext(myContext);

  return (
    <Suspense fallback={<SkeletonLoadingHome />}>
      <Main className="flex flex-col  gap-2">
        <MainCarosels items={trendingBanners[0]?.items} />
        <div className="flex-1 ">
          <RecentlyViewed />
        </div>
        <h1 className="flex font-semibold px-5 text-2xl">Highly Rated</h1>
        <HomeContent
          displayProduct={displayProduct}
          wishList={wishList}
          productsPending={productsPending}
          userLogin={userLogin}
          userData={userData}
        />
        <CategoryBar />
        {popularCategories && userLogin && (
          <>
            <h1 className="flex font-semibold px-5 text-2xl ">
              Popular categories
            </h1>
            {popularCategoryLoading ? (
            <SkeletonLoadingHome />
            ) : (
            <PopularCat products={popularCategories} />)}
            <h1 className="flex font-semibold px-5 text-2xl ">Brand New</h1>
            <BrandNew
              wishList={wishList}
              userLogin={userLogin}
              userData={userData}
            />
          </>
        )}
        <h1 className="flex font-semibold px-5 text-2xl ">Launching Soon</h1>

        <h1 className="flex font-semibold px-5 text-2xl ">BudGet Gadgets</h1>

        <Footer />
      </Main>
    </Suspense>
  );
};

export { Home };
