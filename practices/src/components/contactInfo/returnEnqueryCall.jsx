import { Form, Inputs } from "../../components/layouts/layouts";
import { inputStyles } from "../styles/style";
import {Button} from "@mui/material";

const ReturnEnqueryCall = () => {
  return (
    <>
      <div className="flex headSection flex-col ">
        <Form className="flex flex-col py-2 gap-5 max-w">
          <span className={inputStyles.textInput}>
            <Inputs type="text" placeholder="Enter your name" required className="flex text-lg outline-none w-[350px] text-slate-950"/>
          </span>
          <span className={inputStyles.textInput}>
            <select name="countryCode" className="outline-none" required>
                <option value="+91">+91</option>
            </select>
            <Inputs
              type="text"
              pattern="[0-9]{10}"
              placeholder="Enter your mobile number"
              required
              className="outline-none text-slate-950 flex w-full text-lg"
            />
          </span>
          <span>
            <Button type="submit" variant="contained" sx={{ backgroundColor: "#0c4a6e",width:"100%"}}>Call</Button>
          </span>
        </Form>
      </div>
    </>
  );
};

export default ReturnEnqueryCall;
