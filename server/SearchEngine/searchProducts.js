import {client} from "../SearchEngine/searchEngineSetup.js"

//for search results

export const searchResults = async(req,res)=>{
  const queryParams = req.query.q;
  if(!queryParams){
    return res.status(400).json({result:"query params required"});
  }
  try{
    const index = client.initIndex("products");
    const responens = await index.search(queryParams,{
        hitsPerPage:10
    });

    return res.status(200).json({results:responens.hits});
      
  }catch(e)
  {
     console.log("seacrh error",e.message);
     return res.status(500).json({results:"Failed to search products"});
  }
}