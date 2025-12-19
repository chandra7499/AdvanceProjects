import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/X';
import InstagramIcon from '@mui/icons-material/Instagram';
import TelegramIcon from '@mui/icons-material/Telegram';
export const FollowUs = ({props})=>{
    return (
        <>
            <div className={props}>
              <p className="text-center text-sm font-medium text-gray-300 hidden md:flex">
                Follow us on
              </p>
              <ul className="flex gap-3 ">
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"><FacebookIcon/></a>
                <a href="https://www.x.com" target="_blank" rel="noopener noreferrer"><XIcon/></a>
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"><InstagramIcon/></a>
                <a href="https://www.telegram.com" target="_blank" rel="noopener noreferrer"><TelegramIcon/></a>
              </ul>

            </div>
        </>
    )
}