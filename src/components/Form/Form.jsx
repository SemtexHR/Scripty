import { motion } from "motion/react";
import { invoke } from "@tauri-apps/api/core";
import { open, message } from "@tauri-apps/plugin-dialog";
import { useState } from "react";
import { useListStore } from "../../Hooks/useListStore";

const handleLoadPS1 = async () => {
  let end = null;
  let file = null;

  const selected = await open({
    multiple: false,
    filters: [{ name: "Powershell Script", extensions: ["ps1", "txt"] }],
  });

  if (!selected) {
    return null;
  }

  if (typeof selected === "string") {
    try {
      const [filename, content] = await invoke("read_ps1", { path: selected });
      file = filename;
      end = content;
    } catch (err) {
      await message("File nicht gefunden", {
        title: "ES/Script",
        kind: "error",
      });
    }
  }

  return end;
};

export default function Form({ isVisible }) {
  const addItem = useListStore((state) => state.addItem);
  const [selectedTags, setSelectedTags] = useState([]);
  const tags = useListStore((state) => state.tags);

  const handleTagChange = (e) => {
    const options = Array.from(e.target.options);
    const selected = options
      .filter((opt) => opt.selected)
      .map((opt) => opt.value);
    setSelectedTags(selected);
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    const ps1Content = await handleLoadPS1();
    if (ps1Content === null) {
      return;
    }
    addItem({
      title: evt.target.sp.value,
      content: ps1Content,
      tags: selectedTags,
      date: new Date().toLocaleDateString(),
      id: crypto.randomUUID(),
    });

    evt.target.reset();
    isVisible(false);
  };

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      className=" w-6/20 xl:w-3/20 xl:h-4/10 flex z-10 justify-center absolute  flex-col items-center rad gap-y-10  overflow-y-auto p-5  bg-form ml-12 mt-20"
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center w-full h-full"
      >
        <div className="flex flex-col items-center w-full space-y-4">
          <label htmlFor="sp" className="text-text" autoComplete="off">
            Script Name
          </label>
          <input
            type="text"
            name="sp"
            maxLength={12}
            placeholder="IP Config"
            required
            className="bg-main2 text-text outline-none w-2/3 h-10 rad  p-2 "
          />
        </div>
        <div className="flex flex-col items-center w-full space-y-4 mt-5 rounded-sm">
          <label htmlFor="tags" className=" text-text" autoComplete="off">
            Select Tags
          </label>
          <select
            name="tags"
            multiple
            value={selectedTags}
            onChange={handleTagChange}
            className="bg-main2 p-2 text-text outline-none w-5/6 h-30 rounded-sm"
          >
            {tags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-acc border-none rad w-2/3 h-10 text-[15px] mt-auto mb-5  text-white hover:bg-white hover:text-acc lg:text-[17px] active:translate-y-1 transition-all focus:outline-none"
        >
          Add File
        </button>
      </form>
    </motion.div>
  );
}
