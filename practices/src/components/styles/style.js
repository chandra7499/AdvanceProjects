
export const  style=
{
    generalHover:"px-2 py-2 rounded-md shadow-md hover:bg-slate-900 hover:text-white flex gap-5  transition-all ease-in-out duration-300  gap-5 text-nowrap",
    general:"px-2 py-2  rounded-md shadow-md bg-slate-900 text-white flex items-center  transition-all ease-in-out duration-300 ",
    activatedLink:"bg-slate-900 px-2 py-2 rounded-md flex  text-slate-100  gap-5 text-nowrap",
    btnStyle : "hover:bg-slate-900 px-2 py-2 rounded-md hover:text-slate-100 cursor-pointer shadow-md ring-1 ring-gray-200  flex gap-5  transtion-all ease-in-out duration-300  gap-5 text-nowrap",
    cartBottomCostStyle:"p-2 bg-slate-900 text-gray-200 text-nowrap rounded-md mr-3 *:text-gray-400",

}

export const inputStyles = {
    textInput:"flex w-full gap-2 p-2 shadow-inner shadow-black rounded-md",
    ExchangeSpan:"shadow-inner shadow-slate-950 h-full p-2 rounded-md w-full flex gap-4 overflow-x-scroll items-center"
} 


// for parent variant 
export const listVariant = {
    hidden:{
        opacity:0
    },
    visible:{
        opacity:1,
        transition:{
            staggerChildren:0.3,
            delayChildren:0.3

        }
    }
};


//for children variants
export const ItemVariant = {
  hidden:{opacity:0,x:15},
  visible:{opacity:1,x:0,transition:{duration:0.3,ease:"easeOut"}},
  exit:{opacity:0,x:15,transition:{duration:0.2,ease:"easeIn"}}
}

export const warningParent={
    initial:{opacity:0,y:100}, 
    animate:{y:0,opacity:1,zIndex:9999},
    exit:{opacity:0,y:100,transition:{duration:0.2}}    
}

export const warningChild= {
    initial:{opacity:0,y:100},
    animate:{y:0,opacity:1},
    exit:{opacity:0,y:100}
}

// home content scalling
