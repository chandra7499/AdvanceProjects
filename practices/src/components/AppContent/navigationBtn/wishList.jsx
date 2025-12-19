import { NavLink } from "react-router-dom";
import Stack from "@mui/material/Stack";
import Badge from "@mui/material/Badge";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { TitleToolTip } from "../../layouts/layouts";
import { useContext } from "react";
import { myContext } from "../../GlobalStates/contextHooks";

const WishList = () => {
  const { wishList } = useContext(myContext);

  return (
    <>
      <TitleToolTip title="favorites" arrow disableInteractive>
        <NavLink to="/wishList">
          {({ isActive }) => (
            <Stack spacing={4} direction="row">
              <Badge color="error" badgeContent={wishList?.length} max={10}>
                {isActive ? (
                  <FavoriteBorderIcon sx={{ borderBottom: "1px solid white" }} /> // filled when active
                ) : (
                  <FavoriteBorderIcon />
                )}
              </Badge>
            </Stack>
          )}
        </NavLink>
      </TitleToolTip>
    </>
  );
};

export default WishList;
