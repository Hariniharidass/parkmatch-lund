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
  general:{label:'General (derived)',border:'#2f6a51',fill:'rgba(47,106,81,.12)'},
  young:{label:'Student',border:'#2878a7',fill:'rgba(40,120,167,.10)'},
  family:{label:'Family',border:'#d17a22',fill:'rgba(209,122,34,.10)'},
  pensioner:{label:'Elderly',border:'#6e5797',fill:'rgba(110,87,151,.10)'}
 };

 const render=()=>{
  chart?.destroy();
  const comparison=personas.map(persona=>({persona,values:weightsFor(weights,persona)})).filter(group=>group.values.length>0);
  const generalGroup={persona:'general' as const,values:weightsFor(weights,'family')};
  const selectedGroup=selectedPersona==='general'?generalGroup:selectedPersona?comparison.find(group=>group.persona===selectedPersona):undefined;
  const groups=selectedGroup?[selectedGroup]:comparison.length>1?comparison:[{persona:weights[0]?.persona??'family',values:weights}];
  const labels=(groups.find(group=>group.persona===selectedPersona)??groups[0]).values.map(weight=>weight.label);
  chart=new Chart(canvas,{type:'radar',data:{labels,datasets:groups.map(group=>{
   const style=personaStyle[group.persona];
   const rawScores=group.persona==='general'?group.values.map(weight=>{
    const values=personas.map(persona=>weightsFor(weights,persona).find(item=>item.category===weight.category)).map(item=>item?valueFor(park,item.score_field):null).filter((value):value is number=>value!==null);
    return values.length?values.reduce((sum,value)=>sum+value,0)/values.length:null;
   }):group.values.map(weight=>valueFor(park,weight.score_field));
   const categoryWeights=group.persona==='general'?group.values.map(()=>100/group.values.length):group.values.map(weight=>weight.overall_weight_pct);
   const data=selectedPersona?rawScores.map((score,index)=>score===null?null:score*categoryWeights[index]/100):rawScores;
   return {label:style.label,data,rawScores,categoryWeights,backgroundColor:style.fill,borderColor:style.border,pointBackgroundColor:style.border,pointRadius:3,spanGaps:false,borderWidth:3};
  })},options:{responsive:true,maintainAspectRatio:false,layout:{padding:10},plugins:{legend:{display:groups.length>1,position:'bottom',labels:{usePointStyle:true,boxWidth:8,boxHeight:8,padding:14,color:'#354d42',font:{size:11,weight:600}}},tooltip:{callbacks:{label:c=>{const dataset=c.dataset as typeof c.dataset&{rawScores:(number|null)[];categoryWeights:number[]};const raw=dataset.rawScores[c.dataIndex];if(raw===null)return `${c.dataset.label}: Unavailable`;return selectedPersona?[`${c.dataset.label}: ${Number(c.raw).toFixed(1)} contribution points`,`Category score ${raw.toFixed(1)} · Weight ${dataset.categoryWeights[c.dataIndex].toFixed(1)}%`]:`${c.dataset.label}: ${raw.toFixed(1)} / 100`;}}}},scales:{r:{min:0,max:selectedPersona?25:100,ticks:{display:false,stepSize:selectedPersona?5:25},grid:{color:'#d9e1dc'},angleLines:{color:'#d9e1dc'},pointLabels:{color:'#354d42',font:{size:10,weight:600}}}}}});
 };

 onMount(()=>{render();return()=>chart?.destroy()});
 $effect(()=>{park;weights;selectedPersona;if(canvas)render()});
</script>

{#if selectedPersona}<p class="radar-mode">{selectedPersona==='general'?'Equal-weight General profile':'Persona emphasis'} · category contribution points</p>{/if}
<div class="persona-chart"><canvas bind:this={canvas} aria-label={selectedPersona?'Weighted six-category contribution chart for the selected profile':'Six-category profile comparison radar chart'}></canvas></div>
