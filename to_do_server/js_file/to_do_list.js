
        let txt_area=document.getElementById("txtarea");
        let task_list=document.getElementById("add_task");
        let i=0,key_no,data;
        txt_area.addEventListener("keyup",press_enter);

        get_to_do(function(todos){
            let key_no;
            todos.forEach(function(todo){
                key_no=todo.id;
                if(i<key_no) 
                i=key_no;

                task_list.innerHTML+=`<div class='col-12 col-md-12' id='col${key_no}'>
                <input type='text' style='border:none' id='p${key_no}' value='${todo.task_list}' disabled>
                <i class='fa fa-xmark position-relative float-right mr-5' onclick='delet_task(${key_no})'></i>
                <i class='fa fa-pencil position-relative float-right mr-5' onclick='edit(${key_no})'></i>
                <input type='checkbox' onclick='complete(${i})' class='form-check-input position-relative float-right mr-5' id='${key_no}' ${(todo.checked)?"checked":'' }></div>`;                    
                
                if(todo.checked){
                    document.getElementById('p'+key_no).style.textDecoration="line-through";                   
                }
            });
        });

        function get_to_do(callback){
            let request = new XMLHttpRequest();
                request.open("GET", "/gettodo");
                request.send();

                request.addEventListener("load", function(){
                    callback(JSON.parse(request.responseText))
                });
        }

        function press_enter(event){
            if(event.keyCode==13){
                data=txt_area.value.trim();
                if(data!='')
                {
                    ++i;
                    push_to_do(i,data,function(){
                        task_list.innerHTML+=`<div class='col-12 col-md-12' id='col${i}'>
                            <input type='text' style='border:none' id='p${i}' value='${data}' disabled>
                            <i class='fa fa-xmark position-relative float-right mr-5' onclick='delet_task(${i})'></i>
                            <i class='fa fa-pencil position-relative float-right mr-5' onclick='edit(${i})'></i>
                            <input type='checkbox' onclick='complete(${i})' class='form-check-input position-relative float-right mr-5' id='${i}'></div>`;
                    })
                    
                }

                txt_area.value='';

            }
        }

        function push_to_do(i,data,callback){
            let request = new XMLHttpRequest();
                request.open("POST", "/pushtodo");
                request.setRequestHeader("Content-Type","application/json");
                request.send(JSON.stringify({id:i,task_list:data,checked:false}));

                request.addEventListener("load", function(){
                    request.status===200 && callback()
                });
        }

 function complete(id){
    let p_id=document.getElementById('p'+id);
    let c_id=document.getElementById(id).checked;
        save_to_do(id,c_id,function(){
            if(c_id){
                p_id.style.textDecoration="line-through";
            }
            else{
                p_id.style.textDecoration="none";
            }
        })   
 }

 function save_to_do(id,chk,callback){
    let request = new XMLHttpRequest();
        request.open("POST", "/savetodo");
        request.setRequestHeader("Content-Type","application/json");
        request.send(JSON.stringify({id:id,chk:chk}));

        request.addEventListener("load", function(){
            request.status===200 && callback()
        });
 }
    
        


function edit(id){
            let edit_id = document.getElementById('p'+id);
            let val;
            
            if (edit_id.disabled) {
                edit_id.disabled = false;
            }
            else {

                edit_id.disabled = true;
                val=edit_id.value.trim();
                if(val!=''){
                    edit_to_do(id,val,function(){
                    });
                }else{

                    get_to_do(function(todos){
                        let ele=todos.findIndex(x => x.id ==id); 
                        edit_id.value=todos[ele].task_list;
                    });
                }
                
            }
        }

        function edit_to_do(id,val,callback){
            let request = new XMLHttpRequest();
                request.open("POST", "/edittodo");
                request.setRequestHeader("Content-Type","application/json");
                request.send(JSON.stringify({id:id,val:val}));
        
                request.addEventListener("load", function(){
                    request.status===200 && callback()
                });
         }


         function delet_task(id){
            let col_id=document.getElementById('col'+id);

            delete_to_do(id,function(){
                col_id.remove();
            });

        } 
        
        function delete_to_do(id,callback){
            let request = new XMLHttpRequest();
                request.open("POST", "/deletetodo");
                request.setRequestHeader("Content-Type","application/json");
                request.send(JSON.stringify({id:id}));
        
                request.addEventListener("load", function(){
                    request.status===200 && callback()
                });
         }