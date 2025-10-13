import { getCurrentWindow } from "@tauri-apps/api/window";

function changeTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

export default function TopBar() {
  const win = getCurrentWindow();

  const handleMin = () => {
    win.minimize();
  };

  const handleMax = async () => {
    const isMax = await win.isMaximized();
    isMax ? win.unmaximize() : win.maximize();
  };

  const handleClose = () => {
    win.close();
  };

  const handleThemeChange = (event) => {
    changeTheme(event.target.value);
    localStorage.setItem("theme", event.target.value);
  };

  return (
    <>
      <div
        className=" fixed z-50 w-full h-10 px-3 flex items-center justify-between  bg-main/25 backdrop-blur-2xl"
        data-tauri-drag-region
      >
        <div className="flex mr-[150px] w-[100px] justify-evenly">
          <button
            onClick={handleClose}
            className="w-4 h-4 rounded-full bg-red-400 hover:bg-red-300 transition"
          />
          <button
            onClick={handleMin}
            className="w-4 h-4 rounded-full bg-yellow-400 hover:bg-yellow-300 transition"
          />
          <button
            onClick={handleMax}
            className="w-4 h-4 rounded-full bg-green-400 hover:bg-green-300 transition"
          />
        </div>

        <div className="absolute left-1/2 -translate-x-1/2  font-JetBrains font-light text-titlecolor tracking-[-0.5px] select-none pointer-events-none text-white">
          (S)cripty
        </div>
        <div className="w-16" />
      </div>
    </>
  );
}
