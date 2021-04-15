import rootMenu from "../data/rootMenu";

export function findColor(note) {
  let col = "";
  rootMenu.find((root) => {
    if (root.note === note) {
      col = root.color;
    }
  });
  return col;

}