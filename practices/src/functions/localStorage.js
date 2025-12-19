 export const getStorage = (title) =>{
    const store = localStorage.getItem(title);
    return store ? JSON.parse(store) : null; 
 }

 export const setStorage = (title,data) => {
   return localStorage.setItem(title,JSON.stringify(data))
};




export const getSessionStorage = (title)=>{
   const store = sessionStorage.getItem(title);
   return store ? JSON.parse(store) : [];
}

export const setSessionStorage = (title,data)=>{
   return sessionStorage.setItem(title,JSON.stringify(data))
}

export const removeSessionStorage = (title)=>{
   return sessionStorage.removeItem(title)
}