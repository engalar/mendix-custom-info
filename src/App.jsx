import React, { useRef, useState, useMemo, useEffect, MouseEvent } from 'react'
import { X } from 'react-feather'
import { useTransition } from '@react-spring/web'
import { Container, Message, Button, Content, Life } from './styles'

let id = 0


function MessageHub({
  config = { tension: 125, friction: 20, precision: 0.1 },
  timeout = 3000,
  children,
}) {
  const refMap = useMemo(() => new WeakMap(), [])
  const cancelMap = useMemo(() => new WeakMap(), [])
  const [items, setItems] = useState([])

  const transitions = useTransition(items, {
    from: { opacity: 0, height: 0, life: '100%' },
    keys: item => item.key,
    enter: item => async (next, cancel) => {
      cancelMap.set(item, cancel)
      await next({ opacity: 1, height: refMap.get(item).offsetHeight })
      await next({ life: '0%' })
    },
    leave: [{ opacity: 0 }, { height: 0 }],
    onRest: (result, ctrl, item) => {
      setItems(state =>
        state.filter(i => {
          return i.key !== item.key
        })
      )
    },
    config: (item, index, phase) => key => phase === 'enter' && key === 'life' ? { duration: timeout } : config,
  })

  useEffect(() => {
    children((msg) => {
      setItems(state => [...state, { key: id++, msg }])
    })
  }, [])

  return (
    <Container>
      {transitions(({ life, ...style }, item) => (
        <Message style={style}>
          <Content ref={(ref) => ref && refMap.set(item, ref)}>
            <Life style={{ right: life }} />
            <p>{item.msg}</p>
            <Button
              onClick={(e) => {
                e.stopPropagation()
                if (cancelMap.has(item) && life.get() !== '0%') cancelMap.get(item)()
              }}>
              <X size={18} />
            </Button>
          </Content>
        </Message>
      ))}
    </Container>
  )
}

export default function App() {
  const ref = useRef(null)

  const handleClick = content => {
    ref.current?.(content)
  }

  useEffect(() => {
    // 保存原始的 showMessage 函数
    const originalShowMessage = mx.ui.showMessage

    // 重写 showMessage 函数
    mx.ui.showMessage = function (type, content, blocking) {
      // 检查第三个参数是否为 false
      if (blocking === false && type === 'info') {
        console.log('拦截到 mx.ui.showMessage 调用，阻止执行。')
        handleClick(content)
        return // 阻止执行
      }

      // 如果第三个参数不是 false，调用原始函数
      return originalShowMessage.apply(this, arguments)
    }
    return () => {
      mx.ui.showMessage = originalShowMessage
    }
  })

  return (
    <MessageHub
      children={(add) => {
        ref.current = add
      }}
    />
  )
}
