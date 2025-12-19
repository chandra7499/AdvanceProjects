import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EditIcon from '@mui/icons-material/Edit';
import {useState} from "react";
import FileUpload from "./FileUpload";


const ProfileDetails = ({ profileData }) => {
  const [open,setOpen] = useState(false);
  const hasProfileImage = profileData?.Profile 
  && profileData.Profile.trim() !== ""
  && profileData.Profile !== "null"
  && profileData.Profile !== "unknown";

  function handlePopUpTab(){
    setOpen(true);
  }
  return (
    <>
      <section className="flex w-max flex-col transition ease-in-out duration-300 xs:mr-auto xs:ml-auto xs:rounded-full font-medium relative bg-gray-200 px-5 py-3 gap-3 rounded-md">
        <div className="group  rounded-full  overflow-hidden relative ">
          {hasProfileImage ? (
            <img
              src={profileData?.Profile}
              className="w-[12rem] h-[12rem]  rounded-full cursor-pointer object-center object-cover"
            />
          ) : (
            <AccountCircleIcon sx={{ fontSize: "12rem" }} />
          )}
           <EditIcon onClick={handlePopUpTab} className="group-hover:visible invisible transition-all ease-in-out rounded-full duration-300" sx={{ fontSize: "2rem",cursor:"pointer",marginRight:"0",marginLeft:"auto",display:{xs:"flex"},position:{xs:"absolute"},backgroundColor:{xs:"#0000004E"},width:{xs:"100%"},height:{xs:"30%"},color:{xs:"white"},top:{xs:128}}}/>
        </div>
      </section>
      {open && <FileUpload setOpen={setOpen} profile={profileData?.Profile}/>}
    </>
  );
};

export default ProfileDetails;
