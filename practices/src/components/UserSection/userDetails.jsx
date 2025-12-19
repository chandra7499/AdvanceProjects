import {
  useContext,
  lazy,
  Suspense,
  useState,
  useRef,
  useEffect,
} from "react";
import { myContext } from "../GlobalStates/contextHooks";
import { Main } from "../layouts/layouts";
import { CircularProgress } from "@mui/material";
const AddressInfo = lazy(() => import("./addressInfo"));
import { useProfileupdate } from "../../api/updates";
const AddressList = lazy(() => import("../Addresslist"));
const ProfileDetails = lazy(() => import("./profileDetails"));
const UserInfo = lazy(() => import("./userInfo"));
const DeliveryForm = lazy(() => import("../DeliveryForm"));
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { AnimatePresence, motion } from "framer-motion";
import { PopUps } from "../popUps";

const UserDetails = () => {
  const { userData } = useContext(myContext);
  const profileUrl = useProfileupdate(userData?.uid);
  const [edit, setEdit] = useState(false);
  const [open, setOpen] = useState(false);
  const slideRef = useRef(null);
  function toggle() {
    setEdit((prev) => !prev);
  }

  useEffect(() => {
    if (edit && slideRef.current) {
      const timeOut = setTimeout(() => {
        try {
          const rect = slideRef.current.getBoundingClientRect();
          window.scrollTo({
            top: window.scrollY + rect.top - 100,
            behavior: "smooth",
          });
        } catch (error) {
          console.log("err in scroll in userDetails", error.message);
        }
      }, 300);
      return () => clearTimeout(timeOut);
    }
  },[edit]);

  function handlePops() {
    setOpen(true);
  }

  return (
    <>
      <Main className="flex w-full  gap-5 md:px-10 xs:px-3 xs:flex-col xs:gap-5 p-2 scroll-smooth">
        <section className="profile   flex  transition h-max ease-in-out duration-300">
          <Suspense
            fallback={
              <CircularProgress
                size={60}
                sx={{
                  color: "#0c4a6e",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              />
            }
          >
            <ProfileDetails profileData={{ Profile: profileUrl }} />
          </Suspense>
        </section>
        <div className="flex flex-col w-full gap-5">
          <section className="details userDetails transition ease-in-out duration-300 w-full">
            <Suspense
              fallback={
                <CircularProgress
                  size={60}
                  sx={{
                    marginLeft: "auto",
                    marginRight: "auto",
                    color: "#0c4a6e",
                  }}
                />
              }
            >
              <UserInfo
                userInfo={{
                  Name: userData?.Name,
                  Email: userData?.Email,
                  Phone: userData?.Phone,
                }}
                userId={userData?.uid}
              />
            </Suspense>
          </section>
          <section className="address userDetails flex bg-gray-200 py-3 px-3 rounded-md">
            <div className="group w-full lg:flex gap-2">
              <Suspense
                fallback={
                  <CircularProgress
                    size={60}
                    sx={{
                      marginLeft: "auto",
                      marginRight: "auto",
                      color: "#0c4a6e",
                    }}
                  />
                }
              >
                <AddressList />
              </Suspense>
              <div className="transition-all max-h  group-hover:visible invisible flex lg:flex-col justify-between px-3 ">
                <AddIcon
                  sx={{
                    fontSize: "1.8rem",
                    cursor: "pointer",
                    color: "#0c4a6e",
                  }}
                  onClick={handlePops}
                />
                <EditIcon
                  onClick={() => toggle()}
                  sx={{
                    fontSize: "1.5rem",
                    cursor: "pointer",
                    color: "#0c4a6e",
                  }}
                />
              </div>
            </div>
          </section>
          <AnimatePresence>
            {edit && (
              <motion.section
                key="edit"
                exit={{
                  opacity: 0,
                  transition: {
                    duration: 0.3,
                  },
                }}
                ref={slideRef}
                className="address userDetails overflow-auto  bg-gray-200 py-3  px-3 rounded-md"
              >
                <Suspense
                  fallback={
                    <CircularProgress
                      size={60}
                      sx={{
                        marginLeft: "auto",
                        marginRight: "auto",
                        color: "#0c4a6e",
                      }}
                    />
                  }
                >
                  <AddressInfo userId={userData?.uid} />
                </Suspense>
              </motion.section>
            )}
          </AnimatePresence>

          <PopUps
            open={open}
            setOpen={setOpen}
            title="Add New Address"
            fullWidth={true}
          >
            <DeliveryForm addressTitle={false} />
          </PopUps>
        </div>
      </Main>
    </>
  );
};

export default UserDetails;
