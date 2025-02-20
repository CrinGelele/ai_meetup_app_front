import { FC, useState } from 'react'; // Добавлен useState
import { Button } from 'react-bootstrap';
import './InputField.css';
import { useAppDispatch } from '../store';
import { getSpeakersList, setSearchValue } from '../slices/speakersSlice';

interface Props {
    value: string;
    loading?: boolean;
    buttonTitle?: string;
}

const InputField: FC<Props> = ({ value, loading }) => {
    const dispatch = useAppDispatch();
    const [inputValue, setInputValue] = useState(value); // Состояние для значения input

    // Обработчик изменения значения в input
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    // Обработчик нажатия на кнопку
    const handleButtonClick = () => {
        dispatch(setSearchValue(inputValue)); // Устанавливаем значение в store
        dispatch(getSpeakersList()); // Выполняем поиск
    };

    return (
        <div className="search-container mb-4">
            <input
                value={inputValue} // Используем состояние для значения input
                onChange={handleInputChange} // Обработчик изменения
            />
            <Button
                disabled={loading}
                onClick={handleButtonClick} // Обработчик нажатия
                className="search-btn"
            >
                &#128269;
            </Button>
        </div>
    );
};

export default InputField;