<script lang="ts">
  import { onMount } from 'svelte';
  import { Chart, RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip } from 'chart.js';
  import type { Park } from '../types/park';
  Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip);
  let { park }: { park:Park } = $props();
  let canvas: HTMLCanvasElement;
  let chart: Chart | undefined;
  const level = (v: Park['canopyCover']) => v === null ? null : ({ low:1, mid:2, high:3 }[v]);
  const bool = (v: boolean | null) => v === null ? null : v ? 3 : 0;
  const sport = () => park.publicSportPark === true || park.footballSportCourts === true ? 3 : park.publicSportPark === null || park.footballSportCourts === null ? null : 0;
  const data = () => [level(park.canopyCover),level(park.grassCover),bool(park.playground),sport(),bool(park.wheelchairAccessible),bool(park.streetParkLight)];
  const render = () => { chart?.destroy(); chart = new Chart(canvas,{type:'radar',data:{labels:['Canopy','Grass','Play','Sport','Accessible','Lighting'],datasets:[{data:data(),backgroundColor:'rgba(89, 139, 108, .18)',borderColor:'#2f6a51',pointBackgroundColor:'#173e34',pointRadius:3,borderWidth:2,spanGaps:false}]},options:{responsive:true,maintainAspectRatio:false,layout:{padding:12},plugins:{legend:{display:false},tooltip:{callbacks:{label:(c)=>c.raw===null?'Unknown':`Encoded value: ${c.raw}`}}},scales:{r:{min:0,max:3,beginAtZero:true,ticks:{display:false,stepSize:1},grid:{color:'#d9e1dc'},angleLines:{color:'#d9e1dc'},pointLabels:{color:'#354d42',padding:9,font:{size:12,weight:600}}}}}}); };
  onMount(()=>{ render(); return ()=>chart?.destroy(); });
  $effect(()=>{ park; if(canvas) render(); });
</script>
<div class="chart-wrap"><canvas bind:this={canvas} aria-label="Park feature radar chart"></canvas></div>
