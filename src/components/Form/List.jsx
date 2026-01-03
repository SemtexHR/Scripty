import { useEffect, useState } from "react";
import { useListStore } from "../../Hooks/useListStore";
import { AnimatePresence, motion } from "motion/react";

function ListItem({ item, onSelect, visible, setVisible }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="bg-card text-text w-62 h-10 flex items-center 2xl:w-87 2xl:h-13 hover:bg-acc hover:text-white active:translate-y-1 transition-all cursor-pointer rad ml-5 "
      onClick={() => {
        onSelect(item);
        setVisible(true);
      }}
    >
      <div className="flex flex-col">
        <h1 className="flex ml-5 text-[15px] 2xl:text-[19px]">{item.title}</h1>
        <p className="flex ml-5 text-[12px] 2xl:text-[16px] font-doto font-bold">
          Added: {item.date}
        </p>
      </div>
    </motion.div>
  );
}

export default function List({ setVisible, visible }) {
  const filterTag = useListStore((state) => state.filterTag);
  const getFilteredItems = useListStore((state) => state.getFilteredItems);
  const filteredItems = getFilteredItems();

  const selectItem = useListStore((state) => state.selectItem);

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsub = useListStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });

    return () => unsub();
  }, []);

  return (
    <div className="bg-transparent w-full h-2/3 flex flex-col items-center overflow-y-scroll gap-y-5">
      <AnimatePresence>
        {filteredItems.map((item) => (
          <ListItem
            key={item.id}
            item={item}
            onSelect={selectItem}
            setVisible={setVisible}
            visible={visible}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
