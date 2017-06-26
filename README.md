## chartjs-plugin-funnel-label
Plugin for Chart.js to add labels between columns to show the % progress in the same dataset. **Chart.js 2.6.0 or above** required.

### Starting

Add the **chartjs-plugin-funnel-label.js** and use the **funnel_labels** options to enable the plugin and override the default values.

It works only in **bar charts** with one dataset and will show the % difference between the **first** bar and the **current** bar.

```markdown
new Chart($("#chart"), {
  type: 'bar',
  data: {
    labels: ["Alpha Value", "Beta Value", "Charlie Value", "Delta Value"],
    datasets: [{
      label: 'First Dataset',
      data: [555, 302, 175, 50],
      backgroundColor: "rgba(75, 192, 192, 1)"
    }]
  },
  options: {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }],
      xAxes: [{
        barPercentage: 0.3
      }]
    },
    funnel_labels: {
      enabled: true,
      background_color: "red"
    }
  }
});
```

### Current options

They're setted in the **label_options** object:

```markdown
label_options: {
  enabled: false,
  font_style: "normal",
  font_family: "Arial",
  font_color: "white",
  background_color: "#FFBA4B",
  default_width: 1150,
  default_font_size: 20,
  default_padding: 10,
  default_arrow_width: 20,
  show_zeros: true
}
```

