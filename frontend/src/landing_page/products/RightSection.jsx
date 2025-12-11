import React from "react";

function RightSection({ imageURL, productName, productDesription, learnMore }) {
  return (
    <div className="container mt-5 pt-5">
      <div className="row ">
        <div className="col-6 p-5 mt-5">
          <h1 className="pt-3 mt-3">{productName}</h1>
          <p>{productDesription}</p>
          <div>
            <a href={learnMore}>Learn More</a>
          </div>
        </div>
        <div className="col-6">
          <img src={imageURL} />
        </div>
      </div>
    </div>
  );
}

export default RightSection;