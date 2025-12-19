import CancelIcon from "@mui/icons-material/Cancel";
import { setSessionStorage } from "../functions/localStorage";
export const Note = ({ containerStyle, paraStyle, info,setClose,sessionKey}) => {
  function closeNote() {
    setSessionStorage(sessionKey, "true");
    setClose(true);
  }
  return (
    <>
      <div className={containerStyle}>
        <CancelIcon
          className="absolute cursor-pointer right-1 top-0"
          onClick={closeNote}
        />
        <span className="flex flex-col w-full h-full ">
          <strong className="flex justify-center font-[cursive]">Note</strong>
          <p className={paraStyle}>{info}</p>
        </span>
      </div>
    </>
  );
};
