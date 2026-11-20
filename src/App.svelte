<script lang="ts">
 import {onMount} from 'svelte';import Header from './components/Header.svelte';import FindParkView from './components/FindParkView.svelte';import MunicipalityView from './components/MunicipalityView.svelte';
 let filtersOpen=$state(false);let activeView:'find'|'municipality'=$state('find');let theme=$state<'light'|'dark'>('light');
 const applyTheme=(next:'light'|'dark')=>{theme=next;document.documentElement.dataset.theme=next;localStorage.setItem('parklens-theme',next)};
 onMount(()=>{const saved=localStorage.getItem('parklens-theme');applyTheme(saved==='light'||saved==='dark'?saved:matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')});
 $effect(()=>{document.title=activeView==='find'?'ParkLens — Find my park':'ParkLens — Clearer evidence for a greener Lund.'});
</script>
<Header {activeView} {theme} onToggleTheme={()=>applyTheme(theme==='light'?'dark':'light')} onChangeView={(view)=>{activeView=view;filtersOpen=false}} onOpenFilters={()=>filtersOpen=true}/>{#if activeView==='find'}<FindParkView drawerOpen={filtersOpen} onCloseDrawer={()=>filtersOpen=false}/>{:else}<MunicipalityView drawerOpen={filtersOpen} onCloseDrawer={()=>filtersOpen=false}/>{/if}
