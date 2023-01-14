import React, { useState } from "react";
import Head from "next/head";
import Layout from "/components/Layout";
import { useTranslation } from 'react-i18next';

const Landing = () => {
  const { t, i18n } = useTranslation();
  // i18n.changeLanguage("es")

  return (
    <>
      <Head />
      <Layout>
        {/* <Header /> */}
        <div className="flag-container">
          <img onClick={() => i18n.changeLanguage("es")} className="flag" src={'/images/spain.png'} />
          <img onClick={() => i18n.changeLanguage("en")} className="flag" src={'/images/united-kingdom.png'} />
        </div>
        <div className="header-text p-4 pt-6 text-center font-montserrat h-screen w-screen flex justify-start items-center flex-col">
          <h1 className="title">{t('titleAUX')}</h1>
          <div>
            <h2 className="subtitle mt-10">{t('descriptionAUX')} <span className="subtitle mt-10 font-bold">{t('descriptionAUX2')}</span> <span className="subtitle mt-10">{t('descriptionAUX3')}</span></h2>
          </div>
          {/* <h2 className="subtitle mt-10">Contáctame en <span className="italic">info@franaragondev.com</span></h2> */}
        </div>
        <img className="dog" src={'/images/dog.jpg'} />
      </Layout>
    </>
  );
};

export default Landing;
