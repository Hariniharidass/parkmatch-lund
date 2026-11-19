<script lang="ts">
 import Header from './components/Header.svelte';import FindParkView from './components/FindParkView.svelte';import MunicipalityView from './components/MunicipalityView.svelte';
 let filtersOpen=$state(false);let activeView:'find'|'municipality'=$state('find');
</script>
<Header {activeView} onChangeView={(view)=>{activeView=view;filtersOpen=false}} onOpenFilters={()=>filtersOpen=true}/>{#if activeView==='find'}<FindParkView drawerOpen={filtersOpen} onCloseDrawer={()=>filtersOpen=false}/>{:else}<MunicipalityView drawerOpen={filtersOpen} onCloseDrawer={()=>filtersOpen=false}/>{/if}
