import { useContext, useEffect, useState, useRef } from "react";
import { myContext } from "../GlobalStates/contextHooks";
import {
  Main,
  Form,
  Inputs,
  CosButton,
} from "../../components/layouts/layouts";
import EditIcon from "@mui/icons-material/Edit";
import { handleListner } from "../../functions/eventHandlingFn";
import { useDebounce } from "../../hooks/refetches";
import { useAddressDetailUpdate } from "../../hooks/userDetailsUpdate";

const AddressInfo = ({ userId }) => {
  const { addressList } = useContext(myContext);
  const { mutate: userAddressDetailsupdate, isPending } =
    useAddressDetailUpdate();

  const selectedDeliveryPoint = addressList?.find(
    (item) => item.deliveryPoint === true
  );

  const KeyValueAddress = selectedDeliveryPoint
    ? Object.entries(selectedDeliveryPoint).filter(
        ([key]) => key !== "id" && key !== "deliveryPoint"
      )
    : [];

  const [fields, setFields] = useState(() =>
    Object?.fromEntries(KeyValueAddress)
  );
  const [editable, setEditable] = useState(KeyValueAddress.map(() => false));
  const [saveKey, setSaveKey] = useState(null);
  const inputRef = useRef([]);

  useEffect(() => {
    setFields(Object.fromEntries(KeyValueAddress));
    setEditable(KeyValueAddress.map(() => false));
    setSaveKey(null);
  },[]);

  useEffect(() => {
    if (editable.includes(true)) {
      const cleanup = handleListner(closeEdit, "userDetails");
      return cleanup;
    }
  });

  function closeEdit() {
    setEditable(KeyValueAddress.map(() => false));
    setSaveKey(null);
  }

  function Edit(index) {
    if (inputRef.current[index]) inputRef.current[index].focus();
    setEditable((prev) => {
      const next = [...prev];
      next[index] = true;
      return next;
    });
    setSaveKey(KeyValueAddress[index][0]);
  }

  function handleChange(key, value) {
    setFields((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  const debouncedFields = useDebounce(fields, 1000);

  function handleSubmition(e) {
    e.preventDefault();
    userAddressDetailsupdate({ userId: userId, formData: fields });
  }

  const isUnchanged =
    saveKey === null ||
    (debouncedFields[saveKey] ?? "") ===
      (KeyValueAddress.find(([k]) => k === saveKey)?.[1] ?? "");

  const disableUpdate = saveKey === null || isUnchanged;

  return (
    <Main>
      <Form
        onSubmit={handleSubmition}
        className="flex px-3 w-full gap-3 flex-col"
      >
        <div className="flex flex-col gap-4 justify-between items-center">
          {KeyValueAddress.map(([key], index) => (
            <div
              key={key}
              className="flex md:flex-row  xs:flex-col gap-2  justify-start w-full"
            >
              <span className="flex-shrink-0 flex  xs:gap-2 mr-auto ml-0">
                <label
                  htmlFor={key}
                  className="text-lg md:min-w-20 overflow-scroll gap-2 flex"
                >
                  {key}
                </label>
                :
              </span>
              <span className="flex group rounded-md *:w-full shadow-inner shadow-slate-900 pl-2 *:outline-none *:p-1 font-sans antialiased *:bg-transparent bg-white w-full">
                <Inputs
                  ref={(el) => (inputRef.current[index] = el)}
                  type={
                    key === "zipcode"
                      ? "tel"
                      : key === "phone_no"
                      ? "tel"
                      : key === "email"
                      ? "email"
                      : "text"
                  }
                  pattern={
                    key === "zipcode"
                      ? "[0-9]{6}"
                      : key === "phone_no"
                      ? "[0-9]{10}"
                      : undefined
                  }
                  value={fields[key] || ""}
                  readOnly={!editable[index]}
                  onChange={(e) => handleChange(key, e.target.value)}
                />
                <EditIcon
                  sx={{
                    fontSize: "2.3rem",
                    ":hover": { cursor: "pointer" },
                  }}
                  onClick={() => Edit(index)}
                  className="group-hover:visible group-hover:text-gray-500 invisible"
                />
              </span>
            </div>
          ))}
        </div>
        <CosButton
          type="submit"
          variant="contained"
          disabled={disableUpdate || isPending}
          loading={isPending}
          loadingPosition="start"
          sx={{ backgroundColor: "#012A42FF" }}
        >
          Update
        </CosButton>
      </Form>
    </Main>
  );
};

export default AddressInfo;
