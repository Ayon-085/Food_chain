import React, { useState, useEffect } from 'react'
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useHistory } from 'react-router';

const ProducerHome = () => {

  const history = useHistory();

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);



  const [getUser, setInfil] = useState([]);



  const profileDataGet = async () => {
    try {

      const res = await fetch('/products/producer', {
        method: "GET",

        credentials: "include",
        withCredentials: true,

        headers: {
          Accept: "application/json",
          "Content-Type": "apllication/json"
        }

      



      });

      const data = await res.json();
      console.log("fuck");
      console.log(data);



      setInfil(getUser => [...getUser, data.Record]);

      getUser.push(data);

      console.log("data: ", getUser);




      if (data.status != 400)

        console.log(getUser);

    } catch (err) {
      console.log(err);
      history.push('/login');

    }







  }

  useEffect(() => {
    profileDataGet();


  }, []);


const showProd = getUser.map(el=>{
  return (
    <p key={el.Record.name}>
      {el}
    </p>
  )
})



  return (


    <div>

      <div className="showhead">
        <h1>All orders </h1>

      </div>



      {showProd}


{/* {
        getUser.map((curElm) => {

        <section className="products"  >


          <div className="product-card">
            <div className="product-image">
              <h1>Product Name</h1>
            </div>
            <div className="product-info">

              <div>
                <h5>Product ID : 394955  </h5>

              </div>
              <div>
                <h5>Consumer Name :</h5>

              </div>


            </div>

            <div>

              <Button variant="primary" onClick={() => setShow(true)}>
                View details
                                  </Button>



            </div>

            <div>

              <Modal
                show={show}
                onHide={() => setShow(false)}
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
                  <div className="product-card">
                    <div className="product-image">
                      <h1>Product Name</h1>
                    </div>
                    <div class="product-info">

                      <div>
                        <h5>Product ID : </h5>

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
                      <div>
                        <h5>Consumer Name : </h5>

                      </div>

                    </div>

                  </div>

               </Modal.Body>

                <Modal.Footer>
                  <div className="contact_form_button" >
                    <button type="submit" className="button contact_submit_button" > Confrim </button>

                  </div>


                </Modal.Footer>
              </Modal>

            </div>





          </div>

















        </section>

      }
        )
    } */}

    </div>





  )
}

export default ProducerHome;
