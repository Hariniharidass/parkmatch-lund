<script lang="ts">
  import { onMount } from 'svelte';
  import L from 'leaflet';
  import type { Park } from '../types/park';
  let { parks, selectedId, onHover, onLeave, onSelect }: { parks:Park[]; selectedId:string|null; onHover:(p:Park)=>void; onLeave:()=>void; onSelect:(p:Park)=>void } = $props();
  let container: HTMLDivElement; let map:L.Map; let layer:L.LayerGroup;
  const icon = (selected:boolean) => L.divIcon({className:'park-marker-wrap',html:`<span class="park-marker ${selected?'selected':''}"><span>♧</span></span>`,iconSize:[44,44],iconAnchor:[22,22]});
  function draw(){ if(!map)return; layer.clearLayers(); parks.forEach(p=>{ const marker=L.marker([p.latitude,p.longitude],{icon:icon(p.id===selectedId),title:p.name,keyboard:true}).addTo(layer); marker.on('mouseover',()=>onHover(p)); marker.on('mouseout',onLeave); marker.on('click',()=>onSelect(p)); marker.bindTooltip(p.name,{direction:'top',offset:[0,-17]}); }); }
  onMount(()=>{ map=L.map(container,{zoomControl:false}).setView([55.7047,13.1910],13); L.control.zoom({position:'bottomright'}).addTo(map); L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',maxZoom:19}).addTo(map); layer=L.layerGroup().addTo(map); draw(); const observer=new ResizeObserver(()=>map.invalidateSize()); observer.observe(container); return()=>{observer.disconnect();map.remove();}; });
  $effect(()=>{ parks; selectedId; draw(); });
</script>
<div class="map-shell"><div class="map-label"><strong>{parks.length}</strong><span>fictional demo parks shown</span></div><div class="map" bind:this={container} aria-label="Interactive map of demonstration parks in Lund"></div></div>
