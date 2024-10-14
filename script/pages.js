
//pages
const pages = document.getElementsByClassName("pages");
function hidePages(){
    for(var i = 0; i < pages.length; i++){
        pages[i].style.display = "none";
    }
}
function hidePage(i){
    pages[i].style.display = "none";
}
function showPage(i){
    pages[i].style.display = "block";
}

//navigation
const navItems = document.getElementsByClassName("nav-items");
function changePage(i){

    //change page
    hidePages();
    showPage(i);

    //style nav
    w3.removeClass(".nav-items", 'w3-teal');
    w3.removeClass(".nav-items", 'w3-hover-teal');
    w3.addClass(navItems[i], 'w3-teal');
    w3.addClass(navItems[i], 'w3-hover-teal');

    //animate
    setTimeout(function(){
        w3.removeClass(".animate-opacity", "w3-animate-opacity");
        w3.removeClass(".animate-top", "w3-animate-top");
        w3.removeClass(".animate-bottom", "w3-animate-bottom");
        w3.removeClass(".animate-left", "w3-animate-left");
        w3.removeClass(".animate-right", "w3-animate-right");
    }, 1000);
    w3.addClass(".animate-opacity", "w3-animate-opacity");
    w3.addClass(".animate-top", "w3-animate-top");
    w3.addClass(".animate-bottom", "w3-animate-bottom");
    w3.addClass(".animate-left", "w3-animate-left");
    w3.addClass(".animate-right", "w3-animate-right");

}

//make navigation work
for(var n = 0; n < navItems.length; n++){
    navItems[n].idx = n;
    navItems[n].addEventListener("click", function(){
        changePage(this.idx);
    });
}

//begin
changePage(0);

