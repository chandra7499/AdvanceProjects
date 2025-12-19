// export function handleClose(){
//    console.log(false);
//     return false;
// }

// export function handleOpen(){
//     console.log(true);
//     return true;
// }

import DOMPurify from "dompurify";

export const daysCounter = (newDate) => {
  const days = Math.floor(
    (new Date() - new Date(newDate)) / (1000 * 60 * 60 * 24)
  );
  return Math.abs(days);
};

export const wordCounter = (text) => {
  const noSpace = text
    .trim()
    .split(/[\s,.!?-]+/)
    .filter((w) => w !== "");
  return text.trim() === "" ? 0 : noSpace.length;
};

export const counter = (seconds, onTick, onComplete) => {
  let interval = setInterval(() => {
    seconds--;
    if (typeof onTick === "function") {
      onTick(seconds);
    }
    if (seconds <= 0) {
      clearInterval(interval);
      if (typeof onComplete === "function") {
        onComplete();
      }
    }
  }, 1000);
};

export const slideFocus = (selector, direction, amount) => {
  const element = document.querySelector(selector);
  if (element) {
    const scrollValue = direction === "left" ? -amount : amount;
    element.scrollBy({
      left: scrollValue,
      behavior: "smooth",
    });
  }
};

export const handleListner = (fn, name) => {
  const handle = (e) => {
    const selection = document.getElementsByClassName(`${name}`);
    let click = false;
    for (let i = 0; i < selection.length; i++) {
      if (selection[i].contains(e.target)) {
        click = true;
        console.log(i);
        break;
      }
    }

    if (!click) {
      fn();
    }
  };

  window.addEventListener("click", handle);
  return () => window.removeEventListener("click", handle);
};

export const priceFormatter = (price) => {
  return new Intl.NumberFormat("en-IN",{
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(price));
};


//count converter
export const countConverter = (count) =>{
   count =  Number(count);

   const format = (num,suffix)=>{
      const v = num.toFixed(1);
      return (v.endsWith(".0") ? v.slice(0,-2) : v)+suffix;
   }

   if(count < 1000);
   if(count >= 1000 && count < 1000000) count = format(count / 1000,"K");
   if(count >= 1000000) count = format(count / 1000000,"M");
   if(count >= 1000000000) count = format(count / 1000000000,"B");
   return count.toString();
}


export const sanitizeText = (input) => {
  if (!input) return "";

  // Step 1: Strip all HTML tags using DOMPurify (strong protection)
  let clean = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  });

  // Step 2: Remove all URLs manually (regex)
  clean = clean.replace(
    /(https?:\/\/[^\s]+)|(www\.[^\s]+)/gi,
    ""
  );

  // Step 3: Remove leftover script-like patterns
  clean = clean.replace(/<script.*?>.*?<\/script>/gi, "");

  // Step 4: Convert multiple spaces to single space
  clean = clean.replace(/\s+/g, " ").trim();

  return clean;
};
