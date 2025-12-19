import { Inputs } from "../layouts/layouts";
import EditIcon from "@mui/icons-material/Edit";
import { Button, DialogActions } from "@mui/material";
import { Form } from "../layouts/layouts";
import { useRef, useState, useEffect, useReducer } from "react";
import { handleListner } from "../../functions/eventHandlingFn";
import { useUserDetailsUpdate } from "../../hooks/userDetailsUpdate";

const UserInfo = ({ userInfo, userId }) => {
  const enteries = Object.entries(userInfo);
  const upadationRef = useRef([]);
  const [editable, setEditable] = useState(enteries.map(() => false));
  const [saveIndex, setIndex] = useState(null);
  const [_, forceRender] = useReducer((x) => x + 1, 0);
  const { mutate: userDetailsUpdate, isPending } = useUserDetailsUpdate();

  const Edit = (index) => {
    if (upadationRef.current[index]) {
      upadationRef.current[index].focus();
      setIndex(index);
    }
    setEditable((prev) => {
      const obj = [...prev];
      obj[index] = true;
      return obj;
    });
  };

  useEffect(() => {
    if (editable.includes(true)) {
      const cleanup = handleListner(CloseEdit, "userDetails");
      return cleanup;
    }
  });

  function CloseEdit() {
    setEditable(enteries.map(() => false));
    setIndex(null);
  }

  function handleSubmition(e) {
    e.preventDefault();
    const form = new FormData(e.target);
    const data = Object.fromEntries(form.entries());
    userDetailsUpdate({ userId: userId, formData: data });
  }

  const isUnchanged =
    saveIndex === null ||
    (upadationRef?.current[saveIndex]?.value ?? "") ===
      (enteries[saveIndex]?.[1] ?? "");

  const disableUpdate = saveIndex === null || isUnchanged;

  return (
    <>
      <section>
        <Form
          onSubmit={handleSubmition}
          className="flex  bg-gray-200 px-5 py-2 flex-col gap-5  rounded-md"
        >
          {enteries?.map(([key, value], index) => (
            <div
              key={index}
              className="flex md:flex-row xs:flex-col w-full justify-start  gap-2"
            >
              <span className="flex gap-2 items-center">
                <label
                  htmlFor="Name"
                  className="text-lg md:min-w-20 overflow-scroll gap-2 flex"
                >
                  {key}
                </label>
                :
              </span>
              <span className="w-full  flex py-2 pl-2 shadow-inner group bg-white p-1 font-serif rounded-lg shadow-slate-900">
                {
                  <Inputs
                    ref={(el) => {
                      upadationRef.current[index] = el;
                    }}
                    type={
                      key === "Email"
                        ? "email"
                        : key === "Phone"
                        ? "tel"
                        : "text"
                    }
                    defaultValue={value === "" ? "" : value}
                    readOnly={!editable[index]}
                    name={key}
                    onInput={() => forceRender()}
                    placeholder={key}
                    pattern={key === "Phone" ? "[0-9]{10}" : null}
                    className="outline-none bg-transparent  text-slate-950 flex w-full text-lg"
                  />
                }
                <EditIcon
                  className="group-hover:visible invisible transition-all ease-in-out duration-300 "
                  sx={{ fontSize: "1.5rem", cursor: "pointer" }}
                  onClick={() => Edit(index)}
                />
              </span>
            </div>
          ))}
          <DialogActions>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#0c4a6e" }}
              disabled={disableUpdate || isPending}
              loading={isPending}
              loadingPosition="start"
              type="submit"
            >
              Update
            </Button>
          </DialogActions>
        </Form>
      </section>
    </>
  );
};

export default UserInfo;
