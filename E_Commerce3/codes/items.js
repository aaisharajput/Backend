   
let load_more=document.getElementById("load_more");
let empty=document.getElementById("empty");
let i=10;

load_more.addEventListener("click",function(){
  get_items(function(data){

  if(data!=0){
    let add_items=document.getElementById("add_items");
    
    let row=document.createElement("div");
        row.setAttribute("class","row");
    let slider=document.createElement("div");
        slider.classList.add("container-fluid","slider","owl-carousel","pt-5","pl-5","pr-5");
        row.appendChild(slider);
        add_items.appendChild(row);
        for(let j=0;j<5;j++){
             slider.innerHTML+=`
                               <div class="card">
                               <div class="product_name">
                                  <h5 id="item_name">${data[j].p_name}</h5>
                               </div>
                               <div class="img">
                                  <img src="${data[j].img}" alt="">
                                  <div class="btnn d-flex justify-content-around">
                                    <input type="button" onclick="add_item(${data[j].id})" id="addcarts${data[j].id}" class="btn btn-success" value="Add To Cart">
                                    <button class="btn btn-success" onclick="full_details(${data[j].id})">View Details</button>
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

function add_item(i){
      
  add_product(i,(str)=>{
    if(str=="Added"){
      Swal.fire(
                  'Added!!',
                  'Item has been added successfully in cart.',
                  'success',
               )
    }
  })
}

function add_product(i,callback){
        let request = new XMLHttpRequest();
            request.open("POST","/addToCart");
            request.setRequestHeader("Content-Type","application/json");
            request.send(JSON.stringify({id:i}));

            request.addEventListener("load", function(){
              let result=JSON.parse(request.responseText);
              if(result.redirect){
                window.location.href=result.redirect;
              }else
                callback(result.str);
            });
}
    

   function get_items(callback){
            let request = new XMLHttpRequest();
                request.open("POST","/getdetails");
                request.setRequestHeader("Content-Type","application/json");
                request.send(JSON.stringify({counter:i}));

                request.addEventListener("load", function(){
                  callback(JSON.parse(request.responseText))
                });
   }

   function full_details(id){
     get_details(id,(details)=>{
      let span=`<div class="row">
      <div class="col-12 col-md-4">
          <img id="p_img" src="${details[0].img}" style="height: 90%;width: 115%;">
      </div>
      <div class="col-12 col-md-8">
        <div class="row">
          <div class="col-4 col-md-4 d-flex justify-content-end"><p>saller_name :</p></div> <div class="col-8 col-md-8 d-flex justify-content-start"><p>${details[0].saller_name}</p></div>
          <div class="col-4 col-md-4 d-flex justify-content-end"><p>shipping_charges :</p></div> <div class="col-8 col-md-8 d-flex justify-content-start"><p>${details[0].shipping_charges}</p></div>
          <div class="col-4 col-md-4 d-flex justify-content-end"><p>Product Details :</p></div> <div class="col-8 col-md-8 d-flex justify-content-start"><textarea rows="10" class="form-control" style="background:#fff;border:none" disabled>${details[0].p_details}</textarea></div>
          
        </div>
      </div>
      
    </div> `;
  
  Swal.fire({
      title:details[0].p_name+" "+ details[0].color+" Rs."+ details[0].price,
      width:1000,
      html:span,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Add To Cart'
  }).then((result) => {
        if (result.isConfirmed) {
          add_item(id)
        }
      })
     })
    
   }

   function get_details(id,callback){
    let request = new XMLHttpRequest();
    request.open("POST","/single_product");
    request.setRequestHeader("Content-Type","application/json");
    request.send(JSON.stringify({id:id}));

    request.addEventListener("load", function(){
      callback(JSON.parse(request.responseText))
    });
   }

   function scroll(){
    $(".slider").owlCarousel({
      loop: true,
      margin:0,
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
