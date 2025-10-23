/**
 *
 *  Range Slider
 *
 */

import React from 'react';
import Slider, { SliderTooltip } from 'rc-slider';

const { createSliderWithTooltip } = Slider;
const Range = createSliderWithTooltip(Slider.Range);
const { Handle } = Slider;

const handle = props => {
  const { value, dragging, index, ...restProps } = props;
  return (
    <SliderTooltip
      prefixCls='rc-slider-tooltip'
      overlay={`$${value}`}
      visible={dragging}
      placement='top'
      key={index}
    >
      <Handle value={value} {...restProps} />
    </SliderTooltip>
  );
};

class RangeSlider extends React.Component {
  constructor(props) {
    super(props);
    const sliderDefault = Array.isArray(props.defaultValue)
      ? props.defaultValue[0]
      : props.defaultValue;

    this.state = {
      sliderValue:
        typeof sliderDefault === 'number' ? sliderDefault : Number(sliderDefault) || 0,
      rangeValue: this.props.defaultValue
    };
  }

  onSliderChange = v => {
    this.setState({
      sliderValue: v
    });
  };

  onRangeChange = v => {
    this.setState({
      rangeValue: v
    });
  };

  onAfterSliderChange = value => {
    this.props.onChange(value);
  };

  onAfterRangeChange = value => {
    this.props.onChange(value);
  };

  render() {
    const { type, marks, step, defaultValue, max, allowCross } = this.props;
    const { sliderValue, rangeValue } = this.state;
    const sliderDefault = Array.isArray(defaultValue)
      ? defaultValue[0]
      : defaultValue;

    return (
      <>
        {type === 'slider' ? (
          <Slider
            className='slider'
            dots
            reverse
            allowCross={allowCross}
            step={step}
            defaultValue={sliderDefault}
            marks={marks}
            value={sliderValue}
            onChange={this.onSliderChange}
            onAfterChange={this.onAfterSliderChange}
          />
        ) : (
          <Range
            className='slider'
            pushable={10}
            allowCross={allowCross}
            min={1}
            max={max}
            step={step}
            defaultValue={defaultValue}
            marks={marks}
            handle={handle}
            tipFormatter={value => `$${value}`}
            value={rangeValue}
            onChange={this.onRangeChange}
            onAfterChange={this.onAfterRangeChange}
          />
        )}
      </>
    );
  }
}

RangeSlider.defaultProps = {
  type: 'range',
  allowCross: true
};

export default RangeSlider;
