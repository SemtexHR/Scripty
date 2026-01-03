import { motion } from "motion/react";
import { useListStore } from "../../Hooks/useListStore";
import { useState } from "react";

export default function FormTag({ isVisible }) {
  const addTag = useListStore((state) => state.addTag);

  const handletagSubmit = (evt) => {
    evt.preventDefault();
    const tagname = evt.target.tn.value.trim();
    addTag(tagname);
    evt.target.reset();
    isVisible(false);
  };

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      className=" w-6/20 h-4/10 xl:w-3/20 xl:h-2/10 flex z-10 justify-center absolute  flex-col items-center rad gap-y-10  overflow-y-auto p-5  bg-form ml-12 mt-30"
    >
      <form
        onSubmit={handletagSubmit}
        className="flex flex-col w-full h-full items-center"
      >
        <div className="flex flex-col items-center w-full space-y-4">
          <label htmlFor="tn" className=" text-text " autoComplete="off">
            Tag Name
          </label>
          <input
            type="text"
            name="tn"
            maxLength={12}
            placeholder="Routine"
            required
            className="bg-main2 text-text outline-none  w-2/3 h-10 p-2 rad"
          />
        </div>
        <button
          type="submit"
          className="bg-acc border-none rad w-2/3 h-10 text-[15px] mt-auto mb-5 text-white hover:bg-white hover:text-acc lg:text-[17px] active:translate-y-1 transition-all focus:outline-none"
        >
          Add Tag
        </button>
      </form>
    </motion.div>
  );
}
