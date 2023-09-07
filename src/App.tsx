import { useRef } from 'react';
import './App.css'
import SampleBox from './components/SampleBox'
import SampleSeparator from './components/SampleSeparator'
import Resizable from './components/resizable'
import useContainerSize from './hooks/useContainerSize';

function App() {
  const ref = useRef<HTMLElement>();
  const { width, height } = useContainerSize(ref);
  console.log(width, height);
  return (
    <div style={{flex: 1, display: 'flex', flexDirection: 'column'}} ref={ref}>
       {width && <Resizable axis='x' initial={width/2} min={300} max={width - 300}>
          {({ position: x, endPosition: endX, separatorProps }) => (
            <div id="wrapper" style={{  position: 'relative',display: 'flex', height: '100vh', overflow: 'hidden' }}>
              <SampleBox id="left-block" theme="blue" width={endX} size={endX} />
              <SampleSeparator id="splitter" />
              <SampleSeparator
                id="virtual-splitter"
                {...separatorProps}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: x,
                  height: '100%',
                }}
              />
              <SampleBox id="right-block" theme="red" width={`calc(100% - ${endX}px)`} />
            </div>
          )}
      </Resizable>}
    </div>
  )
}

export default App
