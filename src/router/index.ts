import Home from "../pages/Home.svelte"
import MusicList from "../pages/MusicList.svelte"
import MusicDetail from "../pages/MusicDetail.svelte"

export const routes = {
  "/": Home,
  "/music": MusicList,
  "/music/:folder": MusicDetail,
  "*": Home,
}
