import { useEffect, useState } from "react";
import MiniCarosel from "../carosels/miniCarosels";
const FeaturesView = ({ data }) => {
  const [featureContext, setFeatureContext] = useState([]);
  useEffect(() => {
    setFeatureContext(new Array(data?.length).fill(0));
  }, []);

  function handleSlideChange(slideIdx,index) {
    setFeatureContext((prev) => {
      const next = [...prev];
      next[index] = slideIdx;
      return next;
    });
  }

  return (
    <>
      <section className="flex flex-col">
        {data?.map((item, index) => (
          <div className="p-5 flex flex-col gap-7" key={index}>
            <span className="font-medium  text-xl">{item.title}</span>
            <div className="flex flex-col aspect-auto max-w-[60rem] justify-center ml-auto mr-auto">
              <MiniCarosel
                data={item.images}
                typeView={false}
                onSlideChange={(slideIdx) => handleSlideChange(slideIdx,index)}
              />
            </div>
            <span className="text-xl w-full flex antialiased font-[verdana] justify-center text-wrap">
              {Array.isArray(item?.value)
                ? item?.value[featureContext[index]]
                : item.value}
            </span>
          </div>
        ))}
      </section>
    </>
  );
};

export default FeaturesView;
