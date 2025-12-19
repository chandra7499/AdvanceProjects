export const dateSpliter = (date) =>{
   //like we can splite into hours and min and seconds
   const dateOBJ = new Intl.DateTimeFormat("en-GB",{
     hours:"2-digit",
     minutes:"2-digit",
     seconds:"2-digit"
   }).format(new Date(date));
   return dateOBJ;

}