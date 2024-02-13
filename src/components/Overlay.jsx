import React, { useState } from "react";
import { useProgress } from "@react-three/drei";
import { usePlay } from "../contexts/Play";

/**
 * Renders an overlay on top of a 3D scene.
 * Displays a loader while the scene is loading,
 * an introduction message when the loading is complete,
 * and an outro message at the end of the experience.
 * Handles user interactions with buttons and sends notifications based on the user's choices.
 */
export const Overlay = () => {
  const { progress } = useProgress();
  const { play, end, setPlay, hasScroll } = usePlay();
  const [noButtonPosition, setNoButtonPosition] = useState({
    left: '55.5%',
    top: '60%',
  });
  const [count, setCount] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [textVisible, setTextVisible] = useState(true);

  /**
   * Sends a notification using the IFTTT service.
   * @param {string} eventName - The name of the event to trigger.
   */
  const sendNotification = (eventName) => {
    const IFTTT_KEY = import.meta.env.VITE_IFTTT_SHIT;
    const IFTTT_URL = `https://maker.ifttt.com/trigger/${eventName}/with/key/${IFTTT_KEY}`;

    setTextVisible(false);

    fetch(IFTTT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'no-cors'
    })
    .then(() => {
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
    });
  };

  /**
   * Handles the hover event on the "No" button.
   * @param {Event} event - The hover event.
   */
  const handleNoButtonHover = (event) => {
    if (play && count < 3) {
      const left = Math.random() * (window.innerWidth - event.target.offsetWidth);
      const top = Math.random() * (window.innerHeight - event.target.offsetHeight);

      setNoButtonPosition({
        left: `${left}px`,
        top: `${top}px`,
      });

      setCount((prevCount) => prevCount + 1);
    } else if (count === 3) {
      setNoButtonPosition({
        left: '55.5%',
        top: '60%',
      });
    }
  };

  return (
    <div
      className={`overlay ${play ? "overlay--disable" : ""} ${hasScroll ? "overlay--scrolled" : ""}`}
    >
      {showNotification && (
        <div className="notification">
          Notification sent! Thank you for taking the time to go through the experience and responding :)
        </div>
      )}
      <div
        className={`loader ${progress === 100 ? "loader--disappear" : ""}`}
      />
      {progress === 100 && (
        <div className={`intro ${play ? "intro--disappear" : ""} ${textVisible ? "" : "text-content--hidden"}`}>
          <h1 className="logo">
            ELYSIAN SKYSCAPE
          </h1>
          <p className="intro__scroll">Scroll to begin the journey</p>
          <button
            className="explore"
            onClick={() => {
              setPlay(true);
              setTextVisible(true);
            }}
          >
            Explore
          </button>
        </div>
      )}
      <div className={`outro ${end ? "outro--appear" : ""} ${textVisible ? "" : "text-content--hidden"}`}>
        <p className="outro__text">Will you go out with me?<br></br> I can't wait to hear from you!</p>
        <div>
          <button
            className="yes-button"
            style={{ left: '42%' }}
            onClick={() => {
              if (play) {
                console.log("Yes");
                sendNotification('yes_button_pressed');
              }
            }}
          >
            Yes
          </button>
          <button
            className="yes-button"
            style={{ left: '48%' }}
            onClick={() => {
              if (play) {
                console.log("Maybe");
                sendNotification('maybe_button_pressed');
              }
            }}
          >
            Maybe
          </button>
          <button
            className="yes-button"
            style={{ ...noButtonPosition }}
            onMouseMove={handleNoButtonHover}
            onClick={() => {
              if (play) {
                console.log("No");
                sendNotification('no_button_pressed');
              }
            }}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};
