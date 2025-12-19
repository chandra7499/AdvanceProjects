import {NavLink} from "react-router-dom";
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import {TitleToolTip} from "../../layouts/layouts"

const Orderbtn = () => {

  // function openCartDialog() {
  //   if (Cartref?.current) {
  //     Cartref.current.showModal();
  //   }
  // }


  return (
    <>
    
    <TitleToolTip title="Orders" arrow disableInteractive> 
      <NavLink  to="/orders?section=pending-orders">
      {({isActive}) => isActive ? <InventoryOutlinedIcon sx={{borderBottom:"1px solid white"}}/> : <InventoryOutlinedIcon />}
       
      </NavLink>
    </TitleToolTip>

    </>

  );
};


export default Orderbtn;