const navContainerBlur =document.getElementById("navBlur");

function scrollBlurNav(){
    if (window.scrollY > 50){
        navContainerBlur.classList.add("nav-container-blur");
    }else if (window.scrollY === 0){
        navContainerBlur.classList.remove("nav-container-blur")
    }
}
document.addEventListener("scroll", scrollBlurNav);



window.onload = function mobile(){
    if( isMobile.any() ) {
        document.getElementById('navBlur').style.backgroundColor = "black";
       alert('Mobile'); 
    }
}