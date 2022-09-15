
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Visualize from './Visualize'
import emailjs from '@emailjs/browser';

const ManagerProfile = () => {

    const [manager, setManager] = useState({
        "empid": 0,
        "empname": "",
        "empemail": "",
        "department": "",
        "empaddress": "",
        "phnumber": "",
        "empusername": "",
        "emppassword": "",
        "leaveinhand": 0,
        "managerid": null,
        "manager": null,
        "inverseManager": [],
        "leaves": []
    });
    /*const [emp, setEmp]=useState({
        "empid": 0,
  "empname": "string",
  "empemail": "user@example.com",
  "department": "string",
  "empaddress": "string",
  "phnumber": "string",
  "empusername": "string",
  "emppassword": "string",
  "leaveinhand": 0,
  "managerid": 0,
  "inverseManager": [
    null
  ],
  "leaves": null
    });*/
    const [emps, setEmps] = useState([]);
    const [leaves, setLeaves] = useState([]);
    const [showEmps, setShowEmps] = useState(false);
    const [showLeaves, setShowLeaves] = useState(false);
    const[showChart,setShowChart]=useState(false);
    const [isApproved, setIsApproved] = useState(false);
    const [isDenied, setIsDenied] = useState(false);
    const[graphData, setGraphData]= useState([]);
    const navigate = useNavigate();
    const { id } = useParams();

    const logOut  = () => {
        navigate(`/manlogin`);
    }

    useEffect(() => {

        //get manager details
            fetch(`http://localhost:23040/api/Employees/${id}`)
            .then(res => res.json())
            .then(res => {
                setManager(res);
            })
            .catch(err => {
                alert("Error occured..");
                navigate(`/manager/login`);
            });

           // get all emps working under manager
            fetch(`http://localhost:23040/api/Employees/undermanager/${id}`)
            .then(res => res.json())
                .then(res => {
                    setEmps(res);
                   
            })
            .catch(err => {
                alert("Error occured..");
                
            });
          //get leaves under manager
        fetch(`http://localhost:23040/api/Leaves/bymanagerid/${id}`)
            .then(res => res.json())
            .then(res => {
                setLeaves(res);

            })
            .catch(err => {
                alert("Error occured..");

            });
           

    }, [isApproved, isDenied])

    //methods
    const showEmployees = () => {
        setShowEmps(true);
        if (showLeaves) {
            setShowLeaves(false);
        }
        if(showChart){
            setShowChart(false);
        }
    }

    
    
    const showLeavesForManager = () => {
        setShowLeaves(true);
        if (showEmps) {
            setShowEmps(false);
        }
        if(showChart){
            setShowChart(false);
        }
    }

    const handleApprove = (leave) => {

        var templateparams={
            "from_name":"Your Manager",
            "message":`Your ${leave.leavetype} leave request from ${leave.leavefrom} to ${leave.leaveto} has been approved`
            
        };
    
        emailjs.send('service_50gmywn', 'template_2fuqijc', templateparams, 'IwpiSK40hoj4-I3yM')
          .then((result) => {
              console.log(result.text);
          }, (error) => {
              console.log(error.text);
          });
          
        const {empid}=leave;
        var employee = {};
        for(var i=0; i< emps.length;i++){
            if(emps[i].empid== empid)
            {
                 employee=emps[i];
                break;
            }

        }
        fetch(`http://localhost:23040/api/Employees/${empid}`,{
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({...employee,"leaveinhand":employee.leaveinhand-leave.noofdays})
        })
        .then(res => res.json())
            .then(res => {
                
               // alert("HIIIII");
            })
            .catch(err => console.log(err));
        
        var leaveObject = {
            ...leave,
            "leavestatus": "approved",
           // "leaveinhand": leave.leaveinhand-leave.noofdays
        }
        const { leaveid } = leave;
       
        //update
        fetch(`http://localhost:23040/api/Leaves/${leaveid}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(leaveObject)
        })
            .then(res => res.json())
            .then(res => {
                
               // alert("HIIIII");
            })
            .catch(err => console.log(err));
        setIsApproved(true);
        //again loading
        


        
    }
    const handleDeny = (leave) => {
        var templateparams={
            "from_name":"Your Manager",
            "message":`Your ${leave.leavetype} leave request from ${leave.leavefrom} to ${leave.leaveto} has been denied`
        };
    
        emailjs.send('service_50gmywn', 'template_2fuqijc', templateparams, 'IwpiSK40hoj4-I3yM')
          .then((result) => {
              console.log(result.text);
          }, (error) => {
              console.log(error.text);
          });
        
        var leaveObject = {
            ...leave,
            "leavestatus": "denied"
        }
        const { leaveid } = leave;

        //update
        fetch(`http://localhost:23040/api/Leaves/${leaveid}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(leaveObject)
        })
            .then(res => res.json())
            .then(res => {})
            .catch(err => console.log(err));
        setIsDenied(true);
 //       window.location.reload();

    }

    const  displayGraph=()=>{
        //TODO
        setShowChart(true);
        if(showEmps)
          setShowEmps(false);
        if(showLeaves)
         setShowLeaves(false);
        var countMaternity=0;
        var countExam=0;
        var countPaternity=0;
        var countVacation=0;
        var countMedical=0;
        var countEmergency=0;

        var filtteredLeaves = [];
        for(var i=0;i<leaves.length;i++){
            if(leaves[i].leavetype.toLowerCase() === "medical")
            {
                countMedical++;
            }
            if(leaves[i].leavetype.toLowerCase() === "vacation")
            {
                countVacation++;
            }
            if(leaves[i].leavetype.toLowerCase() === "emergency")
            {
                countEmergency++;
            }
            if(leaves[i].leavetype.toLowerCase() === "maternity")
            {
                countMaternity++;
            }
            if(leaves[i].leavetype.toLowerCase() === "paternity")
            {
                countPaternity++;
            }
            if(leaves[i].leavetype.toLowerCase() === "exam ")
            {
                countExam++;
            }
           
            filtteredLeaves= [
                {
                   name: "Medical",
                   value: countMedical
                },
                {
                   name: "Vacation",
                   value: countVacation
                },
                {
                   name: "Emergency",
                   value: countEmergency
                },
                {
                   name: "Maternity",
                   value: countMaternity
                },
                {
                   name: "Paternity",
                   value: countPaternity
                },
                {
                    name: "Exam",
                    value: countExam
                 }
             ];

             setGraphData(filtteredLeaves);
        }
    }


    return (
        <div>
            <button className="btn btn-secondary" onClick={logOut}style={{marginLeft:"93%", marginTop:"1%"}}>Logout</button>
            <Container style={{marginTop:"5px"}}>
                <Card style={{background:"#0d6efd"}}>

            <Card.Header><h2 style={{marginLeft:"35%"}}>{manager.empname}'s Dashboard</h2></Card.Header>
            </Card>
            
            <Card style={{marginTop:"0.5%",background:"#e5e1e1", height:"220px"}}>
            <b style={{marginLeft:"4%",fontSize:"20px"}}>Email:</b><i style={{marginLeft:"4%",fontSize:"18px"}}>{manager.empemail}</i> <br />
           <b style={{marginLeft:"4%",fontSize:"20px"}}> Department: </b><i style={{marginLeft:"4%",fontSize:"18px"}}>{manager.department}</i><br />
            <b style={{marginLeft:"4%",fontSize:"20px"}}>Phone number: </b><i style={{marginLeft:"4%",fontSize:"18px"}}>{manager.phnumber}</i> <br />
            </Card>
            
            <div style={{marginTop:"2%"}}>
            <button className="btn btn-lg btn-success" onClick={showEmployees} style={{width:"32%"}}>My Employees</button>
            <button className="btn btn-lg btn-primary" onClick={showLeavesForManager} style={{marginLeft:"2%",width:"32%"}}>Approve/Deny Leave Request</button>
            <button className="btn btn-lg btn-success" onClick={displayGraph} style={{marginLeft:"2%",width:"32%"}}>Number of leaves</button>
            </div>
            
            <Card style={{marginTop:"1%"}}>
            {showEmps && <table class="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Department</th>
                        <th scope="col">Address</th>
                        <th scope="col">phone number</th>



                    </tr>
                </thead>
                <tbody>
                    {emps.map(e => (
                        <tr key={e.id}>
                            <td>{e.empname}</td>
                            <td>{e.empemail}</td>
                            <td>{e.department}</td>
                            <td>{e.empaddress}</td>
                            <td>{e.phnumber}</td>

                        </tr>
                    ))}
                </tbody>
            </table>}
            {showLeaves &&
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">Emp Id</th>
                            <th scope="col">From</th>
                            <th scope="col">To</th>
                            <th scope="col">No of days</th>
                            <th scope="col">leave type</th>
                            <th scope="col">Action</th>



                        </tr>
                    </thead>
                    <tbody>
                    {leaves.map(e => (
                        <tr key={e.id}>
                            <td>{e.empid}</td>
                            <td>{e.leavefrom.split("T")[0]}</td>
                            <td>{e.leaveto.split("T")[0]}</td>
                            <td>{e.noofdays}</td>
                            <td>{e.leavetype}</td>
                            {e.leavestatus == "pending" && 
                                <td>
                                    <button className="btn  btn-success" onClick={() => handleApprove(e)} >Approve</button>
                                </td>
                            }
                            {e.leavestatus == "pending" &&
                                <td>
                                    <button className="btn  btn-danger" onClick={() => handleDeny(e)} >Deny</button>
                                </td>
                            }
                            {e.leavestatus == "approved" &&
                                <td>
                                     <button className="btn  btn-success" disabled={true} >Approved</button>
                                </td>
                            }
                            {e.leavestatus == "denied" &&
                                <td>
                                    <button className="btn  btn-danger" disabled={true} >Denied</button>
                                </td>
                            }
                                

                            
                            

                            </tr>
                        ))}
                    </tbody>
                </table>
            }
            </Card>
            {showChart && <Visualize  data={graphData} />}
            </Container>
        </div>
    
    );
}


export default ManagerProfile;