import { FC } from 'react'
import { Button } from 'react-bootstrap'
import './InputField.css'
import { RootState, useAppDispatch } from '../store';
import { getSpeakersList, setSearchValue } from '../slices/speakersSlice';

interface Props {
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    loading?: boolean
    buttonTitle?: string
}

const InputField: FC<Props> = ({ value, onChange, loading}) => {
    const dispatch = useAppDispatch();
    return (
    <div className="search-container mb-4">
        <input value={value}  onChange={onChange}/>
        <Button disabled={loading} onClick={() => dispatch(getSpeakersList())} className="search-btn">&#128269;</Button>
    </div>
    );
};

export default InputField