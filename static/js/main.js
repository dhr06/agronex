
function toggleMenu(){
  document.getElementById("navLinks").classList.toggle("active");
}

function login(){
  let user=document.getElementById("username").value;
  let pass=document.getElementById("password").value;
  if(user==="admin" && pass==="1234"){
    alert("Login Successful!");
    window.location.href="dashboard.html";
  }else{
    alert("Invalid Credentials!");
  }
}
/* ================= SCROLL ANIMATION ================= */

document.addEventListener("DOMContentLoaded", function() {

    const elements = document.querySelectorAll(".reveal, .zoom, .reveal-left");

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if(entry.isIntersecting){
                entry.target.classList.add("active");
            }
        });
    }, {
        threshold: 0.2
    });

    elements.forEach(el => {
        observer.observe(el);
    });

});