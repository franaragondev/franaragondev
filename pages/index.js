import React, { useState } from "react";
import Head from "next/head";
import Layout from "/components/Layout";

const Landing = () => {
  
  return (
    <>
      <Head />
      <Layout>
            {/* <Header /> */}
              <div className="header-text p-4 pt-6 text-center font-montserrat h-screen w-screen flex justify-start items-center flex-col">
                <h1 className="title">¡LA WEB SE HA IDO A JUGAR CON ESTE PERRITO!</h1>
                <h2 className="subtitle mt-10">Y mientras jugaba ha encontrado... <span className="font-bold">¡un diseño totalmente nuevo!</span> pero no te preocupes, volverá pronto.</h2>
                {/* <h2 className="subtitle mt-10">Contáctame en <span className="italic">info@franaragondev.com</span></h2> */}
              </div>
              <img className="dog" src={'/images/dog.jpg'}/>
      </Layout>
    </>
  );
};

export default Landing;
