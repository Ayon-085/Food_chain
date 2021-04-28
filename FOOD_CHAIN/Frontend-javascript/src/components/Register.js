import React,{useState} from 'react'
import { NavLink, useHistory} from 'react-router-dom'
import signuppic from '../images/signup.svg'

const Register = () => {
    

    const history =useHistory();

const [user, setUser]=useState({
    name:"", email:"", role:"", org:"",password:"",
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

      const url='http://localhost:3000/register';

       const{name, email, role, org, password} = user;

         const res= await fetch(url,{
             method:'POST',
            mode: 'cors',
             withCredentials:true,
             credentials:'include',

             headers: {
               'Content-Type':'application/json'
           },
           body:JSON.stringify({
            name:name, email:email, role:role, org:org, password:password,
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
            window.alert("Invalid registration");
        }
        else{

            window.alert("Registration successful");
             history.push("/login");
        }

      







  }






    return (
        <>
            <section className="signup">
                <div className="container mt-5">
                    <div className="signup-content">
                        <div className="signup-form">
                            <h2 className="form-title" > Sign Up</h2>
                            <form method="POST" className="register-form" id="register-form">
                                <div className="form-group">
                                    <label htmlFor="name">
                                    <i class="zmdi zmdi-account material-icons-name "></i>
                                    </label>
                                    <input type="text" name ="name" id="name" autoComplete="off" 
                                       value={user.name}
                                       onChange={handleInputs}
                                    
                                    placeholder="Your Name" autoFocus required ></input>
                                    

                                </div>
                                {/* <div className="form-group">
                                    <label htmlFor="userid">
                                    <i class="zmdi zmdi-account-add material-icons-phone "></i>
                                    </label>
                                    <input type="text" name ="userid" id="phone" autoComplete="off" 
                                       value={user.name}
                                       onChange={handleInputs}
                                    
                                    placeholder="Your Id"  required></input>
                                    

                                </div> */}
                                <div className="form-group">
                                    <label htmlFor="email">
                                    <i class="zmdi zmdi-email material-icons-name "></i>
                                    </label>
                                    <input type="email" name ="email" id="email" autoComplete="off" 
                                       value={user.email}
                                       onChange={handleInputs}
                                    
                                    placeholder="Your Email"  required></input>
                                    

                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="org">
                                    <i class="zmdi zmdi-slideshow material-icons-name "></i>
                                    </label>
                                    <input type="text" name ="org" id="org" autoComplete="off" 
                                       value={user.org}
                                       onChange={handleInputs}
                                    
                                    placeholder="Your organization" required ></input>
                                    

                                </div>
                                <div className="form-group">
                                    <label htmlFor="role">
                                    <i class="zmdi zmdi-accounts-list-alt material-icons-name "></i>
                                    </label>
                                    <input type="text" name ="role" id="role"  
                                     list="mylist"  autoComplete="off" 
                                            value={user.role}
                                            onChange={handleInputs}
                                    
                                    placeholder="Your role" required />

                                    <datalist  id="mylist">
                                        <option value="producer">producer</option>
                                        <option value="retailer">retailer</option>
                                        <option value="consumer">consumer</option>
                                    </datalist>

                                    

                                </div>
                                <div className="form-group">
                                    <label htmlFor="password">
                                    <i class="zmdi zmdi-lock material-icons-name "></i>
                                    </label>
                                    <input type="password" name ="password" id="password" autoComplete="off" 
                                       value={user.password}
                                       onChange={handleInputs}
                                    
                                    placeholder="Your password" required />
                                    
                                    

                                </div>
                               
                                    
                                    

                              
                                 <div className="form-group form-button">
                                     <input type="submit" value="Register" name="signup" id="signup" className="form-submit"
                                     
                                     onClick={PostData}/>


                                 </div>


                            </form>

                         </div>
                            <div className="signup-image">
                                <figure>
                                    <img  src={signuppic} alt="loading"  ></img>
                                </figure>
                                <NavLink to='/login' className="signup-image-link">I am already registered</NavLink>

                            </div>
                        
                            

                        

                    </div>
                     
               
                </div>
            </section>

        </>
    )
}

export default Register
