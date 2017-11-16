import m from 'mithril';
import stream from 'mithril/stream/stream';


export default function CircleSlider() {
  const size = stream(20);
  return {
    view() {
      return [
        m('svg.Svg-wrap',
          m('circle', {
            cx: 130,
            cy: 60,
            r: size(),
          })
        ),
        m('label', 'Radius: '),
        m('input[type=range][min=1][max=100]', {
          value: size(),
          oninput: m.withAttr('valueAsNumber', size),
        }),
        m('span', size()),
      ];
    },
  };
}
