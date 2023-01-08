import { FC } from 'react'

export interface Props {
    fillPrimary: string
    fillSecondary: string
    className: string
}

const HomeIcon: FC<Props> = ({ fillPrimary, fillSecondary, className }) => {

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 576 512"
            // fill="#FFFFFF" 
            className={className}
            fill={fillPrimary}
        >
            <defs>
                {/* <!-- <style>.fa-secondary{opacity:.4}</style> --> */}
            </defs>

            <path
                fill={fillPrimary}
                d="M266.9 7.918C278.1-2.639 297-2.639 309.1 7.918L565.1 231.9C578.4 243.6 579.7 263.8 568.1 277.1C556.4 290.4 536.2 291.7 522.9 280.1L288 74.52L53.07 280.1C39.77 291.7 19.56 290.4 7.918 277.1C-3.72 263.8-2.372 243.6 10.93 231.9L266.9 7.918z"
                />

            <path 
                fill={fillSecondary}
                d="M288 74.52L512.1 270.6L512.5 471.9C512.6 494 494.7 512 472.5 512H392C369.9 512 352 494.1 352 472V383.7C352 366 337.7 351.7 320 351.7H256C238.3 351.7 224 366 224 383.7V472C224 494.1 206.1 512 184 512H104.1C81.1 512 64.09 494.1 64.08 472L64.02 270.5L288 74.52z"
            />
        </svg>
    )
}
export default HomeIcon