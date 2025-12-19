import { DialogActions } from '@mui/material';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses }  from "@mui/material/Tooltip"
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export const Main = ( {children,...props} ) => {
  return (
    <>
      <main {...props}>{children}</main>
    </>
  );
};

export const Form = ({children,...props}) => {
  return (
    <>
      <form {...props}>{children}</form>
    </>
  );
};

export const Inputs = (props)=>{
    return(
        <>
            <input {...props}/>
        </>
    )
}

export const RupeeSymbol = ({size = "1.2rem"})=>{
  return (
    <>
       <CurrencyRupeeIcon sx={{fontSize:`${size}`,fontWeight:"bold"}}/>
    </>
  )
}

export const CosButton = ({children,...props})=>{
    return(
        <>
            <DialogActions>
              <Button {...props} className="hover:bg-[#000d47]">{children}</Button>
            </DialogActions>
        </>
    )
}

export const DiscountTag = ({discount}) => {
  return (
    <>
      <span className="rounded-lg bg-red-700 ml-2 text-white p-1 text-md scale-[0.6] shadow-xl">{discount}%</span>
    </>
  )

}

export const BackHistorybtn =()=>{
  function getBack(){
    window.history.back();
  }
    return(
        <>
            <Button onClick={getBack}>{<ArrowBackIcon sx={{backgroundColor:"black",borderRadius:"50%",color:"white"}} titleAccess='historypath'/>}</Button>
        </>
    )
}

export const TitleToolTip = styled(({ className, ...props }) => (
  <Tooltip {...props}  classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
    fontSize:"16px",
  },

}));




