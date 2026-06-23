
const AllLink = document.querySelectorAll("nav a") ;
const AllSection = document.querySelectorAll("section") ;
const serchInput =document.getElementById("apod-date-input")



let dateNew=new Date() .toISOString().split("T")[0] ;
serchInput.value=dateNew ;

let arr=[]

const planetFacts = {
    "terre": [
        "Only known planet with liquid water",
        "Atmosphere contains 78% nitrogen",
        "Magnetic field protects from solar wind",
        "Formed 4.54 billion years ago"
    ],
    "mars": [
        "Has the tallest volcano in the Solar System (Olympus Mons)",
        "A day on Mars is 24 hours and 37 minutes",
        "Has two small moons: Phobos and Deimos",
        "Surface temperature averages -60°C"
    ],
    "jupiter": [
        "Largest planet in the Solar System",
        "Has at least 95 known moons",
        "Great Red Spot is a storm lasting 350+ years",
        "One day is only 10 hours long"
    ],
    "saturne": [
        "Has the most spectacular ring system",
        "Least dense planet — would float on water",
        "Has 146 known moons including Titan",
        "Winds can reach 1,800 km/h"
    ],
    "uranus": [
        "Rotates on its side at 98° axial tilt",
        "Has 13 known rings",
        "Coldest planetary atmosphere at -224°C",
        "Has 27 known moons named after Shakespeare characters"
    ],
    "neptune": [
        "Winds reach up to 2,100 km/h — fastest in the Solar System",
        "Takes 165 years to orbit the Sun",
        "Has a storm called the Great Dark Spot",
        "Has 16 known moons including Triton"
    ],
    "mercure": [
        "Smallest planet in the Solar System",
        "A year on Mercury is just 88 Earth days",
        "Surface temperatures range from -180°C to 430°C",
        "Has no atmosphere or moons"
    ],
    "venus": [
        "Hottest planet in the Solar System (462°C)",
        "Rotates in the opposite direction to most planets",
        "A day on Venus is longer than its year",
        "Has the densest atmosphere of all rocky planets"
    ]
};

AllLink.forEach((link)=>{
    link.addEventListener('click',function(){
        AllSection.forEach((sec)=>{
            sec.classList.add("hidden");
        })
        document.getElementById(link.getAttribute("data-section")).classList.remove("hidden");
    })
})

getSpaceApi(dateNew)

getLunches()


function getSpaceApi(date){
     let myDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
});
    document.getElementById("apod-date").innerHTML=`Astronomy Picture of the Day - ${myDate}`;
    document.getElementById("apod-loading").classList.remove("hidden");
    document.getElementById("apod-image").classList.add("hidden");
    document.getElementById("apod-explanation").innerHTML="Loding...";
    document.getElementById("apod-date-detail").innerHTML="Loding...";
    document.getElementById("apod-date-info").innerHTML="Loding...";
    document.getElementById("apod-title").innerHTML="Loding...";
    document.querySelector("label span").innerHTML=myDate

    fetch(`https://api.nasa.gov/planetary/apod?api_key=aUGh5ILJMRvAsVKTrfIBppQMtVbEMwKvgpCkYbyX&date=${date}`).then((res)=>{
        return res.json(); 
    }).then((response)=>{
        
        document.getElementById("apod-image").setAttribute("src",response.hdurl);
        document.getElementById("apod-title").innerHTML=response.title;
        document.getElementById("apod-explanation").innerHTML=response.explanation;
        document.getElementById("apod-date-detail").innerHTML=date;
        document.getElementById("apod-date-info").innerHTML=date;

        document.getElementById("apod-date-input").setAttribute("value",date);
        document.querySelector("label span").innerHTML=date


        
    }).finally(()=>{
         document.getElementById("apod-loading").classList.add("hidden")
         document.getElementById("apod-image").classList.remove("hidden")
    })
}

document.getElementById("load-date-btn").addEventListener("click",function(){
getSpaceApi(serchInput.value)
})
document.getElementById("today-apod-btn").addEventListener("click",function(){
getSpaceApi(dateNew)
})



function getLunches(){
    let cached = sessionStorage.getItem("launches");
    if(cached){
        renderData(JSON.parse(cached));
        return;
    }

    fetch(`https://ll.thespacedevs.com/2.3.0/launches/upcoming`)
    .then((res)=>{
        if(res.status === 429){
            console.error("Rate limit!");
            return;
        }
        return res.json(); 
    })
    .then((response)=>{
        if(!response) return;
        sessionStorage.setItem("launches", JSON.stringify(response.results));
        renderData(response.results);
    })
}

function renderData(data){
       

        let launch = data[0];

        displayLunches(data);

        let launchDate = new Date(launch.net);
        let dateStr = launchDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
        let timeStr = launchDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) + " UTC";

        let daysUntil = Math.ceil((launchDate - new Date()) / (1000 * 60 * 60 * 24));

        let imageUrl = launch.image != null ? launch.image.image_url : '';
        let agency = launch.launch_service_provider?.name || 'Unknown';
        let rocket = launch.rocket?.configuration?.name || 'Unknown';
        let location = launch.pad?.location?.name || 'Unknown';
        let country = launch.pad?.location?.country_code || 'Unknown';
        let description = launch.mission?.description || 'No description available';
        let status = launch.status?.name || 'Unknown';

        document.getElementById("featured-launch").innerHTML=`
          <div
              class="relative bg-slate-800/30 border border-slate-700 rounded-3xl overflow-hidden group hover:border-blue-500/50 transition-all"
            >
              <div
                class="absolute inset-0 bg-linear-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
              ></div>
              <div class="relative grid grid-cols-1 lg:grid-cols-2 gap-6 p-8">
                <div class="flex flex-col justify-between">
                  <div>
                    <div class="flex items-center gap-3 mb-4">
                      <span
                        class="px-4 py-1.5 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold flex items-center gap-2"
                      >
                        <i class="fas fa-star"></i>
                        Featured Launch
                      </span>
                      <span
                        class="px-4 py-1.5 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold"
                      >
                        ${status}
                      </span>
                    </div>
                    <h3 class="text-3xl font-bold mb-3 leading-tight">
                       ${launch.name || ' '}
                    </h3>
                    <div
                      class="flex flex-col xl:flex-row xl:items-center gap-4 mb-6 text-slate-400"
                    >
                      <div class="flex items-center gap-2">
                        <i class="fas fa-building"></i>
                        <span>${agency}</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <i class="fas fa-rocket"></i>
                        <span>${rocket}</span>
                      </div>
                    </div>
                    <div
                      class="inline-flex items-center gap-3 px-6 py-3 bg-linear-to-r from-blue-500/20 to-purple-500/20 rounded-xl mb-6"
                    >
                      <i class="fas fa-clock text-2xl text-blue-400"></i>
                      <div>
                        <p class="text-2xl font-bold text-blue-400">${daysUntil}</p>
                        <p class="text-xs text-slate-400">Days Until Launch</p>
                      </div>
                    </div>
                    <div class="grid xl:grid-cols-2 gap-4 mb-6">
                      <div class="bg-slate-900/50 rounded-xl p-4">
                        <p
                          class="text-xs text-slate-400 mb-1 flex items-center gap-2"
                        >
                          <i class="fas fa-calendar"></i>
                          Launch Date
                        </p>
                        <p class="font-semibold">${dateStr}</p>
                      </div>
                      <div class="bg-slate-900/50 rounded-xl p-4">
                        <p
                          class="text-xs text-slate-400 mb-1 flex items-center gap-2"
                        >
                          <i class="fas fa-clock"></i>
                          Launch Time
                        </p>
                        <p class="font-semibold">${timeStr}</p>
                      </div>
                      <div class="bg-slate-900/50 rounded-xl p-4">
                        <p
                          class="text-xs text-slate-400 mb-1 flex items-center gap-2"
                        >
                          <i class="fas fa-map-marker-alt"></i>
                          Location
                        </p>
                        <p class="font-semibold text-sm">${location}</p>
                      </div>
                      <div class="bg-slate-900/50 rounded-xl p-4">
                        <p
                          class="text-xs text-slate-400 mb-1 flex items-center gap-2"
                        >
                          <i class="fas fa-globe"></i>
                          Country
                        </p>
                        <p class="font-semibold">${country}</p>
                      </div>
                    </div>
                    <p class="text-slate-300 leading-relaxed mb-6">
                      ${description}
                    </p>
                  </div>
                  <div class="flex flex-col md:flex-row gap-3">
                    <button
                      class="flex-1 self-start md:self-center px-6 py-3 bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors font-semibold flex items-center justify-center gap-2"
                    >
                      <i class="fas fa-info-circle"></i>
                      View Full Details
                    </button>
                    <div class="icons self-end md:self-center">
                      <button
                        class="px-4 py-3 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors"
                      >
                        <i class="far fa-heart"></i>
                      </button>
                      <button
                        class="px-4 py-3 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors"
                      >
                        <i class="fas fa-bell"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div class="relative">
                  <div
                    class="relative h-full min-h-[400px] rounded-2xl overflow-hidden bg-slate-900/50"
                  >
                    <div
                      class="flex items-center justify-center h-full min-h-[400px] bg-slate-800"
                    >
                     <img src="${imageUrl}" alt="${launch.name || ''}" style="width:100%;height:100%;object-fit:cover;">
                    </div>
                    <div
                      class="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
        `
}

function displayLunches(lunches){
    let cartona = ``;

    for (let i = 1; i < lunches.length; i++) {
        let launchDate = new Date(lunches[i].net);
        let dateStr = launchDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
        let timeStr = launchDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) + " UTC";
        let imageUrl = lunches[i].image != null ? lunches[i].image.image_url : '';
        let status = lunches[i].status?.name || 'Unknown';
        let rocket = lunches[i].rocket?.configuration?.name || 'Unknown';
        let location = lunches[i].pad?.location?.name || 'Unknown';

        cartona += `
         <div class="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all group cursor-pointer">
              <div class="relative h-48 bg-slate-900/50 flex items-center justify-center">
                <img src="${imageUrl}" alt="" style="width:100%;height:100%;object-fit:cover;">
                <div class="absolute top-3 right-3">
                  <span class="px-3 py-1 bg-green-500/90 text-white backdrop-blur-sm rounded-full text-xs font-semibold">
                    ${status}
                  </span>
                </div>
              </div>
              <div class="p-5">
                <div class="mb-3">
                  <h4 class="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                    ${lunches[i].name || ' '}
                  </h4>
                  <p class="text-sm text-slate-400 flex items-center gap-2">
                    <i class="fas fa-building text-xs"></i>
                    ${lunches[i].launch_service_provider?.name || 'Unknown'}
                  </p>
                </div>
                <div class="space-y-2 mb-4">
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-calendar text-slate-500 w-4"></i>
                    <span class="text-slate-300">${dateStr}</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-clock text-slate-500 w-4"></i>
                    <span class="text-slate-300">${timeStr}</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-rocket text-slate-500 w-4"></i>
                    <span class="text-slate-300">${rocket}</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-map-marker-alt text-slate-500 w-4"></i>
                    <span class="text-slate-300 line-clamp-1">${location}</span>
                  </div>
                </div>
                <div class="flex items-center gap-2 pt-4 border-t border-slate-700">
                  <button class="flex-1 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-sm font-semibold">
                    Details
                  </button>
                  <button class="px-3 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
                    <i class="far fa-heart"></i>
                  </button>
                </div>
              </div>
            </div>
        `
    }

    document.getElementById("launches-grid").innerHTML = cartona;
}

getPlantes()


function getPlantes(){
     fetch(`https://solar-system-opendata-proxy.vercel.app/api/planets`)
    .then((res)=>{
        if(res.status === 429){
            console.error("Rate limit!");
            return;
        }
        return res.json(); 
    })
    .then((response)=>{
       
        displayPlantes(response.bodies);
        arr=response.bodies ;
      
    })


}
function displayPlantes(plantes){


      let cartona = `` ;
        for (let i = 0; i < plantes.length; i++) {
            cartona+=`
           
             <div
              onClick=displayPlantesDet(${i})
              class="planet-card bg-slate-800/50 border border-slate-700 rounded-2xl p-4 transition-all cursor-pointer group"
              data-planet-id="mercury"
              style="--planet-color: #eab308"
              onmouseover="this.style.borderColor='#eab30880'"
              onmouseout="this.style.borderColor='#334155'"
            >
              <div class="relative mb-3 h-24 flex items-center justify-center">
                <img
                  class="w-20 h-20 object-contain group-hover:scale-110 transition-transform"
                src="${plantes[i].image}"
                  alt="Mercury"
                />
              </div>
              <h4 class="font-semibold text-center text-sm">${plantes[i].englishName}</h4>
              <p class="text-xs text-slate-400 text-center">0.39 AU</p>
            </div>
            `
            
        }

        document.getElementById("planets-grid").innerHTML=cartona ;
        
}


function displayPlantesDet(i){
   document.getElementById("planet-detail-image").setAttribute("src", arr[i].image || '');
    document.getElementById("planet-distance").innerHTML = `${arr[i].   semimajorAxis.toLocaleString()} km`;
    document.getElementById("planet-radius").innerHTML = `${arr[i]. meanRadius.toLocaleString()} km`;
    document.getElementById("planet-mass").innerHTML = `${arr[i].   mass.massValue} × 10<sup>${arr[i]. mass.massExponent}</sup> kg`;
    document.getElementById("planet-density").innerHTML = `${arr[i].    density} g/cm³`;
    document.getElementById("planet-orbital-period").innerHTML = `${arr[i]. sideralOrbit.toLocaleString()} days`;
    document.getElementById("planet-rotation").innerHTML = `${arr[i].   sideralRotation} hours`;
    document.getElementById("planet-moons").innerHTML = arr[i]. moons ? arr[i].  moons.length : 0;
    document.getElementById("planet-gravity").innerHTML = `${arr[i].    gravity} m/s²`;


  let facts = planetFacts[arr[i].id] || ["No facts available"];

document.getElementById("planet-facts").innerHTML = `
    <ul class="space-y-3 text-sm">
        ${facts.map(f => `
        <li class="flex items-start">
            <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
            <span class="text-slate-300">${f}</span>
        </li>
        `).join('')}
    </ul>
`;
}

document.getElementById("sidebar-toggle").addEventListener("click", function(){
    document.getElementById("sidebar").classList.toggle("sidebar-open");
})

AllLink.forEach((link)=>{
    link.addEventListener('click',function(){
        AllSection.forEach((sec)=>{
            sec.classList.add("hidden");
        })
        document.getElementById(link.getAttribute("data-section")).classList.remove("hidden");

        AllLink.forEach((l)=>{
            l.classList.remove("bg-blue-500/10", "text-blue-400");
            l.classList.add("text-slate-300");
        })

        link.classList.add("bg-blue-500/10", "text-blue-400");
        link.classList.remove("text-slate-300");

        document.getElementById("sidebar").classList.remove("sidebar-open");
    })
})