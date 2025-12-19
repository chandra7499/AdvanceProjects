import { useCart } from "../GlobalStates/contextHooks";
import { NavLink } from "react-router-dom";
import Stack from "@mui/material/Stack";
import Badge from "@mui/material/Badge";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { TitleToolTip } from "../layouts/layouts";
const Cartbtn = () => {
  const { cartItems: items } = useCart();

  // function openCartDialog() {
  //   if (Cartref?.current) {
  //     Cartref.current.showModal();
  //   }
  // }
  return (
    <TitleToolTip title="cart" arrow disableInteractive>
      <NavLink to="/cartItems">
        {({ isActive }) => (
          <Stack spacing={4} direction="row">
            <Badge color="error" badgeContent={items?.length} max={10}>
              {isActive ? (
                <ShoppingCartOutlinedIcon
                  sx={{ borderBottom: "1px solid white" }}
                />
              ) : (
                <ShoppingCartOutlinedIcon />
              )}
            </Badge>
          </Stack>
        )}
        {/* {items?.length > 0 && <span className="absolute -top-1 -left-2 px-1 text-sm  bg-red-700 rounded-full text-white animate-bounce">{items?.length}</span>} */}
      </NavLink>
    </TitleToolTip>
  );
};

export default Cartbtn;
