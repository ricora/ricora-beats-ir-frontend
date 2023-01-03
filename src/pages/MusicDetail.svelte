<script lang="ts">
  import { getNameColor } from "../lib/nameColor"

  export let params

  let selectedMusic
  let selectedBeatmap

  let users
  let playerIdToScreenName = {}
  let playerIdToPerformancePoint = {}

  let ranking = []

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
      if (music.folder == params.folder) {
        selectedMusic = music
        return music
      }
    }
  })()

  const fetchUsers = (async () => {
    const response = await fetch(`https://ricora-beats-ir.fly.dev/users/`)
    const responseJSON = await response.json()
    users = responseJSON
    for (const user of users) {
      playerIdToScreenName[user.id] = user.screen_name
      playerIdToPerformancePoint[user.id] = user.performance_point
    }
  })()

  const fetchRanking = async (folder, filename) => {
    const response = await fetch(
      `https://ricora-beats-ir.fly.dev/scores/${encodeURIComponent(
        folder
      )}/${encodeURIComponent(filename)}/`
    )
    const responseJSON = await response.json()
    return responseJSON
  }

  const changeBeatmap = async () => {
    ranking = await fetchRanking(
      selectedMusic.folder,
      selectedMusic[selectedBeatmap].filename
    )
    ranking.sort((a, b) => b.score - a.score)
  }
</script>

<main>
  <div class="bg-base-100">
    {#await fetchBeatmap}
      <div class="flex p-8 justify-center">
        <div
          class="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"
        />
      </div>
    {:then music}
      <div class="p-8 hero bg-base-300">
        <div class="hero-content flex-col lg:flex-row">
          <img
            src={encodeURIComponent(
              `./beatmaps/${music.folder}/${music.jacket}`
            )}
            class="sm:max-w-sm rounded-lg shadow-2xl"
            alt={music.title}
          />
          <div>
            <div class="text-4xl font-bold">{music.title}</div>

            <div class="py-3 card-actions justify-start">
              <div class="tooltip" data-tip="作曲・編曲">
                <div class="badge badge-primary">{music.artist}</div>
              </div>
              <div class="tooltip" data-tip="譜面作成">
                <div class="badge badge-secondary">{music.noter}</div>
              </div>
            </div>
            <div class="py-3">
              <select
                bind:value={selectedBeatmap}
                on:change={changeBeatmap}
                class="select select-bordered w-full max-w-xs"
              >
                <option disabled selected>難易度とキーの数を選択</option>
                {#each [4, 5, 6, 7] as keyIndex}
                  {#each [1, 2, 3, 4] as difficultyIndex}
                    {#if `beatmap_${keyIndex}k_${difficultyIndex}` in music}
                      <option value={`beatmap_${keyIndex}k_${difficultyIndex}`}
                        >{`${keyIndex} KEYS - ${
                          {
                            1: "BEGINNER",
                            2: "STANDARD",
                            3: "ADVANCED",
                            4: "EXTRA",
                          }[difficultyIndex]
                        }`}</option
                      >
                    {/if}
                  {/each}
                {/each}
              </select>
            </div>
          </div>
        </div>
      </div>
    {/await}
    <div class="divider"><h2 class="text-xl font-bold">ランキング</h2></div>

    {#if ranking.length === 0 && selectedBeatmap !== "難易度とキーの数を選択"}
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
        {#if ranking.length !== 0}
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
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
          {#each ranking as score, i}
            <tr class="hover">
              <td>{i + 1}</td>
              <td>
                <div class="flex items-center space-x-3">
                  <div>
                    <div
                      class="font-bold"
                      style="color: {getNameColor(
                        playerIdToPerformancePoint[score.player_id]
                      )};"
                    >
                      {playerIdToScreenName[score.player_id]}
                    </div>
                    <div class="text-sm opacity-50">ID: {score.player_id}</div>
                  </div>
                </div>
              </td>
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
  </div>
</main>
