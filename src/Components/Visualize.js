import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
class Visualize extends React.Component {
    constructor(props){
       super(props);
      //alert(props.data[1].name +">>"+ props.data[0].value);
    }
   COLORS = ["#8884d8", "#82ca9d", "#FFBB28", "#FF8042", "#AF19FF"];
   pieData = this.props.data;
   CustomTooltip = ({ active, payload, label }) => {
      if (active) {
         return (
         <div
            className="custom-tooltip"
            style={{
               backgroundColor: "#ffff",
               padding: "5px",
               border: "1px solid #cccc"
            }}
         >
            <label>{`${payload[0].name} : ${payload[0].value}`}</label>
         </div>
      );
   }
   return null;
};
render() {
   return (
       <div style={{marginBottom:"50px", border:"1px solid red",textAlign:"center", padding:"0 310px"}}>
      <PieChart width={730} height={300} >
      <Pie
         data={this.pieData}
         color="#000000"
         dataKey="value"
         nameKey="name"
         cx="50%"
         cy="50%"
         outerRadius={120}
         fill="#8884d8"
      >
         {this.pieData.map((entry, index) => (
            <Cell
               key={`cell-${index}`}
               fill={this.COLORS[index % this.COLORS.length]}
            />
         ))}
      </Pie>
      <Tooltip content={<this.CustomTooltip />} />
      <Legend />
      </PieChart>
      </div>
      );
   }
}
export default Visualize;