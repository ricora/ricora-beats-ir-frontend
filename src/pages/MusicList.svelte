<script lang="ts">
  import MusicCard from "../components/MusicCard.svelte"

  const fetchBeatmaps = (async () => {
    const response = await fetch("./beatmaps/beatmaps.json")
    const responseJSON = await response.json()
    let row = []
    let col = []
    for (const music of responseJSON) {
      col.push(music)
      if (col.length == 3) {
        row.push(col)
        col = []
      }
    }

    if (responseJSON.length % 3 == 1) {
      row.push([responseJSON[responseJSON.length - 1]])
    }
    if (responseJSON.length % 3 == 2) {
      row.push([
        responseJSON[responseJSON.length - 1 - 1],
        responseJSON[responseJSON.length - 1],
      ])
    }
    return row
  })()
</script>

<main>
  <div class="divider"><h2 class="text-xl font-bold">楽曲一覧</h2></div>
  {#await fetchBeatmaps}
    <div class="flex p-8 justify-center">
      <div
        class="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"
      />
    </div>
  {:then data}
    {#each data as row}
      <div class="lg:flex justify-center">
        {#each row as { title, artist, noter, folder, jacket }, i}
          <div class="flex p-8 justify-center">
            <MusicCard
              {title}
              {artist}
              {noter}
              imgSrc={encodeURIComponent(`./beatmaps/${folder}/${jacket}`)}
              aHref={`#/music/${encodeURIComponent(folder)}`}
            />
          </div>
        {/each}
      </div>
    {/each}
  {/await}
</main>
