## chartjs-plugin-funnel-label

Plugin for **Chart.js** to add labels between columns to show the *% progress* in the same dataset. **Chart.js 2.6.0 or above** required.

Written by [Albert Gonzalez](http://albertgonzalez.coffee) and released under [the Unlicense](http://unlicense.org/).

[See it in action!](http://albertgonzalez.coffee/projects/chartjs-plugin-funnel-labels/)

### Starting

Add the **chartjs-plugin-funnel-label.js** and use the **funnel_labels** options to enable the plugin and override the default values.

It works only in **bar charts** with one dataset and will show the % difference between **each bar**.

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

They're setted in the **label_options** object with these default values:

```markdown
label_options: {
  enabled: false,
  font_style: "normal",
  font_family: "Arial",
  font_color: "white",
  background_color: "#FFBA4B",
  rectangle_width_scale_factor: 5,
  show_zeros: true,
  min_width_upper_label: 150,
  allow_upper_label: true,
  force_upper_label: false,
}
```

#### rectangle_width_scale_factor

width for each label rectangle = width between two bars / *rectangle_width_scale_factor*

#### show_zeros

If true will show the labels with a 0% value (otherwise will hide them).

#### min_width_upper_label

If the width between two bars is smaller than this value the labels will appear **over** them.

#### allow_upper_label

If setted to false, the labels **over** the bars won't appear (it won't draw anything).

#### force_upper_label

If true will always show the labels **over** the bars (this will override the *allow_upper_label* option).


### Known issues

- The plugin can't handle more than one dataset and it just won't draw anything.
