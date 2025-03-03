<!DOCTYPE html>
<html>
<body>
  <div id="root"></div>
</body>
<!-- This setup is not suitable for production. -->
<!-- Only use it in development! -->
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script async src="https://ga.jspm.io/npm:es-module-shims@1.7.0/dist/es-module-shims.js"></script>
<script type="importmap">
{
  "imports": {
    "react": "https://esm.sh/react?dev",
    "react-dom/client": "https://esm.sh/react-dom/client?dev"
  }
}
</script>
<script type="text/babel" data-type="module">
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { FaMicrophone, FaMapMarkerAlt, FaPhone, FaShieldAlt, FaExclamationTriangle, FaGoogle, FaFacebook, FaBars, FaSignOutAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import firebase from "firebase/app";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const HomeScreen = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [questionAnswered, setQuestionAnswered] = useState(false);
  const [fakeCallActive, setFakeCallActive] = useState(false);
  const [callerName, setCallerName] = useState("Unknown");
  const [callerNumber, setCallerNumber] = useState("+91 XXXXX XXXXX");
  const [callTimer, setCallTimer] = useState(10);
  const [menuOpen, setMenuOpen] = useState(false);
  
  useEffect(() => {
    if (fakeCallActive) {
      const timer = setTimeout(() => {
        alert(`Incoming call from ${callerName} (${callerNumber})`);
        setFakeCallActive(false);
      }, callTimer * 1000);
      return () => clearTimeout(timer);
    }
  }, [fakeCallActive, callTimer, callerName, callerNumber]);

  const handleLogin = async (provider) => {
    const authProvider = provider === "google" ? new firebase.auth.GoogleAuthProvider() : new firebase.auth.FacebookAuthProvider();
    try {
      await firebase.auth().signInWithPopup(authProvider);
      alert("Login Successful!");
    } catch (error) {
      console.error("Login Failed", error);
    }
  };

  const handleLogout = async () => {
    await firebase.auth().signOut();
    alert("Logged out successfully!");
  };

  return (
    <div className={`min-h-screen p-5 transition-all ${darkMode ? "bg-gradient-to-b from-gray-900 to-black text-white" : "bg-gradient-to-b from-pink-100 to-gray-200 text-gray-900"}`}>
      {!questionAnswered ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-2xl font-bold mb-4">Are you feeling safe right now?</h1>
          <div className="flex gap-4">
            <Button onClick={() => setQuestionAnswered(true)} variant="default">Yes</Button>
            <Button onClick={() => alert("Enabling emergency features!")} variant="destructive">No</Button>
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="flex justify-between items-center">
            <img src="/mnt/data/DALL·E 2025-03-02 17.55.38 - A high-quality, modern logo for 'SHE-Guardian,' a women's safety app. The logo features a shield with a feminine silhouette inside, symbolizing protec.webp" alt="SHE-Guardian Logo" className="w-20" />
            <div className="flex items-center gap-4">
              <Switch checked={darkMode} onCheckedChange={() => setDarkMode(!darkMode)} />
              <FaBars className="text-2xl cursor-pointer" onClick={() => setMenuOpen(!menuOpen)} />
            </div>
          </div>

          {menuOpen && (
            <div className="border p-4 rounded-lg shadow-md bg-gray-100 dark:bg-gray-800">
              <h2 className="text-lg font-bold">More</h2>
              <ul>
                <li>About Founders: Anvi Agarwal & Sujal Sharma</li>
                <li><Button onClick={() => setDarkMode(!darkMode)}>Change Theme</Button></li>
                <li><Button onClick={handleLogout} className="flex items-center gap-2"><FaSignOutAlt /> Sign Out</Button></li>
                <li><Input placeholder="Add Extra Safety Number" /></li>
              </ul>
            </div>
          )}

          <p className="text-center text-lg font-semibold">"Your Safety, Our Priority."</p>

          <div className="grid grid-cols-2 gap-4">
            <Button className="flex items-center gap-2 p-4 bg-red-600 text-white rounded-xl">
              <FaExclamationTriangle /> Quick SOS
            </Button>
            <Button className="flex items-center gap-2 p-4 bg-blue-600 text-white rounded-xl">
              <FaMapMarkerAlt /> Share Location
            </Button>
            <Button className="flex items-center gap-2 p-4 bg-green-600 text-white rounded-xl">
              <FaPhone /> Emergency Contacts
            </Button>
            <Button className="flex items-center gap-2 p-4 bg-purple-600 text-white rounded-xl">
              <FaMicrophone /> Voice Command
            </Button>
          </div>

          <div className="border p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
            <h2 className="text-lg font-bold">Emergency Contacts</h2>
            <ul>
              <li>Women’s Safety Helpline: 1091</li>
              <li>Crime Helpline: 112</li>
              <li>Police: 100</li>
            </ul>
          </div>

          <div className="mt-6 space-y-4 border p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
            <h2 className="text-lg font-bold">Login</h2>
            <Button onClick={() => handleLogin("google")} className="flex items-center gap-2 p-3 bg-red-600 text-white w-full">
              <FaGoogle /> Login with Google
            </Button>
            <Button onClick={() => handleLogin("facebook")} className="flex items-center gap-2 p-3 bg-blue-600 text-white w-full">
              <FaFacebook /> Login with Facebook
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

let App = HomeScreen;


const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
</script>
<style>
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

h1 {
  margin-top: 0;
  font-size: 22px;
}

h2 {
  margin-top: 0;
  font-size: 20px;
}

h3 {
  margin-top: 0;
  font-size: 18px;
}

h4 {
  margin-top: 0;
  font-size: 16px;
}

h5 {
  margin-top: 0;
  font-size: 14px;
}

h6 {
  margin-top: 0;
  font-size: 12px;
}

code {
  font-size: 1.2em;
}

ul {
  padding-inline-start: 20px;
}

* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}

</style>
</html>