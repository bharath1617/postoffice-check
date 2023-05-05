let ipAddress;
let getbutton = document.getElementById("get-data");
let postno = 0;
let latitudeid;
let longitudeid;
let timeZones;
let newarr = [];

getbutton.addEventListener('click', () => {
  let dispalydet = document.getElementById("maps-details");
  getbutton.style.display = "none";
  dispalydet.style.display = "block";
  let lat = document.getElementById("lat");
  let long = document.getElementById("long");
  let cityname = document.getElementById("city");
  let regions = document.getElementById("region");
  let timeZone = document.getElementById("time-zone");
  let pincode = document.getElementById("pincode");
  let message = document.getElementById("message");
  let orgnasia = document.getElementById("orgnas");
  let host = document.getElementById("host");
 
  fetch('https://api.ipify.org?format=json')
    .then(response => response.json())
    .then(data => {
      ipAddress = data.ip;
      console.log(`User IP address: ${ipAddress}`);
      document.getElementById("ip-address").innerHTML = `: ${ipAddress}`

      fetch(`https://ipinfo.io/${ipAddress}/geo?token=1428a026cad406`)
        .then(response => response.json())
        .then(data => {
          const { loc, city, region, postal, timezone, org, hostname } = data;
          const [latitude, longitude] = loc.split(",");

          lat.innerHTML = `: ${latitude}`;
          long.innerHTML = `: ${longitude}`;
          cityname.innerHTML = `: ${city}`;
          regions.innerHTML = `: ${region}`;
          timeZone.innerHTML = `: ${timezone}`;
          pincode.innerHTML = `: ${postal}`;
          orgnasia.innerHTML = `: ${org}`;
          host.innerHTML = `: ${hostname}`;
          latitudeid = latitude;
          longitudeid = longitude;
          timeZones = timezone;
          postno = postal;
          newarr.push(data);
          console.log(newarr);
          show();
          fetch(`https://api.postalpincode.in/pincode/${postal}`)
            .then(response => response.json())
            .then(data => {
              console.log(data);
              console.log(data[0].Message);
              message.innerHTML = `: ${data[0].Message}`
              let postOffice = data[0].PostOffice;
              let postOfficeList = document.getElementById("post-office-list");
              postOfficeList.innerHTML = "";
              for (let i = 0; i < postOffice.length; i++) {
                let name = postOffice[i].Name;
                let branch = postOffice[i].BranchType;
                let district = postOffice[i].District;
                let delivary = postOffice[i].DeliveryStatus;
                let devisions = postOffice[i].Division;

                let postdetails = document.createElement('div');
                postdetails.setAttribute("class", "small-container");
                let postOfficeName = document.createElement("p");
                postOfficeName.innerHTML = `Name: ${name}`;
                postdetails.appendChild(postOfficeName);

                let postOfficeBranch = document.createElement("p");
                postOfficeBranch.innerHTML = `Branch Type: ${branch}`;
                postdetails.appendChild(postOfficeBranch);

                let postOfficestatus = document.createElement("p");
                postOfficestatus.innerHTML = `Delivary Status: ${delivary}`;
                postdetails.appendChild(postOfficestatus);

                let postOfficeDistrict = document.createElement("p");
                postOfficeDistrict.innerHTML = `District: ${district}`;
                postdetails.appendChild(postOfficeDistrict);

                let postOfficeDivision = document.createElement("p");
                postOfficeDivision.innerHTML = `Division: ${devisions}`;
                postdetails.appendChild(postOfficeDivision);

                postOfficeList.appendChild(postdetails);
              }
            })
            .catch(error => console.error(error));
        })
        .catch(error => console.error(error));
    })
    .catch(error => console.error(error));
});

function show() {
  const iframe = document.createElement("iframe");
  iframe.src = `https://maps.google.com/maps?q=${latitudeid}, ${longitudeid}&z=15&output=embed`
  iframe.width = "700px";
  iframe.height = "400px";
  const container = document.getElementById("map-container");
  container.appendChild(iframe);

  let datetime = document.getElementById("date-time");

  let datetime_str = new Date().toLocaleString("en-US", { timeZone: `${timeZones}` });
  let date_ = new Date(datetime_str);
  let year = date_.getFullYear();
  let month = ("0" + (date_.getMonth() + 1)).slice(-2);
  let date = ("0" + date_.getDate()).slice(-2);
  let hours = ("0" + date_.getHours()).slice(-2);
  let minutes = ("0" + date_.getMinutes()).slice(-2);
  let seconds = ("0" + date_.getSeconds()).slice(-2);
  let date_time = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
  datetime.innerHTML = ": " + date_time;

}

let searchInput = document.getElementById("search");
let postOfficeList = document.getElementById("post-office-list");

searchInput.addEventListener("keyup", () => {
  let searchTerm = searchInput.value.toLowerCase();
  let allPostOffices = postOfficeList.querySelectorAll(".small-container");

  allPostOffices.forEach(postOffice => {
    let name = postOffice.querySelector("p:nth-child(1)").textContent.toLowerCase();
    let branch = postOffice.querySelector("p:nth-child(2)").textContent.toLowerCase();
    let delivery = postOffice.querySelector("p:nth-child(3)").textContent.toLowerCase();
    let district = postOffice.querySelector("p:nth-child(4)").textContent.toLowerCase();
    let division = postOffice.querySelector("p:nth-child(5)").textContent.toLowerCase();

    if (name.includes(searchTerm) || branch.includes(searchTerm) || delivery.includes(searchTerm) ||district.includes(searchTerm) || division.includes(searchTerm) ) {
      postOffice.style.display = "block";
    } else {
      postOffice.style.display = "none";
    }
  });
});
