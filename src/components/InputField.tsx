import { FC } from 'react'
import { Button } from 'react-bootstrap'
import './InputField.css'

interface Props {
    value: string
    setValue: (value: string) => void
    onSubmit: () => void
    loading?: boolean
    placeholder?: string
    buttonTitle?: string
}

const InputField: FC<Props> = ({ value, setValue, onSubmit, loading, placeholder}) => (
    <div className="search-container mb-4">
        <input value={value} placeholder={placeholder} onChange={(event => setValue(event.target.value))}/>
        <Button disabled={loading} onClick={onSubmit} className="search-btn">&#128269;</Button>
    </div>
)

export default InputField