/* ================= NAVBAR MENU ================= */

function toggleNavbar(){
  let nav = document.getElementById("navLinks");
  if(nav){
    nav.classList.toggle("active");
  }
}

/* ================= SIDEBAR ================= */

function toggleSidebar(){
  let sidebar = document.getElementById("sidebar");
  if(sidebar){
    sidebar.classList.toggle("active");
  }
}

/* ================= LOGIN ================= */

function login(){
  let user=document.getElementById("username").value;
  let pass=document.getElementById("password").value;

  if(user==="admin" && pass==="1234"){
    alert("Login Successful!");
    window.location.href="/dashboard";
  }else{
    alert("Invalid Credentials!");
  }
}

/* ================= SCROLL ANIMATION ================= */

document.addEventListener("DOMContentLoaded", function(){

  const elements=document.querySelectorAll(".reveal, .zoom, .reveal-left");

  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add("active");
      }
    });
  },{threshold:0.2});

  elements.forEach(el=>{
    observer.observe(el);
  });

});

/* ================= SECTION SWITCH ================= */

function showSection(section){

  document.querySelectorAll(".section").forEach(s=>{
    s.classList.remove("active");
  });

  let activeSection=document.getElementById(section);
  if(activeSection){
    activeSection.classList.add("active");
  }

  document.querySelectorAll(".sidebar li").forEach(li=>{
    li.classList.remove("active");
  });

  let item=document.querySelector(`.sidebar li[onclick="showSection('${section}')"]`);
  if(item){
    item.classList.add("active");
  }
}

/* ================= FARM MAP ================= */

if(document.getElementById("map")){

  var map=L.map('map').setView([22.9734,78.6569],5);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{
    maxZoom:19
  }).addTo(map);

  L.marker([23.0225,72.5714]).addTo(map).bindPopup("ABY Farm");

  L.marker([22.3072,73.1812]).addTo(map).bindPopup("YNS Farm");

  L.marker([19.0760,72.8777]).addTo(map).bindPopup("ARD Farm");

}

/* ================= CROP CHART ================= */

if(document.getElementById("cropChart")){

new Chart(document.getElementById("cropChart"),{

type:'doughnut',

data:{
labels:['Wheat','Corn','Barley','Paddy'],

datasets:[{
data:[50,15.5,14.2,6.7],
backgroundColor:[
'#4CAF50',
'#FF9800',
'#E53935',
'#8E24AA'
]
}]
}

});

}

/* ================= COST CHART ================= */

if(document.getElementById("costChart")){

new Chart(document.getElementById("costChart"),{

type:'line',

data:{
labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct'],

datasets:[{
label:'Farm Cost',
data:[100,200,150,300,210,260,220,386,310,330],
borderColor:'#4CAF50',
tension:0.4
}]
}

});

}

/* ================= WEATHER API ================= */

/* ================= LIVE WEATHER ================= */

async function getWeather(){

try{

let res = await fetch("/live-data");

let data = await res.json();

if(document.getElementById("temperature")){
document.getElementById("temperature").innerText = data.temperature + " °C";
}

if(document.getElementById("humidity")){
document.getElementById("humidity").innerText = data.humidity + " %";
}

if(document.getElementById("wind")){
document.getElementById("wind").innerText = data.wind + " km/h";
}

}catch(error){

console.log("Weather Fetch Error:", error);

}

}

/* load weather when page opens */
getWeather();

/* auto refresh every 10 seconds */
setInterval(getWeather,10000);

/* ================= DASHBOARD DATA ================= */

let fields=[];
let jobs=[];
let completedJobs=0;
let completedJobList=[];

function updateDashboard(){

if(document.getElementById("fieldCount")){
document.getElementById("fieldCount").innerText=fields.length;
}

if(document.getElementById("activeJobs")){
document.getElementById("activeJobs").innerText=jobs.length;
}

if(document.getElementById("jobsDue")){
document.getElementById("jobsDue").innerText=jobs.length;
}

if(document.getElementById("jobsCompleted")){
document.getElementById("jobsCompleted").innerText=completedJobs;
}

}

/* ================= FIELDS ================= */

function addField(){

let name=document.getElementById("fieldName").value;
let crop=document.getElementById("cropType").value;

if(name=="" || crop=="") return;

fields.push({name,crop});

renderFields();
updateDashboard();

document.getElementById("fieldName").value="";
document.getElementById("cropType").value="";

}

function renderFields(){

let table=document.getElementById("fieldTable");

if(!table) return;

table.innerHTML="";

fields.forEach((f,i)=>{

table.innerHTML+=`
<tr>
<td>${f.name}</td>
<td>${f.crop}</td>
<td><button class="deleteBtn" onclick="deleteField(${i})">Delete</button></td>
</tr>
`;

});

}

function deleteField(i){

fields.splice(i,1);

renderFields();
updateDashboard();

}

/* ================= JOBS ================= */

function addJob(){

let name=document.getElementById("jobName").value;

if(name=="") return;

jobs.push(name);

renderJobs();
updateDashboard();

document.getElementById("jobName").value="";

}

function renderJobs(){

let table=document.getElementById("jobTable");

if(!table) return;

table.innerHTML="";

jobs.forEach((j,i)=>{

table.innerHTML+=`

<tr>
<td>${j}</td>

<td>
<button onclick="completeJob(${i})">Complete</button>
<button class="deleteBtn" onclick="deleteJob(${i})">Delete</button>
</td>

</tr>

`;

});

}

function renderCompletedJobs(){

let table=document.getElementById("completedJobTable");

if(!table) return;

table.innerHTML="";

completedJobList.forEach(job=>{

table.innerHTML+=`

<tr>
<td>${job}</td>
<td><span class="completedStatus">Completed</span></td>
</tr>

`;

});

}

function deleteJob(i){

jobs.splice(i,1);

renderJobs();
updateDashboard();

}

function completeJob(i){

let job=jobs[i];

jobs.splice(i,1);

completedJobList.push(job);

completedJobs++;

renderJobs();
renderCompletedJobs();
updateDashboard();

}

/* ================= TEAM ================= */

function addMember(){

let name=document.getElementById("memberName").value;

if(name=="") return;

let list=document.getElementById("teamList");

let li=document.createElement("li");

li.innerHTML=name+" <button onclick='this.parentElement.remove()'>Remove</button>";

list.appendChild(li);

document.getElementById("memberName").value="";

}

/* ================= VEHICLES ================= */

function addVehicle(){

let name=document.getElementById("vehicleName").value;

if(name=="") return;

let list=document.getElementById("vehicleList");

let li=document.createElement("li");

li.innerHTML=name+" <button onclick='this.parentElement.remove()'>Remove</button>";

list.appendChild(li);

document.getElementById("vehicleName").value="";

}

/* ================= INIT ================= */

updateDashboard();