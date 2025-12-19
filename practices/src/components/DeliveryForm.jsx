import { Form, Inputs } from "../components/layouts/layouts";
import { useRef, useContext } from "react";
import { myContext } from "../components/GlobalStates/contextHooks.js";
import countryInfo from "../components/JsonData/countryInfo";
import { useDeliverFormDetails } from "../hooks/useItems.js";
import { v4 as uuidv4 } from "uuid";

const DeliveryForm = ({addressTitle = true}) => {
  const styles = {
    inputsStyles:
      "p-2 outline-none ring-1 ring-slate-500 rounded-md w-full flex",
  };
  const { userData } = useContext(myContext);
  const maleRef = useRef(null);
  const resetRef = useRef(null);
  const FemaleRef = useRef(null);
  const OtherRef = useRef(null);
  const { mutate: DeliveryFormDetails, isPending: dataSubmitting } =
    useDeliverFormDetails();

  async function handleDeliveryForm(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    let form = Object.fromEntries(formData.entries());
    DeliveryFormDetails(
      { userId: userData.uid, formData: form },
      {
        onSuccess: (data) => {
          if (data?.deliverdMessage) {
            resetRef.current.reset();
          }
        },
      }
    );
  }

  function ToggleRadio(ref) {
    if (ref.current) {
      ref.current.checked = true;
    }
  }
  return (
    <>
      <Form
        ref={resetRef}
        id="deliveryForm"
        onSubmit={handleDeliveryForm}
        className="h-max  flex justify-center w-full gap-5  flex-col p-4 shadow-xl bg-white  rounded-md"
      >
        {addressTitle && <h1 className="text-3xl font-medium">Address Form</h1>}
        <div className="h-max flex w-full gap-5 flex-col md:flex-row ">
          <Inputs
            type="text"
            placeholder="Name"
            className={styles.inputsStyles}
            name="name"
          />
          <span className="flex w-full ring-1 ring-slate-500 rounded-md py-2 px-1">
            <select className="outline-none w-max" required name="dialcode">
              <option value="" className="ring-1">
                choose code
              </option>
              <optgroup label="Country-codes">
              
                {countryInfo.map((country) => {
                  return (
                    <option
                      value={country.dialCode}
                      className="flex justify-between w-full gap-5"
                      key={country.isoCode}
                      name="dialCode"
                      required
                    >
                      {country.dialCode} {country.isoCode}
                    </option>
                  );
                })}
              </optgroup>
            </select>
            <Inputs
              type="text"
              placeholder="10-digit phone no"
              pattern="[0-9]{10}"
              className="outline-none w-full"
              name="phone_no"
            />
          </span>
        </div>

        <div className="h-max flex w-full">
          <Inputs
            type="email"
            placeholder="E-mail"
            className={styles.inputsStyles}
            name="email"
          />
        </div>
        <div className="h-max flex w-full lg:justify-between md:flex-row flex-col gap-5">
          <select
            className="ring-1 ring-slate-500 p-2 rounded-md md:w-full outline-none"
            name="country"
          >
            <option value="" >choose country</option>
            <optgroup label="countries">
              {countryInfo.map((country) => {
                return (
                  <option
                    value={country.name}
                    key={country.name}
                    name="country"
                    required
                  >
                    {country.name}
                  </option>
                );
              })}
            </optgroup>
          </select>
          <select
            className="ring-1 ring-slate-500 p-2 rounded-md md:w-full w-full outline-none"
            name="state"
          >
            <option value="">choose State</option>
            <optgroup label="states">
              <option value="Andhra Pradesh" name="state">
                Andhra Pradesh
              </option>
            </optgroup>
          </select>
          <Inputs
            type="text"
            pattern="[0-9]{6}"
            placeholder="zip-code"
            className="outline-none rounded-md ring-1 ring-slate-500 pl-2 py-2"
            name="zipcode"
            required
          />
        </div>

        <div className="gender flex justify-between md:items-center md:flex-row flex-col gap-5">
          <label className="text-2xl text-gray-500">Gender:</label>
          <span
            className={`ring-1 ring-slate-500 gap-5  flex rounded-md p-2 cursor-pointer md:w-full`}
            onClick={() => ToggleRadio(maleRef)}
          >
            <Inputs
              type="radio"
              name="gender"
              value="male"
              ref={maleRef}
              className="w-5 accent-sky-900"
            />
            Male
          </span>
          <span
            className="ring-1 ring-slate-500 gap-5 md:w-full flex rounded-md p-2 cursor-pointer"
            onClick={() => ToggleRadio(FemaleRef)}
          >
            <Inputs
              type="radio"
              name="gender"
              value="Female"
              ref={FemaleRef}
              className="w-5 accent-sky-900"
            />
            Female
          </span>
          <span
            className="ring-1 ring-slate-500 gap-5 flex md:w-full rounded-md p-2 cursor-pointer"
            onClick={() => ToggleRadio(OtherRef)}
          >
            <Inputs
              type="radio"
              name="gender"
              value="other"
              ref={OtherRef}
              className="w-5  accent-sky-900"
            />
            Other
          </span>
        </div>
        <div className="flex flex-col w-full gap-4">
          <Inputs
            type="text"
            className={styles.inputsStyles}
            placeholder="street"
            name="street"
            required
          />
          <Inputs
            type="text"
            className={styles.inputsStyles}
            placeholder="LandMark"
            name="landMark"
            required
          />
          <Inputs
            type="text"
            className={styles.inputsStyles}
            placeholder="Area"
            name="Area"
            required
          />
        </div>
        <Inputs type="hidden" name="id" value={uuidv4()} />
        <div className="btn flex w-full justify-end gap-3">
          <button className="bg-red-700 p-2 text-white rounded-md" type="reset">
            reset
          </button>
          <button
            className="bg-sky-950 p-2 text-white rounded-md"
            type="submit"
          >
            {dataSubmitting && "submitting..."}
            {!dataSubmitting && "submit"}
          </button>
        </div>
      </Form>
    </>
  );
};

export default DeliveryForm;
