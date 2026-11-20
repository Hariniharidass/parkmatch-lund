<script lang="ts">
 import type {MunicipalityRealFilters,Persona,RealParkFeature} from '../types/municipality';
 import {parkName,personaOptions} from '../lib/realMunicipality';
 let {persona=$bindable(),filters=$bindable(),resultCount,park,open,onClose,onClear}:{persona:Persona;filters:MunicipalityRealFilters;resultCount:number;park:RealParkFeature|null;open:boolean;onClose:()=>void;onClear:()=>void}=$props();
 const facilityFields=[['bench_count','Benches'],['toilet_count','Toilets'],['drinking_water_count','Drinking water'],['playground_count','Playgrounds'],['sports_pitch_count','Sports pitches'],['fitness_station_count','Fitness stations'],['picnic_table_count','Picnic tables'],['picnic_sites_count','Picnic sites'],['waste_bin_count','Waste bins'],['bicycle_parking_count','Bicycle parking'],['shelter_count','Shelters'],['food_and_drink_count','Food & drink']] as const;
</script>

{#if open}<button class="scrim" aria-label="Close investigation controls" onclick={onClose}></button>{/if}
<aside class:open class="municipality-filters real-controls" aria-label="Municipality investigation controls">
 <div class="filter-head"><div><p class="eyebrow">Investigation tools</p><h2>Explore parks</h2></div><button class="close" onclick={onClose} aria-label="Close controls">×</button></div>
 <div class="result-row"><strong>{resultCount} parks</strong><span>match current controls</span></div>
 {#if park}
  <section class="facilities left-facilities" aria-label={`Mapped facilities in ${parkName(park)}`}>
   <div class="facility-heading"><div><p class="eyebrow">Selected park</p><strong>{parkName(park)}</strong></div><span>Mapped facilities</span></div>
   <div class="facility-grid">{#each facilityFields as field}<div class:available={Number(park.properties[field[0]]??0)>0}><span>{field[1]}</span><strong>{Number(park.properties[field[0]]??0)}</strong></div>{/each}</div>
   <p>Facility locations are marked on the map.</p>
  </section>
 {:else}<div class="facility-placeholder"><strong>Mapped facilities</strong><span>Select a park to view its facility counts and map locations.</span></div>{/if}
 <form class="filter-form">
  <fieldset><legend>Profile</legend><div class="persona-options">{#each personaOptions as option}<label><input type="radio" name="persona" value={option.id} bind:group={persona}/><span>{option.label}</span></label>{/each}</div></fieldset>
  <fieldset><legend>Selected profile score range</legend><div class="range-inputs"><label>Minimum<input type="number" min="0" max="100" step="1" bind:value={filters.minScore}/></label><span>to</span><label>Maximum<input type="number" min="0" max="100" step="1" bind:value={filters.maxScore}/></label></div><small>Filters the original selected-profile score on its 0–100 scale.</small></fieldset>
 </form>
 <button class="clear" type="button" onclick={onClear}>Reset municipality view</button>
</aside>
