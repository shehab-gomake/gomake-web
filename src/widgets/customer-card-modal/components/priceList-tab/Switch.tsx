import React, { useState, ChangeEvent } from 'react';
import styled from 'styled-components';

interface SwitchProps {
  checked: boolean;
  onChange?: (checked: boolean) => void;
}

interface SliderProps {
  isChecked: boolean;
}

const SwitchContainer = styled.label`
  position: relative;
  display: inline-block;
  width: 23px;
  height: 12px;
`;

const Input = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
`;

const Slider = styled.span<SliderProps>`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #9E9E9E;
  border-radius: 12px;
  transition: 0.4s;

  ${({ isChecked }) =>
    isChecked &&
    `
    background-color: #2196f3;
  `}
`;

const SliderKnob = styled.span<SliderProps>`
  position: absolute;
  content: '';
  height:11px;
  width: 11px;
  left: 0.5px;
  bottom: 0.4px;
  background-color: white;
  border-radius: 50%;
  transition: 0.4s;
  linear-gradient(#DADADA, #F0EFEF, #FFFFFF);


  ${({ isChecked }) =>
    isChecked &&
    `
    transform: translateX(10.5px);
  `}
`;

const Switch: React.FC<SwitchProps> = ({ checked, onChange }) => {
  const [isChecked, setChecked] = useState(checked);

  const handleToggle = () => {
    const newCheckedState = !isChecked;
    setChecked(newCheckedState);
    if (onChange) {
      onChange(newCheckedState);
    }
  };

  return (
    <SwitchContainer>
      <Input type="checkbox" checked={isChecked} onChange={handleToggle} />
      <Slider isChecked={isChecked}>
        <SliderKnob isChecked={isChecked} />
      </Slider>
    </SwitchContainer>
  );
};

export default Switch;