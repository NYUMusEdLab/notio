import rootMenu from "../data/rootMenu";

export function findColor(note) {
  const root = rootMenu.find((root) => {
    if (root.note === note) {
      return root;
    } else {
      return "";
    }
  });
  return root.color;
}