import { getChainColor } from 'constants/chains'
import { FC } from 'react'
// import { ChainId } from 'sdk'
export interface Props {
    fillPrimary: string
    fillSecondary: string
    className: string
}

const RepeatIcon: FC<Props> = ({ fillPrimary, fillSecondary, className }) => {

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            // fill="#FFFFFF" 
            className={className}
            fill={fillPrimary}
        >
            <defs>
                {/* <!-- <style>.fa-secondary{opacity:.4}</style> --> */}
            </defs>

            <path
                fill={fillPrimary}
                d="M448 95.1c0 6.812-2.891 13.28-7.938 17.85l-80 72C355.6 189.9 349.8 192 343.1 192c-3.312 0-6.618-.6875-9.759-2.062C325.6 186.1 320 177.5 320 168L319.1 128H160C107.1 128 64 171.1 64 224c0 17.69-14.33 32-32 32S0 241.7 0 224c0-88.22 71.78-160 160-160h160l-.0049-40c0-9.469 5.583-18.06 14.24-21.94c8.641-3.781 18.78-2.219 25.83 4.094l80 72C445.1 82.72 448 89.19 448 95.1z"
            />

            <path
                fill={fillSecondary}
                d="M512 288c0 88.22-71.78 160-160 160H192l.0073 40c0 9.469-5.585 18.06-14.24 21.94C174.6 511.3 171.3 512 168 512c-5.812 0-11.57-2.125-16.07-6.156l-80-72C66.89 429.3 64 422.8 64 416s2.891-13.28 7.938-17.84l80-72C159 319.8 169.1 318.3 177.8 322.1C186.4 325.9 192 334.5 192 344L192 384H352c52.94 0 96-43.06 96-96c0-17.69 14.33-32 32-32S512 270.3 512 288z"
            />
        </svg>

    )
}
export default RepeatIcon


