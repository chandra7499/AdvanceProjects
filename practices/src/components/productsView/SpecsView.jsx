import { useEffect } from "react";
const SpecsView = ({ data }) => {
  // useEffect(()=>{
  //  data.map((item)=>{
  //  console.log(item.key);
  //  console.log(item.value);

  //  })
  // },[])

  return (
    <>
      <section className="flex w-full overflow-x-scroll">
        <table className="w-full text-left flex border-2 border-collapse">
          <tbody className="w-full">
            {data?.map((item, index) => (
              <tr key={index} className="w-full flex">
                <td className="text-lg py-2 w-full px-4 first-letter:uppercase  font-semibold border-b-2 border-r-2 border-b-gray-300 antialiased">
                  {item?.key}
                </td>
                <td className="border-b-2 w-full border-b-gray-300 px-4 py-2 text-lg antialiased font-normal">
                  {item?.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
};

export default SpecsView;
