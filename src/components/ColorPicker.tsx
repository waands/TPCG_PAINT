import React, { useState } from 'react';
import { ChromePicker, ColorResult } from 'react-color';

const ColorPicker: React.FC<{ onChangeComplete: (color: string) => void }> = ({ onChangeComplete }) => {
  const [color, setColor] = useState<string>('#000');

  const handleChangeComplete = (color: ColorResult) => {
    setColor(color.hex);
    onChangeComplete(color.hex);
  };

  return (
    <div>
      <ChromePicker disableAlpha={true} color={color} onChangeComplete={handleChangeComplete} />
    </div>
  );
};

export default ColorPicker;