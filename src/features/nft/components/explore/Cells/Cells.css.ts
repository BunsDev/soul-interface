import { body } from '../../../css/common.css'

export const logo = 
// sprinkles(
  { borderRadius: '12' }
// )

export const title = [
  body,
  // sprinkles(
    {
    color: 'textPrimary',
    textAlign: 'left',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    paddingLeft: '12',
    paddingRight: '2',
  },
]

export const address = [
  title,
  // sprinkles(
    {
    marginLeft: '8',
    alignItems: 'center',
    minWidth: '0',
    width: 'max',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
]

export const verifiedBadge = 
// sprinkles(
  {
  marginLeft: '4',
  display: 'inline-block',
  paddingTop: '4',
  height: '28',
  width: '28',
  textAlign: 'left',
}