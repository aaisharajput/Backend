   
let load_more=document.getElementById("load_more");
let empty=document.getElementById("empty");
let i=10,details;

load_more.addEventListener("click",function(){
  get_items(function(data){

  if(data!=0){
    details=data;
    let add_items=document.getElementById("add_items");
    
    let row=document.createElement("div");
        row.setAttribute("class","row");
    let slider=document.createElement("div");
        slider.classList.add("container-fluid","slider","owl-carousel","p-5");
        row.appendChild(slider);
        add_items.appendChild(row);
        for(let i=0;i<5;i++){
             slider.innerHTML+=`
                               <div class="card">
                               <div class="product_name">
                                  <h5 id="item_name">${data[i].p_name}</h5>
                               </div>
                               <div class="img">
                                  <img src="${data[i].img}" alt="">
                                  <div class="btnn d-flex justify-content-center">
                                     <button class="btn btn-success" data-toggle="modal" data-target="#myModal" onclick="full_details(${i})">View Details</button>
                                  </div>
             
                               </div>
                            </div>`;
                         }
                         i+=5;
                   scroll();
      }else{
        empty.innerText="No more Products!!";
      }
  });
});
    

   function get_items(callback){
            let request = new XMLHttpRequest();
                request.open("POST","/getdetails");
                request.setRequestHeader("Content-Type","application/json");
                request.send(JSON.stringify({counter:i}));

                request.addEventListener("load", function(){
                  console.log("response",request.responseText);
                  callback(JSON.parse(request.responseText))
                });
   }

   function full_details(id){
    let saller_name=document.getElementById("saller_name");
      let shipping_charges=document.getElementById("shipping_charges");
      let RAM=document.getElementById("RAM");
      let ROM=document.getElementById("ROM");
      let Expandable=document.getElementById("Expandable");
      let Display=document.getElementById("Display");
      let Camera=document.getElementById("Camera");
      let Battery=document.getElementById("Battery");
      let Processor=document.getElementById("Processor");
      let Warranty=document.getElementById("Warranty");
      let p_name=document.getElementById("p_name");
      let p_img=document.getElementById("p_img");

      p_name.innerText=`${details[id].p_name} (${details[id].color}) Rs. ${details[id].price}`;
      saller_name.innerText=`${details[id].saller_name}`;
      shipping_charges.innerText=`${details[id].shipping_charges}`;
      RAM.innerText=`${details[id].p_details.RAM}`;
      ROM.innerText=`${details[id].p_details.ROM}`;
      Expandable.innerText=`${details[id].p_details.Expandable}`;
      Display.innerText=`${details[id].p_details.Display}`;
      Camera.innerText=`${details[id].p_details.Camera}`;
      Battery.innerText=`${details[id].p_details.Battery}`;
      Processor.innerText=`${details[id].p_details.Processor}`;
      Warranty.innerText=`${details[id].p_details.Warranty}`;
      p_img.setAttribute("src",`${details[id].img}`);
   }

   function scroll(){
    $(".slider").owlCarousel({
      loop: true,
      autoplay: true,
      autoplayTimeout: 2000, //2000ms = 2s;
      autoplayHoverPause: true,
      responsive: {
        0:{
          items:1,
        },
        600:{
          items:2,
        },
        900:{
          items:3,
        },
        1250:{
          items:4,
        }
      }
    });
    }
