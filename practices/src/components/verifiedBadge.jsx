import VerifiedIcon from "@mui/icons-material/Verified";

const verifiedBadge = () => {
  return (
    <>
      <div className="fullfillbadge select-none md:text-lg md:scale-[1] scale-[0.9]  flex gap-1 font-bold shadow-inner shadow-slate-900 items-center rounded-md w-max p-1">
        <VerifiedIcon sx={{ color: "black" }} />
        <p>verified</p>
      </div>
    </>
  );
};

export default verifiedBadge;
