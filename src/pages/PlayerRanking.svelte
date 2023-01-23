<script lang="ts">
  import { getNameColor } from "../lib/nameColor"
  import { retryFetch } from "../lib/retryFetch"

  const SERVER_URL = process.env.SERVER_URL as string

  const fetchUsers = (async () => {
    const response = await retryFetch(new URL("/users/", SERVER_URL).toString())
    const ranking = await response.json()
    ranking.sort((a, b) => b.performance_point - a.performance_point)
    return ranking
  })()
</script>

<main>
  <div class="divider"><h2 class="text-xl font-bold">総合ランキング</h2></div>

  {#await fetchUsers}
    <div class="flex p-8 justify-center">
      <div
        class="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"
      />
    </div>
  {:then users}
    <div class="p-6 overflow-x-auto">
      <table class="table w-full">
        <!-- head -->
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Performance</th>
            <th />
          </tr>
        </thead>

        <tbody>
          {#each users as user, i}
            <tr class="hover">
              <th>{i + 1}</th>
              <td>
                <div class="flex items-center space-x-3">
                  <div>
                    <div
                      class="font-bold"
                      style="color: {getNameColor(user.performance_point)};"
                    >
                      <a href="#/users/{user.id}">{user.screen_name}</a>
                    </div>
                    <div class="text-sm opacity-50">ID: {user.id}</div>
                  </div>
                </div>
              </td>
              <td>
                <div class="font-bold">{user.performance_point}</div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/await}
</main>

<style>
</style>
