import React, { useState,useEffect } from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Moment from 'moment';
import {useNavigate,useParams} from 'react-router-dom';


const AddLeave = () => {

    const [form ,setForm]=useState({});
    const [errors,setErrors]= useState({});
    const[emp,setEmp]=useState({});
    //const [submit, setSubmit] = useState(null);
    const [inputs, setInputs] = useState({
        "empid": 0,
        "manid": 0,
        "leavefrom": "2022-09-09T11:11:04.204Z",
        "leaveto": "2022-09-09T11:11:04.204Z",
        "noofdays": 0,
        "leavestatus": "pending",
        "leavetype": "string",
        "emp":null
});

    
    const navigate= useNavigate();
    
    const {id}= useParams();
    const [submit, setSubmit]=useState(false);
    
    

    const back =()=>{
        navigate(`/empdash/${id}`);
    }

    const handleChange = (n)=>(event) => {

        validate(event,n,event.target.value);
        if(n != "leavefrom" && n != "leaveto"){
            setInputs({...inputs,[n]:event.target.value});
        }
        
    }
    
    //valiadte inputs
    const validate = (event, name, value) => {
       
        switch (name) {
            case "leavefrom":
                const curDate = Moment(new Date()).format('YYYY-MM-DD');
                if(value < curDate){
                    alert("Invalid Date Selected! Date should be greater than or equal to current date");
                    setInputs({...inputs,[name]:""});
                    event.target.value ="";
                    
                    return;
                }
                const weekendNo = new Date(value).getDay();
                if(weekendNo ==0 || weekendNo == 6){
                    alert("Date can't be saturday/Sunday");
                    event.target.value ="";
                    return;
                }
                setInputs({...inputs,[name]:value});
                break;
            case "leaveto":
                const startDate = Moment(inputs.leavefrom).format('YYYY-MM-DD');
                
                if(value <= startDate){
                    alert("End date should be greater than start date");
                    setInputs({...inputs,[name]:""});
                    event.target.value ="";
                    return;
                }
                const weekendNo1 = new Date(value).getDay();
                if(weekendNo1 ==0 || weekendNo1 == 6){
                    alert("Date can't be saturday/Sunday");
                    event.target.value ="";
                    return;
                }
               
                 var diff =  new Date(inputs.leavefrom).getTime() - new Date(value).getTime();   
                
                 
                 var daydiff = calculateValidDays(Moment(inputs.leavefrom).format('YYYY-MM-DD'), Moment(value).format('YYYY-MM-DD'));
                
                 setInputs({...inputs,[name]:value,"noofdays":daydiff});
                break;
            default:
                break;
        }
    }
   
    const handleSubmit = (event) => {
        //event.preventDefault();
        setInputs({...inputs,"empid":id,"manid":emp.managerid});
        
        
        
        
        //alert(inputs.leavefrom +" "+inputs.noofdays)
        
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(inputs)
        };
        fetch('http://localhost:5196/api/Leaves/', requestOptions)
            .then(response => response.json())
            .then(response => {
                alert("Submitted to Manager for approval!")
                navigate(`/empdash/${id}`)}
                );

        
            
    }
    
    useEffect(() => {
        fetch(`http://localhost:5196/api/Employees/${id}`)
            .then(res => res.json())
            .then(res => {
                setEmp(res);
            })
            .catch(err => console.log(err));

        
     }, [])

    const calculateValidDays=(start,end)=>{
        var s = start;
         var count=0;
         
         while(s <= end){
             
             if(new Date(s).getDay() != 0 &&   new Date(s).getDay() !=6){
                 count++;
             }
             
              s =  Moment(s).add(1,'days').format('YYYY-MM-DD');
             
         }
       
        
         return count;
    }

    return (
        <div style={{
            display: 'block',
            width: 700,
            padding: 30, margin: 'auto'
        }} >
            <form onSubmit={handleSubmit} style={{border:"1px solid #9C9C9C",padding:"20px",borderRadius:"5px"}}>
                


                <Form.Group style={{ paddingBottom: 15 }}>
                    <Form.Label>My Manager Id:</Form.Label>
                    <b>{emp.managerid}</b>
                </Form.Group>

                <Form.Group style={{ paddingBottom: 15 }}>
                    <Form.Label>Start Date:</Form.Label>
                    <Form.Control type="date"
                        id="leavefrom" onChange={handleChange("leavefrom")} />
                </Form.Group>

                <Form.Group style={{ paddingBottom: 15 }}>
                    <Form.Label>End Date:</Form.Label>
                    <Form.Control type="date"
                         id="leaveto" onChange={handleChange("leaveto")} />
                </Form.Group>


                <Form.Group style={{ paddingBottom: 15 }}>
                    <Form.Label>number of days:</Form.Label>
                    <b>{inputs.noofdays}</b>
                </Form.Group>

                <Form.Group style={{ paddingBottom: 15 }}>
                    <Form.Label>Enter leave type:</Form.Label>
                    <select id="leavetype" onChange={handleChange("leavetype")}>
                        <option value="Medical">Medical </option>
                        <option value="Vacation">Vacation</option>
                        <option value="Emergency">Emergency</option>
                        <option value="Maternity">Maternity</option>
                        <option value="Paternity">Paternity</option>
                        <option value="Exam ">exams leave</option>
                    </select>
                </Form.Group>


                <Button variant="success" onClick={handleSubmit}>Submit your Form</Button>
                <Button variant="primary" onClick={back} style={{marginLeft:"4%"}}>Back</Button>
                {submit &&
                    <label>Response Submitted</label>
                }
            </form>
        </div>
    );
}

export default AddLeave;
/*
*/

                   /* <Form.Control type="number"
                         id="leavetype" onChange={handleChange("leavetype")} />*/
                    
               