<script lang="ts">
 import {onMount} from 'svelte';
 import {Chart,RadarController,RadialLinearScale,PointElement,LineElement,Filler,Tooltip,Legend} from 'chart.js';
 import type {CategoryWeight,Persona,RealParkFeature} from '../types/municipality';
 import {valueFor,weightsFor} from '../lib/realMunicipality';

 Chart.register(RadarController,RadialLinearScale,PointElement,LineElement,Filler,Tooltip,Legend);

 let {park,weights,selectedPersona}:{park:RealParkFeature;weights:CategoryWeight[];selectedPersona?:Persona}=$props();
 let canvas:HTMLCanvasElement;
 let chart:Chart|undefined;
 const personas:Persona[]=['young','family','pensioner'];
 const personaStyle:Record<Persona,{label:string;border:string;fill:string}>={
  young:{label:'Student',border:'#2878a7',fill:'rgba(40,120,167,.10)'},
  family:{label:'Family',border:'#d17a22',fill:'rgba(209,122,34,.10)'},
  pensioner:{label:'Elderly',border:'#6e5797',fill:'rgba(110,87,151,.10)'}
 };

 const render=()=>{
  chart?.destroy();
  const comparison=personas.map(persona=>({persona,values:weightsFor(weights,persona)})).filter(group=>group.values.length>0);
  const groups=comparison.length>1?comparison:[{persona:selectedPersona??weights[0]?.persona??'family',values:weights}];
  const ordered=[...groups].sort((a,b)=>a.persona===selectedPersona?1:b.persona===selectedPersona?-1:0);
  const labels=(groups.find(group=>group.persona===selectedPersona)??groups[0]).values.map(weight=>weight.label);
  chart=new Chart(canvas,{type:'radar',data:{labels,datasets:ordered.map(group=>{
   const style=personaStyle[group.persona];const active=!selectedPersona||group.persona===selectedPersona;
   return {label:style.label,data:group.values.map(weight=>valueFor(park,weight.score_field)),backgroundColor:style.fill,borderColor:style.border,pointBackgroundColor:style.border,pointRadius:active?3:2,spanGaps:false,borderWidth:active?3:1.5};
  })},options:{responsive:true,maintainAspectRatio:false,layout:{padding:10},plugins:{legend:{display:groups.length>1,position:'bottom',labels:{usePointStyle:true,boxWidth:8,boxHeight:8,padding:14,color:'#354d42',font:{size:11,weight:600}}},tooltip:{callbacks:{label:c=>`${c.dataset.label}: ${c.raw===null?'Unavailable':`${Number(c.raw).toFixed(1)} / 100`}`}}},scales:{r:{min:0,max:100,ticks:{display:false,stepSize:25},grid:{color:'#d9e1dc'},angleLines:{color:'#d9e1dc'},pointLabels:{color:'#354d42',font:{size:10,weight:600}}}}}});
 };

 onMount(()=>{render();return()=>chart?.destroy()});
 $effect(()=>{park;weights;selectedPersona;if(canvas)render()});
</script>

<div class="persona-chart"><canvas bind:this={canvas} aria-label="Six-category Student, Family and Elderly comparison radar chart"></canvas></div>
