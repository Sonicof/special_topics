import React from "react";

import "./Home.css";
import { Link, NavLink } from "react-router-dom";
import { GiStethoscope } from 'react-icons/gi';

import logo from "../data/logo.png";
import logosvg from "../data/logo.svg";
import sthetoscope from "../data/stethoscope.png";
import down from "../data/upload.svg";
import user from "../data/user.svg";
import tick from "../data/tick.svg";
import store from "../data/store.png";
import doc from "../data/doc.svg";
import disease from "../data/disease.png";


const Home = () => {
  return (
    <div>
      <header className="header" id="header">
        <nav className="nav container">
          <div className="logo">
            <img className="logo-img" src={logosvg} />
            <a href="#" className="nav__logo">
              MediVault
            </a>
          </div>
          <div className="nav__menu" id="nav-menu">
            <ul className="nav__list">
              <li className="nav__item">
                <a href="#home" className="nav__link">
                  Home
                </a>
              </li>
              <li className="nav__item">
                <a href="#about" className="nav__link">
                  Get Started
                </a>
              </li>
              {/* <li className="nav__item">
                <a href="#how" className="nav__link">
                  How?
                </a>
              </li> */}
              <li className="nav__item">
                <a href="#services" className="nav__link">
                  Services
                </a>
              </li>
              <li className="nav__item">
                <a href="#contact" className="nav__link">
                  Contact Us
                </a>
              </li>

              <i
                className="bx bx-toggle-left change-theme"
                id="theme-button"
              ></i>
            </ul>
          </div>

          <div className="nav__toggle" id="nav-toggle">
            <i className="bx bx-grid-alt"></i>
          </div>
          <div style={{ display: "flex" }}>
            <Link to="/login" className="button button__header log">
              Log In
            </Link>
            <Link to="/signup" className="button button__header">
              Sign Up
            </Link>
          </div>
        </nav>
      </header>
      <main className="main">
        <section className="home section container" id="home">
          <div className="home__container  grid">
            <div className="home__data">
              <h1 className="home__title">Health Record System</h1>
              <p className="home__description">
                MediVault is a secure blockchain based platform for storage of
                highly sensitive and critical data related to patients that is
                shared among multiple facilities and agencies for effective
                diagnosis and treatment.
              </p>

              <Link to="/signup" className="button">
                Sign Up Now!
              </Link>
            </div>
            <img className="sto-img" src={sthetoscope} />
          </div>
        </section>
        <section className="services section container" id="about">
          <h2 className="section__title">Getting started is quick and easy</h2>
          <div className="services__container grid">
            <div className="services__data">
              <h3 className="services__subtitle">Register Yourself</h3>
              <img className="services__img" src={user} />
              <p className="services__description">
                Register yourself to the locker, secured by blockchain
                technology.
              </p>
            </div>

            <div className="services__data">
              <h3 className="services__subtitle">Authenticate Yourself</h3>
              <img className="services__img" src={tick} />
              <p className="services__description">
                Log In with your credentials.
              </p>
            </div>

            <div className="services__data">
              <h3 className="services__subtitle">Upload your Data</h3>
              <img className="services__img" src={down} />
              <p className="services__description">
                Create, update, or view your health record information.
              </p>
            </div>
          </div>
        </section>
        <section className="services section container" id="services">
          <h2 className="section__title">Services we deliver</h2>
          <div className="services__container grid">
            <div className="services__data">
              <h3 className="services__subtitle">Maintaining Medical Records</h3>
              <img className="services__img" src={store} />
              <p className="services__description">
              Keep track of your medical records, enabled by blockchain
                technology.
              </p>
            </div>

            <div className="services__data">
              <h3 className="services__subtitle">Connect With Doctors</h3>
              <img className="services_img" src={doc} />
              <p className="services__description">
              Share your records with our trusted medical experts, to get a prescription.
              </p>
            </div>

            <div className="services__data">
              <h3 className="services__subtitle">Disease Prediction Model</h3>
              <img className="servicesimg" src={disease} />
              <p className="services__description">
              Get a quick diagnosis about diseases you might suffer from, based on our ML model.
              </p>
            </div>
          </div>
        </section>
        
        <section className="contact section container" id="contact">
            <div className="contact__container grid">
                <div className="contact__content">
                    <h2 className="section__title-center">Contact Us</h2>
                    <p className="contact__description">You can contact us from here, you can write to us,
                        call us for suggestions and enhancements.</p>
                </div>

                <ul className="contact__content grid">
                    <li className="contact__address">Telephone: <span className="contact__information">+91 1234567890</span>
                    </li>
                    <li className="contact__address">Email: <span
                            className="contact__information">rj024245@gmail.com</span></li>
                    <li className="contact__address">Location: <span className="contact__information">Dayananda Sagar University,
                      Harohalli, Karnataka 562112</span></li>
                </ul>
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d796.3446200651628!2d77.4501411954511!3d12.660905207806213!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae5b32ad06ec57%3A0x95e7a57b8a6b94d2!2sDayananda%20Sagar%20University%20(DSU)%20-%20Main%20Campus!5e0!3m2!1sen!2sin!4v1717805887872!5m2!1sen!2sin"
                    width="300" height="200" style={{border:"0",}} allowfullscreen="" loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"></iframe>
            </div>
        </section>
      </main>
        <footer className="footer section">
          <p className="footer__copy">
            
          </p>
          <p className="footer__copy"> </p>
        </footer>
    </div>
  );
};

export default Home;
