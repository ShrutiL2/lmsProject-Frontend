import React from 'react';
import  Button from 'react-bootstrap/Button';
import {Card} from 'react-bootstrap';
import image from '../Images/back.jpg'

import {useNavigate} from 'react-router-dom';
function Home ()  {

  (function(d, m){
    var kommunicateSettings = 
        {"appId":"3ffb821dc33df60a9c35ad1f9ff8f612b","popupWidget":true,"automaticChatOpenOnNavigation":true};
    var s = document.createElement("script"); s.type = "text/javascript"; s.async = true;
    s.src = "https://widget.kommunicate.io/v2/kommunicate.app";
    var h = document.getElementsByTagName("head")[0]; h.appendChild(s);
    window.kommunicate = m; m._globals = kommunicateSettings;
})(document, window.kommunicate || {});


    const navigate=useNavigate();
    const LoginEmp=()=>
    {
    navigate('/emplogin');
    }

    const LoginMan=()=>
    {
    navigate('/manlogin');
    }
    
    return (
      <div > 
        <div style={{
            paddingTop:"5%"
          }}>
      
            <Card style={{
              display:'block',width:900,paddingTop:50,margin:"auto",backgroundColor:"rgb(194 194 194)"
            }}>
              <h1 align="center">Welcome to LMS</h1><br></br>
              <img src={require('../Images/img.jpg')} style={{
                height: "20%",
                width: "40%",
                display: "block",
                margin: " auto",
                /* left: auto; */
                marginLeft: "auto"
              }} />
      
              <div class="col-md-12 text-center" className='d-flex flex-row mt-2' style={{paddingTop:"4%"}} >
      
                <Button onClick={LoginEmp} variant="dark" color="black" style={{marginLeft:"31%"}}>
                  Login As Employee
            </Button>
                <Button onClick={LoginMan} variant="dark" style={{marginLeft:"3%"}} >
                  Login As Manager
          </Button><br />
      
              </div><br/>
            </Card>
      
          </div>

      </div>
    
);
}

export default Home;