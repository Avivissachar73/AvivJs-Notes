'use strict';

import { LineChart, BarChart, PiChart, DonatChart, DiscChart, FrameDiscChart, Heatmap } from '../../../../lib/AvivChart.js';

import heatmapData from '../heatmapData.js';

export default {
    name: 'about-page',
    template: `
        <main class="app-main container flex column align-center space-around">
            <h2>Dashboard</h2>
            <div class="charts-container flex wrap align-center space-around">
              <div class="chart donat-container"></div>
              <div class="chart frame-container"></div>
              <div class="chart bar-container"></div>
              <div class="chart bar2-container"></div>
              <div class="chart bar3-container"></div>
              <div class="chart line-container"></div>
              <div class="chart disc-container"></div>
              <div class="chart pi-container"></div>
            </div>
        </main>
    `,
    // <div class="chart hitmap-container"></div>
    style: {
      h2: {
        margin: '30px 0'
      },
      '.charts-container': {
        gap: '10px',
        '.chart' : {
          width: '200px',
          height: '150px',
          display: 'flex',
          'align-items': 'center',
          'justify-content': 'center'
        },
        'margin-bottom': '30px'
      }
    },
    state() {
      return {
        charts: []
      }
    },
    onMounted() {
      this.mountCharts();
    },
    OnDestroyedCPN() {
      this.charts.forEach(c => c.destroy());
      this.charts = [];
    },
    methods: {
      mountCharts() {
        const range = (count) => '0'.repeat(count).split('').map((_, i) => i);
        const randInt = (min = -infinity, max) => Math.floor(Math.random() * (max - min) + min);

        const labels = ['sep', 'oct', 'nov', 'dec', 'jan', 'feb'];
        const randData = (min = false) => range(labels.length).map(c => randInt(min? -50 : 0, 100));

        const baseOptions = () => ({ 
          data: [
            {tag: 'Data sample 1', vals: randData(), style: {color: '#abcdeb'}},
            {tag: 'Data sample 2', vals: randData(), style: {color: '#fdaaaa'}},
            {tag: 'Data sample 3', vals: randData(), style: {color: '#b4ffd9'}},
            {tag: 'Data sample 4', vals: randData(), style: {color: '#fcfdcd'}},
            {tag: 'Data sample 5', vals: randData(), style: {color: '#f2ddff'}},
          ], 
          labels,
          horizontal: false,
          labelsNegative: true,
          dataNegative: false,
          // width: 1000, height: 1000,
          info: {
            disable: true,
            // size: 60,
            position: 'right',
            align: 'middle'
          }
          // legend: { tag: 'Chart test', align: 'end' }
        })

        this.charts = [
          new DonatChart(baseOptions(), '.donat-container'),
      
        new BarChart(baseOptions(), '.bar-container'),
        
        new BarChart({
          ...baseOptions(),
          data: [
            {tag: 'Data sample 1', vals: randData(true), style: {color: '#abcdeb'}},
            {tag: 'Data sample 2', vals: randData(true), style: {color: '#fdaaaa'}},
            {tag: 'Data sample 3', vals: randData(true), style: {color: '#b4ffd9'}},
            {tag: 'Data sample 4', vals: randData(true), style: {color: '#fcfdcd'}},
            {tag: 'Data sample 5', vals: randData(true), style: {color: '#f2ddff'}},
          ],
        }, '.bar2-container'),
        
        new BarChart(baseOptions(), '.bar3-container'),
      
        new LineChart(baseOptions(), '.line-container'),
      
        new DiscChart(baseOptions(), '.disc-container'),
      
        new PiChart(baseOptions(), '.pi-container'),
      
        new FrameDiscChart({...baseOptions(), info: { disable: false }}, '.frame-container')
      ]
      
        // setTimeout(() => {
        //   new Heatmap(heatmapData, '.hitmap-container', true);
        // }, 1000)
      }
    }
}