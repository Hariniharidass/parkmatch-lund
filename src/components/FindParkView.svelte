<script lang="ts">
 import {onMount} from 'svelte';
 import ConsumerCategoryFilterPanel from './ConsumerCategoryFilters.svelte';
 import ConsumerParkMap from './ConsumerParkMap.svelte';
 import ConsumerRealParkDetails from './ConsumerRealParkDetails.svelte';
 import type {AmenityCollection,AmenityFeature,CategoryWeightCollection,RealParkCollection,RealParkFeature} from '../types/municipality';
 import type {ConsumerCategoryFilters} from '../lib/consumerReal';
 import {defaultConsumerFilters,filterConsumerParks} from '../lib/consumerReal';
 import {weightsFor} from '../lib/realMunicipality';

 let {drawerOpen,onCloseDrawer}:{drawerOpen:boolean;onCloseDrawer:()=>void}=$props();
 let parks=$state<RealParkFeature[]>([]);let amenities=$state<AmenityFeature[]>([]);let weights=$state<CategoryWeightCollection['features'][number]['properties'][]>([]);let filters=$state<ConsumerCategoryFilters>({});let selectedId=$state<string|null>(null);let hovered=$state<RealParkFeature|null>(null);let loading=$state(true);let error=$state<string|null>(null);
 let categoryWeights=$derived(weightsFor(weights,'family'));let matches=$derived(filterConsumerParks(parks,filters));let selected=$derived(matches.find(p=>p.properties.park_id===selectedId)??null);let display=$derived(selected??hovered);
 $effect(()=>{if(selectedId&&!matches.some(p=>p.properties.park_id===selectedId))selectedId=null;if(hovered&&!matches.some(p=>p.properties.park_id===hovered?.properties.park_id))hovered=null;});
 onMount(async()=>{try{const [parkResponse,weightResponse,amenityResponse]=await Promise.all([fetch('/data/lund-parks.geojson'),fetch('/data/category-weights.json'),fetch('/data/amenities.geojson')]);if(!parkResponse.ok||!weightResponse.ok||!amenityResponse.ok)throw new Error('Park data files could not be loaded.');const parkData=await parkResponse.json() as RealParkCollection;const weightData=await weightResponse.json() as CategoryWeightCollection;const amenityData=await amenityResponse.json() as AmenityCollection;if(parkData.features.length!==172)throw new Error(`Expected 172 parks but loaded ${parkData.features.length}.`);parks=parkData.features;weights=weightData.features.map(f=>f.properties);amenities=amenityData.features;filters=defaultConsumerFilters();}catch(reason){error=reason instanceof Error?reason.message:'Park data could not be loaded.'}finally{loading=false}});
</script>

<div class="consumer-data-banner"><strong>Real Lund park data</strong><span>Mapped facilities and park characteristics</span></div>
<main class="real-find-layout">
 <ConsumerCategoryFilterPanel bind:filters weights={categoryWeights} resultCount={matches.length} open={drawerOpen} onClose={onCloseDrawer}/>
 <section class="map-column">
  {#if loading}<div class="map-loading">Loading 172 Lund parks…</div>
  {:else if error}<div class="no-results" role="alert"><h2>Park data unavailable</h2><p>{error}</p></div>
  {:else}
   {#if matches.length===0}<div class="no-results"><div>⌁</div><h2>No parks have every selected feature</h2><p>Uncheck one or more amenities to widen your search.</p><button onclick={()=>filters=defaultConsumerFilters()}>Clear all filters</button></div>{/if}
   <div class="consumer-map-count" aria-live="polite">Showing <strong>{matches.length}</strong> of <strong>{parks.length}</strong> parks</div>
   <ConsumerParkMap parks={matches} {amenities} selectedId={selectedId} onHover={(p)=>{if(!selectedId)hovered=p}} onLeave={()=>{if(!selectedId)hovered=null}} onSelect={(p)=>{selectedId=p.properties.park_id;hovered=null}}/>
  {/if}
 </section>
 <ConsumerRealParkDetails park={display} weights={categoryWeights} pinned={selected!==null} onClose={()=>{selectedId=null;hovered=null}}/>
</main>
