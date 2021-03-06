import { SelectOutlined, SwapOutlined } from '@ant-design/icons'
import { Typography } from 'antd'
import styled from 'styled-components'
import { palette } from 'styled-theme'

import { Table as UITable } from '../../../uielements/table'

export const Table = styled(UITable)`
  .ant-table-thead > tr > th {
    font-size: 16px;
    font-family: 'MainFontRegular';
    border: none;
    color: ${palette('gray', 2)};
  }

  .ant-table-tbody > tr > td {
    border: none;
  }
`

export const Text = styled(Typography.Text)`
  font-size: 16px;
  text-transform: uppercase;
  font-family: 'MainFontRegular';
  color: ${palette('text', 1)};
`

export const LinkIcon = styled(SelectOutlined)`
  svg {
    height: 20px;
    width: 20px;
    transform: scale(-1, 1) translateX(5px);
    color: ${palette('text', 1)};
  }
`

export const TransferIcon = styled(SwapOutlined)`
  svg {
    height: 20px;
    width: 20px;
    color: ${palette('text', 1)};
  }
`
