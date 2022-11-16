import styles from './index.less'
import { Button, Result } from 'antd'
import { AppConfig } from '@/configs/app'

const { foundByteBigdataURL } = AppConfig

export default () => {
  const onClick = () => {
    window.location.href = foundByteBigdataURL
  }

  return (
    <div className={styles.container}>
      <Result
        title="当前未登录，请点击下方按钮前往登录"
        extra={
          <Button type="primary" onClick={onClick}>去登录</Button>
        }
      />
    </div>
  )
}
