<script lang="ts">
  export let title: string
  export let artist: string
  export let noter: string
  export let imgSrc: string
  export let aHref: string
</script>

<div class="card card-compact w-64 bg-base-100 shadow-xl justify-center">
  <figure><img src={imgSrc} alt={title} /></figure>
  <div class="card-body">
    <a href={aHref}>
      <h2 class="card-title">
        {title}
      </h2>
    </a>
    <p />
    <div class="card-actions justify-end">
      <div class="tooltip" data-tip="作曲・編曲">
        <div class="badge badge-primary">{artist}</div>
      </div>
      <div class="tooltip" data-tip="譜面作成">
        <div class="badge badge-secondary">{noter}</div>
      </div>
    </div>
  </div>
</div>
