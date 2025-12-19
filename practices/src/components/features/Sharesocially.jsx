import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailShareButton,
  FacebookIcon,
  LinkedinIcon,
  TwitterIcon,
  WhatsappIcon,
  EmailIcon,
} from "react-share";
import { useState } from "react";
import { PopUps } from "../popUps";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import { Inputs } from "../layouts/layouts";

const Sharesocially = ({ url, title, image }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const objSharingItems = [
    {
      Button: FacebookShareButton,
      icon: FacebookIcon,
      props: { url, title, quote: "check out this:" + url, media: image },
    },
    {
      Button: TwitterShareButton,
      icon: TwitterIcon,
      props: { url, title, via: "check out this:" + url },
    },
    {
      Button: LinkedinShareButton,
      icon: LinkedinIcon,
      props: { url, title, summary: "check out this:" + url },
    },
    {
      Button: WhatsappShareButton,
      icon: WhatsappIcon,
      props: {
        url,
        title,
        separater: "-",
        body: "check out this:" + url,
        media: image,
      },
    },
    {
      Button: EmailShareButton,
      icon: EmailIcon,
      props: { url, title, body: "check out this:" + url, media: image },
    },
  ];

  const isMobile = /Mobi|Android/i.test(navigator.userAgent);

  async function handleShare() {
    try {
      if (navigator.share) {
        setLoading(true);
        await navigator.share({
          title: title,
          text: "check out this:",
          url: url,
        });
        setLoading(false);
      }
      console.log("share successfully");
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <section className="flex gap-3">
        {!isMobile ? (
          <div>
            <ShareRoundedIcon
              sx={{ fontSize: "1.8rem", cursor: "pointer" }}
              onClick={() => setOpen(true)}
              loading={loading}
              loadingPosition="right"
            />
            <PopUps
              open={open}
              setOpen={setOpen}
              fullWidth={true}
              title={title}
            >
              <img
                src={image}
                alt={title}
                className="w-50 h-32 flex mr-auto ml-auto object-cover"
              />
              <Inputs
                type="url"
                value={url}
                readOnly
                className="flex  px-5 py-1 mx-3 my-2 rounded-md outline-none font-serif shadow-inner shadow-slate-950"
              />
              <div className="flex flex-row gap-5  justify-center items-center py-5 w-full">
                {objSharingItems.map((item, index) => {
                  return (
                    <item.Button key={index} {...item.props}>
                      <item.icon size={40} round={true} />
                    </item.Button>
                  );
                })}
              </div>
            </PopUps>
          </div>
        ) : (
          <ShareRoundedIcon
            loading={loading}
            loadingPosition="right"
            onClick={handleShare}
          />
        )}
      </section>
    </>
  );
};

export default Sharesocially;
