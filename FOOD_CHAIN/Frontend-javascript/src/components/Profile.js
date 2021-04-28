import React, { useEffect } from 'react'

import {useHistory} from 'react-router-dom'
//assume contactUs as profile

const Profile = () => {

    const history= useHistory();


    const callProfilePage=  async ()=>{
        try{
            const res =  await fetch('/profile', {
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
    if(data.status === 422){
        history.push('/profile');
    }

        }catch(err){
            console.log(err);
       history.push('/login');

        }

      





    }



    useEffect(()=>{
        callProfilePage();


    }, []);


    return (
        <>
            <div className="signup">
                <div className="container mt-5">
                    <div className="signup-content1">
                        <div className="signup-form1">
                            <h2 className="form-title1" > Profile</h2>
                            <form className="register-form" id="register-form">
                                <div className="form-group">
                                    <label htmlFor="name">
                                    <i class="zmdi zmdi-account material-icons-name "></i>
                                    </label>
                                    <input type="text" name ="name" id="name" autoComplete="off" placeholder="Your Name" autoFocus required ></input>
                                    

                                </div>
                                <div className="form-group">
                                    <label htmlFor="userid">
                                    <i class="zmdi zmdi-account-add material-icons-phone "></i>
                                    </label>
                                    <input type="text" name ="userid" id="phone" autoComplete="off" placeholder="Your Id"  required></input>
                                    

                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">
                                    <i class="zmdi zmdi-email material-icons-name "></i>
                                    </label>
                                    <input type="email" name ="email" id="email" autoComplete="off" placeholder="Your Email"  required></input>
                                    

                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="role">
                                    <i class="zmdi zmdi-slideshow material-icons-name "></i>
                                    </label>
                                    <input type="text" name ="role" id="role" autoComplete="off" placeholder="Your role(ex-Producer)" required ></input>
                                    

                                </div>
                                <div className="form-group">
                                    <label htmlFor="organization">
                                    <i class="zmdi zmdi-accounts-list-alt material-icons-name "></i>
                                    </label>
                                    <input type="text" name ="organization" id="organization"  list="mylist" autoComplete="off" placeholder="Your organization" required />
                                    <datalist  id="mylist">
                                        <option value="Producer">Producer</option>
                                        <option value="Distributor">Distributor</option>
                                        <option value="Consumer">Consumer</option>
                                    </datalist>

                                    

                                </div>
                                <div className="form-group">
                                    <label htmlFor="password">
                                    <i class="zmdi zmdi-lock material-icons-name "></i>
                                    </label>
                                    <input type="password" name ="password" id="password" autoComplete="off" placeholder="Your password" required />
                                    
                                    

                                </div>
                                <div className="form-group">
                                    <label htmlFor="cpassword">
                                    <i class="zmdi zmdi-lock material-icons-name "></i>
                                    </label>
                                    <input type="password" name ="cpassword" id="cpassword" autoComplete="off" placeholder="Confirm your password" required />
                                    
                                    

                                </div>
                                 <div className="form-group form-button">
                                     <input type="submit" value="Register" name="signup" id="signup" className="form-submit"/>


                                 </div>


                            </form>

                         </div>
                            
                            

                        

                    </div>
                     
               
                </div>
            </div>       
          
        </>
    )
}

export default Profile
