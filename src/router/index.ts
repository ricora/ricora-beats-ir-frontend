import Home from "../pages/Home.svelte"
import MusicList from "../pages/MusicList.svelte"
import MusicDetail from "../pages/MusicDetail.svelte"
import PlayerRanking from "../pages/PlayerRanking.svelte"
import UserDetail from "../pages/UserDetail.svelte"

export const routes = {
  "/": Home,
  "/music": MusicList,
  "/music/:folder": MusicDetail,
  "/ranking": PlayerRanking,
  "/users/:id": UserDetail,
  "*": Home,
}
