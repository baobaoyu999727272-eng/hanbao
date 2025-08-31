  import React from "react";
  
  export default function Layout({ children }) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="phone-container">
          {children}
        </div>
        <style jsx>{`
          .phone-container {
            width: 375px;
            height: 812px;
            max-width: 100vw;
            max-height: 100vh;
            position: relative;
          }
          
          @media (max-width: 480px) {
            .phone-container {
              width: 100vw;
              height: 100vh;
            }
          }
        `}</style>
      </div>
    );
  }