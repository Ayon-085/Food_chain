import React , {useState}from 'react'
import { NavLink, useHistory} from 'react-router-dom'
import loginpic from '../images/login.svg'

const Login = () => {

    const history =useHistory();

    const [user, setUser]=useState({
         email:"",password:"",    });


    let name, value;
    
    const handleInputs= (e) =>{
      
        name=e.target.name;
        value= (e.target.value);
    
        setUser({...user, [name]:value}); 
    
        
           
         };

         const PostData= async(e)=>{
       
            e.preventDefault();
      
            const url='http://localhost:3000/login';
      
             const{email, password} = user;
      
               const res= await fetch(url,{
                   method:'POST',
                  mode: 'cors',
                   withCredentials:true,
                   credentials:'include',
      
                   headers: {
                     'Content-Type':'application/json'
                 },
                 body:JSON.stringify({
                  email:email, password:password
                 }),
      
              
      
      
      
               });
               const data  = await res.json();
               console.log(data);
      
               //ata dekhte hbe
      
              //  if(data.status==422|| !data){
              //      window.alert("Invalid registration");
              //      console.log("Invalid resgitration");
      
              //  }else{
              //     window.alert("Registration Successfully");
              //     console.log("Registration Successfully");
      
               
      
              //  }


              
      
             history.push("/");



            }
      
         

     

   
     

    return (
        <>
           <section className="sign-in">
                <div className="container mt-5">
                    <div className="signin-content">
                    <div className="signin-image">
                                <figure>
                                    <img  src={loginpic} alt="loginpic"  ></img>
                                </figure>
                                <NavLink to='/register' className="signup-image-link">Create an account</NavLink>

                            </div>
                        <div className="signin-form">
                            <h2 className="form-title" > Sign In</h2>
                            <form  method ="POST" className="register-form" id="register-form">
                                
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
                                    <label htmlFor="password">
                                    <i class="zmdi zmdi-lock material-icons-name "></i>
                                    </label>
                                    <input type="password" name ="password" id="password" autoComplete="off"

                                    value={user.password}
                                    onChange={handleInputs} 
                                    
                                   

                                    placeholder="Your password" required />
                                    
                                    

                                </div>
                               
                                 <div className="form-group form-button">
                                     <input type="submit" value="Log In" name="signin" id="signin" 
                                     
                                     
                                      onClick={PostData}

                                     className="form-submit"/>


                                 </div>


                            </form>

                         </div>
                            
                        
                            

                        

                    </div>
                     
               
                </div>
            </section>
            
        </>
    )
}

export default Login
