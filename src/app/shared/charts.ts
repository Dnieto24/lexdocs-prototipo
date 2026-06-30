// Helpers de ApexCharts tematizados a lexflow. ponytail: opciones base reutilizadas.
export const LEX_COLORS = ['#080098', '#10b981', '#9227b1', '#2563eb', '#f59e0b', '#07c0ed'];

const FONT = 'Montserrat, sans-serif';

export function barChart(categories: string[], data: number[], serie = 'Cantidad'): any {
  return {
    series: [{ name: serie, data }],
    chart: { type: 'bar', height: 320, fontFamily: FONT, toolbar: { show: false } },
    colors: LEX_COLORS,
    plotOptions: { bar: { distributed: true, borderRadius: 6, columnWidth: '50%', dataLabels: { position: 'top' } } },
    dataLabels: { enabled: true, offsetY: -20, style: { colors: ['#1e1e1c'], fontFamily: FONT, fontWeight: 700 } },
    xaxis: { categories, labels: { style: { fontFamily: FONT } } },
    yaxis: { labels: { style: { fontFamily: FONT } } },
    legend: { show: false },
    grid: { borderColor: '#eef0f5' },
    tooltip: { theme: 'light' },
  };
}

export function donutChart(labels: string[], data: number[]): any {
  return {
    series: data,
    chart: { type: 'donut', height: 320, fontFamily: FONT },
    labels,
    colors: LEX_COLORS,
    legend: { position: 'bottom', fontFamily: FONT },
    dataLabels: { enabled: true, style: { fontFamily: FONT } },
    plotOptions: { pie: { donut: { size: '62%' } } },
    stroke: { width: 2 },
    tooltip: { theme: 'light' },
  };
}

export function areaChart(categories: string[], data: number[], serie = 'Cantidad'): any {
  return {
    series: [{ name: serie, data }],
    chart: { type: 'area', height: 300, fontFamily: FONT, toolbar: { show: false } },
    colors: [LEX_COLORS[0]],
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 3 },
    fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05 } },
    xaxis: { categories, labels: { style: { fontFamily: FONT } } },
    yaxis: { labels: { style: { fontFamily: FONT } } },
    grid: { borderColor: '#eef0f5' },
    tooltip: { theme: 'light' },
  };
}
