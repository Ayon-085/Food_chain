import React ,{ useEffect,useState } from 'react'

import {useHistory} from 'react-router-dom'

const Post = () => {


  const history= useHistory();

  const historyPost=useHistory();

  

  const [getUser, setInfil]= useState({});



  const profileDataGet=  async ()=>{
      try{
          const res =  await fetch('/profile',{
        method:"GET",

        credentials:"include",
         withCredentials:true,

        headers:{
           Accept:"application/json",
            "Content-Type": "apllication/json"
         }





  });

  const data= await res.json();
  console.log(data);
  setInfil(data);

      }catch(err){
          console.log(err);
       history.push('/login')

      }

    

     



  }

  useEffect(()=>{
    profileDataGet();


}, []);


//for post data

const [user, setUser]=useState({
  
  productname:"", quantity:"", unit:""
});
let name, value;

const handleInputs= (e) =>{
  console.log(e);
  name=e.target.name;
  value= (e.target.value);

  setUser({...user, [name]:value}); 

  console.log(user);
     
   };


const PostData= async(e)=>{
       
  e.preventDefault();



   const{productname, quantity, unit} = user;

     const res= await fetch('/products',{
         method:'POST',
        mode: 'cors',
         withCredentials:true,
         credentials:'include',

         headers: {
           'Content-Type':'application/json'
       },
       body:JSON.stringify({
        productname:productname, quantity:quantity, unit:unit
        
       }),

    



     });




     const data  = await res.json();
    

     //ata dekhte hbe

    //  if(data.status==422|| !data){
    //      window.alert("Invalid registration");
    //      console.log("Invalid resgitration");

    //  }else{
    //     window.alert("Registration Successfully");
    //     console.log("Registration Successfully");

     

    //  }

    if(res.status===400||!data){
        window.alert("your product is not uploaded");
        historyPost.push("/post")
    }
    else{

        window.alert("Your product is uploaded Succesful");
         historyPost.push("/");
    }

  







}











    return (
    <>
      <div className="signup">
        
          <div className="container emp-profile">
            
             <div   className="col-lg-10 offset-lg-1">
             <form id="product_details_form">
                   

                  <div  className= "contact_form_container py-5"> 
                       <div className="product">
                            < h1 >Product Details</h1>
                        </div>
                   
                      <form  method='GET'>

                      <div className="contact_form_name ">

                          <div  className="product_details_item">
                            
                            
                           
                         <input type="text" id = "name" className="contact_form_name input_field" 

                            value={getUser.name}

                         placeholder="Your Name"  required="true"/>
                          </div>

                          <div  className="product_details_item">
                            
                            
                           
                         <input type="text" id = "userId" className="contact_form_name input_field" 
                            
                        value={getUser.key}

                         placeholder="Your userId"  required/>
                          </div>
                         
                          <div  className="product_details_item">
                            
                            
                           
                            <input type="text" id = "role" className="contact_form_name input_field" 
                               
                            value={getUser.role}
   
                            placeholder="Your role"  required/>
                             </div>
                             <div  className="product_details_item">
                            
                            
                           
                            <input type="text" id = "org" className="contact_form_name input_field" 
                               
                            value={getUser.org}
   
                            placeholder="Your organization"  required/>
                             </div>
                            
                             <div  className="product_details_item" >
                          
                         
                          <input type="text" 
                                  name="productname"
                                  value={user.productname}
                                  onChange={handleInputs}
                         
                          id = "productname" className="contact_form_name input_field" 
                             
                          
 
                          placeholder=" Your Product Name "  required/>
                          </div>
 

                         <div  className="product_details_item" >
                          
                         
                         <input type="text" 
                              name="quantity"
                              value={user.quantity}
                              onChange={handleInputs}
                     
                         id = "quantity" className="contact_form_name input_field" 
                            
                         

                         placeholder=" Quantity"  required/>
                         </div>


                         <div className="product_details_item" >                            
                            
                           
                            <input type="text" 
                              name="unit"
                              value={user.unit}
                              onChange={handleInputs}
                     
                            id = "unit" className="contact_form_name input_field" 
                            placeholder="unit"  required/>
                             </div>
                            

                       </div>

                      </form>

                  </div> 
                  <div className="contact_form_button align-center" >
               <button  type="submit"  onClick={PostData}  className="button contact_submit_button" 
                    

               > Upload</button>

           </div>



                </form>
             </div>
               


           </div>

           
          </div>
           
        </>
    )
}

export default Post
