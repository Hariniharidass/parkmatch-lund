<script lang="ts">
 import type { Park } from '../types/park'; import { coverDistribution,facilityAvailability } from '../lib/municipality';
 let {parks}:{parks:Park[]}=$props();
 let coverCharts=$derived([{title:'Canopy cover',items:coverDistribution(parks,'canopyCover')},{title:'Grass cover',items:coverDistribution(parks,'grassCover')}]);
 let facilities=$derived(facilityAvailability(parks));
</script>
<p class="scope-note">Based on all assessed parks</p>
<section class="summary-charts" aria-label="Dataset visual summaries">
 {#each coverCharts as chart}<article><h3>{chart.title}</h3>{#each chart.items as item}<div class="bar-row"><span>{item.label[0].toUpperCase()+item.label.slice(1)}</span><div><i style:width={`${parks.length?item.count/parks.length*100:0}%`}></i></div><strong>{item.count}</strong></div>{/each}</article>{/each}
 <article><h3>Recorded facility availability</h3>{#each facilities as item}<div class="bar-row"><span>{item.label}</span><div><i style:width={`${parks.length?item.count/parks.length*100:0}%`}></i></div><strong>{item.count}</strong></div>{/each}</article>
</section>
