import React from "react";
import "../../assets/css/supportHero.css";

function Hero() {
  return (
    <section className="container-fluid search-support">
      <div className="p-4">
        <div className="d-flex justify-content-between align-items-center">
            <h2>Support Portal</h2>
            <a href=""><button className="btn btn-primary"> My Tickets</button></a>
        </div>
    </div>
       
       
         
        
        <div className="input-icon p-1">
            <i className="fa fa-search"></i>
            <input 
                type="text" 
                placeholder="Eg. how do I open my account, How do I activate F&O..."
            />
        </div>
                
       
    </section>
  );
}

export default Hero;
