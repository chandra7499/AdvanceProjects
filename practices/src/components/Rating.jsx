import { Rating} from "@mui/material";
import StarIcon from '@mui/icons-material/Star';

const RatingComp = ({size,value,color = "#001855FF"}) => {
  return (
    <>
      <div className="flex items-center gap-2">
      <Rating name="simple-controlled" sx={{ color: color}}  precision={0.1} readOnly value={value} size={size} emptyIcon={<StarIcon style={{ opacity: 0.9 }} fontSize="inherit"/>}/>
      <p>{value}</p>
      </div>

    </>
  );
};

export default RatingComp;
