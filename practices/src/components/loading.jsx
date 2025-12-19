import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { CircularProgress } from "@mui/material";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { motion } from "framer-motion";
import { useLayoutEffect } from "react";
import { useScrolling } from "../hooks/scrolling";
import AnimatedNumbers from "react-animated-numbers";

const Loading = ({ testid }) => {
  return (
    <DotLottieReact
      src="https://lottie.host/fe8d34d7-6788-4303-8144-efafb47a5016/jqTbHk6s4w.lottie"
      loop
      data-testid={testid}
      autoplay
      style={{ width: "200px", height: "200px" }}
    />
  );
};

export const PaymentModeAnima = () => {
  return (
    <DotLottieReact
      src="https://lottie.host/9a5f0ae6-53d1-4975-9593-92354ae980bd/kvdq7ENRsx.lottie"
      loop
      autoplay
      speed={2.0}
      style={{ width: "70px", height: "70px" }}
    />
  );
};

export const NumberAnimation = ({ value, color, size }) => {
  return (
    <AnimatedNumbers
      useThousandsSeparator
      animateToNumber={Number(value)}
      fontStyle={{ fontSize: size, color: `${color}` }}
      transitions={(index) => ({
        type: "spring",
        duration: index + 0.5,
      })}
    />
  );
};

export const NotFoundAnimation = () => {
  return (
    <>
      <DotLottieReact
        src="https://lottie.host/e1f3fac1-ea0f-4bc2-9783-2023345471e3/M2fu0tev1Q.lottie"
        loop
        autoplay
        speed={1.0}
        className="flex w-full justify-center"
        style={{ width: "500px", height: "500px" }}
      />
    </>
  );
};

export const PaymentModeAnima2 = () => {
  return (
    <DotLottieReact
      src="https://lottie.host/4dd5431a-a80a-4ef2-a48f-c732e09cef0a/7KREwlIXqs.lottie"
      autoplay
      speed={0.5}
      style={{ width: "70px", height: "70px" }}
    />
  );
};

const SkeletonLoading = () => {
  return (
    <>
      <div className="shadow-md rounded-full px-2 mx-2 flex justify-center items-center ">
        <Skeleton
          circle
          height={35}
          width={35}
          baseColor="#4545"
          duration={1.2}
        />
      </div>
    </>
  );
};

const SkeletonLoadingAddress = () => {
  return (
    <>
      <div className="rounded-lg px-5 overflow-x-hidden  gap-3 flex  justify-center items-center ">
        <Skeleton height={150} width={280} baseColor="#e5e7eb" duration={1.2} />
        <Skeleton height={150} width={280} baseColor="#e5e7eb" duration={1.2} />
        <Skeleton height={150} width={280} baseColor="#e5e7eb" duration={1.2} />
      </div>
    </>
  );
};

const Slide = () => {
  return <Skeleton height={20} width={90} baseColor="#e5e7eb" duration={1.2} />;
};

const Minislide = ({ ...props }) => {
  return <Skeleton {...props} />;
};

const Image = () => {
  return (
    <Skeleton
      height={200}
      width={"100%"}
      baseColor="#DEE0E2FF"
      duration={1.2}
    />
  );
};

const RecentlyViewedSkeleton = ({ countArr }) => {
  return (
    <>
      <div className="flex gap-3  overflow-x-scroll">
        {countArr?.map((items) => {
          return (
            <li className="flex flex-col border-2 border-gray-200 p-2 gap-2" key={items}>
              <span>{<Image />}</span>
              <span>
                {
                  <Minislide
                    height={20}
                    width={150}
                    baseColor="#CFD1D4FF"
                    duration={1.2}
                  />
                }
              </span>
            </li>
          );
        })}
      </div>
    </>
  );
};

const SkeletonLoadingHome = ({
  countArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
}) => {
  return (
    <>
      <div className="grid  grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-5 px-7 py-4 md:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] 2xl:grid-cols-[repeat(auto-fit,minmax(260px,1fr))]shadow-xl">
        {countArr?.map((items) => {
          return (
            <li className="flex flex-col gap-2" key={items}>
              <span>{<Slide />}</span>
              <span>{<Image />}</span>
              <span>
                {
                  <Minislide
                    height={20}
                    width={150}
                    baseColor="#CFD1D4FF"
                    duration={1.2}
                  />
                }
              </span>
              <span>
                {
                  <Minislide
                    height={20}
                    width={100}
                    baseColor="#CFD1D4FF"
                    duration={1.2}
                  />
                }
              </span>
            </li>
          );
        })}
      </div>
    </>
  );
};

const CanclePaymentState = () => {
  return (
    <>
      <DotLottieReact
        src="https://lottie.host/31b911f2-cab5-4543-94d9-91071c4f6352/HFumr2Z2ti.lottie"
        loop
        autoplay
        speed={0.5}
        style={{ width: "240px", height: "250px" }}
      />
    </>
  );
};

const OrderNow = () => {
  return (
    <>
      <DotLottieReact
        src="https://lottie.host/8cb447df-3605-486c-bb8a-d46af3baaed6/aWC0m8Sqdx.lottie"
        loop
        autoplay
        speed={0.5}
        style={{ width: "500px", height: "500px" }}
      />
    </>
  );
};

export const SuccessPaymentState = () => {
  return (
    <>
      <DotLottieReact
        src="https://lottie.host/e6ff0a9e-7ea7-4d84-8ebe-78d0766a9585/5QpMc0wDMf.lottie"
        loop
        autoplay
        speed={0.5}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      />
    </>
  );
};

export const CodsuccessFull = () => {
  return (
    <>
      <DotLottieReact
        src="https://lottie.host/46b175c5-12e6-431a-8bf6-856b315dc00b/i5cxglo0m6.lottie"
        autoplay
        speed={0.6}
        style={{ width: "200px", height: "200px" }}
      />
    </>
  );
};

export const CodError = () => {
  return (
    <>
      <DotLottieReact
        src="https://lottie.host/16c3709c-e62c-4bec-91e7-d6b4691b863c/Z4TfPMc0Hm.lottie"
        autoplay
        loop
        speed={0.6}
        style={{ width: "320px", height: "320px" }}
      />
    </>
  );
};

export const HeartAnimation = ({ size }) => {
  return (
    <>
      <DotLottieReact
        src="https://lottie.host/34ba406f-b5f3-4427-9b3f-651eb4c8afc5/mYBzSrJbos.lottie"
        autoplay
        speed={1.5}
        style={{ width: size, height: size, position: "absolute", top: "-8px" }}
      />
    </>
  );
};

const WishListSkeleton = () => {
  return (
    <>
      {[1, 2, 3, 4, 5].map((_, index) => (
        <div
          key={index}
          className="m-3 p-2 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(380px,1fr))] gap-5 lg:gap-16  lg:grid-cols-[repeat(auto-fit,minmax(430px,1fr))]"
        >
          <div className="flex flex-col gap-2">
            <div className="flex gap-4 justify-center w-full ">
              <div className="flex">
                <Minislide
                  height={200}
                  width={200}
                  baseColor="#DEE0E2FF"
                  duration={1.2}
                />
              </div>
              <div className="flex h-full w-full ml-0 mr-auto ">
                <div className="w-full h-full ">
                  <Minislide
                    height={"100%"}
                    width={"100%"}
                    baseColor="#DEE0E2FF"
                    duration={1.2}
                  />
                </div>
              </div>
            </div>
            <div className="w-full flex items-center justify-between">
              <div className="rounded-full ml-0 mr-auto w-50">
                <Minislide
                  height={20}
                  width={150}
                  baseColor="#CFD1D4FF"
                  duration={1.2}
                />
              </div>
              {[1, 2].map((_, index) => (
                <div key={index} className="rounded-full ml-2 mr-0 flex w-50">
                  <Minislide
                    height={30}
                    width={30}
                    baseColor="#CFD1D4FF"
                    duration={1.2}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

const PopUpLoading = ({ size }) => {
  const { lock, unlock } = useScrolling();
  useLayoutEffect(() => {
    lock();
    return () => unlock();
  }, []);

  return (
    <>
      <motion.div
        className="bg-transparent backdrop-brightness-[0.6] w-screen h-screen flex justify-center items-center fixed z-[9999] "
        initial={{ opacity: 0, zIndex: 9999, top: 0, left: 0 }}
        animate={{ opacity: 1, zIndex: 9999, top: 0, left: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-white rounded-md w-max p-5 h-max flex justify-center items-center">
          <CircularProgress size={size} sx={{ color: "#3D007DFF" }} />
        </div>
      </motion.div>
    </>
  );
};

export {
  Loading,
  SkeletonLoading,
  SkeletonLoadingAddress,
  Slide,
  Image,
  Minislide,
  CanclePaymentState,
  SkeletonLoadingHome,
  OrderNow,
  PopUpLoading,
  WishListSkeleton,
  RecentlyViewedSkeleton,
};
