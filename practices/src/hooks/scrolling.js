export const useScrolling = () =>{
    const lock = ()=> document.body.style.overflow = "hidden";
    const unlock = ()=> document.body.style.overflow = "";
    return {lock,unlock}
}