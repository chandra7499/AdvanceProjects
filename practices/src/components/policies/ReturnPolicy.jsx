import { usePolicies } from "../../hooks/usePolicy";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { CircularProgress } from "@mui/material";
import { Inputs } from "../layouts/layouts";
import {useContext} from "react"
import { myContext } from "../GlobalStates/contextHooks";
const ReturnPolicy = () => {
  
  const { returnPolicyAccepted,setReturnPolicyAccepted} = useContext(myContext);




  function handleAcceptance(e){
    const isChecked = e.target.checked;
    setReturnPolicyAccepted(isChecked);
}

  const policy = usePolicies({type:"return_policies"});
  if (!policy) {
    return (
      <div className="w-full flex justify-center items-center">
        <CircularProgress size={60} sx={{ color: "#0c4a6e" }} />
      </div>
    );
  }


  return (
    <>
      <div className="prose max-w-none [&_a]:text-indigo-600 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-center [&_h2]]:mb-3 [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:text-lg [&_p]:text-md [&_p]:px-5 md:[&_p]:px-8 [&_ul]:px-16 [&_ul]:list-disc">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeSanitize]}
        >
          {policy?.content}
        </ReactMarkdown>

      </div>
      <div className="w-full flex gap-3 font-bold mt-4 p-3" style={{boxShadow:"3px 3px 15px 3px rgba(0,0,0,0.2)"}}>
        <Inputs type="checkbox" name="returnPolicy" className="accent-slate-900 w-5 cursor-pointer" value="accepted return policy" checked={returnPolicyAccepted} onChange={handleAcceptance}/>
        <label htmlFor="returnPolicy">
          I accept the return policy
        </label>

      </div>
    </>
  );
};

export default ReturnPolicy;
