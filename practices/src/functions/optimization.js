export const optimizedCloudinaryImage = (url,width = 800)=>{
    if(!url) return url;
    return url.replace("upload/",`upload/f_auto,q_auto:good,w_${width},c_limit/`);
}