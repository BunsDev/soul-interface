import { FC } from 'react'

export interface Props {
    fillPrimary: string
    fillSecondary: string
    className: string
}

const VaultIcon: FC<Props> = ({ fillPrimary, fillSecondary, className }) => {

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
                d="M384 240C384 328.4 312.4 400 224 400C135.6 400 64 328.4 64 240C64 151.6 135.6 80 224 80C312.4 80 384 151.6 384 240zM224 160C179.8 160 144 195.8 144 240C144 284.2 179.8 320 224 320C268.2 320 304 284.2 304 240C304 195.8 268.2 160 224 160zM512 176C512 196.9 498.6 214.7 480 221.3V336C480 344.8 472.8 352 464 352C455.2 352 448 344.8 448 336V221.3C429.4 214.7 416 196.9 416 176C416 149.5 437.5 128 464 128C490.5 128 512 149.5 512 176z"
                />

            <path 
                fill={fillSecondary}
                d="M512 0C547.3 0 576 28.65 576 64V416C576 451.3 547.3 480 512 480H496L480 512H416L400 480H176L160 512H96L80 480H64C28.65 480 0 451.3 0 416V64C0 28.65 28.65 0 64 0H512zM224 80C135.6 80 64 151.6 64 240C64 328.4 135.6 400 224 400C312.4 400 384 328.4 384 240C384 151.6 312.4 80 224 80zM480 221.3C498.6 214.7 512 196.9 512 176C512 149.5 490.5 128 464 128C437.5 128 416 149.5 416 176C416 196.9 429.4 214.7 448 221.3V336C448 344.8 455.2 352 464 352C472.8 352 480 344.8 480 336V221.3z"
            />
        </svg>        
    )
}
export default VaultIcon