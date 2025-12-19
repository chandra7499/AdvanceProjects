import { Inputs, Main } from "../components/layouts/layouts";
import { myContext } from "../components/GlobalStates/contextHooks";
import { useContext, useRef } from "react";
import { SkeletonLoadingAddress } from "../components/loading";
import { useChangeDeliveryPoint } from "../hooks/useItems";

const AddressList = () => {
  const { addressList, userData } = useContext(myContext);
  const addressData = useRef([]);
  const { mutate: changeDeliveryPoint } = useChangeDeliveryPoint();
  function handleSelectionOfAddress(index, currentAddress) {
    if (addressData.current[index]) {
      addressData.current[index].checked = true;
      changeDeliveryPoint({ id: currentAddress.id, userId: userData.uid });
    }
  }

  return (
    <>
      <Main className="flex lg:w-[40rem]  border-2  flex-col ld:flex-row px-4 gap-2 p-2 shadow-lg rounded-md  bg-white ">
        <h1 className="text-3xl font-medium">Addresses list</h1>
        {!addressList ? (
          <SkeletonLoadingAddress />
        ) : (
          <div className="flex flex-row overflow-x-scroll  gap-6  py-2">
            {addressList?.length === 0 && <h1>No address were added yet</h1>}
            {addressList?.length > 0 &&
              addressList
                ?.map((address, index) => {
                  return (
                    <span
                      className="ring-1 ring-slate-300 py-3  rounded-lg p-2 flex w-max items-center gap-3 cursor-pointer bg-gray-200"
                      key={address.id}
                    >
                      <Inputs
                        type="radio"
                        name="address"
                        value={address}
                        ref={(el) => (addressData.current[index] = el)}
                        checked={address.deliveryPoint}
                        onChange={() =>
                          handleSelectionOfAddress(index, address)
                        }
                        className="w-6 h-4 accent-sky-900"
                      />
                      <span
                        className="text-sm *:mt-1 font-medium"
                        onClick={() =>
                          handleSelectionOfAddress(index, addressList[index])
                        }
                      >
                        <ul>
                          <li>{address?.name}</li>
                          <li>{address?.phone_no}</li>
                          <li>{address?.email}</li>
                          <li>
                            {address?.country}, {" "},{address?.zipcode},{" "}
                          </li>
                          <li>{address?.landMark}</li>
                        </ul>
                      </span>
                    </span>
                  );
                })
                .reverse()}
          </div>
        )}
      </Main>
    </>
  );
};

export default AddressList;
