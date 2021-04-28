import React , {useState} from 'react'
import {Modal ,Button}from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";





const ConsumerHome = () => {


  


    const [showproduct, setProductShow] = useState(false);


 

  const handleCloseProduct= () => setProductShow(false);
  const handleShowProduct= () => setProductShow(true);



  

    return (
        <>

<div>
           <div className="showhead">
          <h1> All Retailer Product </h1>
          </div>
            
         <section class="products">


              <div class="product-card">
                      <div class="product-image">
                          <h1>Product Name</h1>
                      </div>
                         <div class="product-info">

                         <div>
                          <h5>Product ID : </h5>

                         </div>
                         <div>
                          <h5>Consumer Name : </h5>

                         </div>

                       
                </div>

               <div>

            <Button variant="primary" onClick={() => setProductShow(true)}>
                                    View details
                                  </Button> 
                         
                         

               </div>

                   <div>     

<Modal
     show={showproduct}
     onHide={() => setProductShow(false)}
        dialogClassName="modal-90w"
       size='xl'
     aria-labelledby="example-custom-modal-styling-title"
       >
     <Modal.Header closeButton>
       <Modal.Title id="example-custom-modal-styling-title">
          Product Details
      </Modal.Title>
     </Modal.Header>
              <Modal.Body>
              <div class="product-card">
                      <div class="product-image">
                          <h1>Product Name</h1>
                      </div>
                         <div class="product-info">

                         <div>
                          <h5>Product ID : </h5>

                         </div>
                         <div>
                          <h5>Producer Name : </h5>

                         </div>
                         <div>
                          <h5>Consumer Name : </h5>

                         </div>
                         <div>
                          <h5>Consumer Name : </h5>

                         </div>
                         <div>
                          <h5>Consumer Name : </h5>

                         </div>
                         <div  className="product_details_item">
                            
                            
                           
                            <input type="text" id = "userId" className="contact_form_name input_field" 
                               
   
                            placeholder="How ammount do you want??"  required/>
                             </div>

                        





                       
                </div>

                </div>
           



             </Modal.Body>

             <Modal.Footer>
             <div className="contact_form_button" >
                   <button  type="submit"  className="button contact_submit_button" > Request to buy</button>

               </div>
             
           
              </Modal.Footer>
            </Modal> 

            </div>  





             </div>

             
             



 


          

        
   
                                



                 </section>




                                
                               


        
        

         

                 </div> 

         
        
                
    
            
            
    
             
    
    
            
    
            
                
            </>
            
      
    )
}

export default ConsumerHome
