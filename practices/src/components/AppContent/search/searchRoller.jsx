import {motion} from "framer-motion"

// import { useSearchProducts } from '../../../hooks/useItems';

// import {useSearchFunction} from "../../../functions/searchFunction";
// import { Loading } from '../../loading';
import {myContext} from "../../GlobalStates/contextHooks";
import {useContext} from "react"
import {useNavigate} from "react-router-dom";
// import {useProducts} from "../../GlobalStates/contextHooks"





const SearchRoller = () => {
 const {filter:FilterProducts,setSearchItems} = useContext(myContext);
 const navigate = useNavigate();
 function handleSearch(itemName){
    navigate(`/search`,{state:{searchName:itemName,partialSearch:false}});
    setSearchItems("");
 }



// useEffect(()=>{
//     // console.log("searchRoller:",FilterProducts);
//     if(FilterProducts){
       
//            console.log(FilterProducts);
//     }
// },[FilterProducts]);



  return (
    <>
    {<motion.div className="fixed lg:w-1/2 lg:left-16 h-[100vh] backdrop-blur-md z-50 flex justify-center items-start mt-10 py-1"
      initial={{opacity:0,width:"100%",height:0}}
      animate={FilterProducts?.length>0 && FilterProducts!=="" ? {opacity:1,width:"100%",height:"100vh"}:{opacity:0,width:"100%",height:0}}
      exit={{opacity:0}}
    >
        <motion.div className="bg-slate-100 shadow-md text-slate-950 lg:w-[40%] md:w-[43%] w-[80%] mt-4 max-h-[70vh] rounded-md z-50  right-24  overflow-y-auto"
           initial={{opacity:0,height:0}}
           animate={FilterProducts?.length>0 && FilterProducts!=="" ? {opacity:1,height:"auto"} : {opacity:0,height:0}}
           exit={{opacity:0,height:0}}
           transition={{duration:.3}}
          
        >
            <main>
                <ul>
                    {
                       FilterProducts?.map((items)=>{
                        return (
                            <li key={items.id} onClick={()=>handleSearch(items.name)} className="flex items-center justify-between gap-2 p-2 hover:bg-slate-200 hover:text-slate-950 hover:cursor-pointer"> 
                               <p>{items.name}</p>
                               <img src={Array.isArray(items.images) ? items.images[0] : items.image} alt={items.name} className="w-10 h-10 rounded-full"/>
                            </li>
                        )
                       })
                    }
                </ul>
            </main>

        </motion.div>
        </motion.div>}
    </>
  )
}

export default SearchRoller