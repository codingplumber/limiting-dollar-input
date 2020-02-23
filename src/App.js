import React, { useState } from 'react';
import styled from 'styled-components';
import './App.css';
import DollarInput from './DollarInput';


const Body = styled.div`
  height: 100vh;
  font-size: 5rem;
  padding: 4rem;
`

function App() {
  const [value, setValue] = useState(100);

  console.log('value in app ', value);
  
  const valueChange = value => {
    setValue(value)
  }

  return (
    <Body>
      <DollarInput
        value={value}
        onValueChange={valueChange}
        before={9}
        after={6}
      />
    </Body>
  );
}

export default App;
