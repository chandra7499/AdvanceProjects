import { PopUps } from "../../components/popUps";
import { useState, Suspense, lazy, useContext } from "react";
import { myContext } from "../../components/GlobalStates/contextHooks";
import { CosButton, Form, Inputs } from "../layouts/layouts";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import { useProfileUpdate } from "../../hooks/userDetailsUpdate";
import { toast } from "react-toastify";
const AdjustMents = lazy(() => import("./profileAdjustMent"));

const FileUpload = ({ setOpen, profile }) => {
 
  const [fileName, setFileName] = useState(null);
  const [profileAdjustMents, setProfileAdjustMents] = useState(() => ({
    fill: false,
    cover: true,
    contain: false,
    none: false,
  }));
  const { userData } = useContext(myContext);

  const { mutate: userProfileUpdate, isPending } = useProfileUpdate();

  let profileAdjust = profileAdjustMents?.center
    ? "object-center"
    : profileAdjustMents?.fill
    ? "object-fill"
    : profileAdjustMents?.cover
    ? "object-cover"
    : profileAdjustMents?.contain
    ? "object-contain"
    : "object-none";

  // function handleFileUpload() {
  //   fileRef.current?.click();
  // }

  function handleFileValue(e) {
    const file = e.target.files[0];
    if (file) {
      setFileName({
        fileUrl: URL.createObjectURL(file),
        fileName: file.name,
        file: file,
      });
    }
  }

   function handleSubmission(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("profile", fileName?.file);
    formData.append("userId", userData.uid);
    formData.append("upload_preset", "e-commers-userProfile-floder");
    userProfileUpdate({ userId: userData.uid, formData: formData },{
      onSuccess: (data) => {
        if (data?.message) {
         
          toast.success(data?.message);
          setOpen(false);
        } else {
          toast.error(data?.error);
        }
      },
    });

  }
  return (
    <>
      <PopUps
        open={open}
        setOpen={!isPending && setOpen}
        title="Upload profile"
        fullWidth={true}
      >
        <div className="flex flex-col px-3 transition-all duration-100 ease-in-out gap-5 max-w text-wrap  relative w-full">
          {!fileName?.fileUrl && (
            <img
              src={profile}
              alt="profile"
              className={`w-[120px] h-[120px] rounded-full flex mr-auto ml-auto object-center ${profileAdjust}`}
              style={{ perspective: "1200px" }}
            />
          )}
          {fileName?.fileUrl && (
            <img
              src={fileName?.fileUrl}
              alt="updated profile"
              className={`w-[120px] h-[120px] rounded-full mr-auto ml-auto flex object-center ${profileAdjust}`}
              style={{ perspective: "1200px" }}
            />
          )}
          {fileName?.fileUrl && (
            <div className="flex gap-3 justify-center w-full items-center ">
              {
                <Suspense fallback="loading...">
                  <div className="flex gap-3 w-full overflow-x-scroll  p-1 ">
                    <AdjustMents
                      object={profileAdjustMents}
                      className="flex items-center bg-gray-300 p-1 px-2 rounded-md cursor-pointer"
                      setObject={setProfileAdjustMents}
                    />
                  </div>
                </Suspense>
              }
            </div>
          )}
          <div className="text-wrap">
            <Form
              onSubmit={(e) => handleSubmission(e)}
              className="flex flex-col"
            >
              <div className="flex px-2">
                <Inputs
                 id="triggerFile"
                  type="file"
                  name="profile"
                  className="hidden"
                  onChange={handleFileValue}
                />
                <label
                  htmlFor="triggerFile"
                  className={`shadow-inner shadow-slate-900 rounded-lg  w-full text-wrap  flex cursor-pointer ${
                    !fileName && "mr-auto ml-auto"
                  }`}
                >
                  {!fileName?.fileName && (
                    <CloudUploadOutlinedIcon
                      sx={{
                        fontSize: {
                          xs: "7rem",
                          marginLeft: "auto",
                          marginRight: "auto",
                          color: "grey",
                        },
                      }}
                    />
                  )}
                  {fileName?.fileName && (
                    <p className="flex h-max text-wrap line-clamp-1 p-2">
                      {fileName?.fileName}
                    </p>
                  )}
                </label>
              </div>
              <CosButton
                variant="contained"
                sx={{ backgroundColor: "#0c4a6e" }}
                type="submit"
                disabled={!fileName || isPending}
                loadingPosition="start"
                loading={isPending}
              >
                Upload
              </CosButton>
            </Form>
          </div>
        </div>
      </PopUps>
    </>
  );
};

export default FileUpload;
