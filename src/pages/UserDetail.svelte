<script lang="ts">
  import MusicCard from "../components/MusicCard.svelte"
  import { getNameColor } from "../lib/nameColor"

  export let params

  let user
  let scores = []

  let fileNameToDifficulty = {}

  const difficultyindexToLabel = {
    1: "BEGINNER",
    2: "STANDARD",
    3: "ADVANCED",
    4: "EXTRA",
  }

  const formatDate = (date: Date) => {
    const year = date.getFullYear().toString().padStart(4, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const day = date.getDate().toString().padStart(2, "0")
    const hour = date.getHours().toString().padStart(2, "0")
    const minute = date.getMinutes().toString().padStart(2, "0")
    const second = date.getSeconds().toString().padStart(2, "0")
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`
  }

  const fetchBeatmap = (async () => {
    const response = await fetch("./beatmaps/beatmaps.json")
    const responseJSON = await response.json()
    for (const music of responseJSON) {
      if (!(music.folder in fileNameToDifficulty)) {
        fileNameToDifficulty[music.folder] = {}
      }
      for (const keyIndex of Array(4).keys()) {
        for (const difficultyIndex of Array(4).keys()) {
          if (`beatmap_${keyIndex + 4}k_${difficultyIndex + 1}` in music) {
            fileNameToDifficulty[music.folder][
              music[`beatmap_${keyIndex + 4}k_${difficultyIndex + 1}`].filename
            ] = {
              music: music,
              key: keyIndex + 4,
              difficulty: difficultyIndex + 1,
            }
          }
        }
      }
    }
  })()

  const fetchUser = (async (userId: number) => {
    const response = await fetch(
      `https://ricora-beats-ir.fly.dev/users/${userId}`
    )
    user = await response.json()
    if (!response.ok) {
      return Promise.reject(new Error("User not found."))
    }
    scores = user.scores
    scores.sort((a, b) => b.performance_point - a.performance_point)
    return user
  })(params.id)
</script>

<main>
  <div class="bg-base-100">
    {#await fetchBeatmap}
      <div class="flex p-8 justify-center">
        <div
          class="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"
        />
      </div>
    {:then}
      {#await fetchUser}
        <div class="flex p-8 justify-center">
          <div
            class="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"
          />
        </div>
      {:then user}
        <div class="p-8 hero bg-base-300">
          <div class="hero-content flex-col lg:flex-row">
            <div>
              <div>
                <span
                  class="text-4xl font-bold"
                  style="color: {getNameColor(user.performance_point)};"
                  >{user.screen_name}</span
                >
                <span class="px-2 text-sm opacity-50">(ID: {user.id})</span>
              </div>

              <span class="py-3">
                <span class="tooltip" data-tip="Performance Point">
                  <span class="badge badge-md"
                    >{user.performance_point} pts.</span
                  >
                </span></span
              >
            </div>
          </div>
        </div>
      {:catch error}
        <div class="p-8">
          <div class="alert alert-error shadow-lg">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="stroke-current flex-shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                ><path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                /></svg
              >
              <span>Error: {error.message}</span>
            </div>
          </div>
        </div>
      {/await}
      <div class="divider"><h2 class="text-xl font-bold">マイベスト</h2></div>

      {#if scores.length === 0}
        <div class="p-8">
          <div class="alert alert-warning shadow-lg">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="stroke-current flex-shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                ><path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                /></svg
              >
              <span>Warning: スコアが存在しません。</span>
            </div>
          </div>
        </div>
      {/if}

      <div class="p-6 overflow-x-auto w-full">
        <table class="table w-full">
          <!-- head -->
          {#if scores.length !== 0}
            <thead>
              <tr>
                <th>Rank</th>
                <th>Title</th>
                <th>Score</th>
                <th class="text-xs">Max Combo</th>
                <th class="text-xs">Perfect</th>
                <th class="text-xs">Great</th>
                <th class="text-xs">Good</th>
                <th class="text-xs">Bad</th>
                <th class="text-xs">Miss</th>
                <th class="text-xs">Performance</th>
                <th class="text-xs">Submitted Date</th>
                <th />
              </tr>
            </thead>
          {/if}
          <tbody>
            {#each scores as score, i}
              <tr class="hover">
                <td>{i + 1}</td>
                <td>
                  <div class="flex items-center space-x-3">
                    <div>
                      <div class="font-bold">
                        <a href="#/music/{encodeURIComponent(score.folder)}/">
                          {fileNameToDifficulty[score.folder][score.filename]
                            .music.title}</a
                        >
                      </div>
                      <div class="text-sm opacity-50">
                        {fileNameToDifficulty[score.folder][score.filename].key}
                        KEYS - {difficultyindexToLabel[
                          fileNameToDifficulty[score.folder][score.filename]
                            .difficulty
                        ]}
                      </div>
                    </div>
                  </div></td
                >
                <td>
                  <div class="font-bold">{score.score.toFixed(2)} %</div>
                </td>
                <td class="text-xs">{score.combo} combo</td>
                <td class="text-xs">{score.judge_0}</td>
                <td class="text-xs">{score.judge_1}</td>
                <td class="text-xs">{score.judge_2}</td>
                <td class="text-xs">{score.judge_3}</td>
                <td class="text-xs">{score.judge_4}</td>
                <td class="text-xs">{score.performance_point}</td>
                <td>
                  <span class="badge badge-ghost badge-md"
                    >{formatDate(new Date(score.submitted_on))}</span
                  ></td
                >
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/await}
  </div>
</main>
