import styled from 'styled-components/macro'
import React from "react";

interface Props {
    children: React.ReactNode
    handleBackgroundClick?: () => void
    style?: React.CSSProperties
}

export const Popup = ({ children, handleBackgroundClick, style }: Props) => {
    const VerticalPadder = ({ height }: { height: number }) => (
        <div style={{ minHeight: height, width: '100%' }} onClick={handleBackgroundClick}></div>
    )
    return (
        <Background style={style} onClick={handleBackgroundClick}>
            <div style={{ height: '100%' }}>
                <VerticalPadder height={100} />
                <Foreground id="foreground" onClick={(event) => event.stopPropagation()}>
                    {children}
                </Foreground>
                <VerticalPadder height={100} />
            </div>
        </Background>
    )
}

const Background = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 998;
  overflow: auto;
  backdrop-filter: blur(1px) saturate(0.5);
`

const Foreground = styled.span`
  height: 100%;
  /* height: max-content; */
`