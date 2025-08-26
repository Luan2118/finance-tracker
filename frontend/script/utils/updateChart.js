export function updateChart(chart, labels, data, unit) {
  chart.data.labels = labels;
  chart.data.datasets[0].data = data;

  chart.options.scales.x.time.unit = unit;
  chart.update();
}