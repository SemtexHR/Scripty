import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { writeTextFile, readTextFile, exists } from "@tauri-apps/plugin-fs";
import { appDataDir } from "@tauri-apps/api/path";

const getFileStorePath = async () => {
  const dir = await appDataDir();
  return `${dir}scriptStorage.json`;
};

const fileStorage = {
  getItem: async (_) => {
    const path = await getFileStorePath();
    if (!(await exists(path))) return null;
    return await readTextFile(path);
  },
  setItem: async (_, value) => {
    const path = await getFileStorePath();
    await writeTextFile(path, value);
  },
  removeItem: async (_) => {
    const path = await getFileStorePath();
    await writeTextFile(path, "");
  },
};

export const useListStore = create(
  persist(
    (set, get) => ({
      items: [],

      tags: ["Routine", "SYSTEM", "Check", "User", "Admin", "Archive"],

      selectedItem: null,

      filterTag: null,

      addItem: (item) =>
        set((state) => ({
          items: [...state.items, item],
        })),

      addTag: (tag) => {
        set((state) => ({
          tags: state.tags.includes(tag) ? state.tags : [...state.tags, tag],
        }));
      },

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      selectItem: (item) => set({ selectedItem: item }),

      clearSelection: () => set({ selectedItem: null }),

      setItems: (items) => set({ items }),

      setFilterTag: (tag) => {
        set({ filterTag: tag });
      },

      getFilteredItems: () => {
        const { items, filterTag } = get();
        if (filterTag === "Archive") {
          return items.filter((item) => item.tags.includes(filterTag));
        } else if (filterTag) {
          return items.filter(
            (item) =>
              item.tags.includes(filterTag) && !item.tags.includes("Archive"),
          );
        } else {
          return items.filter((item) => !item.tags.includes("Archive"));
        }
      },
    }),
    {
      name: "scriptStorage",
      partialize: (state) => ({
        items: state.items,
        tags: state.tags,
      }),
      storage: createJSONStorage(() => fileStorage),
    },
  ),
);
