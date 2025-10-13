import { useState, useEffect } from "react";
import DetailView from "./components/DetailView/DetailView";
import List from "./components/Form/List";
import Form from "./components/Form/Form";
import FormTag from "./components/Form/FormTag";
import "./App.css";
import { useListStore } from "./Hooks/useListStore";
import { AnimatePresence } from "motion/react";
import TopBar from "./components/TopBar.jsx";
import { check } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";
import { PlusIcon } from "@heroicons/react/16/solid";

const update = await check();
if (update) {
  console.log(
    `found update ${update.version} from ${update.date} with notes ${update.body}`,
  );
  let downloaded = 0;
  let contentLength = 0;

  await update.downloadAndInstall((event) => {
    switch (event.event) {
      case "Started":
        contentLength = event.data.contentLength;
        console.log(`started downloading ${event.data.contentLength} bytes`);
        break;
      case "Progress":
        downloaded += event.data.chunkLength;
        console.log(`downloaded ${downloaded} from ${contentLength}`);
        break;
      case "Finished":
        console.log("download finished");
        break;
    }
  });

  console.log("update installed");
  await relaunch();
}

const savedTheme = localStorage.getItem("theme") || "default";
document.documentElement.setAttribute("data-theme", savedTheme);

function App() {
  const [prewOpen, setPrewOpen] = useState(false);
  const [popOpen, setPopOpen] = useState(false);
  const [tagOpen, setTagOpen] = useState(false);

  const setFilterTag = useListStore((state) => state.setFilterTag);
  const tags = useListStore((state) => state.tags);
  const removeItem = useListStore((state) => state.removeItem);

  return (
    <>
      <TopBar />
      <main className="flex w-full h-full bg-background">
        <div className="h-screen w-10.5 bg-main flex flex-row justify-center">
          <div className="mt-20 gap-y-4 flex flex-col">
            <button
              onClick={() => {
                setPopOpen(!popOpen);
                setTagOpen(false);
              }}
              className="bg-main2 text-text flex rounded-sm justify-center w-7 h-7"
            >
              <PlusIcon className="w-5" />
            </button>
            <button
              onClick={() => {
                setPopOpen(false);
                setTagOpen(!tagOpen);
              }}
              className="bg-main2 text-text flex rounded-sm justify-center w-7 h-7"
            >
              AD
            </button>
          </div>
        </div>

        <div className=" bg-main2 pt-20">
          <List setVisible={() => setPrewOpen(true)} />
        </div>
        <AnimatePresence>
          {popOpen && <Form key={1} isVisible={setPopOpen} />}
          {tagOpen && <FormTag key={2} isVisible={setTagOpen} />}
          {prewOpen && <DetailView key={3} setIsVisible={setPrewOpen} />}
        </AnimatePresence>
      </main>
    </>
  );
}

export default App;
