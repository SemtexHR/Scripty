import { useState, useEffect } from "react";
import { motion } from "motion/react";
function changeTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

const Settings = ({ visible }) => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "root",
  );

  useEffect(() => {
    changeTheme(theme);
  }, [theme]);

  const handleThemeChange = (event) => {
    changeTheme(event.target.value);
    localStorage.setItem("theme", event.target.value);
    setTheme(event.target.value);
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center absolute ">
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0, ease: "expo" }}
        className="bg-main w-200 h-7/10 p-5 rad text-text"
      >
        <div className="h-full">
          <div className="flex flex-row justify-between p-2">
            <h2 className="text-2xl">Settings</h2>
            <button
              onClick={() => visible(false)}
              className="bg-acc w-25 h-10 rad hover:bg-text hover:text-acc transition-all"
            >
              Close
            </button>
          </div>

          <div className="w-full h-full flex flex-row gap-x-5">
            <div className="bg-main2 h-9/10 w-4/16 rad p-2 flex flex-col items-center gap-y-5">
              <button>Personalization</button>
            </div>
            <div className="mt-5 ">
              <h2 className="text-2xl">Personalization</h2>
              <div className="mt-5">
                <label htmlFor="theme">Theme:</label>
                <select
                  id="theme"
                  value={theme}
                  onChange={(e) => handleThemeChange(e)}
                  className="bg-main2 w-50 h-10 ml-5 rad"
                >
                  <option value="dark">(S)cripty Default</option>
                  <option value="light">(S)cripty Light</option>
                  <option value="brat">BRATWAVE</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;
