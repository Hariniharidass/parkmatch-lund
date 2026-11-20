<script lang="ts">
 import type {CategoryWeight} from '../types/municipality';
 import type {ConsumerCategoryFilters} from '../lib/consumerReal';
 import {activeConsumerFilterCount,amenityFiltersByCategory,defaultConsumerFilters} from '../lib/consumerReal';
 let {filters=$bindable(),weights,resultCount,open,onClose}:{filters:ConsumerCategoryFilters;weights:CategoryWeight[];resultCount:number;open:boolean;onClose:()=>void}=$props();
 const toggle=(field:string,checked:boolean)=>{filters={...filters,[field]:checked}};
</script>

{#if open}<button class="scrim" aria-label="Close park filters" onclick={onClose}></button>{/if}
<aside class:open class="consumer-score-filters" aria-label="Park amenity filters">
 <div class="filter-head"><div><p class="eyebrow">Find a park</p><h2>Choose amenities</h2></div><button class="close" onclick={onClose} aria-label="Close filters">×</button></div>
 <div class="result-row"><strong>{resultCount}</strong><span>parks match</span></div>
 <p class="consumer-filter-intro">Select one or more mapped features. Matching parks must contain every checked item.</p>
 <form class="category-filter-list">
  {#each weights as weight}
   <fieldset>
    <legend>{weight.label}</legend>
    <div class="amenity-checkboxes">
     {#each amenityFiltersByCategory[weight.category]??[] as option}
      <label class="check"><input type="checkbox" checked={filters[option.field]??false} onchange={(event)=>toggle(option.field,event.currentTarget.checked)}/><span>{option.label}</span></label>
     {/each}
    </div>
   </fieldset>
  {/each}
 </form>
 <button class="clear" type="button" onclick={()=>filters=defaultConsumerFilters()} disabled={activeConsumerFilterCount(filters)===0}>Clear all filters</button>
 <p class="control-note">Facility filters use mapped GeoPackage counts. Climate filters use mapped cover percentages. Missing or zero values do not match a checked option.</p>
</aside>
