import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';

const toggleSider = ({event,...props}) => {
  return (
    <>
         <ChevronRightRoundedIcon {...props} onClick={event}/>
    </>
  )
}

export default toggleSider