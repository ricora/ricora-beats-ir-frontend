import Home from "../pages/Home.svelte"
import MusicList from "../pages/MusicList.svelte"

export const routes = {
  "/": Home,
  "/music": MusicList,
  "*": Home,
}
